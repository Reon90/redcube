import { createProgram, generateMipmaps, LoadedTexture } from './utils';
import { fetchImage, FetchedImage, ImageSource, loadBasisModule, ResolvedKTX2Format, BasisModule, TranscodedKTX2 } from './fetch';
import { GlTf } from '../GLTF';
import type { State, ReadonlyState, Define } from './state';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import fragGLSL from './shaders/frag.h';
import vertGLSL from './shaders/vert.h';

// Ordered by preference (quality/bandwidth first). Each candidate names the
// WebGL extension + GL constant, and the WebGPU feature + GPUTextureFormat,
// needed to actually declare/upload that compressed format - alpha-capable
// variants are used uniformly (no opaque-vs-alpha branching like BC1-vs-BC3)
// to keep target-format selection a single, backend-wide choice rather than
// a per-texture one. sRGB is different: it's a per-texture-usage property
// (baseColorTexture vs. normalTexture) decided at upload time, not at
// format-selection time, so both the linear and sRGB GPU format identifiers
// are captured here - the transcoded bytes are identical either way, only
// the tag the GPU samples them under differs.
interface KTX2FormatCandidate {
    transcoderFormatKey: string;
    webgl?: { extension: string; constant: string; srgbExtension?: string; srgbConstant?: string };
    webgpu?: { feature: GPUFeatureName; format: GPUTextureFormat; srgbFormat?: GPUTextureFormat };
}
const KTX2_FORMAT_CANDIDATES: KTX2FormatCandidate[] = [
    {
        transcoderFormatKey: 'cTFASTC_4x4_RGBA',
        webgl: {
            extension: 'WEBGL_compressed_texture_astc',
            constant: 'COMPRESSED_RGBA_ASTC_4x4_KHR',
            srgbConstant: 'COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR',
        },
        webgpu: { feature: 'texture-compression-astc', format: 'astc-4x4-unorm', srgbFormat: 'astc-4x4-unorm-srgb' },
    },
    {
        transcoderFormatKey: 'cTFBC7_RGBA',
        webgl: {
            extension: 'EXT_texture_compression_bptc',
            constant: 'COMPRESSED_RGBA_BPTC_UNORM_EXT',
            srgbConstant: 'COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT',
        },
        webgpu: { feature: 'texture-compression-bc', format: 'bc7-rgba-unorm', srgbFormat: 'bc7-rgba-unorm-srgb' },
    },
    {
        transcoderFormatKey: 'cTFBC3_RGBA',
        webgl: {
            extension: 'WEBGL_compressed_texture_s3tc',
            constant: 'COMPRESSED_RGBA_S3TC_DXT5_EXT',
            // sRGB S3TC is a separate extension, not just another constant
            // on WEBGL_compressed_texture_s3tc.
            srgbExtension: 'WEBGL_compressed_texture_s3tc_srgb',
            srgbConstant: 'COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT',
        },
        webgpu: { feature: 'texture-compression-bc', format: 'bc3-rgba-unorm', srgbFormat: 'bc3-rgba-unorm-srgb' },
    },
    {
        transcoderFormatKey: 'cTFETC2_RGBA',
        webgl: {
            extension: 'WEBGL_compressed_texture_etc',
            constant: 'COMPRESSED_RGBA8_ETC2_EAC',
            srgbConstant: 'COMPRESSED_SRGB8_ALPHA8_ETC2_EAC',
        },
        webgpu: { feature: 'texture-compression-etc2', format: 'etc2-rgba8unorm', srgbFormat: 'etc2-rgba8unorm-srgb' },
    },
    {
        transcoderFormatKey: 'cTFPVRTC1_4_RGBA',
        webgl: {
            extension: 'WEBGL_compressed_texture_pvrtc',
            constant: 'COMPRESSED_RGBA_PVRTC_4BPPV1_IMG',
            // No standard sRGB PVRTC constant.
        },
        // No WebGPU equivalent - PVRTC isn't part of the WebGPU spec.
    },
];

function wrapFormat(module: BasisModule, key: string) {
    return module.transcoder_texture_format[key];
}

