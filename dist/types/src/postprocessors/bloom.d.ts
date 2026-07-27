import { PostProcessor } from './base';
import { GLTexture } from '../utils';
import type { PostProcessing } from '../postprocessing';
type Texture = GLTexture;
export declare class Bloom extends PostProcessor {
    gl: WebGL2RenderingContext;
    tempBlurTexture: Texture;
    blurTexture: Texture;
    blurTexture2?: Texture;
    blurTexture3?: Texture;
    blurTexture4?: Texture;
    program: WebGLProgram;
    bloorProgram: WebGLProgram;
    hdrTexture: Texture;
    setGL(g: WebGL2RenderingContext): void;
    attachUniform(program: WebGLProgram): void;
    postProcessing(PP: PostProcessing): void;
    buildScreenBuffer(pp: PostProcessing): {
        name: string;
    };
    renderBlur(inTexture: Texture, program: WebGLProgram): void;
    preProcessing(): void;
}
export {};
