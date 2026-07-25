import { Matrix4 } from '../matrix';
import { Material as M } from '../../GLTF';
import { LoadedTexture } from '../utils';
import { Light } from './light';
import type { Define } from '../parse';
interface Uniforms {
    baseColorTexture: WebGLUniformLocation | null;
    metallicRoughnessTexture: WebGLUniformLocation | null;
    normalTexture: WebGLUniformLocation | null;
    occlusionTexture: WebGLUniformLocation | null;
    clearcoatTexture: WebGLUniformLocation | null;
    clearcoatRoughnessTexture: WebGLUniformLocation | null;
    sheenRoughnessTexture: WebGLUniformLocation | null;
    sheenColorTexture: WebGLUniformLocation | null;
    clearcoatNormalTexture: WebGLUniformLocation | null;
    transmissionTexture: WebGLUniformLocation | null;
    specularTexture: WebGLUniformLocation | null;
    specularColorTexture: WebGLUniformLocation | null;
    thicknessTexture: WebGLUniformLocation | null;
    emissiveTexture: WebGLUniformLocation | null;
    prefilterMap: WebGLUniformLocation | null;
    charlieMap: WebGLUniformLocation | null;
    brdfLUT: WebGLUniformLocation | null;
    irradianceMap: WebGLUniformLocation | null;
    depthTexture: WebGLUniformLocation | null;
    colorTexture: WebGLUniformLocation | null;
    Sheen_E: WebGLUniformLocation | null;
    iridescenceThicknessTexture: WebGLUniformLocation | null;
    diffuseTransmissionTexture: WebGLUniformLocation | null;
    diffuseTransmissionColorTexture: WebGLUniformLocation | null;
    anisotropyTexture: WebGLUniformLocation | null;
    iridescenceTexture: WebGLUniformLocation | null;
    isTone: WebGLUniformLocation | null;
    isIBL: WebGLUniformLocation | null;
    isDefaultLight: WebGLUniformLocation | null;
}
export declare class Material extends M {
    normalTexture?: LoadedTexture;
    occlusionTexture?: LoadedTexture;
    emissiveTexture?: LoadedTexture;
    blend: string;
    uniforms: Uniforms;
    alpha: boolean;
    UBO?: WebGLBuffer;
    defines: Array<Define>;
    matrices: Matrix4[];
    uniformBuffer: GPUBuffer;
    lightPosUniform?: WebGLBuffer;
    lightColorUniform?: WebGLBuffer;
    spotdirUniform?: WebGLBuffer;
    lightIntensityUniform?: WebGLBuffer;
    textureMatricesUniform?: WebGLBuffer;
    matricesMap: Map<string, number | undefined>;
    lights: number[];
    uniformBindGroup1: GPUBindGroupEntry[];
    constructor(m: M | undefined, textures: LoadedTexture[], defines: Array<Define>);
    buildTrans(ex: {
        offset?: number[];
        scale?: number[];
        rotation?: number;
    }, defines: Array<Define>, name?: string): number | undefined;
    setHarmonics(sphericalHarmonics?: WebGLBuffer): void;
    updateUniformsWebgl(gl: WebGL2RenderingContext, program: WebGLProgram): void;
    createUniforms(isTexture: boolean, lights: Light[]): void;
    updateUniformsWebGPU(WebGPU: WEBGPU): void;
    hasNormal(): boolean;
    setColor(gl: WebGL2RenderingContext, name: string, value: {
        elements: ArrayLike<number>;
    }): void;
    setTexture(gl: WebGL2RenderingContext, name: string, type: string, value: {
        elements: Float32Array;
    }): void;
    setTextureWebGPU(WebGPU: WEBGPU, name: string, type: string, value: {
        elements: Float32Array;
    }): void;
    setColorWebGPU(WebGPU: WEBGPU, name: string, value: {
        elements: ArrayLike<number>;
    }): void;
}
export {};
