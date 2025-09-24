/// <reference path='../index.d.ts'/>
/// <reference types="@webgpu/types" />

import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light, SkinnedMesh, UniformBuffer } from './objects/index';
import { Events } from './events';
import { Env } from './env.webgpu';
import { Parse } from './parse';
import { RendererWebGPU } from './renderer.webgpu';
import { create } from './objects/pipeline';
import { walk } from './utils';
import { PostProcessing } from './postprocessing.webgpu';
import { Refraction } from './postprocessors/refraction';
import { Vector3 } from './matrix';
import {getWebGPUMemoryUsage} from '../webgpu-memory';

const FOV = 60; // degrees

class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    ioc: Container;
    isIBL = true;
    isDefaultLight = true;
    renderState = {};
    stateBuffer = {};
    cameraBuffer: UniformBuffer;
    lightPosBuffer: UniformBuffer;
    storage2: UniformBuffer;
    storage: UniformBuffer;

    constructor(url, canvas, _pp, envUrl = 'env') {
        if (!url) {
            throw new Error('Url not found');
        }

        this.envUrl = envUrl;
        this.url = url;
        this.canvas = canvas;
        this.events = new Events(canvas, this.redraw.bind(this));
    }

    async webgpuInit(): Promise<WEBGPU> {
        const glslangModule = await import(/*webpackChunkName: "glslang"*/ '../glslang.js');
        await import(/*webpackChunkName: "twgsl"*/ '../twgsl.js');

        // @ts-ignore
        const adapter = await navigator.gpu.requestAdapter();
        const required: GPUFeatureName[] = ['float32-filterable'];
        if (adapter.features.has('timestamp-query')) {
            required.push('timestamp-query');
        }
        const device = await adapter.requestDevice({
            requiredFeatures: required
        });
        const glslang = await glslangModule.default();
        // @ts-ignore
        const wgsl = await twgsl('twgsl.wasm');

        const context = this.canvas.getContext('webgpu');
        context.configure({
            device,
            format: 'bgra8unorm',
            alphaMode: 'opaque'
        });

        const depthTexture = device.createTexture({
            size: {
                width: this.canvas.offsetWidth * devicePixelRatio,
                height: this.canvas.offsetHeight * devicePixelRatio,
                depthOrArrayLayers: 1
            },
            format: 'depth32float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        const renderPassDescriptor = {
            colorAttachments: [],
            depthStencilAttachment: {
                view: depthTexture.createView(),

                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp
            }
        };

        return { glslang, wgsl, context, device, renderPassDescriptor };
    }

    get camera(): Camera {
        return this.ioc.get('camera');
    }
    get light(): Light {
        return this.ioc.get('light');
    }
    get renderer(): Renderer {
        return this.ioc.get('renderer');
    }
    get scene(): Scene {
        return this.ioc.get('scene');
    }
    get parse(): Parse {
        return this.ioc.get('parser');
    }
    get env(): Env {
        return this.ioc.get('env');
    }
    get PP(): PostProcessing {
        return this.ioc.get('pp');
    }

    async init(cb) {
        const ioc = new Container();
        this.ioc = ioc;

        try {
            const WebGPU = await this.webgpuInit();
            ioc.register('canvas', this.canvas);
            ioc.register('gl', WebGPU);
            ioc.register('scene', Scene);
            ioc.register('light', Light, [], {
                type: 'directional',
                intensity: 5,
                color: [1, 1, 1],
                isInitial: true,
                spot: {}
            });
            this.ioc.register('pp', PostProcessing, ['light', 'camera', 'canvas', 'gl'], [], this.renderScene.bind(this));
            ioc.register('parser', Parse, ['gl', 'scene', 'camera', 'light'], this.url, [], () => {});
            ioc.register('env', Env, ['camera', 'canvas'], this.envUrl);
            ioc.register('renderer', RendererWebGPU, ['gl', 'scene', 'parser', 'env', 'pp'], this.getState.bind(this));
            ioc.register(
                'camera',
                Camera,
                [],
                {
                    type: 'perspective',
                    isInitial: true,
                    zoom: 1,
                    aspect: this.canvas.offsetWidth / this.canvas.offsetHeight,
                    perspective: {
                        yfov: (FOV * Math.PI) / 180
                    }
                },
                'perspective'
            );

            await this.parse.getJson();
            await this.parse.getBuffer();
            await this.parse.initTextures(false);
            this.parse.buildSkin();
            await this.parse.buildMesh();
            this.parse.buildAnimation();
            this.parse.cameras.push(this.camera);

            this.parse.createSamplersWebGPU(WebGPU);
            this.parse.createTexturesWebGPU(WebGPU);

            const envData = await this.parse.getEnv(true);
            await this.env.createEnvironmentBuffer(envData, WebGPU);

            this.parse.calculateFov(this.camera.props.isInitial);
            this.resize();

            WebGPU.nearestSampler = WebGPU.device.createSampler({
                mipmapFilter: 'nearest',
                magFilter: 'nearest',
                minFilter: 'nearest',
                addressModeU: 'repeat',
                addressModeV: 'repeat',
                addressModeW: 'repeat'
            });
            WebGPU.linearSampler = WebGPU.device.createSampler({
                mipmapFilter: 'linear',
                magFilter: 'linear',
                minFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat',
                addressModeW: 'repeat'
            });

            await this.env.createTexture(WebGPU);
            this.env.drawBRDF(WebGPU);
            //this.env.drawQuad(WebGPU, this.parse.scene.meshes[0].material.baseColorTexture);
            this.env.drawMips(WebGPU);
            this.env.drawIrradiance(WebGPU);
            this.env.drawPrefilter(WebGPU);
            //return

            const { renderState, isIBL, isDefaultLight, lights } = this.getState();
            const stateBuffer = new UniformBuffer();
            // @ts-expect-error
            stateBuffer.add('isTone', renderState.isprerefraction ? 0 : 1);
            stateBuffer.add('isIBL', isIBL ? 1 : 0);
            stateBuffer.add('isDefaultLight', isDefaultLight || lights.some(l => !l.isInitial) ? 1 : 0);
            stateBuffer.done();
            this.stateBuffer = stateBuffer;
            const uniformBuffer = WebGPU.device.createBuffer({
                size: 256 + stateBuffer.store.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            stateBuffer.bufferWebGPU = uniformBuffer;
            WebGPU.device.queue.writeBuffer(
                uniformBuffer,
                0,
                stateBuffer.store.buffer,
                stateBuffer.store.byteOffset,
                stateBuffer.store.byteLength
            );

            const hasTransmission = this.parse.json.extensionsUsed && this.parse.json.extensionsUsed.includes('KHR_materials_transmission');
            if (hasTransmission) {
                this.PP.addPrepass('refraction');
            }
            //this.PP.add('scattering');
            if (this.PP.hasPostPass || this.PP.hasPrePass) {
                this.PP.buildScreenBuffer();
            }
            const refraction = this.PP.postprocessors.find(p => p instanceof Refraction);

            const cameraBuffer = new UniformBuffer();
            cameraBuffer.add('view', this.camera.matrixWorldInvert.elements);
            cameraBuffer.add('projection', this.camera.projection.elements);
            cameraBuffer.add('light', this.light.matrixWorldInvert.elements);
            cameraBuffer.add('isShadow', 0);
            cameraBuffer.done();
            this.cameraBuffer = cameraBuffer;
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, cameraBuffer);

            const lightEnum = {
                directional: 0,
                point: 1,
                spot: 2
            };
            const spotDirs = new Float32Array(this.parse.lights.length * 4);
            const lightPos = new Float32Array(this.parse.lights.length * 4);
            const lightColor = new Float32Array(this.parse.lights.length * 4);
            const lightProps = new Float32Array(this.parse.lights.length * 4);
            this.parse.lights.forEach((light, i) => {
                spotDirs.set(
                    new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize()
                        .elements,
                    i * 4
                );
                lightPos.set(light.getPosition(), i * 4);
                lightColor.set(light.color.elements, i * 4);
                lightProps.set([light.intensity, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]], i * 4);
            });
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightPos', lightPos);
            materialUniformBuffer.done();
            this.lightPosBuffer = materialUniformBuffer;
            
            const materialUniformBuffer2 = new UniformBuffer();
            materialUniformBuffer2.add('lightColor', lightColor);
            materialUniformBuffer2.done();
        
            const materialUniformBuffer3 = new UniformBuffer();
            materialUniformBuffer3.add('spotdir', spotDirs);
            materialUniformBuffer3.done();
        
            const materialUniformBuffer4 = new UniformBuffer();
            materialUniformBuffer4.add('lightIntensity', lightProps);
            materialUniformBuffer4.done();
    
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, materialUniformBuffer);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, materialUniformBuffer2);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, materialUniformBuffer3);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, materialUniformBuffer4);
            
            this.scene.meshes.forEach((mesh) => {
                mesh.material.createUniforms(this.camera, this.parse.lights);
            });
            const storage = new Float32Array(this.scene.meshes.length * this.scene.meshes[0].material.materialUniformBuffer.store.length);
            this.scene.meshes.forEach((mesh, i) => {
                storage.set(mesh.material.materialUniformBuffer.store, i * mesh.material.materialUniformBuffer.store.length);
            });
            const storageBuffer = {store: storage};
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer, GPUBufferUsage.STORAGE);

            this.scene.meshes.forEach((mesh) => {
                mesh.geometry.createUniforms(mesh.matrixWorld);
            });
            const storage2 = new Float32Array(this.scene.meshes.length * this.scene.meshes[0].geometry.uniformBuffer.store.length);
            this.scene.meshes.forEach((mesh, i) => {
                mesh.order = i;
                storage2.set(mesh.geometry.uniformBuffer.store, i * mesh.geometry.uniformBuffer.store.length);
            });
            const storageBuffer2 = {store: storage2};
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer2, GPUBufferUsage.STORAGE);
            // @ts-expect-error
            this.storage2 = storageBuffer2;
            // @ts-expect-error
            this.storage = storageBuffer;

            const uniformBindGroup1 = [{
                binding: 0,
                resource: {
                    // @ts-expect-error
                    buffer: storageBuffer2.bufferWebGPU,
                    offset: 0,
                    size: storageBuffer2.store.byteLength
                }
            }, {
                binding: 1,
                resource: {
                    // @ts-expect-error
                    buffer: storageBuffer.bufferWebGPU,
                    offset: 0,
                    size: storageBuffer.store.byteLength
                }
            }, {
                binding: 39,
                resource: {
                    buffer: cameraBuffer.bufferWebGPU,
                    offset: 0,
                    size: cameraBuffer.store.byteLength
                }
            }, {
                binding: 16,
                resource: {
                    buffer: materialUniformBuffer.bufferWebGPU,
                    offset: 0,
                    size: materialUniformBuffer.store.byteLength
                }
            }, {
                binding: 15,
                resource: {
                    buffer: materialUniformBuffer2.bufferWebGPU,
                    offset: 0,
                    size: materialUniformBuffer2.store.byteLength
                }
            },
            
            {
                binding: 17,
                resource: {
                    buffer: materialUniformBuffer3.bufferWebGPU,
                    offset: 0,
                    size: materialUniformBuffer3.store.byteLength
                }
            },
            {
                binding: 18,
                resource: {
                    buffer: materialUniformBuffer4.bufferWebGPU,
                    offset: 0,
                    size: materialUniformBuffer4.store.byteLength
                }
            },];

            const prevProgramHash = new Map();
            const uniformBindGroup2 = [];

            const s = {
                            buffer: uniformBuffer,
                            offset: 0,
                            size: stateBuffer.store.byteLength
                        };

            this.scene.meshes.forEach((mesh, i) => {
                mesh.geometry.createGeometryForWebGPU(WebGPU);
                mesh.geometry.uniformBindGroup1 = [];

                mesh.material.updateUniformsWebGPU(WebGPU);
                mesh.material.uniformBindGroup1.push(
                    {
                        binding: 19,
                        // @ts-expect-error
                        resource: this.env.prefilterTexture?.view
                    },
                    {
                        binding: 20,
                        // @ts-expect-error
                        resource: this.env.irradianceTexture?.view
                    },
                    {
                        binding: 21,
                        // @ts-expect-error
                        resource: this.env.bdrfTexture?.view
                    },
                    {
                        binding: 28,
                        // @ts-expect-error
                        resource: this.env.Sheen_E?.view
                    },
                    {
                        binding: 26,
                        resource: mesh.defines.find(i => i.name === 'TRANSMISSION')
                        // @ts-expect-error
                        ? refraction.texture.texture.createView()
                        : this.PP.fakeDepth.view
                    },
                    {
                        binding: 35,
                        // @ts-expect-error
                        resource: this.env.charlieTexture?.view
                    },
                    {
                        binding: 30,
                        resource: s
                    }
                );
                if (this.env.uniformBuffer) {
                    mesh.material.uniformBindGroup1.push({
                        binding: 27,
                        resource: {
                            buffer: this.env.uniformBuffer.bufferWebGPU,
                            offset: 0,
                            size: this.env.uniformBuffer.store.byteLength
                        }
                    });
                }
                if (mesh instanceof SkinnedMesh) {
                    for (const join of this.parse.skins[mesh.skin].jointNames) {
                        walk(this.scene, this.buildBones.bind(this, join, this.parse.skins[mesh.skin]));
                    }
                    mesh.geometry.uniformBindGroup1.push(mesh.setSkinWebGPU(WebGPU, this.parse.skins[mesh.skin]));
                }

                // @ts-expect-error
                const programHash = mesh.material.defines.map((define) => `${define.name}${define.value ?? 1}`).join('');
                if (!prevProgramHash.has(programHash)) {
                    prevProgramHash.set(programHash, create(WebGPU.device, WebGPU.glslang, WebGPU.wgsl, mesh.material.uniformBindGroup1, mesh.defines, hasTransmission, mesh.mode, mesh.frontFace));
                }
                let group = check(uniformBindGroup2, mesh.material.uniformBindGroup1);
                if (!group) {
                    group = {k: mesh.material.uniformBindGroup1, v: WebGPU.device.createBindGroup({
                        layout: prevProgramHash.get(programHash).getBindGroupLayout(0),
                        entries: [...uniformBindGroup1, ...mesh.geometry.uniformBindGroup1, ...mesh.material.uniformBindGroup1]
                    })};
                    uniformBindGroup2.push(group);
                }

                mesh.pipeline = prevProgramHash.get(programHash);
                mesh.uniformBindGroup1 = group.v;
            });

            // if (this.parse.cameras.length === 0) {
            //     this.camera = new Camera(
            //         {
            //             type: 'perspective',
            //             isInitial: true,
            //             zoom: 1,
            //             aspect: 1,
            //             perspective: {
            //                 yfov: (FOV * Math.PI) / 180
            //             }
            //         },
            //         'perspective'
            //     );
            //     this.parse.cameras.push(this.camera);
            // }
            // this.camera = this.parse.cameras[0];
        } catch (e) {
            console.log(e);
        }

        this.scene.tracks = this.parse.tracks;
        this.scene.cameras = this.parse.cameras;
        this.scene.lights = this.parse.lights;

        this.renderer.render();

        const info = getWebGPUMemoryUsage();
        console.log(info);

        // @ts-ignore
        window.__TEST_READY__ = true;

        cb(this.scene);
    }

    buildBones(join, v, node) {
        if (node.name === join) {
            v.bones.push(node);
        }
    }

    resize() {
        this.camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;

        const z = this.camera.modelSize;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        if (this.light.isInitial || this.light.type === 'directional') {
            this.light.setZ(z);
        }
        this.camera.updateNF();
    }

    renderScene(renderState) {
        this.renderState = renderState;
        this.renderer.renderScene();
        this.renderState = {};
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.camera.zoom(coordsStart);
            this.renderer.needUpdateView = true;
            this.renderer.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            this.camera.rotate(coordsStart, coordsMove);
            this.renderer.needUpdateView = true;
        }
        if (type === 'pan') {
            this.camera.pan(coordsStart, coordsMove, this.canvas.offsetWidth, this.canvas.offsetHeight);
            this.renderer.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize();
            this.renderer.needUpdateProjection = true;
        }

        this.renderer.reflow = true;
    }

    setVariant() {
        console.warn('Not implemented');
    }

    draw() {
        console.warn('Not implemented');
    }

    getState() {
        return {
            storage2: this.storage2,
            storage: this.storage,
            lightPosBuffer: this.lightPosBuffer,
            cameraBuffer: this.cameraBuffer,
            stateBuffer: this.stateBuffer,
            renderState: this.renderState,
            lights: [],
            isIBL: this.isIBL,
            isDefaultLight: this.isDefaultLight,
            camera: this.camera,
            light: this.light,
            needUpdateView: this.renderer.needUpdateView,
            needUpdateProjection: this.renderer.needUpdateProjection
        };
    }
}

function check(source, candidate) {
    return source.find(item => {
        for (let i = 0; i < candidate.length; i++) {
            if (item.k[i].binding !== candidate[i].binding || item.k[i].resource !== candidate[i].resource) {
                return false;
            }
        }
        return true;
    });
}

export { RedCube };
