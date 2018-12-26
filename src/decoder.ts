import draco3d from 'draco3d';

export const decoderModule = draco3d.createDecoderModule({});

export function decodeDracoData(rawBuffer, decoder, offset, length) {
    const buffer = new decoderModule.DecoderBuffer();
    buffer.Init(new Int8Array(rawBuffer, offset, length), rawBuffer.byteLength);

    const dracoGeometry = new decoderModule.Mesh();
    decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    decoderModule.destroy(buffer);

    return dracoGeometry;
}

export function getArray(type, length, decodedGeometry?, attribute?, decoder?) {
    let arr;
    let dracoArr;
    switch (type) {
        case 'BYTE':
            arr = new Int8Array(length);
            arr.type = 'BYTE';
            dracoArr = new decoderModule.DracoInt8Array();
            if (decodedGeometry) {
                decoder.GetAttributeInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_BYTE':
            arr = new Uint8Array(length);
            arr.type = 'UNSIGNED_BYTE';
            dracoArr = new decoderModule.DracoUInt8Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'SHORT':
            arr = new Int16Array(length);
            arr.type = 'SHORT';
            dracoArr = new decoderModule.DracoInt16Array();
            if (decodedGeometry) {
                decoder.GetAttributeInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_SHORT':
            arr = new Uint16Array(length);
            arr.type = 'UNSIGNED_SHORT';
            dracoArr = new decoderModule.DracoUInt16Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_INT':
            arr = new Uint32Array(length);
            arr.type = 'UNSIGNED_INT';
            dracoArr = new decoderModule.DracoUInt32Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt32ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'FLOAT':
            arr = new Float32Array(length);
            arr.type = 'FLOAT';
            dracoArr = new decoderModule.DracoFloat32Array();
            if (decodedGeometry) {
                decoder.GetAttributeFloatForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
    }

    return [dracoArr, arr];
}
