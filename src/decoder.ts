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
interface DracoAttribute {}
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

export type TaggedTypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array) & { type?: string };

export let decoderModule: DracoModule;
export const DecoderModule = () =>
    new Promise<DracoModule>(async resolve => {
        const dracoDecoderType = {
            onModuleLoaded(module: DracoModule) {
                decoderModule = module;
                resolve(decoderModule);
            }
        };
        const m = await import(/*webpackChunkName: "draco3d"*/ 'draco3d');
        m.createDecoderModule(dracoDecoderType);
    });

export function decodeDracoData(rawBuffer: ArrayBufferLike, decoder: DracoDecoder, offset: number, length: number) {
    const buffer = new decoderModule.DecoderBuffer();
    buffer.Init(new Int8Array(rawBuffer, offset, length), rawBuffer.byteLength);

    const dracoGeometry = new decoderModule.Mesh();
    decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    decoderModule.destroy(buffer);

    return dracoGeometry;
}

export function getArray(
    type: string,
    length: number,
    decodedGeometry?: DracoMesh,
    attribute?: DracoAttribute,
    decoder?: DracoDecoder,
): [DracoPointArray | undefined, TaggedTypedArray | undefined] {
    let arr: TaggedTypedArray | undefined;
    let dracoArr: DracoPointArray | undefined;
    switch (type) {
    case 'BYTE':
        arr = new Int8Array(length) as TaggedTypedArray;
        arr.type = 'BYTE';
        dracoArr = new decoderModule.DracoInt8Array();
        if (decodedGeometry) {
            decoder!.GetAttributeInt8ForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    case 'UNSIGNED_BYTE':
        arr = new Uint8Array(length) as TaggedTypedArray;
        arr.type = 'UNSIGNED_BYTE';
        dracoArr = new decoderModule.DracoUInt8Array();
        if (decodedGeometry) {
            decoder!.GetAttributeUInt8ForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    case 'SHORT':
        arr = new Int16Array(length) as TaggedTypedArray;
        arr.type = 'SHORT';
        dracoArr = new decoderModule.DracoInt16Array();
        if (decodedGeometry) {
            decoder!.GetAttributeInt16ForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    case 'UNSIGNED_SHORT':
        arr = new Uint16Array(length) as TaggedTypedArray;
        arr.type = 'UNSIGNED_SHORT';
        dracoArr = new decoderModule.DracoUInt16Array();
        if (decodedGeometry) {
            decoder!.GetAttributeUInt16ForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    case 'UNSIGNED_INT':
        arr = new Uint32Array(length) as TaggedTypedArray;
        arr.type = 'UNSIGNED_INT';
        dracoArr = new decoderModule.DracoUInt32Array();
        if (decodedGeometry) {
            decoder!.GetAttributeUInt32ForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    case 'FLOAT':
        arr = new Float32Array(length) as TaggedTypedArray;
        arr.type = 'FLOAT';
        dracoArr = new decoderModule.DracoFloat32Array();
        if (decodedGeometry) {
            decoder!.GetAttributeFloatForAllPoints(decodedGeometry, attribute!, dracoArr);
        }
        break;
    }

    return [dracoArr, arr];
}
