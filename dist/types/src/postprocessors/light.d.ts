import { PostProcessor } from './base';
import { GLTexture } from '../utils';
import type { PostProcessing } from '../postprocessing';
type Texture = GLTexture;
export declare class Light extends PostProcessor {
    texture: Texture;
    program: WebGLProgram;
    scale: number;
    quadVAO: WebGLVertexArrayObject;
    constructor();
    setGL(g: WebGL2RenderingContext): void;
    preProcessing(PP: PostProcessing): void;
    buildScreenBuffer(PP: PostProcessing): {
        name: string;
    };
    attachUniform(program: WebGLProgram): void;
    postProcessing(): void;
}
export {};
