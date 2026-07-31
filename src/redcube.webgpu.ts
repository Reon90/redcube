import { Scene, Camera, Light, Object3D, SkinnedMesh, UniformBuffer } from './objects/index';
import { UniformBufferLike } from './objects/uniform';
import { Events } from './events';
import { Env } from './env.webgpu';
import { getJson, getBuffer, getEnv } from './parseLoader';
import { buildMesh, buildSkin, buildAnimation, calculateFov } from './parseSceneBuilder';
import { createSamplersWebGPU, createTexturesWebGPU, initTextures } from './parseTextures';
import { RendererWebGPU } from './renderer.webgpu';
import { create } from './objects/pipeline';
import { walk } from './utils';
import { PostProcessing } from './postprocessing.webgpu';
import { Refraction } from './postprocessors/refraction';
import { Vector3 } from './matrix';
import { getWebGPUMemoryUsage } from '../webgpu-memory';
import { State, Skin, commit } from './state';

const FOV = 60; // degrees

class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    state: State;

    constructor(url: string, canvas: HTMLCanvasElement, _pp: string[], envUrl = 'env') {
        if (!url) {
            throw new Error('RedCube: a glTF url must be passed as the first constructor argument');
        }

        this.envUrl = envUrl;
        this.url = url;
        this.canvas = canvas;
        this.events = new Events(canvas, this.redraw.bind(this));

        this.state = {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            url,
            host: url.substr(0, url.lastIndexOf('/') + 1),
            defines: [],
            tracks: [],
            json: undefined,
            skins: [],
            cameras: [],
            lights: [],
            textures: null,
            images: new Map(),
            samplers: null,
            arrayBuffer: null,
            programs: {},
            renderState: {},
            isIBL: true,
            isDefaultLight: true,
            needUpdateView: true,
            needUpdateProjection: true,
        } as unknown as State;
    }

    getState(): State {
        return this.state;
    }

    private withPatch<T>(run: (patch: Partial<State>) => T): T {
        const patch: Partial<State> = {};
        const result = run(patch);
        commit(this.state, patch);
        return result;
    }

    private async withPatchAsync<T>(run: (patch: Partial<State>) => Promise<T>): Promise<T> {
        const patch: Partial<State> = {};
        const result = await run(patch);
        commit(this.state, patch);
        return result;
    }

    async webgpuInit(): Promise<WEBGPU> {
        const glslangModule = await import(/*webpackChunkName: "glslang"*/ '../glslang.js');
        await import(/*webpackChunkName: "twgsl"*/ '../twgsl.js');

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error(
                'RedCube: no WebGPU adapter was returned by navigator.gpu.requestAdapter() - the GPU may be unavailable or blocklisted on this device',
            );
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
            throw new Error(
                'RedCube: WebGPU is not supported by this browser/canvas - use the WebGL build instead (Chrome 113+ is required for WebGPU), or check that the canvas has no other active rendering context',
            );
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

    // Fans out a runtime camera switch (e.g. picking a different glTF camera
    // node) to the child postprocessors that still cache their own copy -
    // everything else reads state.camera live, so there's nothing to update.
    setActiveCamera(camera: Camera) {
        this.state.camera = camera;
        this.state.pp!.setCamera(camera);
    }

    async init(cb: (scene: Scene) => void) {
        const WebGPU = await this.webgpuInit();
        this.state.gl = WebGPU;

        this.state.scene = new Scene();
        this.state.light = new Light({
            type: 'directional',
            intensity: 5,
            color: [1, 1, 1],
            isInitial: true,
            spot: {},
        });
        this.state.camera = new Camera(
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

        const env = new Env(this.getState.bind(this), this.envUrl);
        this.state.env = env;
        const pp = new PostProcessing(this.getState.bind(this), this.canvas, [], this.renderScene.bind(this));
        this.state.pp = pp;
        this.state.renderer = new RendererWebGPU(this.getState.bind(this));

        await this.withPatchAsync<void | boolean>((patch) => getJson(this.state, patch));
        await this.withPatchAsync((patch) => getBuffer(this.state, patch));
        await this.withPatchAsync((patch) => initTextures(this.state, patch, true));
        buildSkin(this.state);
        await buildMesh(this.state);
        buildAnimation(this.state);
        this.state.cameras.push(this.state.camera);

        this.withPatch((patch) => createSamplersWebGPU(this.state, patch, WebGPU));
        createTexturesWebGPU(this.state, WebGPU);

        const envData = await getEnv(this.state, true);
        await env.createEnvironmentBuffer(envData, WebGPU);

        calculateFov(this.state, this.state.camera.props.isInitial);
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

        await env.createTexture(WebGPU);
        env.drawBRDF(WebGPU);
        //env.drawQuad(WebGPU, this.state.scene.meshes[0].material.baseColorTexture);
        env.drawMips(WebGPU);
        env.drawIrradiance(WebGPU);
        env.drawPrefilter(WebGPU);
        //return

        const { renderState, isIBL, isDefaultLight, lights } = this.state;
        const stateBuffer = new UniformBuffer();
        stateBuffer.add('isTone', renderState.isprerefraction ? 0 : 1);
        stateBuffer.add('isIBL', isIBL ? 1 : 0);
        stateBuffer.add('isDefaultLight', isDefaultLight || lights.some((l) => !l.isInitial) ? 1 : 0);
        stateBuffer.done();
        this.state.stateBuffer = stateBuffer;
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

        const hasTransmission = this.state.json.extensionsUsed && this.state.json.extensionsUsed.includes('KHR_materials_transmission');
        if (hasTransmission) {
            this.state.pp.addPrepass('refraction');
        }
        //this.state.pp.add('scattering');
        if (this.state.pp.hasPostPass || this.state.pp.hasPrePass) {
            this.state.pp.buildScreenBuffer();
        }
        const refraction = this.state.pp.postprocessors.find((p) => p instanceof Refraction);

        const cameraBuffer = new UniformBuffer();
        cameraBuffer.add('view', this.state.camera.matrixWorldInvert.elements);
        cameraBuffer.add('projection', this.state.camera.projection.elements);
        cameraBuffer.add('light', this.state.light.matrixWorldInvert.elements);
        cameraBuffer.add('isShadow', 0);
        cameraBuffer.done();
        this.state.cameraBuffer = cameraBuffer;
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, cameraBuffer);

        const lightEnum = {
            directional: 0,
            point: 1,
            spot: 2,
        };
        const spotDirs = new Float32Array(this.state.lights.length * 4);
        const lightPos = new Float32Array(this.state.lights.length * 4);
        const lightColor = new Float32Array(this.state.lights.length * 4);
        const lightProps = new Float32Array(this.state.lights.length * 4);
        this.state.lights.forEach((light, i) => {
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
        this.state.lightPosBuffer = lightPosBuffer;

        const lightColorBuffer = new UniformBuffer();
        lightColorBuffer.add('lightColor', lightColor);
        lightColorBuffer.done();
        this.state.lightColorBuffer = lightColorBuffer;

        const spotdirBuffer = new UniformBuffer();
        spotdirBuffer.add('spotdir', spotDirs);
        spotdirBuffer.done();

        const lightIntensityBuffer = new UniformBuffer();
        lightIntensityBuffer.add('lightIntensity', lightProps);
        lightIntensityBuffer.done();

        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightPosBuffer);
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightColorBuffer);
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, spotdirBuffer);
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, lightIntensityBuffer);

        this.state.scene.meshes.forEach((mesh) => {
            [mesh.material, ...mesh.variants.map((m) => m.m)].forEach((m) => m.createUniforms(false, this.state.lights));
        });
        const materialStorage = new Float32Array(
            this.state.scene.meshes.length * this.state.scene.meshes[0].material.materialUniformBuffer.store!.length,
        );
        this.state.scene.meshes.forEach((mesh, i) => {
            materialStorage.set(mesh.material.materialUniformBuffer.store!, i * mesh.material.materialUniformBuffer.store!.length);
        });
        const storageBuffer: UniformBufferLike = { store: materialStorage };
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer, GPUBufferUsage.STORAGE);

        let meshCount = this.state.scene.meshes.length;
        this.state.scene.meshes.forEach((mesh) => {
            mesh.geometry.createUniforms(mesh.matrixWorld);
            if (mesh.matrices.length) {
                meshCount += mesh.matrices.length;
            }
        });
        const transformsStorage = new Float32Array(meshCount * this.state.scene.meshes[0].geometry.uniformBuffer!.store!.length);
        this.state.scene.meshes.forEach((mesh, i) => {
            mesh.order = i;
            transformsStorage.set(mesh.geometry.uniformBuffer!.store!, i * mesh.geometry.uniformBuffer!.store!.length);
            if (mesh.matrices.length) {
                mesh.matrices.forEach((matrix, j) => {
                    transformsStorage.set(matrix.elements, (i + j + 1) * mesh.geometry.uniformBuffer!.store!.length);
                });
            }
        });
        const storageBuffer2: UniformBufferLike = { store: transformsStorage };
        this.state.scene.meshes[0].geometry.updateUniformsWebGPU(WebGPU, storageBuffer2, GPUBufferUsage.STORAGE);
        this.state.transformsStorage = storageBuffer2;
        this.state.materialStorage = storageBuffer;

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

        this.state.scene.meshes.forEach((mesh) => {
            mesh.geometry.createGeometryForWebGPU(WebGPU, mesh.order);
            mesh.geometry.uniformBindGroup1 = [];

            mesh.material.updateUniformsWebGPU(WebGPU);
            mesh.material.uniformBindGroup1.push(
                {
                    binding: 19,
                    resource: env.prefilterTexture.view!,
                },
                {
                    binding: 20,
                    resource: env.irradianceTexture.view!,
                },
                {
                    binding: 21,
                    resource: env.bdrfTexture.view!,
                },
                {
                    binding: 28,
                    resource: env.Sheen_E.view!,
                },
                {
                    binding: 26,
                    resource: mesh.defines!.find((i) => i.name === 'TRANSMISSION')
                        ? (refraction!.texture as { texture: GPUTexture }).texture.createView()
                        : pp.fakeDepth.view,
                },
                {
                    binding: 35,
                    resource: env.charlieTexture.view!,
                },
                {
                    binding: 30,
                    resource: uniformBuffer,
                },
            );
            if (env.uniformBuffer) {
                mesh.material.uniformBindGroup1.push({
                    binding: 27,
                    resource: env.uniformBuffer.bufferWebGPU!,
                });
            }
            if (mesh instanceof SkinnedMesh) {
                for (const join of this.state.skins[mesh.skin].jointNames) {
                    walk(this.state.scene, this.buildBones.bind(this, join, this.state.skins[mesh.skin]));
                }
                mesh.geometry.uniformBindGroup1.push(mesh.setSkinWebGPU(WebGPU, this.state.skins[mesh.skin]));
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

        this.state.scene.tracks = this.state.tracks;
        this.state.scene.cameras = this.state.cameras;
        this.state.scene.lights = this.state.lights;

        this.state.renderer.render();

        const info = getWebGPUMemoryUsage();
        console.log(info);

        window.__TEST_READY__ = true;

        cb(this.state.scene);
    }

    buildBones(join: number, v: Skin, node: Object3D | Scene) {
        if (node instanceof Object3D && node.name === join) {
            v.bones.push(node);
        }
    }

    resize() {
        this.state.width = this.canvas.offsetWidth;
        this.state.height = this.canvas.offsetHeight;
        const { camera, light } = this.state;
        camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;

        const z = camera.modelSize!;

        if (camera.props.isInitial) {
            camera.setZ(z);
        }
        if (light!.isInitial || light!.type === 'directional') {
            light!.setZ(z);
        }
        camera.updateNF();
    }

    renderScene(renderState: { isprepender?: boolean; isprerefraction?: boolean }) {
        this.state.renderState = renderState;
        this.state.renderer!.renderScene();
        this.state.renderState = {};
    }

    redraw(type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) {
        const { camera, renderer } = this.state;
        if (type === 'zoom') {
            camera.zoom(coordsStart as number);
            renderer!.needUpdateView = true;
            renderer!.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            camera.rotate(coordsStart as [number, number], coordsMove!);
            renderer!.needUpdateView = true;
        }
        if (type === 'pan') {
            camera.pan(coordsStart as [number, number], coordsMove!, this.canvas.offsetWidth, this.canvas.offsetHeight);
            renderer!.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize();
            renderer!.needUpdateProjection = true;
        }

        renderer!.reflow = true;
    }

    setVariant(variant: string | number) {
        this.state.scene.meshes.forEach((mesh) => {
            if (variant && mesh.variants.length) {
                mesh.material = mesh.variants.find((v) => v.variants.includes(Number(variant)))!.m;
                mesh.repaint = true;
            }
        });
        this.state.renderer!.reflow = true;
        this.state.renderer!.needUpdateView = true;
        this.state.renderer!.needUpdateProjection = true;
    }

    draw() {
        this.state.renderer!.reflow = true;
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
