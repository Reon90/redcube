export interface DracoPointArray {
    GetValue(index: number): number;
}
interface DracoBuffer {
    Init(data: Int8Array, length: number): void;
}
interface DracoMesh {
    num_faces(): number;
    num_points(): number;
}
interface DracoAttribute {
}
export interface DracoDecoder {
    DecodeBufferToMesh(buffer: DracoBuffer, mesh: DracoMesh): void;
    GetAttributeByUniqueId(mesh: DracoMesh, uniqueId: number): DracoAttribute;
    GetAttributeInt8ForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetAttributeUInt8ForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetAttributeInt16ForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetAttributeUInt16ForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetAttributeUInt32ForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetAttributeFloatForAllPoints(mesh: DracoMesh, attr: DracoAttribute, out: DracoPointArray): void;
    GetFaceFromMesh(mesh: DracoMesh, index: number, out: DracoPointArray): void;
}
export interface DracoModule {
    DecoderBuffer: new () => DracoBuffer;
    Mesh: new () => DracoMesh;
    Decoder: new () => DracoDecoder;
    DracoInt8Array: new () => DracoPointArray;
    DracoUInt8Array: new () => DracoPointArray;
    DracoInt16Array: new () => DracoPointArray;
    DracoUInt16Array: new () => DracoPointArray;
    DracoUInt32Array: new () => DracoPointArray;
    DracoFloat32Array: new () => DracoPointArray;
    destroy(obj: unknown): void;
}
export type TaggedTypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array) & {
    type?: string;
};
export declare let decoderModule: DracoModule;
export declare const DecoderModule: () => Promise<DracoModule>;
export declare function decodeDracoData(rawBuffer: ArrayBufferLike, decoder: DracoDecoder, offset: number, length: number): DracoMesh;
export declare function getArray(type: string, length: number, decodedGeometry?: DracoMesh, attribute?: DracoAttribute, decoder?: DracoDecoder): [DracoPointArray | undefined, TaggedTypedArray | undefined];
export {};
