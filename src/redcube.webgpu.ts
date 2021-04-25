/// <reference path='../index.d.ts'/>
/// <reference types="@webgpu/types" />

import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light, SkinnedMesh } from './objects/index';
import { Events } from './events';
import { Env } from './env.webgpu';
import { Parse } from './parse';
import { Matrix4 } from './matrix';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { Light as PPLight } from './postprocessors/light';
import { RendererWebGPU } from './renderer.webgpu';
import { create } from './objects/pipeline';
import { walk } from './utils';

const FOV = 45; // degrees

class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    ioc: Container;

    constructor(url, canvas, _pp, envUrl = 'env') {
        if (!url) {
            throw new Error('Url not found');
        }

        this.envUrl = envUrl;
        this.url = url;
        this.canvas = canvas;
        this.events = new Events(canvas, this.redraw.bind(this));
    }

    async webgpuInit() {
        const glslangModule = await import(/*webpackChunkName: "glslang"*/ '../glslang.js');
        // @ts-ignore
        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        const glslang = await glslangModule.default();

        const context = this.canvas.getContext('gpupresent');

        const swapChainFormat = 'bgra8unorm';

        // @ts-ignore
        const swapChain = context.configureSwapChain({
            device,
            format: swapChainFormat
        });

        const depthTexture = device.createTexture({
            size: {
                width: this.canvas.offsetWidth * devicePixelRatio,
                height: this.canvas.offsetHeight * devicePixelRatio,
                depthOrArrayLayers: 1
            },
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        const renderPassDescriptor = {
            colorAttachments: [
                {
                    // attachment is acquired in render loop.
                    view: swapChain.getCurrentTexture().createView(),
                    storeOp: 'store' as GPUStoreOp,
                    loadValue: { r: 0, g: 0, b: 0, a: 1.0 }
                }
            ],
            depthStencilAttachment: {
                view: depthTexture.createView(),

                depthLoadValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp
            }
        };

        return { glslang, swapChain, device, renderPassDescriptor };
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
                intensity: 1,
                color: [1, 1, 1],
                isInitial: true,
                spot: {}
            });
            ioc.register('parser', Parse, ['gl', 'scene', 'camera', 'light'], this.url, [], () => {});
            ioc.register('env', Env, ['camera', 'canvas'], this.envUrl);
            ioc.register('renderer', RendererWebGPU, ['gl', 'scene', 'parser', 'env'], this.getState.bind(this));
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
            if (this.parse.cameras.length === 0) {
                this.parse.cameras.push(this.camera);
            }

            this.parse.createSamplersWebGPU(WebGPU);
            this.parse.createTexturesWebGPU(WebGPU);

            this.parse.calculateFov(this.camera.props.isInitial);
            this.resize();

            await this.env.createTexture(WebGPU);
            this.env.drawBRDF(WebGPU);
            //this.env.drawQuad(WebGPU);
            this.env.drawMips(WebGPU);
            this.env.drawIrradiance(WebGPU);
            this.env.drawPrefilter(WebGPU);
            //this.env.drawCube(WebGPU);

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
                    }
                );
                if (mesh instanceof SkinnedMesh) {
                    for (const join of this.parse.skins[mesh.skin].jointNames) {
                        walk(this.scene, this.buildBones.bind(this, join, this.parse.skins[mesh.skin]));
                    }
                    mesh.geometry.uniformBindGroup1.push(mesh.setSkinWebGPU(WebGPU, this.parse.skins[mesh.skin]));
                }

                mesh.pipeline = create(WebGPU.device, WebGPU.glslang, mesh.material.uniformBindGroup1, mesh.defines);
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
            this.camera.setZ(z * 1.5);
        }
        if (this.light.isInitial || this.light.type === 'directional') {
            this.light.setZ(z * 1.5);
        }
        this.camera.updateNF();
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
            camera: this.camera,
            light: this.light,
            needUpdateView: this.renderer.needUpdateView,
            needUpdateProjection: this.renderer.needUpdateProjection
        };
    }
}

export { RedCube };
