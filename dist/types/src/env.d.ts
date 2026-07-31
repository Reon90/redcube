import { GLTexture } from './utils';
import { Matrix4 } from './matrix';
import type { State } from './state';
import { UniformBuffer } from './objects/uniform';
type Texture = GLTexture;
type FrameBuffer = WebGLFramebuffer & {
    size: number;
};
interface IBLData {
    rotation: number[];
    irradianceCoefficients: number[][];
    intensity: number;
    specularImageSize: number;
    specularImages: Array<Array<HTMLImageElement>>;
}
export declare class Env {
    getState: () => State;
    envMatrix: Matrix4;
    VAO: WebGLVertexArrayObject;
    quadVAO: WebGLVertexArrayObject;
    IndexBufferLength?: number;
    cubeprogram: WebGLProgram;
    irradianceprogram: WebGLProgram;
    mipmapcubeprogram: WebGLProgram;
    bdrfprogram: WebGLProgram;
    level?: WebGLUniformLocation;
    diffuse?: WebGLUniformLocation;
    MVPMatrix?: WebGLUniformLocation;
    framebuffer: FrameBuffer;
    irradiancebuffer: FrameBuffer;
    prefilterbuffer: FrameBuffer;
    views: Array<Matrix4>;
    views2: Array<Matrix4>;
    prefilterrender?: WebGLRenderbuffer;
    brdfbuffer: FrameBuffer;
    url: string;
    sampler: WebGLSampler;
    samplerCube: WebGLSampler;
    envData: IBLData;
    uniformBuffer?: UniformBuffer;
    originalCubeTexture: Texture;
    brdfLUTTexture: Texture;
    original2DTexture: Texture;
    irradiancemap: Texture;
    prefilterMap: Texture;
    charlieMap: Texture;
    Sheen_E: Texture;
    constructor(getState: () => State, url: string);
    get width(): number;
    get height(): number;
    drawQuad(): void;
    draw(): void;
    createEnvironment(): void;
    updateUniform(gl: WebGL2RenderingContext, program: WebGLProgram): WebGLBuffer | undefined;
    createEnvironmentBuffer(envData: IBLData): Promise<void>;
}
export {};
