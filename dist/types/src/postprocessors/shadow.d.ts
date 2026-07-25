import { PostProcessor } from './base';
import type { PostProcessing } from '../postprocessing';
export declare class Shadow extends PostProcessor {
    setGL(g: WebGL2RenderingContext): void;
    preProcessing(PP: PostProcessing): void;
    buildScreenBuffer(): {
        name: string;
    };
    attachUniform(): void;
    postProcessing(): void;
}
