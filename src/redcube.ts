/// <reference path='../index.d.ts'/>

import { Container } from './container';
import { Renderer } from './renderer';
import { Frustum, Vector3 } from './matrix';
import { Scene, Camera, Light, SkinnedMesh, UniformBuffer } from './objects/index';
import { Events } from './events';
import { Env } from './env';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { setGl, clearColor, walk } from './utils';
import { Light as PPLight } from './postprocessors/light';
import { Refraction } from './postprocessors/refraction';
import '../webgl-memory';

let gl;
const FOV = 60; // degrees

class RedCube {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    events: Events;
    processors: Array<String>;
    ioc: Container;
    renderState = {};
    isIBL = true;
    isDefaultLight = true;
    stateBuffer: UniformBuffer;
    cameraBuffer: UniformBuffer;
    lightPosBuffer: UniformBuffer;
    storage2: Float32Array;
    storage: Float32Array;

    lightUBO1: WebGLBuffer;
    lightUBO2: WebGLBuffer;
    lightUBO3: WebGLBuffer;
    lightUBO4: WebGLBuffer;
    UBO: WebGLBuffer;

    constructor(url, canvas, processors = [], envUrl = 'env', mode = 'pbr') {
        if (!url || !canvas) {
            throw new Error('Url or Canvas not found');
        }

        this.canvas = canvas;
        this.processors = processors;

        const defines = [];
        if (this.processors.length === 0) {
            defines.push({ name: 'TONE' });
        }
        if (this.processors.some(p => p === 'shadow')) {
            defines.push({ name: 'SHADOWMAP' });
        }
        if (mode === 'pbr') {
            defines.push({ name: 'USE_PBR' });
        }

        this.ioc = new Container();
        this.ioc.register('env', Env, ['camera', 'canvas', 'gl'], envUrl);
        this.ioc.register(
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
        this.ioc.register('canvas', canvas);
        this.ioc.register('scene', Scene);
        this.ioc.register('light', Light, [], {
            type: 'directional',
            intensity: 5,
            color: [1, 1, 1],
            isInitial: true,
            spot: {}
        });
        this.ioc.register('pp', PostProcessing, ['light', 'camera', 'canvas', 'gl'], this.processors, this.renderScene.bind(this));
        this.ioc.register('parser', Parse, ['scene', 'light', 'camera', 'canvas', 'gl'], url, defines, this.resize.bind(this));
        this.ioc.register('particles', Particles, ['camera', 'gl'], () => {
            const l = this.PP.postprocessors.find(p => p instanceof PPLight) as PPLight;
            return l.texture.index;
        });
        this.ioc.register('renderer', Renderer, ['gl', 'parser', 'pp', 'scene', 'camera', 'particles', 'env'], this.getState.bind(this));

        this.events = new Events(canvas, this.redraw.bind(this));
    }

    get renderer(): Renderer {
        return this.ioc.get('renderer');
    }

    get scene(): Scene {
        return this.ioc.get('scene');
    }
    get camera(): Camera {
        return this.ioc.get('camera');
    }
    get light(): Light {
        return this.ioc.get('light');
    }
    get env(): Env {
        return this.ioc.get('env');
    }
    get PP(): PostProcessing {
        return this.ioc.get('pp');
    }
    get Particles(): Particles {
        return this.ioc.get('particles');
    }
    get parse(): Parse {
        return this.ioc.get('parser');
    }

    setVariant(variant) {
        this.scene.meshes.forEach(mesh => {
            if (variant && mesh.variants.length) {
                mesh.material = mesh.variants.find(v => v.variants.includes(Number(variant))).m;
            }
        });
        this.renderer.reflow = true;
        this.renderer.needUpdateView = true;
        this.renderer.needUpdateProjection = true;
    }

    async init(cb) {
        await this.parse.getJson();
        this.glInit();
        await this.parse.getBuffer();
        await this.parse.initTextures(false);
        this.parse.buildSkin();
        await this.parse.buildMesh();

        this.parse.createSamplers();
        this.parse.createTexturesWebGL();

        this.parse.cameras.push(this.camera);

        this.parse.calculateFov(this.camera.props.isInitial);
        const planes = Frustum(this.camera.getViewProjMatrix());

        const envData = await this.parse.getEnv(false);
        await this.env.createEnvironmentBuffer(envData);

        const { renderState, isIBL, isDefaultLight, lights } = this.getState();
        const stateBuffer = new UniformBuffer();
        // @ts-expect-error
        stateBuffer.add('isTone', renderState.isprerefraction ? 0 : 1);
        stateBuffer.add('isIBL', isIBL ? 1 : 0);
        stateBuffer.add('isDefaultLight', isDefaultLight || lights.some(l => !l.isInitial) ? 1 : 0);
        stateBuffer.done();
        this.stateBuffer = stateBuffer;
        const mUBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
        gl.bufferData(gl.UNIFORM_BUFFER, stateBuffer.store, gl.STATIC_DRAW);

        const cameraBuffer = new UniformBuffer();
        cameraBuffer.add('view', this.camera.matrixWorldInvert.elements);
        cameraBuffer.add('projection', this.camera.projection.elements);
        cameraBuffer.add('light', this.light.matrixWorldInvert.elements);
        cameraBuffer.add('isShadow', 0);
        cameraBuffer.done();
        this.cameraBuffer = cameraBuffer;
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, cameraBuffer.store, gl.DYNAMIC_DRAW);
        this.UBO = UBO;

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

        const UBO2 = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO2);
        gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.DYNAMIC_DRAW);
        const UBO3 = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO3);
        gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer2.store, gl.DYNAMIC_DRAW);
        const UBO4 = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO4);
        gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer3.store, gl.DYNAMIC_DRAW);
        const UBO5 = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO5);
        gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer4.store, gl.DYNAMIC_DRAW);
        this.lightUBO1 = UBO2;
        this.lightUBO2 = UBO3;
        this.lightUBO3 = UBO4;
        this.lightUBO4 = UBO5;

        this.scene.meshes.forEach((mesh) => {
            mesh.geometry.createUniforms(mesh.matrixWorld);
        });
        this.scene.meshes.forEach((mesh, i) => {
            mesh.order = i;
            mesh.reflow = true;
            mesh.repaint = true;
        });

        this.scene.meshes.forEach((mesh) => {
            mesh.material.createUniforms(this.camera, this.parse.lights);
        });

        gl.activeTexture(gl[`TEXTURE${31}`]);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA32F,
            this.scene.meshes[0].geometry.uniformBuffer.store.length / Float32Array.BYTES_PER_ELEMENT, this.scene.meshes.length, 0,
            gl.RGBA, gl.FLOAT,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // @ts-expect-error
        this.storage2 = {texture};

        gl.activeTexture(gl[`TEXTURE${30}`]);
        const texture2 = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA32F,
            this.scene.meshes[0].material.materialUniformBuffer.store.length / Float32Array.BYTES_PER_ELEMENT, this.scene.meshes.length, 0,
            gl.RGBA, gl.FLOAT,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // @ts-expect-error
        this.storage = {texture2};

        const hasTransmission = this.parse.json.extensionsUsed && this.parse.json.extensionsUsed.includes('KHR_materials_transmission');
        this.scene.meshes.forEach(mesh => {
            mesh.geometry.createGeometryForWebGl(gl, mesh.defines, mesh.order);

            const program = this.parse.createProgram(mesh.defines);
            [mesh.material, ...mesh.variants.map(m => m.m)].forEach(m => m.updateUniformsWebgl(gl, program));
            mesh.material.setHarmonics(this.env.updateUniform(gl, program));

            mesh.setProgram(program);

            gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, this.lightUBO1);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.lightUBO2);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 5, this.lightUBO3);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 6, this.lightUBO4);

            gl.activeTexture(gl[`TEXTURE${31}`]);
            let t = gl.getUniformLocation(program, "uTransformTex");
            gl.uniform1i(t, 31);

            gl.activeTexture(gl[`TEXTURE${30}`]);
            t = gl.getUniformLocation(program, "uMaterialTex");
            gl.uniform1i(t, 30);

            mesh.geometry.updateUniformsWebGl(gl, mesh.program);
            mesh.visible = mesh.isVisible(planes);

            if (mesh instanceof SkinnedMesh) {
                for (const join of this.parse.skins[mesh.skin].jointNames) {
                    walk(this.scene, this.buildBones.bind(this, join, this.parse.skins[mesh.skin]));
                }
                mesh.setSkin(gl, this.parse.skins[mesh.skin]);
            }
        });
        if (hasTransmission) {
            this.PP.addPrepass('refraction');
        }
       //this.PP.add('scattering');

        if (this.PP.postprocessors.some(p => p instanceof PPLight)) {
            this.Particles.build();
        }
        if (this.PP.hasPostPass || this.PP.hasPrePass) {
            this.PP.buildScreenBuffer();
        }

        this.resize(null);
        this.parse.buildAnimation();
        this.initialDraw();

        const ext = gl.getExtension('GMAN_webgl_memory');
        if (ext) {
            // memory info
            const info = ext.getMemoryInfo();
            // every texture, it's size, a stack of where it was created and a stack of where it was last updated.
            const textures = ext.getResourcesInfo(WebGLTexture);
            // every buffer, it's size, a stack of where it was created and a stack of where it was last updated.
            const buffers = ext.getResourcesInfo(WebGLBuffer);
            console.log(info, textures, buffers);
        }

        cb();
    }

    buildBones(join, v, node) {
        if (node.name === join) {
            v.bones.push(node);
        }
    }

    renderScene(renderState) {
        this.renderState = renderState;
        this.renderer.renderScene();
        this.renderState = this.PP.hasPostPass ? { isprerefraction: true } : {};
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
            this.resize(type);
            this.renderer.needUpdateProjection = true;
        }

        this.renderer.reflow = true;
    }

    resize(e) {
        this.camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
        gl.viewport(0, 0, this.canvas.offsetWidth * devicePixelRatio, this.canvas.offsetHeight * devicePixelRatio);
        const z = this.camera.modelSize;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        if (this.light.isInitial || this.light.type === 'directional') {
            this.light.setZ(z);
        }

        this.renderer.needUpdateView = true;
        this.camera.updateNF();

        if (e) {
            this.PP.clear();
            this.PP.buildScreenBuffer();
        }
    }

    glInit() {
        gl = this.canvas.getContext('webgl2', {
            antialias: !(window as any).__FORCE_DETERMINISTIC__
        });
        this.gl = gl;

        if (!gl) {
            throw new Error('Webgl 2 doesnt support');
        }

        setGl(gl);
        this.ioc.register('gl', gl);

        let ext = gl.getExtension('EXT_color_buffer_float');
        ext = gl.getExtension('OES_texture_float_linear');
        ext = gl.getExtension('OES_texture_buffer');
        console.log(ext);
    }

    draw() {
        this.renderer.reflow = true;
    }
    initialDraw() {
        gl.clearColor(...clearColor);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.renderer.reflow = true;
        this.renderer.render();
        // @ts-ignore
        window.__TEST_READY__ = true;
    }

    getState() {
        const refraction = this.PP.postprocessors.find(p => p instanceof Refraction);
        return {
            storage: this.storage,
            storage2: this.storage2,
            UBO: this.UBO,
            cameraBuffer: this.cameraBuffer,
            lightUBO1: this.lightUBO1,
            lightUBO2: this.lightUBO2,
            lightUBO3: this.lightUBO3,
            lightUBO4: this.lightUBO4,
            lightPosBuffer: this.lightPosBuffer,
            isIBL: this.isIBL,
            isDefaultLight: this.isDefaultLight,
            renderState: this.renderState,
            lights: this.parse.lights,
            camera: this.camera,
            light: this.light,
            preDepthTexture: this.PP.preDepthTexture,
            // @ts-ignore
            colorTexture: refraction ? refraction.texture : this.PP.fakeDepth,
            fakeDepth: this.PP.fakeDepth,
            needUpdateView: this.renderer.needUpdateView,
            needUpdateProjection: this.renderer.needUpdateProjection,
            irradiancemap: this.env.irradiancemap,
            Sheen_E: this.env.Sheen_E,
            prefilterMap: this.env.prefilterMap,
            charlieMap: this.env.charlieMap,
            brdfLUT: this.env.brdfLUTTexture
        };
    }
}

export { RedCube };
