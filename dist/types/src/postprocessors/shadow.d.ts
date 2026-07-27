import { PostProcessor } from './base';
import type { PostProcessing } from '../postprocessing';
export declare class Shadow extends PostProcessor {
    gl: WebGL2RenderingContext;
    setGL(g: WebGL2RenderingContext): void;
    preProcessing(PP: PostProcessing): void;
    buildScreenBuffer(): {
        name: string;
    };
    attachUniform(): void;
    postProcessing(): void;
}
