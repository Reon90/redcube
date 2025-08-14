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
        const device = await adapter.requestDevice({
            // @ts-ignore
            requiredFeatures: ['float32-filterable']
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
            await this.parse.initTextures(true);
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
            this.scene.meshes.forEach(mesh => {
                mesh.geometry.createGeometryForWebGPU(WebGPU);
                mesh.geometry.createUniforms(mesh.matrixWorld, this.camera, this.light);
                mesh.geometry.updateUniformsWebGPU(WebGPU);

                mesh.material.createUniforms(this.camera, this.parse.lights);
                mesh.material.updateUniformsWebGPU(WebGPU);
                mesh.material.uniformBindGroup1.push(
                    {
                        binding: 19,
                        resource: this.env.prefilterTexture?.createView({
                            dimension: 'cube'
                        })
                    },
                    {
                        binding: 20,
                        resource: this.env.irradianceTexture?.createView({
                            dimension: 'cube'
                        })
                    },
                    {
                        binding: 21,
                        resource: this.env.bdrfTexture?.createView()
                    },
                    {
                        binding: 28,
                        resource: this.env.Sheen_E?.createView()
                    },
                    {
                        binding: 26,
                        resource: mesh.defines.find(i => i.name === 'TRANSMISSION')
                        // @ts-expect-error
                        ? refraction.texture.texture.createView()
                        : this.PP.fakeDepth.texture.createView()
                    },
                    {
                        binding: 35,
                        resource: this.env.charlieTexture?.createView({
                            dimension: 'cube'
                        })
                    },
                    {
                        binding: 30,
                        resource: {
                            buffer: uniformBuffer,
                            offset: 0,
                            size: stateBuffer.store.byteLength
                        }
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

                mesh.pipeline = create(WebGPU.device, WebGPU.glslang, WebGPU.wgsl, mesh.material.uniformBindGroup1, mesh.defines, hasTransmission, mesh.mode, mesh.frontFace);
                mesh.uniformBindGroup1 = WebGPU.device.createBindGroup({
                    layout: mesh.pipeline.getBindGroupLayout(0),
                    entries: [...mesh.geometry.uniformBindGroup1, ...mesh.material.uniformBindGroup1]
                });
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

export { RedCube };
