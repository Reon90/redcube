import { LoadedTexture } from './utils';
import { Mesh, Bone, Camera, Object3D, Scene, Light } from './objects/index';
import { Matrix4 } from './matrix';
import { GlTf, Node, MeshPrimitive } from '../GLTF';
import { DracoModule } from './decoder';
declare global {
    interface Constructable<T> {
        new (...args: unknown[]): T;
    }
    interface KtxTexture {
        needsTranscoding: boolean;
        transcodeBasis(target: number, flags: number): number;
        glUpload(): {
            texture: WebGLTexture;
        };
    }
    interface TranscodeTarget {
        ETC1_RGB: number;
        BC1_RGB: number;
        BC4_R: number;
        BC5_RG: number;
        BC3_RGBA: number;
        BC1_OR_3: number;
        PVRTC1_4_RGB: number;
        PVRTC1_4_RGBA: number;
        BC7_M6_RGB: number;
        BC7_M5_RGBA: number;
        ETC2_RGBA: number;
        ASTC_4x4_RGBA: number;
        RGBA32: number;
        RGB565: number;
        BGR565: number;
        RGBA4444: number;
        PVRTC2_4_RGB: number;
        PVRTC2_4_RGBA: number;
        ETC: number;
        EAC_R11: number;
        EAC_RG11: number;
    }
    interface Window {
        LIBKTX: {
            ktxTexture: Constructable<KtxTexture>;
            TranscodeTarget: TranscodeTarget;
            transcoderConfig: {
                astcSupported: unknown;
                dxtSupported: unknown;
                pvrtcSupported: unknown;
                etc1Supported: unknown;
                etc2Supported: unknown;
                bptcSupported?: unknown;
            };
            GL: {
                makeContextCurrent: Function;
                registerContext: Function;
            };
            ErrorCode: {
                SUCCESS: number;
            };
        };
    }
}
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
interface Key {
    time: number;
    value: Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | number[];
}
export interface Skin {
    jointNames: Array<number>;
    bones: Array<Bone>;
    boneInverses: Array<Matrix4>;
}
export interface Define {
    name: string;
    value?: number;
}
export declare class Parse {
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
    aspect?: number;
    zoom?: number;
    canvas: HTMLCanvasElement;
    resize: () => void;
    json: GlTf;
    defines: Array<Define>;
    draco?: DracoModule;
    constructor(url: string, defines: Array<Define>, resize: () => void);
    setScene(scene: Scene): void;
    setGl(g: WebGL2RenderingContext | WEBGPU): void;
    setCamera(camera: Camera): void;
    setLight(light: Light): void;
    setCanvas(canvas: HTMLCanvasElement): void;
    getBuffer(): Promise<void>;
    createProgram(defines: Define[]): WebGLProgram;
    buildPrim(el: Node, parent: Object3D, name: string, skin: number | undefined, weights: number[] | undefined, primitive: MeshPrimitive): Mesh;
    buildNode(parent: Object3D | Scene, name: number): void;
    calculateFov(isInitial: boolean): void;
    buildMesh(): Promise<void>;
    buildAnimation(): true | undefined;
    buildSkin(): true | undefined;
    getJson(): Promise<void> | Promise<boolean>;
    createSamplers(): void;
    createSamplersWebGPU(WebGPU: WEBGPU): void;
    createTexturesWebGPU(WebGPU: WEBGPU): void;
    createTexturesWebGL(): void;
    createTextures(callback: (t: LoadedTexture, textureType: string) => unknown): void;
    initTextures(isbitmap: boolean): Promise<boolean>;
    handleTextureLoadedWebGPU(WebGPU: WEBGPU, { image: bitmap, sampler, srgb, name }: {
        image: ImageBitmap;
        sampler?: number;
        srgb?: boolean;
        name: string;
    }, textureType: string): unknown;
    handleTextureLoaded({ image, name, mimeType, sampler, srgb, }: {
        image: HTMLImageElement & {
            sampler?: WebGLSampler;
        };
        name: string;
        mimeType?: string;
        sampler?: number;
        srgb?: boolean;
    }): unknown;
    getEnv(isBuffer: boolean): Promise<any>;
}
export {};
