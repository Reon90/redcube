import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light, Object3D, SkinnedMesh, UniformBuffer } from './objects/index';
import { UniformBufferLike } from './objects/uniform';
import { Events } from './events';
import { Env } from './env.webgpu';
import { Parse, Skin } from './parse';
import { RendererWebGPU } from './renderer.webgpu';
import { create } from './objects/pipeline';
import { walk } from './utils';
import { PostProcessing } from './postprocessing.webgpu';
import { Refraction } from './postprocessors/refraction';
import { Vector3 } from './matrix';
import { getWebGPUMemoryUsage } from '../webgpu-memory';

const FOV = 60; // degrees

class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    ioc!: Container;
    isIBL = true;
    isDefaultLight = true;
    renderState: { isprepender?: boolean; isprerefraction?: boolean } = {};
    stateBuffer!: UniformBuffer;
    cameraBuffer!: UniformBuffer;
    lightPosBuffer!: UniformBuffer;
    lightColorBuffer!: UniformBuffer;
    transformsStorage!: UniformBufferLike;
    materialStorage!: UniformBufferLike;

    constructor(url: string, canvas: HTMLCanvasElement, _pp: string[], envUrl = 'env') {
        if (!url) {
            throw new Error('RedCube: a glTF url must be passed as the first constructor argument');
        }

        this.envUrl = envUrl;
        this.url = url;
        this.canvas = canvas;
        this.events = new Events(canvas, this.redraw.bind(this));
    }

    async webgpuInit(): Promise<WEBGPU> {
        const glslangModule = await import(/*webpackChunkName: "glslang"*/ '../glslang.js');
        await import(/*webpackChunkName: "twgsl"*/ '../twgsl.js');

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('RedCube: no WebGPU adapter was returned by navigator.gpu.requestAdapter() - the GPU may be unavailable or blocklisted on this device');
        }
        const required: GPUFeatureName[] = ['float32-filterable'];
        if (adapter.features.has('timestamp-query')) {
            required.push('timestamp-query');
        }
        const device = await adapter.requestDevice({
            requiredFeatures: required,
        });
        const glslang = await glslangModule.default();
        const wgsl = await (globalThis as unknown as { twgsl: (wasmPath: string) => Promise<unknown> }).twgsl('twgsl.wasm');

        const context = this.canvas.getContext('webgpu');
        if (!context) {
            throw new Error('RedCube: WebGPU is not supported by this browser/canvas - use the WebGL build instead (Chrome 113+ is required for WebGPU), or check that the canvas has no other active rendering context');
        }
        context.configure({
            device,
            format: 'bgra8unorm',
            alphaMode: 'opaque',
        });

        const newRenderTarget = device.createTexture({
            size: {
                width: this.canvas.offsetWidth * devicePixelRatio,
                height: this.canvas.offsetHeight * devicePixelRatio,
                depthOrArrayLayers: 1,
            },
            format: 'bgra8unorm',
            sampleCount: 4,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        const depthTexture = device.createTexture({
            size: {
                width: this.canvas.offsetWidth * devicePixelRatio,
                height: this.canvas.offsetHeight * devicePixelRatio,
                depthOrArrayLayers: 1,
            },
            format: 'depth32float',
            sampleCount: 4,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        const renderPassDescriptor = {
            colorAttachments: [],
            depthStencilAttachment: {
                view: depthTexture.createView(),

                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
            },
        };

        return {
            glslang,
            wgsl,
            context,
            device,
            renderPassDescriptor,
            features: adapter.features,
            newRenderTarget: newRenderTarget as unknown as GPUTextureView,
        };
    }

    get camera(): Camera {
        return this.ioc.get('camera') as Camera;
    }
    get light(): Light {
        return this.ioc.get('light') as Light;
    }
    get renderer(): Renderer {
        return this.ioc.get('renderer') as Renderer;
    }
    get scene(): Scene {
        return this.ioc.get('scene') as Scene;
    }
    get parse(): Parse {
        return this.ioc.get('parser') as Parse;
    }
    get env(): Env {
        return this.ioc.get('env') as Env;
    }
    get PP(): PostProcessing {
        return this.ioc.get('pp') as PostProcessing;
    }

    async init(cb: (scene: Scene) => void) {
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
                spot: {},
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
                        yfov: (FOV * Math.PI) / 180,
                    },
                },
                'perspective',
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

            WebGPU.nearestSampler = WebGPU.device.createSampler({
                mipmapFilter: 'nearest',
                magFilter: 'nearest',
                minFilter: 'nearest',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
                addressModeW: 'clamp-to-edge',
            });
            WebGPU.linearSampler = WebGPU.device.createSampler({
                mipmapFilter: 'linear',
                magFilter: 'linear',
                minFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat',
                addressModeW: 'repeat',
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
            stateBuffer.add('isTone', renderState.isprerefraction ? 0 : 1);
            stateBuffer.add('isIBL', isIBL ? 1 : 0);
            stateBuffer.add('isDefaultLight', isDefaultLight || lights.some((l) => !l.isInitial) ? 1 : 0);
            stateBuffer.done();
            this.stateBuffer = stateBuffer;
            const uniformBuffer = WebGPU.device.createBuffer({
                size: 256 + stateBuffer.store!.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            stateBuffer.bufferWebGPU = uniformBuffer;
            WebGPU.device.queue.writeBuffer(
                uniformBuffer,
                0,
                stateBuffer.store!.buffer,
                stateBuffer.store!.byteOffset,
                stateBuffer.store!.byteLength,
            );

            const hasTransmission = this.parse.json.extensionsUsed && this.parse.json.extensionsUsed.includes('KHR_materials_transmission');
            if (hasTransmission) {
                this.PP.addPrepass('refraction');
            }
            //this.PP.add('scattering');
            if (this.PP.hasPostPass || this.PP.hasPrePass) {
                this.PP.buildScreenBuffer();
            }
            const refraction = this.PP.postprocessors.find((p) => p instanceof Refraction);

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
                spot: 2,
            };
            const spotDirs = new Float32Array(this.parse.lights.length * 4);
            const lightPos = new Float32Array(this.parse.lights.length * 4);
            const lightColor = new Float32Array(this.parse.lights.length * 4);
            const lightProps = new Float32Array(this.parse.lights.length * 4);
            this.parse.lights.forEach((light, i) => {
                spotDirs.set(
                    new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize()
                        .elements,
                    i * 4,
                );
                lightPos.set(light.getPosition(), i * 4);
                lightColor.set(light.color.elements, i * 4);
                lightProps.set(
                    [light.intensity!, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]],
                    i * 4,
                );
            });
            const lightPosBuffer = new UniformBuffer();
            lightPosBuffer.add('lightPos', lightPos);
            lightPosBuffer.done();
            this.lightPosBuffer = lightPosBuffer;

            const lightColorBuffer = new UniformBuffer();
            lightColorBuffer.add('lightColor', lightColor);
            lightColorBuffer.done();
            this.lightColorBuffer = lightColorBuffer;

            const spotdirBuffer = new UniformBuffer();
            spotdirBuffer.add('spotdir', spotDirs);
            spotdirBuffer.done();

            const lightIntensityBuffer = new UniformBuffer();
            lightIntensityBuffer.add('lightIntensity', lightProps);
            lightIntensityBuffer.done();

            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightPosBuffer);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightColorBuffer);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, spotdirBuffer);
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightIntensityBuffer);

            this.scene.meshes.forEach((mesh) => {
                [mesh.material, ...mesh.variants.map((m) => m.m)].forEach((m) => m.createUniforms(false, this.parse.lights));
            });
            const materialStorage = new Float32Array(
                this.scene.meshes.length * this.scene.meshes[0].material.materialUniformBuffer.store!.length,
            );
            this.scene.meshes.forEach((mesh, i) => {
                materialStorage.set(mesh.material.materialUniformBuffer.store!, i * mesh.material.materialUniformBuffer.store!.length);
            });
            const storageBuffer: UniformBufferLike = { store: materialStorage };
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer, GPUBufferUsage.STORAGE);

            let meshCount = this.scene.meshes.length;
            this.scene.meshes.forEach((mesh) => {
                mesh.geometry.createUniforms(mesh.matrixWorld);
                if (mesh.matrices.length) {
                    meshCount += mesh.matrices.length;
                }
            });
            const transformsStorage = new Float32Array(meshCount * this.scene.meshes[0].geometry.uniformBuffer!.store!.length);
            this.scene.meshes.forEach((mesh, i) => {
                mesh.order = i;
                transformsStorage.set(mesh.geometry.uniformBuffer!.store!, i * mesh.geometry.uniformBuffer!.store!.length);
                if (mesh.matrices.length) {
                    mesh.matrices.forEach((matrix, j) => {
                        transformsStorage.set(matrix.elements, (i + j + 1) * mesh.geometry.uniformBuffer!.store!.length);
                    });
                }
            });
            const storageBuffer2: UniformBufferLike = { store: transformsStorage };
            this.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer2, GPUBufferUsage.STORAGE);
            this.transformsStorage = storageBuffer2;
            this.materialStorage = storageBuffer;

            const uniformBindGroup1 = [
                {
                    binding: 0,
                    resource: storageBuffer2.bufferWebGPU!,
                },
                {
                    binding: 1,
                    resource: storageBuffer.bufferWebGPU!,
                },
                {
                    binding: 39,
                    resource: cameraBuffer.bufferWebGPU!,
                },
                {
                    binding: 16,
                    resource: lightPosBuffer.bufferWebGPU!,
                },
                {
                    binding: 15,
                    resource: lightColorBuffer.bufferWebGPU!,
                },

                {
                    binding: 17,
                    resource: spotdirBuffer.bufferWebGPU!,
                },
                {
                    binding: 18,
                    resource: lightIntensityBuffer.bufferWebGPU!,
                },
            ];

            const prevProgramHash = new Map<string, GPURenderPipeline[]>();
            const uniformBindGroup2: Array<{ k: GPUBindGroupEntry[]; v: GPUBindGroup }> = [];

            this.scene.meshes.forEach((mesh) => {
                mesh.geometry.createGeometryForWebGPU(WebGPU, mesh.order);
                mesh.geometry.uniformBindGroup1 = [];

                mesh.material.updateUniformsWebGPU(WebGPU);
                mesh.material.uniformBindGroup1.push(
                    {
                        binding: 19,
                        resource: this.env.prefilterTexture.view!,
                    },
                    {
                        binding: 20,
                        resource: this.env.irradianceTexture.view!,
                    },
                    {
                        binding: 21,
                        resource: this.env.bdrfTexture.view!,
                    },
                    {
                        binding: 28,
                        resource: this.env.Sheen_E.view!,
                    },
                    {
                        binding: 26,
                        resource: mesh.defines!.find((i) => i.name === 'TRANSMISSION')
                            ? (refraction!.texture as { texture: GPUTexture }).texture.createView()
                            : this.PP.fakeDepth.view,
                    },
                    {
                        binding: 35,
                        resource: this.env.charlieTexture.view!,
                    },
                    {
                        binding: 30,
                        resource: uniformBuffer,
                    },
                );
                if (this.env.uniformBuffer) {
                    mesh.material.uniformBindGroup1.push({
                        binding: 27,
                        resource: this.env.uniformBuffer.bufferWebGPU!,
                    });
                }
                if (mesh instanceof SkinnedMesh) {
                    for (const join of this.parse.skins[mesh.skin].jointNames) {
                        walk(this.scene, this.buildBones.bind(this, join, this.parse.skins[mesh.skin]));
                    }
                    mesh.geometry.uniformBindGroup1.push(mesh.setSkinWebGPU(WebGPU, this.parse.skins[mesh.skin]));
                }

                const id = mesh.material.baseColorTexture ? mesh.material.baseColorTexture.sampler.id : '';
                const programHash = mesh.mode + id + mesh.material.defines.map((define) => `${define.name}${define.value ?? 1}`).join('');
                if (!prevProgramHash.has(programHash)) {
                    prevProgramHash.set(
                        programHash,
                        create(
                            WebGPU.device,
                            WebGPU.glslang,
                            WebGPU.wgsl,
                            mesh.material.uniformBindGroup1,
                            mesh.defines!,
                            mesh.mode,
                            mesh.frontFace!,
                        ),
                    );
                }
                let group = check(uniformBindGroup2, mesh.material.uniformBindGroup1);
                if (!group) {
                    group = {
                        k: mesh.material.uniformBindGroup1,
                        v: WebGPU.device.createBindGroup({
                            layout: prevProgramHash.get(programHash)![0].getBindGroupLayout(0),
                            entries: [...uniformBindGroup1, ...mesh.geometry.uniformBindGroup1!, ...mesh.material.uniformBindGroup1],
                        }),
                    };
                    uniformBindGroup2.push(group);
                }

                mesh.pipeline = prevProgramHash.get(programHash)![0];
                mesh.pipeline2 = prevProgramHash.get(programHash)![1];
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

        window.__TEST_READY__ = true;

        cb(this.scene);
    }

    buildBones(join: number, v: Skin, node: Object3D | Scene) {
        if (node instanceof Object3D && node.name === join) {
            v.bones.push(node);
        }
    }

    resize() {
        this.camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;

        const z = this.camera.modelSize!;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        if (this.light.isInitial || this.light.type === 'directional') {
            this.light.setZ(z);
        }
        this.camera.updateNF();
    }

    renderScene(renderState: { isprepender?: boolean; isprerefraction?: boolean }) {
        this.renderState = renderState;
        this.renderer.renderScene();
        this.renderState = {};
    }

    redraw(type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) {
        if (type === 'zoom') {
            this.camera.zoom(coordsStart as number);
            this.renderer.needUpdateView = true;
            this.renderer.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            this.camera.rotate(coordsStart as [number, number], coordsMove!);
            this.renderer.needUpdateView = true;
        }
        if (type === 'pan') {
            this.camera.pan(coordsStart as [number, number], coordsMove!, this.canvas.offsetWidth, this.canvas.offsetHeight);
            this.renderer.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize();
            this.renderer.needUpdateProjection = true;
        }

        this.renderer.reflow = true;
    }

    setVariant(variant: string | number) {
        this.scene.meshes.forEach((mesh) => {
            if (variant && mesh.variants.length) {
                mesh.material = mesh.variants.find((v) => v.variants.includes(Number(variant)))!.m;
                mesh.repaint = true;
            }
        });
        this.renderer.reflow = true;
        this.renderer.needUpdateView = true;
        this.renderer.needUpdateProjection = true;
    }

    draw() {
        this.renderer.reflow = true;
    }

    getState() {
        return {
            lightColorBuffer: this.lightColorBuffer,
            transformsStorage: this.transformsStorage,
            materialStorage: this.materialStorage,
            lightPosBuffer: this.lightPosBuffer,
            cameraBuffer: this.cameraBuffer,
            stateBuffer: this.stateBuffer,
            renderState: this.renderState,
            lights: this.parse.lights,
            isIBL: this.isIBL,
            isDefaultLight: this.isDefaultLight,
            camera: this.camera,
            light: this.light,
            needUpdateView: this.renderer.needUpdateView,
            needUpdateProjection: this.renderer.needUpdateProjection,
        };
    }
}

function check(source: Array<{ k: GPUBindGroupEntry[]; v: GPUBindGroup }>, candidate: GPUBindGroupEntry[]) {
    return source.find((item) => {
        for (let i = 0; i < candidate.length; i++) {
            if (item.k[i].binding !== candidate[i].binding || item.k[i].resource !== candidate[i].resource) {
                return false;
            }
        }
        return true;
    });
}

export { RedCube };
