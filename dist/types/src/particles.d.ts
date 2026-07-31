import { GLTexture } from './utils';
import type { State } from './state';
type Texture = GLTexture;
export declare class Particles {
    getState: () => State;
    currentSourceIdx: number;
    program: WebGLProgram;
    program2: WebGLProgram;
    VAO: Array<WebGLVertexArrayObject>;
    TFO: Array<WebGLTransformFeedback>;
    texture3d: Texture;
    getLight: () => number;
    constructor(getState: () => State, getLight: () => number);
    private get gl();
    build(): void;
    draw(time: number): void;
}
export {};
