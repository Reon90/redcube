import { Vector3, Matrix4 } from '../matrix';
import { UniformBuffer, UniformBufferLike } from './uniform';
import { TypedArray } from '../utils';
import { DracoModule } from '../decoder';
import { GlTf, MeshPrimitive, Accessor } from '../../GLTF';
import type { Define } from '../parse';
export interface Attributes {
    POSITION?: TypedArray;
    NORMAL?: TypedArray;
    TEXCOORD_0?: TypedArray;
    TEXCOORD_1?: TypedArray;
    TEXCOORD_2?: TypedArray;
    JOINTS_0?: TypedArray;
    WEIGHTS_0?: TypedArray;
    TANGENT?: TypedArray;
    COLOR_0?: TypedArray;
    [key: string]: TypedArray | undefined;
}
interface BoundingSphere {
    min: Vector3;
    max: Vector3;
    _min?: Vector3;
    _max?: Vector3;
    center: Vector3;
    radius: number | null;
}
interface Attr extends Partial<Accessor> {
    componentType: number;
}
export declare class Geometry {
    UBO: WebGLBuffer | null;
    VAO: WebGLBuffer | null;
    uniformBuffer: UniformBuffer | null;
    indicesBuffer?: TypedArray;
    attributes: Attributes;
    targets: Array<Attributes>;
    blend: string | null;
    uniforms: object | null;
    SKIN: WebGLBuffer | null;
    boundingSphere: BoundingSphere;
    vertexAccessor: Map<string, Attr>;
    indexType: number;
    cubeVertexSize?: number;
    VBO?: WebGLBuffer;
    indicesWebGPUBuffer?: GPUBuffer;
    verticesWebGPUBuffer?: GPUBuffer;
    uniformBindGroup1?: GPUBindGroupEntry[];
    g?: Float32Array;
    constructor(json: GlTf, arrayBuffer: ArrayBufferLike[], weights: number[], draco: DracoModule | undefined, primitive: MeshPrimitive);
    compose(order: number): void;
    createGeometryForWebGPU(WebGPU: WEBGPU, order: number): void;
    createGeometryForWebGl(gl: WebGL2RenderingContext, defines: Define[], order: number): void;
    calculateBounding(matrix: Matrix4): void;
    createUniforms(matrixWorld: Matrix4): void;
    updateUniformsWebGPU(WebGPU: WEBGPU, buffer: UniformBufferLike, usage?: number): {
        binding: number;
        resource: GPUBuffer;
    }[];
    updateUniformsWebGl(gl: WebGL2RenderingContext, program: WebGLProgram): void;
    updateWebGPU(WebGPU: WEBGPU, geometry: Attributes): Promise<void>;
    update(gl: WebGL2RenderingContext, geometry: Attributes): void;
}
export {};
