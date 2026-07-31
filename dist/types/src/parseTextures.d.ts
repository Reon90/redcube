import { LoadedTexture } from './utils';
import type { State, ReadonlyState, Define } from './state';
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
export declare function createShaderProgram(input: ReadonlyState, defines: Define[]): WebGLProgram;
export declare function createSamplers(input: ReadonlyState, output: Partial<State>): void;
export declare function createSamplersWebGPU(input: ReadonlyState, output: Partial<State>, WebGPU: WEBGPU): void;
export declare function createTexturesWebGPU(input: ReadonlyState, WebGPU: WEBGPU): void;
export declare function createTexturesWebGL(input: ReadonlyState): void;
export declare function createTextures(input: ReadonlyState, callback: (t: LoadedTexture, textureType: string) => unknown): void;
export declare function initTextures(input: ReadonlyState, output: Partial<State>, isbitmap: boolean): Promise<boolean>;
export declare function handleTextureLoadedWebGPU(input: ReadonlyState, WebGPU: WEBGPU, { image: bitmap, sampler, srgb, name }: {
    image: ImageBitmap;
    sampler?: number;
    srgb?: boolean;
    name: string;
}, textureType: string): unknown;
export declare function handleTextureLoaded(input: ReadonlyState, { image, name, mimeType, sampler, srgb, }: {
    image: HTMLImageElement & {
        sampler?: WebGLSampler;
    };
    name: string;
    mimeType?: string;
    sampler?: number;
    srgb?: boolean;
}): unknown;
