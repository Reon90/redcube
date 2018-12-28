/// <reference path='../index.d.ts'/>

import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light } from './objects/index';
import { Events } from './events';
import { Env } from './env';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { setGl, clearColor } from './utils';
import { Light as PPLight } from './postprocessors/light';

let gl;
const FOV = 15; // degrees

class RedCube {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    events: Events;
    processors: Array<String>;
    ioc: Container;

    constructor(url, canvas, processors = [], envUrl = 'env', mode = 'pbr') {
        if (!url || !canvas) {
            throw new Error('Url or Canvas not found');
        }

        this.canvas = canvas;
        this.processors = processors;

        const defines = [];
        if (processors.length === 0) {
            defines.push({ name: 'TONE' });
        }
        if (processors.some(p => p === 'shadow')) {
            defines.push({ name: 'SHADOWMAP' });
        }
        if (mode === 'pbr') {
            defines.push({ name: 'USE_PBR' });
        }

        this.ioc = new Container();
        this.ioc.register('env', Env, ['camera', 'canvas', 'gl'], envUrl);
        this.ioc.register('camera', Camera, [], {
            type: 'perspective',
            isInitial: true,
            zoom: 1,
            aspect: this.canvas.offsetWidth / this.canvas.offsetHeight,
            perspective: {
                yfov: (FOV * Math.PI) / 180
            }
        });
        this.ioc.register('canvas', canvas);
        this.ioc.register('scene', Scene);
        this.ioc.register('light', Light, [], {
            type: 'directional',
            intensity: 1,
            color: [1, 1, 1],
            isInitial: true,
            spot: {}
        });
        this.ioc.register('pp', PostProcessing, ['light', 'camera', 'canvas', 'gl'], processors, this.renderScene.bind(this));
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

    async init(cb) {
        await this.parse.getJson();
        this.glInit();
        if (this.PP.postprocessors.some(p => p instanceof PPLight)) {
            this.Particles.build();
        }
        await this.parse.initTextures();
        if (this.PP.postprocessors.length > 0) {
            this.PP.buildScreenBuffer();
        }
        await this.parse.getBuffer();
        this.parse.buildSkin();
        this.parse.buildMesh();
        this.resize(null);
        this.parse.buildAnimation();
        await this.env.createEnvironmentBuffer();
        this.draw();

        cb();
    }

    renderScene(isShadow, isLight) {
        this.renderer.renderScene(isShadow, isLight);
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.camera.zoom(coordsStart);
            this.renderer.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            this.camera.rotate(coordsStart, coordsMove, this.canvas.offsetWidth, this.canvas.offsetHeight);
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
        const z = (10000 / this.canvas.width) * this.camera.modelSize * devicePixelRatio;

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
            antialias: this.processors.length === 0
        });
        this.gl = gl;

        if (!gl) {
            throw new Error('Webgl 2 doesnt support');
        }

        setGl(gl);
        this.ioc.register('gl', gl);

        gl.getExtension('EXT_color_buffer_float');
        gl.getExtension('OES_texture_float_linear');
    }

    draw() {
        gl.clearColor(...clearColor);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.renderer.render();
    }

    getState() {
        return {
            camera: this.camera,
            light: this.light,
            preDepthTexture: this.PP.preDepthTexture,
            fakeDepth: this.PP.fakeDepth,
            needUpdateView: this.renderer.needUpdateView,
            needUpdateProjection: this.renderer.needUpdateProjection,
            irradiancemap: this.env.irradiancemap,
            prefilterMap: this.env.prefilterMap,
            brdfLUT: this.env.brdfLUTTexture
        };
    }
}

export { RedCube };
