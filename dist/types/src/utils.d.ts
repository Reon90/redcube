import { Matrix2, Matrix4 } from './matrix';
import { Accessor, BufferView } from '../GLTF';
export declare const clearColor: number[];
export type GLTexture = WebGLTexture & {
    index: number;
    sampler?: WebGLSampler;
};
export type LoadedTexture = (WebGLTexture | GPUTexture) & {
    index?: number;
    sampler?: WebGLSampler | GPUSampler;
    view?: GPUTextureView;
    name?: string;
    image?: unknown;
    srgb?: boolean;
};
export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
export interface ProjectionCamera {
    aspect: number;
    zoom: number;
    type: string;
    perspective?: {
        yfov: number;
        znear?: number;
        zfar?: number;
    };
    orthographic?: {
        xmag: number;
        ymag: number;
        znear: number;
        zfar: number;
    };
}
export declare function getTextureIndex(): number;
export declare const textureEnum: {
    baseColorTexture: number;
    metallicRoughnessTexture: number;
    normalTexture: number;
    occlusionTexture: number;
    emissiveTexture: number;
    irradianceTexture: number;
    prefilterTexture: number;
    brdfLUTTexture: number;
    clearcoatTexture: number;
    clearcoatRoughnessTexture: number;
    clearcoatNormalTexture: number;
    sheenColorTexture: number;
    sheenRoughnessTexture: number;
    Sheen_E: number;
    transmissionTexture: number;
    specularTexture: number;
    specularColorTexture: number;
    thicknessTexture: number;
    iridescenceThicknessTexture: number;
    charlieTexture: number;
    diffuseTransmissionTexture: number;
    diffuseTransmissionColorTexture: number;
    anisotropyTexture: number;
    iridescenceTexture: number;
};
export declare function isMatrix(type: number): boolean;
export declare function random(min: number, max: number): number;
export declare function lerp(a: number, b: number, f: number): number;
export declare function getMatrixType(type: number): typeof Matrix2 | undefined;
export declare function getDataType(type: string): number | undefined;
export declare function getComponentType(type: number): number | undefined;
export declare function getMethod(type: number): string | undefined;
export declare function range(min: number, max: number, value: number): number;
export declare function interpolation(time: number, frames: {
    time: number;
}[]): number[];
export declare const ArrayBufferMap: Map<any, any>;
export declare function buildArrayWithStride(arrayBuffer: ArrayBufferLike, accessor: Accessor, bufferView: BufferView): TypedArray | undefined;
export declare function buildArray(arrayBuffer: ArrayBufferLike, type: number, offset: number, length: number): TypedArray | undefined;
export declare function compileShader(gl: WebGL2RenderingContext, type: GLenum, shaderSource: string, program: WebGLProgram): void;
export declare function createProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram;
export declare function createTexture(gl: WebGL2RenderingContext, type?: GLenum, index?: number): GLTexture;
export declare function walk<R extends {
    children?: C[];
}, C extends {
    children?: C[];
}>(node: R, callback: (node: R | C) => void): void;
export declare function sceneToArcBall(pos: [number, number]): number[];
export declare function canvasToWorld(vec2: [number, number], projection: Matrix4, width: number, height: number): number[];
export declare function calculateProjection2(cam: ProjectionCamera): Matrix4 | undefined;
export declare function calculateProjection(cam: ProjectionCamera): Matrix4 | undefined;
export declare function calculateOffset(a?: number, b?: number): number;
export declare function calculateUVs(vertex: ArrayLike<number>, normal: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function calculateNormals2(vertex: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function calculateNormals(index: ArrayLike<number>, vertex: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function calculateBinormals(index: ArrayLike<number>, vertex: ArrayLike<number>, normal: ArrayLike<number>, uv: ArrayLike<number>): Float32Array<ArrayBuffer>;
export declare function measureGPU(gl: WebGL2RenderingContext): void;
export declare function getGlEnum(name: number): string;
export declare function normalize(array: Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Float32Array | number[]): Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | number[];
export declare function generateMipmaps(device: GPUDevice, texture: GPUTexture, width: number, height: number, mipLevelCount: number, { isCube }?: {
    isCube?: boolean | undefined;
}): Promise<void>;
export declare function fanToTriListIndices(fan: Uint16Array | Uint32Array): Uint32Array;
export declare function convertLineLoopToLineList(loopIndices: Uint16Array | Uint32Array): Uint16Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>;
export declare function toFloat32Normalized(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array): Float32Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Int8Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;
