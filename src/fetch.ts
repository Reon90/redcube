import { GlTf, Image as GLTFImage, BufferView } from '../GLTF';

export interface FetchedImage {
    sampler: unknown;
    mimeType?: string;
    name?: string;
    image: unknown;
}

export interface ImageSource {
    json: { bufferViews?: BufferView[] };
    arrayBuffer: ArrayBufferLike[] | null;
    gl?: WebGL2RenderingContext | WEBGPU;
}

// Embind enums come back as wrapped objects, not plain numbers -
// transcodeImage()/getImageTranscodedSizeInBytes() need `.value` extracted
// explicitly.
export interface ResolvedKTX2Format {
    transcoderFormat: { value: number };
    compressed: boolean;
    webglInternalFormat?: number;
    webglInternalFormatSrgb?: number;
    webgpuFormat?: GPUTextureFormat;
    webgpuFormatSrgb?: GPUTextureFormat;
}

export interface TranscodedKTX2 {
    data: Uint8Array;
    width: number;
    height: number;
    format: ResolvedKTX2Format;
}

interface KTX2FileInstance {
    isValid(): boolean;
    getWidth(): number;
    getHeight(): number;
    getHasAlpha(): boolean;
    startTranscoding(): boolean;
    getImageTranscodedSizeInBytes(level: number, layer: number, face: number, format: number): number;
    transcodeImage(
        dst: Uint8Array,
        level: number,
        layer: number,
        face: number,
        format: number,
        getAlphaForOpaqueFormats: number,
        channel0: number,
        channel1: number,
    ): boolean;
    close(): void;
    delete(): void;
}

export interface BasisTranscoderFormat {
    [name: string]: { value: number };
}

export interface BasisModule {
    KTX2File: new (data: Uint8Array) => KTX2FileInstance;
    transcoder_texture_format: BasisTranscoderFormat;
    initializeBasis(): void;
}

interface BasisFactoryGlobal {
    BASIS(config: { locateFile: (path: string) => string }): Promise<BasisModule>;
}

// The vendored basis_transcoder.js is an Emscripten/embind build with no CPU
// pixel-access dependency on WebGL at all (unlike libktx.js's glUpload()-only
// API) - transcodeImage() hands back raw transcoded bytes directly, so the
// same code path serves both WebGL and WebGPU. It assigns `window.BASIS`
// explicitly (patched to match libktx.js's `window.LIBKTX = ...` pattern) -
// its own top-level `var BASIS`/UMD `module.exports` never fire under
// esbuild, which treats the file as ESM (no CommonJS interop) and would
// otherwise leave the factory unreachable from the dynamic import() result.
let basisModulePromise: Promise<BasisModule> | undefined;
export function loadBasisModule(): Promise<BasisModule> {
    if (!basisModulePromise) {
        basisModulePromise = import(/*webpackChunkName: "basis"*/ '../basis_transcoder').then(async () => {
            const module = await (globalThis as unknown as BasisFactoryGlobal).BASIS({ locateFile: (path) => path });
            module.initializeBasis();
            return module;
        });
    }
    return basisModulePromise;
}

export function transcodeKTX2(module: BasisModule, buffer: ArrayBuffer, format: ResolvedKTX2Format): TranscodedKTX2 {
    const ktx2File = new module.KTX2File(new Uint8Array(buffer));
    if (!ktx2File.isValid()) {
        ktx2File.close();
        ktx2File.delete();
        throw new Error('Texture is not a valid KTX2 file');
    }
    const width = ktx2File.getWidth();
    const height = ktx2File.getHeight();
    if (!ktx2File.startTranscoding()) {
        ktx2File.close();
        ktx2File.delete();
        throw new Error('KTX2 transcoding failed to start');
    }
    const targetFormat = format.transcoderFormat.value;
    const sizeBytes = ktx2File.getImageTranscodedSizeInBytes(0, 0, 0, targetFormat);
    const data = new Uint8Array(sizeBytes);
    const ok = ktx2File.transcodeImage(data, 0, 0, 0, targetFormat, 0, -1, -1);
    ktx2File.close();
    ktx2File.delete();
    if (!ok) {
        throw new Error('KTX2 image transcode failed');
    }
    return { data, width, height, format };
}

export function fetchJSON(url: string): Promise<GlTf> {
    return fetch(url).then((r) => r.json());
}

export function fetchBinary(url: string): Promise<ArrayBuffer> {
    return fetch(url).then((r) => r.arrayBuffer());
}

export function fetchImage(
    isbitmap: boolean,
    s: ImageSource,
    { bufferView, mimeType, uri }: GLTFImage,
    { url, name }: { url: string; name?: string },
    sampler: unknown,
    ktx2Format?: ResolvedKTX2Format,
): Promise<FetchedImage> {
    if (typeof window !== 'undefined') {
        return new Promise<FetchedImage>((resolve, reject) => {
            if (mimeType === 'image/ktx2') {
                Promise.all([loadBasisModule(), window.fetch(url).then((r) => r.arrayBuffer())])
                    .then(([module, buffer]) => {
                        resolve({
                            sampler,
                            mimeType,
                            name,
                            image: transcodeKTX2(module, buffer, ktx2Format!),
                        });
                    })
                    .catch(reject);
            } else {
                const image = new Image();
                image.onload = () => {
                    if (isbitmap) {
                        createImageBitmap(image, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }).then((bitmap) => {
                            resolve({
                                sampler,
                                name,
                                image: bitmap,
                            });
                        });
                    } else {
                        resolve({
                            sampler,
                            name,
                            image,
                        });
                    }
                };

                image.onerror = () => {
                    reject(new Error('Cant load texture'));
                };
                image.crossOrigin = 'anonymous';
                if (bufferView !== undefined) {
                    const view = s.json.bufferViews![bufferView];
                    const buffer = new Uint8Array(s.arrayBuffer![view.buffer], view.byteOffset, view.byteLength);
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
            .then((r) => r.arrayBuffer())
            .then((b) => ({
                sampler,
                mimeType,
                name,
                image: b,
            }));
    }
}
