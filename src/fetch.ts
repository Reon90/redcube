import * as fs from 'fs';
import { GlTf } from '../GLTF';

function loadKTX(b) {
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

export function fetchJSON(url): Promise<GlTf> {
    if (typeof window !== 'undefined') {
        return window.fetch(url).then(r => r.json());
    } else {
        return new Promise(resolve => {
            fs.readFile(url, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
}

export function fetchBinary(url): Promise<ArrayBuffer> {
    if (typeof window !== 'undefined') {
        return window.fetch(url).then(r => r.arrayBuffer());
    } else {
        return new Promise(resolve => {
            fs.readFile(url, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    resolve(new Uint8Array(data).buffer);
                }
            });
        });
    }
}

export function fetchImage(isbitmap, s, { bufferView, mimeType, uri }, { url, name }, sampler): Promise<any> {
    if (typeof window !== 'undefined') {
        return new Promise((resolve, reject) => {
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
                        createImageBitmap(image).then(bitmap => {
                            resolve({
                                sampler,
                                name,
                                bitmap
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
                    const view = s.json.bufferViews[bufferView];
                    const buffer = new Uint8Array(s.arrayBuffer[view.buffer], view.byteOffset, view.byteLength);
                    const blob = new Blob([buffer], { type: mimeType });
                    image.src = URL.createObjectURL(blob);
                } else if (/base64/.test(uri)) {
                    image.src = uri;
                } else {
                    image.src = url;
                }
            }
        });
    } else {
        return new Promise(resolve => {
            fs.readFile(url, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    resolve({
                        sampler,
                        url,
                        name,
                        image: new Uint8Array(data).buffer
                    });
                }
            });
        });
    }
}
