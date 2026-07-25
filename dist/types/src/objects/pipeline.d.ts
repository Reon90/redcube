import type { Define } from '../parse';
interface Glslang {
    compileGLSL(code: string, type: string): Uint32Array;
}
interface WgslConverter {
    convertSpirV2WGSL(spirv: Uint32Array): string;
}
export declare function create(device: GPUDevice, glslang: Glslang, wgsl: WgslConverter, uniformBindGroup1: GPUBindGroupEntry[], defines: Define[], mode: number, frontFace: boolean): GPURenderPipeline[];
export {};
