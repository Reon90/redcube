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
export declare class Scattering extends PostProcessor {
    gl: WebGL2RenderingContext & {
        device?: GPUDevice;
    };
    output: Texture | GPUTextureSet;
    program: WebGLProgram;
    pipeline: GPURenderPipeline;
    bindGroup: GPUBindGroup;
    setGL(g: WebGL2RenderingContext & {
        device?: GPUDevice;
    }): void;
    attachUniform(program: WebGLProgram): void;
    attachUniformWebGPU(): {
        binding: number;
        resource: GPUTextureView;
    };
    postProcessing(PP: PostProcessingWebGL): void;
    postProcessingWebGPU(PP: PostProcessingWebGPU): void;
    buildScreenBuffer(pp: PostProcessingWebGL): {
        name: string;
    };
    buildScreenBufferWebGPU(pp: PostProcessingWebGPU): {
        name: string;
    };
    preProcessing(): void;
    preProcessingWebGPU(): void;
}
export {};
