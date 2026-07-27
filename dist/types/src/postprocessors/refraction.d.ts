import { GLTexture } from '../utils';
import { PostProcessor } from './base';
import type { PostProcessing as PostProcessingWebGL } from '../postprocessing';
import type { PostProcessing as PostProcessingWebGPU } from '../postprocessing.webgpu';
type Texture = GLTexture;
type GPUTextureSet = {
    texture: GPUTexture;
    sampler: GPUSampler;
    view: GPUTextureView;
};
export declare class Refraction extends PostProcessor {
    gl: WebGL2RenderingContext & {
        device?: GPUDevice;
    };
    texture: Texture | GPUTextureSet;
    setGL(g: WebGL2RenderingContext & {
        device?: GPUDevice;
    }): void;
    preProcessing(PP: PostProcessingWebGL): void;
    preProcessingWebGPU(PP: PostProcessingWebGPU): void;
    buildScreenBuffer(pp: PostProcessingWebGL): {
        name: string;
    };
    buildScreenBufferWebGPU(pp: PostProcessingWebGPU): {
        name: string;
    };
    attachUniform(): void;
    postProcessing(): void;
    postProcessingWebGPU(): void;
}
export {};
