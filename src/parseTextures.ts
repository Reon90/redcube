import { createProgram, generateMipmaps, LoadedTexture } from './utils';
import { fetchImage, FetchedImage, ImageSource, getHelperGl } from './fetch';
import { GlTf } from '../GLTF';
import type { State, ReadonlyState, Define } from './state';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import fragGLSL from './shaders/frag.h';
import vertGLSL from './shaders/vert.h';

declare global {
    interface Constructable<T> {
        new (...args: unknown[]): T;
    }
    interface KtxTexture {
        needsTranscoding: boolean;
        baseWidth: number;
        baseHeight: number;
        transcodeBasis(target: number, flags: number): number;
        glUpload(): { texture: WebGLTexture };
    }
    interface TranscodeTarget {
        ETC1_RGB: number;
        BC1_RGB: number;
        BC4_R: number;
        BC5_RG: number;
        BC3_RGBA: number;
        BC1_OR_3: number;
        PVRTC1_4_RGB: number;
        PVRTC1_4_RGBA: number;
        BC7_M6_RGB: number;
        BC7_M5_RGBA: number;
        ETC2_RGBA: number;
        ASTC_4x4_RGBA: number;
        RGBA32: number;
        RGB565: number;
        BGR565: number;
        RGBA4444: number;
        PVRTC2_4_RGB: number;
        PVRTC2_4_RGBA: number;
        ETC: number;
        EAC_R11: number;
        EAC_RG11: number;
    }
    interface Window {
        LIBKTX: {
            ktxTexture: Constructable<KtxTexture>;
            TranscodeTarget: TranscodeTarget;
            transcoderConfig: {
                astcSupported: unknown;
                dxtSupported: unknown;
                pvrtcSupported: unknown;
                etc1Supported: unknown;
                etc2Supported: unknown;
                bptcSupported?: unknown;
            };
            GL: {
                makeContextCurrent: Function;
                registerContext: Function;
            };
            ErrorCode: {
                SUCCESS: number;
            };
        };
    }
}

interface LibktxGlobal {
    LIBKTX(config: { preinitializedWebGLContext: unknown }): Promise<Window['LIBKTX']>;
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
                image: ImageBitmap | { data: Uint8Array; width: number; height: number };
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
                image: HTMLImageElement & { sampler?: WebGLSampler };
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
    if (hasBasisu) {
        const { gl } = input;
        const isWebGPU = Boolean((gl as WEBGPU).device);
        // libktx's GL bindings only understand a real WebGL2RenderingContext
        // - for WebGPU, register a hidden offscreen one for it to transcode
        // into instead (see fetch.ts's getHelperGl()/loadKTXPixels()).
        const registrationGl = isWebGPU ? getHelperGl() : (gl as WebGL2RenderingContext);
        await import(/*webpackChunkName: "libktx"*/ '../libktx');
        (globalThis as unknown as LibktxGlobal).LIBKTX({ preinitializedWebGLContext: registrationGl }).then((module) => {
            const transcoderConfig = isWebGPU
                ? // Force the uncompressed RGBA4444 fallback: the WebGPU path
                  // reads the transcoded pixels back via readPixels(), which
                  // only works for uncompressed formats.
                  {
                      astcSupported: false,
                      etc1Supported: false,
                      etc2Supported: false,
                      bptcSupported: false,
                      dxtSupported: false,
                      pvrtcSupported: false,
                  }
                : {
                      astcSupported: (gl as WebGL2RenderingContext).getExtension('WEBGL_compressed_texture_astc'),
                      etc1Supported: (gl as WebGL2RenderingContext).getExtension('WEBGL_compressed_texture_etc1'),
                      etc2Supported: (gl as WebGL2RenderingContext).getExtension('WEBGL_compressed_texture_etc'),
                      dxtSupported: (gl as WebGL2RenderingContext).getExtension('WEBGL_compressed_texture_s3tc'),
                      bptcSupported: (gl as WebGL2RenderingContext).getExtension('EXT_texture_compression_bptc'),
                      pvrtcSupported:
                          (gl as WebGL2RenderingContext).getExtension('WEBGL_compressed_texture_pvrtc') ||
                          (gl as WebGL2RenderingContext).getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
                  };
            window.LIBKTX = module;
            window.LIBKTX.transcoderConfig = transcoderConfig;
            window.LIBKTX.GL.makeContextCurrent(window.LIBKTX.GL.registerContext(registrationGl, { majorVersion: 2.0 }));
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
        image: ImageBitmap | { data: Uint8Array; width: number; height: number };
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
    const width = isKTX2 ? (image as { width: number }).width : (image as ImageBitmap).width;
    const height = isKTX2 ? (image as { height: number }).height : (image as ImageBitmap).height;
    const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(width, height))) - 2);