export function selectKTX2FormatWebGL(gl: WebGL2RenderingContext, module: BasisModule): ResolvedKTX2Format {
    for (const candidate of KTX2_FORMAT_CANDIDATES) {
        if (!candidate.webgl) {
            continue;
        }
        const ext = gl.getExtension(candidate.webgl.extension) as Record<string, number> | null;
        if (ext) {
            let srgbExt = ext;
            if (candidate.webgl.srgbExtension) {
                srgbExt = (gl.getExtension(candidate.webgl.srgbExtension) as Record<string, number> | null) ?? ext;
            }
            return {
                transcoderFormat: wrapFormat(module, candidate.transcoderFormatKey),
                compressed: true,
                webglInternalFormat: ext[candidate.webgl.constant],
                webglInternalFormatSrgb: candidate.webgl.srgbConstant ? srgbExt[candidate.webgl.srgbConstant] : undefined,
            };
        }
    }
    return { transcoderFormat: wrapFormat(module, 'cTFRGBA32'), compressed: false };
}

export function selectKTX2FormatWebGPU(device: GPUDevice, module: BasisModule): ResolvedKTX2Format {
    for (const candidate of KTX2_FORMAT_CANDIDATES) {
        if (!candidate.webgpu) {
            continue;
        }
        if (device.features.has(candidate.webgpu.feature)) {
            return {
                transcoderFormat: wrapFormat(module, candidate.transcoderFormatKey),
                compressed: true,
                webgpuFormat: candidate.webgpu.format,
                webgpuFormatSrgb: candidate.webgpu.srgbFormat,
            };
        }
    }
    return { transcoderFormat: wrapFormat(module, 'cTFRGBA32'), compressed: false };
}

interface texturesMap {
    [key: string]: TextureJSON;
}
type TextureJSON = GlTf['textures'] extends (infer T)[] | undefined ? T & { name?: string } : never;

// Read-only: programs[hash] = ... mutates the Record State already
// owns, it doesn't reassign the `programs` field itself.
export function createShaderProgram(input: ReadonlyState, defines: Define[]) {
    let program;
    const programHash = defines.map((define) => `${define.name}${define.value ?? 1}`).join('');
    if (input.programs[programHash]) {
        program = input.programs[programHash];
    } else {
        const defineStr = defines.map((define) => `#define ${define.name} ${define.value ?? 1}` + '\n').join('');
        const shaders = [vertexShader, fragmentShader]
            .map((p) =>
                p.replace(/#include ".*/g, (str) => {
                    const [, subPath] = str.split('"');
                    if (subPath.includes('vert')) {
                        return vertGLSL;
                    } else {
                        return fragGLSL;
                    }
                }),
            )
            .map((p) => p.replace(/\n/, `\n${defineStr}`));
        input.programs[programHash] = createProgram(input.gl as WebGL2RenderingContext, shaders[0], shaders[1]);
        program = input.programs[programHash];
    }

    return program;
}

export function createSamplers(input: ReadonlyState, output: Partial<State>) {
    const webglGl = input.gl as WebGL2RenderingContext;
    const samplers = input.json.samplers || [{}];
    output.samplers = samplers.map((s) => {
        const sampler = webglGl.createSampler()!;
        webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MIN_FILTER, s.minFilter || webglGl.LINEAR_MIPMAP_LINEAR);
        webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MAG_FILTER, s.magFilter || webglGl.LINEAR);
        webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_S, s.wrapS || webglGl.REPEAT);
        webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_T, s.wrapT || webglGl.REPEAT);
        return sampler;
    });
}

export function createSamplersWebGPU(input: ReadonlyState, output: Partial<State>, WebGPU: WEBGPU) {
    function getSamplerParam(value?: number) {
        const map: Record<number, string> = {
            9987: 'linear',
            9729: 'linear',
            9986: 'nearest',
            9728: 'nearest',
            10497: 'repeat',
            33648: 'mirror-repeat',
            33071: 'clamp-to-edge',
        };
        return value === undefined ? undefined : map[value];
    }
    const samplers = input.json.samplers || [{}];
    output.samplers = samplers.map((s) => {
        const sampler = WebGPU.device.createSampler({
            mipmapFilter: 'linear',
            magFilter: (getSamplerParam(s.magFilter) || 'linear') as GPUFilterMode,
            minFilter: (getSamplerParam(s.minFilter) || 'linear') as GPUFilterMode,
            addressModeU: (getSamplerParam(s.wrapS) || 'repeat') as GPUAddressMode,
            addressModeV: (getSamplerParam(s.wrapT) || 'repeat') as GPUAddressMode,
            addressModeW: (getSamplerParam(s.wrapS) || 'repeat') as GPUAddressMode,
        }) as GPUSampler & { id?: string };
        sampler.id = (getSamplerParam(s.minFilter) || 'linear') + (getSamplerParam(s.magFilter) || 'linear');
        return sampler;
    });
}

