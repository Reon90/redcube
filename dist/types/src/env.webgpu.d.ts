import { Matrix4 } from './matrix';
import { Camera } from './objects/index';
import { UniformBuffer } from './objects/uniform';
type EnvTexture = GPUTexture & {
    view?: GPUTextureView;
    sampler?: GPUSampler;
};
interface IBLData {
    rotation: number[];
    irradianceCoefficients: number[][];
    intensity: number;
    specularImages: Array<Array<{
        bitmap: ImageBitmap;
    }>>;
    specularImageSize: number;
}
export declare class Env {
    camera: Camera;
    envMatrix: Matrix4;
    views: Array<Matrix4>;
    canvas: HTMLCanvasElement;
    url: string;
    envData: IBLData;
    uniformBuffer?: UniformBuffer;
    originalCubeTexture: EnvTexture;
    Sheen_E: EnvTexture;
    prefilterTexture: EnvTexture;
    charlieTexture: EnvTexture;
    irradianceTexture: EnvTexture;
    bdrfTexture: EnvTexture;
    cubeTexture: EnvTexture;
    pipeline?: GPURenderPipeline;
    pipeline2?: GPURenderPipeline;
    pipeline3?: GPURenderPipeline;
    constructor(url: string);
    setCamera(camera: Camera): void;
    setCanvas(canvas: HTMLCanvasElement): void;
    get width(): number;
    get height(): number;
    drawQuad(WebGPU: WEBGPU, _x: unknown): void;
    drawCube(WebGPU: WEBGPU, shadowPass: GPURenderPassEncoder): void;
    createEnvironmentBuffer(envData: IBLData, WebGPU: WEBGPU): Promise<void>;
    createTexture(WebGPU: WEBGPU): Promise<void>;
    buildPass(WebGPU: WEBGPU, size: number): [GPURenderPassDescriptor, GPUTexture];
    buildPipeline(WebGPU: WEBGPU, vertex: string, fragment: string, vertexId: number, entries: GPUBindGroupLayoutEntry[], targets: GPUColorTargetState[]): GPURenderPipeline;
    buildVertex(WebGPU: WEBGPU, g: Float32Array): GPUBuffer;
    drawBRDF(WebGPU: WEBGPU): void;
    drawWebGPU(WebGPU: WEBGPU, mipWidth: number, mipHeight: number, layer: number, mip: number): void;
    drawWebGPU2(WebGPU: WEBGPU, mipWidth: number, mipHeight: number, layer: number, mip: number): void;
    drawWebGPU3(WebGPU: WEBGPU, mipWidth: number, mipHeight: number, layer: number, mip: number): void;
    drawMips(WebGPU: WEBGPU): void;
    drawIrradiance(WebGPU: WEBGPU): void;
    drawPrefilter(WebGPU: WEBGPU): void;
}
export {};
