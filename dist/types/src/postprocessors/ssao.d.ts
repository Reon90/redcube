import { PostProcessor } from './base';
import { GLTexture } from '../utils';
import type { PostProcessing } from '../postprocessing';
type Texture = GLTexture;
export declare class SSAO extends PostProcessor {
    ssaoBlurTexture: Texture;
    ssaoTexture: Texture;
    noice: Texture;
    kernels: Float32Array;
    ssaoProgram: WebGLProgram;
    ssaoBlurProgram: WebGLProgram;
    scale: number;
    constructor();
    setGL(g: WebGL2RenderingContext): void;
    attachUniform(program: WebGLProgram): void;
    postProcessing(PP: PostProcessing): void;
    buildScreenBuffer(pp: PostProcessing): {
        name: string;
    };
    buildNoice(pp: PostProcessing): void;
    buildKernels(): void;
    preProcessing(): void;
}
export {};