export function createTexturesWebGPU(input: ReadonlyState, WebGPU: WEBGPU) {
    createTextures(input, (t, textureType) =>
        handleTextureLoadedWebGPU(
            input,
            WebGPU,
            t as unknown as {
                image: ImageBitmap | TranscodedKTX2;
                mimeType?: string;
                sampler?: number;
                srgb?: boolean;
                name: string;
            },
            textureType,
        ),
    );
}

export function createTexturesWebGL(input: ReadonlyState) {
    createTextures(input, (t) =>
        handleTextureLoaded(
            input,
            t as unknown as {
                image: (HTMLImageElement & { sampler?: WebGLSampler }) | TranscodedKTX2;
                name: string;
                mimeType?: string;
                sampler?: number;
                srgb?: boolean;
            },
        ),
    );
}

// Read-only: material[textureType] = ... mutates a Material object reached
// through the scene, not a State field itself.
export function createTextures(input: ReadonlyState, callback: (t: LoadedTexture, textureType: string) => unknown) {
    input.scene.meshes.forEach((mesh) => {
        const materials = [mesh.material, ...mesh.variants.map((m) => m.m)];
        const textureTypes = [
            'baseColorTexture',
            'metallicRoughnessTexture',
            'emissiveTexture',
            'normalTexture',
            'occlusionTexture',
            'clearcoatTexture',
            'clearcoatRoughnessTexture',
            'clearcoatNormalTexture',
            'sheenColorTexture',
            'sheenRoughnessTexture',
            'transmissionTexture',
            'specularTexture',
            'specularColorTexture',
            'thicknessTexture',
            'iridescenceThicknessTexture',
            'iridescenceTexture',
            'diffuseTransmissionTexture',
            'diffuseTransmissionColorTexture',
            'anisotropyTexture',
        ];
        const textureSRGB = [
            'baseColorTexture',
            'sheenColorTexture',
            'emissiveTexture',
            'diffuseTransmissionColorTexture',
            mesh.defines!.find((d) => d.name === 'SPECULARGLOSSINESSMAP') && 'metallicRoughnessTexture',
        ];

        for (let i = 0; i < textureTypes.length; i++) {
            for (const material of materials as unknown as Record<string, LoadedTexture | undefined>[]) {
                const textureType = textureTypes[i];
                const t = material[textureType];
                if (!t) {
                    continue;
                }
                if (textureSRGB.find((name) => name === textureType)) {
                    t.srgb = true;
                }
                material[textureType] = callback(t, textureType) as LoadedTexture;
            }
        }
    });
}

export async function initTextures(input: ReadonlyState, output: Partial<State>, isbitmap: boolean) {
    if (!input.json.textures) {
        return true;
    }
    const texturesMap: texturesMap = {};
    let hasBasisu = false;
    input.json.textures.forEach((t) => {
        if (t.extensions && t.extensions.KHR_texture_basisu) {
            hasBasisu = true;
        }
        let source = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
        source = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : source;
        const name = String(t.sampler) + String(source);
        texturesMap[name] = t;
        texturesMap[name].name = name;
        t.name = name;
    });
    let ktx2Format: ResolvedKTX2Format | undefined;
    if (hasBasisu) {
        const { gl } = input;
        const isWebGPU = Boolean((gl as WEBGPU).device);
        const module = await loadBasisModule();
        ktx2Format = isWebGPU
            ? selectKTX2FormatWebGPU((gl as WEBGPU).device, module)
            : selectKTX2FormatWebGL(gl as WebGL2RenderingContext, module);
    }
    const promiseArr = Object.values(texturesMap).map((t) => {
        const isBasisu = Boolean(t.extensions && t.extensions.KHR_texture_basisu);
        let s = isBasisu ? t.extensions!.KHR_texture_basisu.source : t.source;
        s = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : s;
        const source = input.json.images![s!];
        return fetchImage(
            isbitmap,
            input as unknown as ImageSource,
            // KHR_texture_basisu images aren't required to carry mimeType
            // themselves (the extension reference is what marks them as
            // KTX2) - fetchImage only branches to the KTX2 loader off
            // mimeType, so make that explicit here.
            isBasisu ? { ...source, mimeType: 'image/ktx2' } : source,
            {
                url: `${input.host}${source.uri}`,
                name: t.name,
            },
            t.sampler,
            isBasisu ? ktx2Format : undefined,
        );
    });

    return Promise.all(promiseArr).then((textures: FetchedImage[]) => {
        output.textures = input.json.textures!.map((t) => {
            return textures.find((j) => j.name === t.name);
        }) as unknown as LoadedTexture[];
        return true;
    });
}

