import { Camera, Light as LightObj } from './objects/index';
import { Renderer } from './renderer';
import { SSAO } from './postprocessors/ssao';
import { Bloom } from './postprocessors/bloom';
import { Shadow } from './postprocessors/shadow';
import { Refraction } from './postprocessors/refraction';
import { Light } from './postprocessors/light';
import { PostProcessor } from './postprocessors/base';
import { Scattering } from './postprocessors/scattering';
declare const processorsMap: {
    bloom: typeof Bloom;
    ssao: typeof SSAO;
    shadow: typeof Shadow;
    light: typeof Light;
    refraction: typeof Refraction;
    scattering: typeof Scattering;
};
type ProcessorName = keyof typeof processorsMap;
type GPUTextureSet = {
    texture: GPUTexture;
    sampler: GPUSampler;
    view: GPUTextureView;
};
interface WebGPUProcessor {
    postProcessingWebGPU(PP: PostProcessing): void;
    preProcessingWebGPU(PP?: PostProcessing): void;
    buildScreenBufferWebGPU(pp: PostProcessing): {
        name: string;
        value?: number;
    };
    attachUniformWebGPU?(): GPUBindGroupEntry;
}
export declare class PostProcessing {
    screenTexture: GPUTextureSet;
    normalTexture: GPUTextureSet;
    irradianceTexture: GPUTextureSet;
    specTexture: GPUTextureSet;
    albedoTexture: GPUTextureSet;
    depthTexture: GPUTextureSet;
    preDepthTexture: GPUTextureSet;
    fakeDepth: GPUTextureSet;
    camera: Camera;
    renderer: Renderer;
    canvas: HTMLCanvasElement;
    framebuffer: WebGLFramebuffer;
    preframebuffer: WebGLFramebuffer;
    postprocessors: Array<PostProcessor & Partial<WebGPUProcessor>>;
    VAO: WebGLBuffer;
    program: [string, string];
    renderframebuffer?: WebGLFramebuffer;
    MSAA: number;
    renderScene: (renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    }) => void;
    pipeline: GPURenderPipeline & {
        pass?: GPURenderPassDescriptor;
    };
    target: GPURenderPassColorAttachment[] | undefined;
    vertexBuffer: GPUBuffer;
    bindGroup: GPUBindGroup;
    hasPostPass: boolean;
    hasPrePass: boolean;
    constructor(processors: ProcessorName[], renderScene: (renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    }) => void);
    add(name: ProcessorName): void;
    addPrepass(name: ProcessorName): void;
    setCamera(camera: Camera): void;
    setLight(light: LightObj): void;
    setGl(g: WEBGPU): void;
    setCanvas(canvas: HTMLCanvasElement): void;
    get width(): number;
    get height(): number;
    bindPrePass(): void;
    bindPostPass(): void;
    preProcessing(): void;
    postProcessing(): void;
    createByteTexture(label: string): {
        texture: GPUTexture;
        sampler: GPUSampler;
        view: GPUTextureView;
    };
    createDefaultTexture(label?: string, scale?: number, hasMipmap?: boolean): {
        texture: GPUTexture;
        sampler: GPUSampler;
        view: GPUTextureView;
    };
    createOneChannelTexture(scale?: number): {
        texture: GPUTexture;
        sampler: GPUSampler;
        view: GPUTextureView;
    };
    createDepthTexture(label: string): {
        texture: GPUTexture;
        sampler: GPUSampler;
        view: GPUTextureView;
    };
    createNoiceTexture(size: number): {
        texture: GPUTexture;
        sampler: GPUSampler;
        view: GPUTextureView;
    };
    buildVertex(WebGPU: WEBGPU, g: Float32Array): GPUBuffer;
    buildPipeline(WebGPU: WEBGPU, vertex: string, fragment: string, vertexId: number, entries: GPUBindGroupLayoutEntry[], screen?: boolean, label?: string): GPURenderPipeline;
    buildScreenBuffer(): true | undefined;
    clear(): void;
}
export {};
