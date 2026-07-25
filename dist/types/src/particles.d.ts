import { GLTexture } from './utils';
import { Camera } from './objects/index';
type Texture = GLTexture;
export declare class Particles {
    currentSourceIdx: number;
    program: WebGLProgram;
    program2: WebGLProgram;
    VAO: Array<WebGLVertexArrayObject>;
    TFO: Array<WebGLTransformFeedback>;
    texture3d: Texture;
    camera: Camera;
    getLight: () => number;
    constructor(getLight: () => number);
    setGl(g: WebGL2RenderingContext): void;
    setCamera(camera: Camera): void;
    build(): void;
    draw(time: number): void;
}
export {};