// Read-only: images.set(...) mutates the Map State already owns, it
// doesn't reassign the `images` field itself.
// writeTexture()'s bytesPerRow must be a multiple of 256 whenever more than
// one row is copied - transcodeKTX2()'s output is tightly packed (no
// padding), so rows need padding out to the alignment boundary here. Works
// for either compressed (rows = block-rows) or uncompressed (rows = pixel
// rows) data, since both are just "N equal-size rows" once the caller has
// worked out what a row actually is.
function alignBytesPerRow(data: Uint8Array, unpaddedBytesPerRow: number, rows: number): { data: Uint8Array; bytesPerRow: number } {
    const bytesPerRow = Math.ceil(unpaddedBytesPerRow / 256) * 256;
    if (bytesPerRow === unpaddedBytesPerRow) {
        return { data, bytesPerRow };
    }
    const padded = new Uint8Array(bytesPerRow * rows);
    for (let row = 0; row < rows; row++) {
        padded.set(data.subarray(row * unpaddedBytesPerRow, (row + 1) * unpaddedBytesPerRow), row * bytesPerRow);
    }
    return { data: padded, bytesPerRow };
}

export function handleTextureLoadedWebGPU(
    input: ReadonlyState,
    WebGPU: WEBGPU,
    {
        image,
        mimeType,
        sampler,
        srgb,
        name,
    }: {
        image: ImageBitmap | TranscodedKTX2;
        mimeType?: string;
        sampler?: number;
        srgb?: boolean;
        name: string;
    },
    textureType: string,
) {
    if (input.images.get(name)) {
        return input.images.get(name);
    }
    const { device } = WebGPU;
    const s = input.samplers![sampler !== undefined ? sampler : 0];
    const isKTX2 = mimeType === 'image/ktx2';
    const width = isKTX2 ? (image as TranscodedKTX2).width : (image as ImageBitmap).width;
    const height = isKTX2 ? (image as TranscodedKTX2).height : (image as ImageBitmap).height;

    let tex: LoadedTexture;
    if (isKTX2) {
        const { data, format } = image as TranscodedKTX2;
        // KTX2 textures carry a single mip level, same as the WebGL path
        // (see handleTextureLoaded) - compressed formats can't be
        // RENDER_ATTACHMENT targets in WebGPU anyway, which generateMipmaps()'s
        // blit pass requires.
        tex = device.createTexture({
            label: textureType,
            size: [width, height, 1],
            format: format.compressed
                ? srgb && format.webgpuFormatSrgb
                    ? format.webgpuFormatSrgb
                    : format.webgpuFormat!
                : srgb
                  ? 'rgba8unorm-srgb'
                  : 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            mipLevelCount: 1,
        }) as LoadedTexture;
        // All of our WebGPU-eligible compressed candidates (ASTC 4x4, BC7,
        // BC3, ETC2) are genuinely 4x4-block GPU formats - basis's own
        // getFormatBlockWidth/Height() reports the *source* transcoding
        // block granularity instead (4x4 even for the uncompressed RGBA32
        // target, confirmed via a WebGPU validation error when it was used
        // to derive row pitch here), so it's not a safe way to compute the
        // real output byte layout and isn't used for that.
        const blockRows = format.compressed ? Math.ceil(height / 4) : height;
        const unpaddedBytesPerRow = format.compressed ? data.length / blockRows : width * 4;
        const { data: uploadData, bytesPerRow } = alignBytesPerRow(data, unpaddedBytesPerRow, blockRows);
        device.queue.writeTexture(
            { texture: tex as GPUTexture, mipLevel: 0 },
            uploadData,
            { bytesPerRow },
            { width, height, depthOrArrayLayers: 1 },
        );
    } else {
        const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(width, height))) - 2);
        tex = device.createTexture({
            label: textureType,
            size: [width, height, 1],
            format: srgb ? 'rgba8unorm-srgb' : 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount,
        }) as LoadedTexture;
        device.queue.copyExternalImageToTexture(
            { source: image as ImageBitmap },
            { premultipliedAlpha: false, texture: tex as GPUTexture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
            { width, height, depthOrArrayLayers: 1 },
        );
        generateMipmaps(device, tex as GPUTexture, width, height, mipLevelCount);
    }
    tex.sampler = s;
    tex.view = (tex as GPUTexture).createView();
    input.images.set(name, tex);

    return tex;
}

