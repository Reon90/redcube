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

// The single mutable state RedCube owns for one instance. Every other class
// (Env, PostProcessing, Particles, Renderer, and the parseLoader/
// parseSceneBuilder/parseTextures functions) receives only a getState()
// closure over this object instead of holding direct references to RedCube's
// collaborators - there's exactly one canonical copy of any value, so e.g.
// switching the active camera is a single assignment, not a fan-out to every
// class that used to cache its own copy.
export interface State {
    // core - gl isn't available until glInit() runs, after construction;
    // width/height/light are never set in the headless Node entry point.
    // width/height are the canvas's un-scaled CSS size (offsetWidth/
    // offsetHeight) - every reader only ever needed those two numbers, not
    // the canvas element itself, so RedCube caches them here (refreshed in
    // resize()) instead of handing out the whole HTMLCanvasElement.
    gl?: WebGL2RenderingContext | WEBGPU;
    width?: number;
    height?: number;
    scene: Scene;
    camera: Camera;
    light?: Light;
    url: string;
    host: string;
    defines: Array<Define>;

    // glTF parse output - json isn't populated until the async fetch resolves,
    // but is required (not optional) since parseSceneBuilder/parseTextures
    // read it unconditionally, always after that fetch has completed
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

    // collaborator instances, needed for the methods they expose
    env?: EnvWebGL | EnvWebGPU;
    pp?: PostProcessingWebGL | PostProcessingWebGPU;
    particles?: Particles;
    renderer?: Renderer;

    // render-loop, shared - the three buffers are only built once mesh/light
    // data is known, partway through init()
    renderState: RenderPassState;
    isIBL: boolean;
    isDefaultLight: boolean;
    cameraBuffer?: UniformBuffer;
    lightPosBuffer?: UniformBuffer;
    lightColorBuffer?: UniformBuffer;
    needUpdateView: boolean;
    needUpdateProjection: boolean;

    // WebGL-only
    preDepthTexture?: GLTexture;
    colorTexture?: GLTexture;
    fakeDepth?: GLTexture;
    UBO?: WebGLBuffer;
    lightPosUniform?: WebGLBuffer;
    lightColorUniform?: WebGLBuffer;
    storage2?: { texture: WebGLTexture };
    storage?: { texture2: WebGLTexture };

    // WebGPU-only
    stateBuffer?: UniformBuffer;
    materialStorage?: UniformBufferLike;
    transformsStorage?: UniformBufferLike;
}

// Read-only view for functions that only inspect state - keeps a function's
// signature honest about whether it can mutate State or not. Only blocks
// reassigning a field (`input.json = x`); array/Map contents reached through
// it (`input.tracks.push(x)`) are still mutable, since they're the same
// underlying objects State owns - callers that need to add to a collection
// still go through the mutable `output` param by convention, even though JS
// can't enforce that distinction for reference types.
export type ReadonlyState = Readonly<State>;

// Functions that reassign fields write into a fresh, empty patch object
// instead of the live State - `commit` then applies it in one place. This
// keeps "what did this function decide to change" visible as a value, rather
// than a mutation buried in the middle of the function body.
export function commit(target: State, patch: Partial<State>) {
    Object.assign(target, patch);
}
