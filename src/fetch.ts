import { GlTf, Image as GLTFImage, BufferView } from '../GLTF';

interface FetchedImage {
    sampler: unknown;
    mimeType?: string;
    name?: string;
    image: unknown;
}

interface ImageSource {
    json: { bufferViews?: BufferView[] };
    arrayBuffer: ArrayBufferLike[];
}

function loadKTX(b: ArrayBuffer) {
    const { ktxTexture, TranscodeTarget, transcoderConfig } = window.LIBKTX;
    const { astcSupported, dxtSupported, pvrtcSupported, etc1Supported, etc2Supported } = transcoderConfig;
    const ktxdata = new Uint8Array(b);
    if (!IsValid(ktxdata)) {
        throw new Error('Texture is not valid ktx 2.0 file');
    }
    const texture = new ktxTexture(ktxdata);
    if (texture.needsTranscoding) {
        let format;
        if (astcSupported) {
            format = TranscodeTarget.ASTC_4x4_RGBA;
        } else if (dxtSupported) {
            format = TranscodeTarget.BC1_OR_3;
        } else if (pvrtcSupported) {
            format = TranscodeTarget.PVRTC1_4_RGBA;
        } else if (etc1Supported || etc2Supported) {
            format = TranscodeTarget.ETC;
        } else {
            format = TranscodeTarget.RGBA4444;
        }
        const result = texture.transcodeBasis(format, 0);
        if (result !== window.LIBKTX.ErrorCode.SUCCESS) {
            throw new Error('Texture transcode failed. See console for details.');
        }
        return texture.glUpload().texture;
    }
}

function IsValid(data: ArrayBufferView): boolean {
    if (data.byteLength >= 12) {
        // '«', 'K', 'T', 'X', ' ', '1', '1', '»', '\r', '\n', '\x1A', '\n'
        const identifier = new Uint8Array(data.buffer, data.byteOffset, 12);
        if (
            identifier[0] === 0xab &&
            identifier[1] === 0x4b &&
            identifier[2] === 0x54 &&
            identifier[3] === 0x58 &&
            identifier[4] === 0x20 &&
            identifier[5] === 0x32 &&
            identifier[6] === 0x30 &&
            identifier[7] === 0xbb &&
            identifier[8] === 0x0d &&
            identifier[9] === 0x0a &&
            identifier[10] === 0x1a &&
            identifier[11] === 0x0a
        ) {
            return true;
        }
    }

    return false;
}

export function fetchJSON(url: string): Promise<GlTf> {
    return fetch(url).then(r => r.json());
}

export function fetchBinary(url: string): Promise<ArrayBuffer> {
    return fetch(url).then(r => r.arrayBuffer());
}

export function fetchImage(
    isbitmap: boolean,
    s: ImageSource,
    { bufferView, mimeType, uri }: GLTFImage,
    { url, name }: { url: string; name?: string },
    sampler: unknown
): Promise<FetchedImage> {
    if (typeof window !== 'undefined') {
        return new Promise<FetchedImage>((resolve, reject) => {
            if (mimeType === 'image/ktx2') {
                window
                    .fetch(url)
                    .then(r => r.arrayBuffer())
                    .then(b => {
                        resolve({
                            sampler,
                            mimeType,
                            name,
                            image: loadKTX(b)
                        });
                    });
            } else {
                const image = new Image();
                image.onload = () => {
                    if (isbitmap) {
                        createImageBitmap(image, { premultiplyAlpha: 'none', colorSpaceConversion: 'none'}).then(bitmap => {
                            resolve({
                                sampler,
                                name,
                                image: bitmap
                            });
                        });
                    } else {
                        resolve({
                            sampler,
                            name,
                            image
                        });
                    }
                };

                image.onerror = () => {
                    reject(new Error('Cant load texture'));
                };
                image.crossOrigin = 'anonymous';
                if (bufferView !== undefined) {
                    const view = s.json.bufferViews![bufferView];
                    const buffer = new Uint8Array(s.arrayBuffer[view.buffer], view.byteOffset, view.byteLength);
                    const blob = new Blob([buffer as BlobPart], { type: mimeType });
                    image.src = URL.createObjectURL(blob);
                } else if (/base64/.test(uri!)) {
                    image.src = uri!;
                } else {
                    image.src = url;
                }
            }
        });
    } else {
        return fetch(url)
            .then(r => r.arrayBuffer())
            .then(b => ({
                sampler,
                mimeType,
                name,
                image: b
            }));
    }
}
