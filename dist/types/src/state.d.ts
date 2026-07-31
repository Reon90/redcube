import type { Mesh, Camera, Scene, Light } from './objects/index';
import type { LoadedTexture } from './utils';
import type { GlTf } from '../GLTF';
import type { UniformBuffer, UniformBufferLike } from './objects/uniform';
import type { GLTexture } from './utils';
import type { PostProcessing as PostProcessingWebGL } from './postprocessing';
import type { PostProcessing as PostProcessingWebGPU } from './postprocessing.webgpu';
import type { Particles } from './particles';
import type { Env as EnvWebGL } from './env';
import type { Env as EnvWebGPU } from './env.webgpu';
import type { Renderer } from './renderer';
export interface Track {
    keys: Array<Key>;
    stoped: boolean;
    type: string;
    component: number;
    meshes: Array<Mesh>;
    name: string;
    interpolation: string;
    duration: number;
}
export interface Key {
    time: number;
    value: Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | number[];
}
export interface Skin {
    jointNames: Array<number>;
    bones: Array<import('./objects/index').Bone>;
    boneInverses: Array<import('./matrix').Matrix4>;
}
export interface Define {
    name: string;
    value?: number;
}
export interface RenderPassState {
    isprepender?: boolean;
    isprerefraction?: boolean;
}
export interface State {
    gl?: WebGL2RenderingContext | WEBGPU;
    width?: number;
    height?: number;
    scene: Scene;
    camera: Camera;
    light?: Light;
    url: string;
    host: string;
    defines: Array<Define>;
    tracks: Array<Track[]>;
    json: GlTf;
    skins: Array<Skin>;
    cameras: Array<Camera>;
    lights: Array<Light>;
    textures: LoadedTexture[] | null;
    images: Map<string, unknown>;
    samplers: Array<WebGLSampler | GPUSampler> | null;
    arrayBuffer: ArrayBufferLike[] | null;
    programs: Record<string, WebGLProgram>;
    env?: EnvWebGL | EnvWebGPU;
    pp?: PostProcessingWebGL | PostProcessingWebGPU;
    particles?: Particles;
    renderer?: Renderer;
    renderState: RenderPassState;
    isIBL: boolean;
    isDefaultLight: boolean;
    cameraBuffer?: UniformBuffer;
    lightPosBuffer?: UniformBuffer;
    lightColorBuffer?: UniformBuffer;
    needUpdateView: boolean;
    needUpdateProjection: boolean;
    preDepthTexture?: GLTexture;
    colorTexture?: GLTexture;
    fakeDepth?: GLTexture;
    UBO?: WebGLBuffer;
    lightPosUniform?: WebGLBuffer;
    lightColorUniform?: WebGLBuffer;
    storage2?: {
        texture: WebGLTexture;
    };
    storage?: {
        texture2: WebGLTexture;
    };
    stateBuffer?: UniformBuffer;
    materialStorage?: UniformBufferLike;
    transformsStorage?: UniformBufferLike;
}
export type ReadonlyState = Readonly<State>;
export declare function commit(target: State, patch: Partial<State>): void;
