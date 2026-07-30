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
export declare class ParseContext {
    gl: WebGL2RenderingContext | WEBGPU;
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
    scene: Scene;
    camera: Camera;
    light: Light;
    canvas: HTMLCanvasElement;
    resize: () => void;
    json: GlTf;
    defines: Array<Define>;
    draco?: DracoModule;
    constructor(url: string, defines: Array<Define>, resize: () => void);
}
export type ReadonlyParseContext = Readonly<ParseContext>;
export declare function commit(target: ParseContext, patch: Partial<ParseContext>): void;
