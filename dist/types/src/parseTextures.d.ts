import { LoadedTexture } from './utils';
import type { ParseContext, ReadonlyParseContext, Define } from './parseContext';
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
export declare function createShaderProgram(input: ReadonlyParseContext, defines: Define[]): WebGLProgram;
export declare function createSamplers(input: ReadonlyParseContext, output: Partial<ParseContext>): void;
export declare function createSamplersWebGPU(input: ReadonlyParseContext, output: Partial<ParseContext>, WebGPU: WEBGPU): void;
export declare function createTexturesWebGPU(input: ReadonlyParseContext, WebGPU: WEBGPU): void;
export declare function createTexturesWebGL(input: ReadonlyParseContext): void;
export declare function createTextures(input: ReadonlyParseContext, callback: (t: LoadedTexture, textureType: string) => unknown): void;
export declare function initTextures(input: ReadonlyParseContext, output: Partial<ParseContext>, isbitmap: boolean): Promise<boolean>;
export declare function handleTextureLoadedWebGPU(input: ReadonlyParseContext, WebGPU: WEBGPU, { image: bitmap, sampler, srgb, name }: {
    image: ImageBitmap;
    sampler?: number;
    srgb?: boolean;
    name: string;
}, textureType: string): unknown;
export declare function handleTextureLoaded(input: ReadonlyParseContext, { image, name, mimeType, sampler, srgb, }: {
    image: HTMLImageElement & {
        sampler?: WebGLSampler;
    };
    name: string;
    mimeType?: string;
    sampler?: number;
    srgb?: boolean;
}): unknown;
