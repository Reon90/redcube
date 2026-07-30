import { Mesh, Camera, Scene, Light } from './objects/index';
import { LoadedTexture } from './utils';
import { GlTf } from '../GLTF';
import { DracoModule } from './decoder';

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

// The mutable state that glTF loading/building/texture-creation is threaded
// through. Parse owns one of these and passes it explicitly to the functions
// in parseLoader.ts / parseSceneBuilder.ts / parseTextures.ts, rather than
// those modules depending on the Parse class itself.
export class ParseContext {
    gl!: WebGL2RenderingContext | WEBGPU;
    tracks: Array<Track[]>;
    url: string;
    host: string;
    skins: Array<Skin>;
    textures: LoadedTexture[] | null;
    images: Map<string, unknown>;
    samplers: Array<WebGLSampler | GPUSampler> | null;
    arrayBuffer: ArrayBufferLike[] | null;
    cameras: Array<Camera>;
    lights: Array<Light>;
    programs: Record<string, WebGLProgram>;
    scene!: Scene;
    camera!: Camera;
    light!: Light;
    canvas!: HTMLCanvasElement;
    resize: () => void;
    json!: GlTf;
    defines: Array<Define>;
    draco?: DracoModule;

    constructor(url: string, defines: Array<Define>, resize: () => void) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.tracks = [];
        this.skins = [];
        this.textures = null;
        this.images = new Map();
        this.samplers = null;
        this.arrayBuffer = null;
        this.cameras = [];
        this.lights = [];
        this.programs = {};
        this.defines = defines;
        this.resize = resize;
    }
}

// Read-only view for functions that only inspect state - keeps a function's
// signature honest about whether it can mutate ParseContext or not. Only
// blocks reassigning a field (`input.json = x`); array contents reached
// through it (`input.tracks.push(x)`) are still mutable, since they're the
// same underlying arrays ParseContext owns - callers that need to add to a
// collection still go through the mutable `output` param by convention, even
// though JS can't enforce that distinction for reference types.
export type ReadonlyParseContext = Readonly<ParseContext>;

// Functions that reassign fields write into a fresh, empty patch object
// instead of the live ParseContext - `commit` then applies it in one place.
// This keeps "what did this function decide to change" visible as a value,
// rather than a mutation buried in the middle of the function body.
export function commit(target: ParseContext, patch: Partial<ParseContext>) {
    Object.assign(target, patch);
}