export function handleTextureLoaded(
    input: ReadonlyState,
    {
        image,
        name,
        mimeType,
        sampler,
        srgb = false,
    }: {
        image: (HTMLImageElement & { sampler?: WebGLSampler }) | TranscodedKTX2;
        name: string;
        mimeType?: string;
        sampler?: number;
        srgb?: boolean;
    },
) {
    const s = input.samplers![sampler !== undefined ? sampler : 0] as WebGLSampler;
    if (mimeType === 'image/ktx2') {
        if (input.images.has(name + srgb)) {
            return input.images.get(name + srgb);
        }
        const { data, width, height, format } = image as TranscodedKTX2;
        const webglGl = input.gl as WebGL2RenderingContext;
        const t = webglGl.createTexture() as LoadedTexture;
        t.name = name;
        t.sampler = s;
        webglGl.activeTexture((webglGl as unknown as Record<string, number>)[`TEXTURE${31}`]);
        webglGl.bindTexture(webglGl.TEXTURE_2D, t as WebGLTexture);
        if (format.compressed) {
            const internalFormat =
                srgb && format.webglInternalFormatSrgb !== undefined ? format.webglInternalFormatSrgb : format.webglInternalFormat!;
            webglGl.compressedTexImage2D(webglGl.TEXTURE_2D, 0, internalFormat, width, height, 0, data);
        } else {
            webglGl.texImage2D(
                webglGl.TEXTURE_2D,
                0,
                srgb ? webglGl.SRGB8_ALPHA8 : webglGl.RGBA,
                width,
                height,
                0,
                webglGl.RGBA,
                webglGl.UNSIGNED_BYTE,
                data,
            );
        }
        // Single mip level only - generateMipmap() doesn't work for (and
        // errors on) compressed internal formats, and without this the
        // sampler's minFilter is still treated as mipmapped, making the
        // texture mip-incomplete (renders as solid black).
        webglGl.texParameteri(webglGl.TEXTURE_2D, webglGl.TEXTURE_BASE_LEVEL, 0);
        webglGl.texParameteri(webglGl.TEXTURE_2D, webglGl.TEXTURE_MAX_LEVEL, 0);
        input.images.set(name + srgb, t);
        return t;
    }
    if (input.images.has(name + srgb)) {
        return input.images.get(name + srgb);
    }
    const htmlImage = image as HTMLImageElement & { sampler?: WebGLSampler };
    const webglGl = input.gl as WebGL2RenderingContext;
    const t = webglGl.createTexture() as LoadedTexture;
    t.name = name;
    t.image = htmlImage.src.substr(htmlImage.src.lastIndexOf('/'));
    t.sampler = s;

    webglGl.activeTexture((webglGl as unknown as Record<string, number>)[`TEXTURE${31}`]);
    webglGl.bindTexture(webglGl.TEXTURE_2D, t as WebGLTexture);
    webglGl.pixelStorei(webglGl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    webglGl.pixelStorei(webglGl.UNPACK_COLORSPACE_CONVERSION_WEBGL, webglGl.NONE);
    webglGl.texImage2D(webglGl.TEXTURE_2D, 0, srgb ? webglGl.SRGB8_ALPHA8 : webglGl.RGBA, webglGl.RGBA, webglGl.UNSIGNED_BYTE, htmlImage);
    webglGl.generateMipmap(webglGl.TEXTURE_2D);
    input.images.set(name + srgb, t);

    return t;
}