    const tex = device.createTexture({
        label: textureType,
        size: [width, height, 1],
        format: srgb ? 'rgba8unorm-srgb' : 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount,
    }) as LoadedTexture;
    if (isKTX2) {
        // KTX2 comes back from loadKTXPixels() as raw RGBA bytes (libktx
        // only exposes a WebGL upload path, not a WebGPU one - see
        // fetch.ts), so it's uploaded via writeTexture() instead of
        // copyExternalImageToTexture(), which only accepts image/canvas
        // sources.
        const { data } = image as { data: Uint8Array };
        device.queue.writeTexture(
            { texture: tex as GPUTexture, mipLevel: 0 },
            data,
            { bytesPerRow: width * 4 },
            { width, height, depthOrArrayLayers: 1 },
        );
    } else {
        device.queue.copyExternalImageToTexture(
            { source: image as ImageBitmap },
            { premultipliedAlpha: false, texture: tex as GPUTexture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
            { width, height, depthOrArrayLayers: 1 },
        );
    }
    tex.sampler = s;
    tex.view = (tex as GPUTexture).createView();

    generateMipmaps(device, tex as GPUTexture, width, height, mipLevelCount);
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
        image: HTMLImageElement & { sampler?: WebGLSampler };
        name: string;
        mimeType?: string;
        sampler?: number;
        srgb?: boolean;
    },
) {
    const s = input.samplers![sampler !== undefined ? sampler : 0] as WebGLSampler;
    if (mimeType) {
        // KTX2 (mimeType 'image/ktx2'): `image` here is already an uploaded
        // WebGLTexture (loadKTX() -> glUpload()) with only its base level
        // populated - it skipped texImage2D entirely. generateMipmap()
        // doesn't work for (and errors on) compressed internal formats like
        // the ASTC/ETC/DXT targets loadKTX() transcodes to, so instead tell
        // WebGL this texture intentionally has a single mip level: sampler
        // objects' minFilter is otherwise still treated as mipmapped and the
        // texture is considered incomplete (renders as solid black).
        const webglGl = input.gl as WebGL2RenderingContext;
        webglGl.bindTexture(webglGl.TEXTURE_2D, image as unknown as WebGLTexture);
        webglGl.texParameteri(webglGl.TEXTURE_2D, webglGl.TEXTURE_BASE_LEVEL, 0);
        webglGl.texParameteri(webglGl.TEXTURE_2D, webglGl.TEXTURE_MAX_LEVEL, 0);
        image.sampler = s;
        return image;
    }
    if (input.images.has(name + srgb)) {
        return input.images.get(name + srgb);
    }
    const webglGl = input.gl as WebGL2RenderingContext;
    const t = webglGl.createTexture() as LoadedTexture;
    t.name = name;
    t.image = image.src.substr(image.src.lastIndexOf('/'));
    t.sampler = s;

    webglGl.activeTexture((webglGl as unknown as Record<string, number>)[`TEXTURE${31}`]);
    webglGl.bindTexture(webglGl.TEXTURE_2D, t as WebGLTexture);
    webglGl.pixelStorei(webglGl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    webglGl.pixelStorei(webglGl.UNPACK_COLORSPACE_CONVERSION_WEBGL, webglGl.NONE);
    webglGl.texImage2D(webglGl.TEXTURE_2D, 0, srgb ? webglGl.SRGB8_ALPHA8 : webglGl.RGBA, webglGl.RGBA, webglGl.UNSIGNED_BYTE, image);
    webglGl.generateMipmap(webglGl.TEXTURE_2D);
    input.images.set(name + srgb, t);

    return t;
}
