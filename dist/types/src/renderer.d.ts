import { Scene, Mesh, Camera, Light } from './objects/index';
import { GLTexture } from './utils';
import { Parse, Track } from './parse';
import { PostProcessing } from './postprocessing.webgpu';
import { Particles } from './particles';
import { FPS } from './fps';
import { Env } from './env';
import { Attributes } from './objects/geometry';
import { UniformBuffer, UniformBufferLike } from './objects/uniform';
declare global {
    interface Window {
        __FORCE_DETERMINISTIC__?: boolean;
    }
}
export interface RenderPassState {
    isprepender?: boolean;
    isprerefraction?: boolean;
}
export interface State {
    lights: Light[];
    camera: Camera;
    needUpdateProjection: boolean;
    needUpdateView: boolean;
    preDepthTexture: GLTexture;
    colorTexture: GLTexture;
    renderState: RenderPassState;
    fakeDepth: GLTexture;
    isIBL: boolean;
    isDefaultLight: boolean;
    UBO: WebGLBuffer;
    cameraBuffer: UniformBuffer;
    light: Light;
    lightPosUniform: WebGLBuffer;
    lightPosBuffer: UniformBuffer;
    lightColorUniform: WebGLBuffer;
    lightColorBuffer: UniformBuffer;
    storage2: {
        texture: WebGLTexture;
    };
    storage: {
        texture2: WebGLTexture;
    };
    stateBuffer: UniformBuffer;
    materialStorage: UniformBufferLike;
    transformsStorage: UniformBufferLike;
}
export declare class Renderer {
    parse: Parse;
    PP: PostProcessing;
    scene: Scene;
    Particles: Particles;
    fps: FPS;
    camera: Camera;
    getState: () => State;
    reflow: boolean;
    needUpdateProjection: boolean;
    needUpdateView: boolean;
    env: Env;
    currentTrack: number;
    constructor(getState: () => State);
    setEnv(env: Env): void;
    setCamera(camera: Camera): void;
    setParticles(Particles: Particles): void;
    setScene(scene: Scene): void;
    setPp(pp: PostProcessing): void;
    setGl(g: WebGL2RenderingContext | WEBGPU): void;
    setParser(parser: Parse): void;
    step(sec: number, v: Track): false | undefined;
    spline(sec: number, v: Track): false | undefined;
    updateGeometry(mesh: Mesh, geometry: Attributes): void;
    interpolation(sec: number, v: Track): false | undefined;
    updateMaterial(mesh: Mesh, type: string, out: {
        elements: Float32Array;
    }): void;
    animate(sec: number): void;
    render(time?: number): void;
    renderScene(): void;
    clean(): void;
}
