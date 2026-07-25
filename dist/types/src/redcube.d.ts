import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light, Object3D, UniformBuffer } from './objects/index';
import { Events } from './events';
import { Env } from './env';
import { Parse, Skin } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { GLTexture } from './utils';
import '../webgl-memory';
declare global {
    interface Window {
        __TEST_READY__?: boolean;
    }
}
declare class RedCube {
    gl: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
    events: Events;
    processors: Array<string>;
    ioc: Container;
    renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    };
    isIBL: boolean;
    isDefaultLight: boolean;
    stateBuffer?: UniformBuffer;
    cameraBuffer: UniformBuffer;
    lightPosBuffer: UniformBuffer;
    lightColorBuffer: UniformBuffer;
    storage2: {
        texture: WebGLTexture;
    };
    storage: {
        texture2: WebGLTexture;
    };
    lightPosUniform: WebGLBuffer;
    lightColorUniform: WebGLBuffer;
    spotdirUniform: WebGLBuffer;
    lightIntensityUniform: WebGLBuffer;
    UBO: WebGLBuffer;
    constructor(url: string, canvas: HTMLCanvasElement, processors?: string[], envUrl?: string, mode?: string);
    get renderer(): Renderer;
    get scene(): Scene;
    get camera(): Camera;
    get light(): Light;
    get env(): Env;
    get PP(): PostProcessing;
    get Particles(): Particles;
    get parse(): Parse;
    setVariant(variant: string | number): void;
    init(cb: (scene: Scene) => void): Promise<void>;
    buildBones(join: number, v: Skin, node: Object3D | Scene): void;
    renderScene(renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    }): void;
    redraw(type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]): void;
    resize(isResizeEvent?: boolean): void;
    glInit(): void;
    draw(): void;
    initialDraw(): void;
    getState(): {
        storage: {
            texture2: WebGLTexture;
        };
        storage2: {
            texture: WebGLTexture;
        };
        UBO: WebGLBuffer;
        cameraBuffer: UniformBuffer;
        lightPosUniform: WebGLBuffer;
        lightColorUniform: WebGLBuffer;
        spotdirUniform: WebGLBuffer;
        lightIntensityUniform: WebGLBuffer;
        lightPosBuffer: UniformBuffer;
        lightColorBuffer: UniformBuffer;
        isIBL: boolean;
        isDefaultLight: boolean;
        renderState: {
            isprepender?: boolean;
            isprerefraction?: boolean;
        };
        lights: Light[];
        camera: Camera;
        light: Light;
        preDepthTexture: GLTexture;
        colorTexture: GLTexture;
        fakeDepth: GLTexture;
        needUpdateView: boolean;
        needUpdateProjection: boolean;
        irradiancemap: GLTexture;
        Sheen_E: GLTexture;
        prefilterMap: GLTexture;
        charlieMap: GLTexture;
        brdfLUT: GLTexture;
    };
}
export { RedCube };
