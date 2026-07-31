import { Renderer } from './renderer';
import { Vector3 } from './matrix';
import { Scene, Camera, Light, SkinnedMesh, Object3D, UniformBuffer } from './objects/index';
import { Events } from './events';
import { Env } from './env';
import { getJson, getBuffer, getEnv } from './parseLoader';
import { buildMesh, buildSkin, buildAnimation, calculateFov } from './parseSceneBuilder';
import { createShaderProgram, createSamplers, createTexturesWebGL, initTextures } from './parseTextures';
import { PostProcessing, ProcessorName } from './postprocessing';
import { Particles } from './particles';
import { clearColor, walk, GLTexture } from './utils';
import { Light as PPLight } from './postprocessors/light';
import { Refraction } from './postprocessors/refraction';
import { State, Define, Skin, commit } from './state';
import '../webgl-memory';

declare global {
    interface Window {
        __TEST_READY__?: boolean;
    }
}

const FOV = 60; // degrees

class RedCube {
    canvas: HTMLCanvasElement;
    events: Events;
    processors: Array<string>;
    url: string;
    envUrl: string;
    defines: Array<Define>;
    state: State;

    constructor(url: string, canvas: HTMLCanvasElement, processors: string[] = [], envUrl = 'env', mode = 'pbr') {
        if (!url) {
            throw new Error('RedCube: a glTF url must be passed as the first constructor argument');
        }
        if (!canvas) {
            throw new Error('RedCube: an HTMLCanvasElement must be passed as the second constructor argument');
        }

        this.url = url;
        this.canvas = canvas;
        this.processors = processors;
        this.envUrl = envUrl;

        const defines: Array<Define> = [];
        if (this.processors.length === 0) {
            defines.push({ name: 'TONE' });
        }
        if (this.processors.some((p) => p === 'shadow')) {
            defines.push({ name: 'SHADOWMAP' });
        }
        if (mode === 'pbr') {
            defines.push({ name: 'USE_PBR' });
        }
        this.defines = defines;

        const camera = new Camera(
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
        const scene = new Scene();
        const light = new Light({
            type: 'directional',
            intensity: 5,
            color: [1, 1, 1],
            isInitial: true,
            spot: {},
        });

        this.state = {
            camera,
            scene,
            light,
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            url,
            host: url.substr(0, url.lastIndexOf('/') + 1),
            defines,
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

        this.events = new Events(canvas, this.redraw.bind(this));
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

    // Fans out a runtime camera switch (e.g. picking a different glTF camera
    // node) to the child postprocessors that still cache their own copy -
    // everything else reads state.camera live, so there's nothing to update.
    setActiveCamera(camera: Camera) {
        this.state.camera = camera;
        this.state.pp!.setCamera(camera);
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

    async init(cb: (scene: Scene) => void) {
        this.glInit();
        const gl = this.state.gl as WebGL2RenderingContext;

        const env = new Env(this.getState.bind(this), this.envUrl);
        this.state.env = env;
        this.state.pp = new PostProcessing(
            this.getState.bind(this),
            this.canvas,
            this.processors as ProcessorName[],
            this.renderScene.bind(this),
        );
        this.state.particles = new Particles(this.getState.bind(this), () => {
            const l = this.state.pp!.postprocessors.find((p) => p instanceof PPLight) as PPLight;
            return l.texture.index;
        });
        this.state.renderer = new Renderer(this.getState.bind(this));

        await this.withPatchAsync<void | boolean>((patch) => getJson(this.state, patch));
        await this.withPatchAsync((patch) => getBuffer(this.state, patch));
        await this.withPatchAsync((patch) => initTextures(this.state, patch, false));
        buildSkin(this.state);
        await buildMesh(this.state);

        this.withPatch((patch) => createSamplers(this.state, patch));
        createTexturesWebGL(this.state);

        this.state.cameras.push(this.state.camera);

        calculateFov(this.state, this.state.camera.props.isInitial);

        const envData = await getEnv(this.state, false);
        await env.createEnvironmentBuffer(envData);

        const cameraBuffer = new UniformBuffer();
        cameraBuffer.add('view', this.state.camera.matrixWorldInvert.elements);
        cameraBuffer.add('projection', this.state.camera.projection.elements);
        cameraBuffer.add('light', this.state.light!.matrixWorldInvert.elements);
        cameraBuffer.add('isShadow', 0);
        cameraBuffer.done();
        this.state.cameraBuffer = cameraBuffer;
        const UBO = gl!.createBuffer();
        gl!.bindBuffer(gl!.UNIFORM_BUFFER, UBO);
        gl!.bufferData(gl!.UNIFORM_BUFFER, cameraBuffer.store!, gl!.DYNAMIC_DRAW);
        this.state.UBO = UBO!;

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

        const lightPosUniform = gl!.createBuffer();
        gl!.bindBuffer(gl!.UNIFORM_BUFFER, lightPosUniform);
        gl!.bufferData(gl!.UNIFORM_BUFFER, lightPosBuffer.store!, gl!.DYNAMIC_DRAW);
        const lightColorUniform = gl!.createBuffer();
        gl!.bindBuffer(gl!.UNIFORM_BUFFER, lightColorUniform);
        gl!.bufferData(gl!.UNIFORM_BUFFER, lightColorBuffer.store!, gl!.DYNAMIC_DRAW);
        const spotdirUniform = gl!.createBuffer();
        gl!.bindBuffer(gl!.UNIFORM_BUFFER, spotdirUniform);
        gl!.bufferData(gl!.UNIFORM_BUFFER, spotdirBuffer.store!, gl!.DYNAMIC_DRAW);
        const lightIntensityUniform = gl!.createBuffer();
        gl!.bindBuffer(gl!.UNIFORM_BUFFER, lightIntensityUniform);
        gl!.bufferData(gl!.UNIFORM_BUFFER, lightIntensityBuffer.store!, gl!.DYNAMIC_DRAW);
        this.state.lightPosUniform = lightPosUniform!;
        this.state.lightColorUniform = lightColorUniform!;

        let meshCount = this.state.scene.meshes.length;
        this.state.scene.meshes.forEach((mesh) => {
            mesh.geometry.createUniforms(mesh.matrixWorld);
            if (mesh.matrices.length) {
                meshCount += mesh.matrices.length;
            }
        });
        this.state.scene.meshes.forEach((mesh, i) => {
            mesh.order = i;
            mesh.reflow = true;
            mesh.repaint = true;
        });

        this.state.scene.meshes.forEach((mesh) => {
            [mesh.material, ...mesh.variants.map((m) => m.m)].forEach((m) => m.createUniforms(true, this.state.lights));
        });

        gl!.activeTexture(gl![`TEXTURE${31}`]);
        const texture = gl!.createTexture();
        gl!.bindTexture(gl!.TEXTURE_2D, texture);
        gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA32F,
            this.state.scene.meshes[0].geometry.uniformBuffer!.store!.length / Float32Array.BYTES_PER_ELEMENT,
            meshCount,
            0,
            gl!.RGBA,
            gl!.FLOAT,
            null,
        );
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
        this.state.storage2 = { texture: texture! };

        gl!.activeTexture(gl![`TEXTURE${30}`]);
        const texture2 = gl!.createTexture();
        gl!.bindTexture(gl!.TEXTURE_2D, texture2);
        gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA32F,
            this.state.scene.meshes[0].material.materialUniformBuffer.store!.length / Float32Array.BYTES_PER_ELEMENT,
            this.state.scene.meshes.length,
            0,
            gl!.RGBA,
            gl!.FLOAT,
            null,
        );
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
        this.state.storage = { texture2: texture2! };

        const hasTransmission = this.state.json.extensionsUsed && this.state.json.extensionsUsed.includes('KHR_materials_transmission');
        this.state.scene.meshes.forEach((mesh) => {
            mesh.geometry.createGeometryForWebGl(gl!, mesh.defines!, mesh.order);

            const program = createShaderProgram(this.state, mesh.defines!);
            [mesh.material, ...mesh.variants.map((m) => m.m)].forEach((m) => m.updateUniformsWebgl(gl!, program));
            mesh.material.setHarmonics(env.updateUniform(gl!, program));

            mesh.setProgram(program);

            gl!.bindBufferBase(gl!.UNIFORM_BUFFER, 3, this.state.lightPosUniform!);
            gl!.bindBufferBase(gl!.UNIFORM_BUFFER, 4, this.state.lightColorUniform!);
            gl!.bindBufferBase(gl!.UNIFORM_BUFFER, 5, spotdirUniform);
            gl!.bindBufferBase(gl!.UNIFORM_BUFFER, 6, lightIntensityUniform);

            gl!.activeTexture(gl![`TEXTURE${31}`]);
            let t = gl!.getUniformLocation(program, 'uTransformTex');
            gl!.uniform1i(t, 31);

            gl!.activeTexture(gl![`TEXTURE${30}`]);
            t = gl!.getUniformLocation(program, 'uMaterialTex');
            gl!.uniform1i(t, 30);

            mesh.geometry.updateUniformsWebGl(gl!, mesh.program!);

            if (mesh instanceof SkinnedMesh) {
                for (const join of this.state.skins[mesh.skin].jointNames) {
                    walk(this.state.scene, this.buildBones.bind(this, join, this.state.skins[mesh.skin]));
                }
                mesh.setSkin(gl!, this.state.skins[mesh.skin]);
            }
        });
        if (hasTransmission) {
            this.state.pp.addPrepass('refraction');
        }
        // this.state.pp.add('scattering');

        if (this.state.pp.postprocessors.some((p) => p instanceof PPLight)) {
            this.state.particles.build();
        }
        if (this.state.pp.hasPostPass || this.state.pp.hasPrePass) {
            this.state.pp.buildScreenBuffer();
        }

        const refraction = this.state.pp.postprocessors.find((p) => p instanceof Refraction);
        this.state.preDepthTexture = this.state.pp.preDepthTexture;
        this.state.fakeDepth = this.state.pp.fakeDepth;
        this.state.colorTexture = refraction ? (refraction.texture as GLTexture) : this.state.pp.fakeDepth;

        this.resize();
        buildAnimation(this.state);
        this.initialDraw();

        const ext = gl!.getExtension('GMAN_webgl_memory');
        if (ext) {
            // memory info
            const info = ext.getMemoryInfo();
            // every texture, it's size, a stack of where it was created and a stack of where it was last updated.
            const textures = ext.getResourcesInfo(WebGLTexture);
            // every buffer, it's size, a stack of where it was created and a stack of where it was last updated.
            const buffers = ext.getResourcesInfo(WebGLBuffer);
            console.log(info, textures, buffers);
        }

        cb(this.state.scene);
    }

    buildBones(join: number, v: Skin, node: Object3D | Scene) {
        if (node instanceof Object3D && node.name === join) {
            v.bones.push(node);
        }
    }

    renderScene(renderState: { isprepender?: boolean; isprerefraction?: boolean }) {
        this.state.renderState = renderState;
        this.state.renderer!.renderScene();
        this.state.renderState = this.state.pp!.hasPostPass ? { isprerefraction: true } : {};
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
            this.resize(true);
            renderer!.needUpdateProjection = true;
        }

        renderer!.reflow = true;
    }

    resize(isResizeEvent = false) {
        this.state.width = this.canvas.offsetWidth;
        this.state.height = this.canvas.offsetHeight;
        const { camera, light, renderer, pp } = this.state;
        const gl = this.state.gl as WebGL2RenderingContext;
        camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
        gl.viewport(0, 0, this.canvas.offsetWidth * devicePixelRatio, this.canvas.offsetHeight * devicePixelRatio);
        const z = camera.modelSize!;

        if (camera.props.isInitial) {
            camera.setZ(z);
        }
        if (light!.isInitial || light!.type === 'directional') {
            light!.setZ(z);
        }

        renderer!.needUpdateView = true;
        camera.updateNF();

        if (isResizeEvent) {
            pp!.clear();
            pp!.buildScreenBuffer();
        }
    }

    glInit() {
        const context = this.canvas.getContext('webgl2', {
            antialias: true,
        });

        if (!context) {
            throw new Error(
                'RedCube: WebGL2 is not supported by this browser/canvas - use the WebGPU or Node build instead, or check that the canvas has no other active rendering context',
            );
        }

        this.state.gl = context;

        let ext = context.getExtension('EXT_color_buffer_float');
        ext = context.getExtension('OES_texture_float_linear');
        ext = context.getExtension('OES_texture_buffer');
        console.log(ext);
    }

    draw() {
        this.state.renderer!.reflow = true;
    }
    initialDraw() {
        const gl = this.state.gl as WebGL2RenderingContext;
        gl.clearColor(...(clearColor as [number, number, number, number]));
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.state.renderer!.reflow = true;
        this.state.renderer!.render();
        window.__TEST_READY__ = true;
    }
}

export { RedCube };
