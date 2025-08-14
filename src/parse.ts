import {
    buildArray,
    getDataType,
    walk,
    generateMipmaps,
    calculateProjection,
    createProgram,
    calculateOffset,
    normalize,
} from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, Material } from './objects/index';
import { Matrix4, Box, Vector3 } from './matrix';
import { GlTf } from '../GLTF';
import { fetchJSON, fetchBinary, fetchImage } from './fetch';
import { DecoderModule } from './decoder';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import fragGLSL from './shaders/frag.h';
import vertGLSL from './shaders/vert.h';
import { Geometry } from './objects/geometry';

declare global {
    interface Constructable<T> {
        new (...args: any): T;
    }
    interface KtxTexture {
        needsTranscoding: boolean;
        transcodeBasis(target: TranscodeTarget, flags: number): number;
        glUpload(): { texture: WebGLTexture };
    }
    interface TranscodeTarget {
        ETC1_RGB;
        BC1_RGB;
        BC4_R;
        BC5_RG;
        BC3_RGBA;
        BC1_OR_3;
        PVRTC1_4_RGB;
        PVRTC1_4_RGBA;
        BC7_M6_RGB;
        BC7_M5_RGBA;
        ETC2_RGBA;
        ASTC_4x4_RGBA;
        RGBA32;
        RGB565;
        BGR565;
        RGBA4444;
        PVRTC2_4_RGB;
        PVRTC2_4_RGBA;
        ETC;
        EAC_R11;
        EAC_RG11;
    }
    interface Window {
        LIBKTX: {
            ktxTexture: Constructable<KtxTexture>;
            TranscodeTarget: TranscodeTarget;
            transcoderConfig: {
                astcSupported: boolean;
                dxtSupported: boolean;
                pvrtcSupported: boolean;
                etc1Supported: boolean;
                etc2Supported: boolean;
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

let gl;
const BASE64_MARKER = ';base64,';

export interface Track {
    keys: Array<Key>;
    stoped: boolean;
    type: string;
    meshes: Array<Mesh>;
    name: string;
    interpolation: string;
    duration: number;
}
interface Key {
    value: number;
}
interface Skin {
    jointNames: Array<number>;
    bones: Array<Bone>;
}
interface texturesMap {
    name?: string;
}
interface Texture {
    name: string;
    image: string;
    count: number;
    data: WebGLTexture;
}
interface Define {
    name: string;
    value?: number;
}

export class Parse {
    tracks: Array<Track[]>;
    url: string;
    host: string;
    skins: Array<Skin>;
    textures: Array<object>;
    images: Map<string, object>;
    samplers: Array<object>;
    arrayBuffer: object;
    cameras: Array<Camera>;
    lights: Array<Light>;
    programs: object;
    scene: Scene;
    camera: Camera;
    light: Light;
    aspect: number;
    zoom: number;
    canvas: HTMLCanvasElement;
    resize: Function;
    json: GlTf;
    defines: Array<Define>;
    draco?: {};

    constructor(url, defines, resize) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.tracks = [];
        this.skins = [];
        this.textures = null;
        this.images = new Map();
        this.samplers = null;
        this.arrayBuffer = null;
        this.cameras = [];
        this.lights = [];
        this.programs = {};
        this.defines = defines;
        this.resize = resize;
    }

    setScene(scene) {
        this.scene = scene;
    }

    setGl(g) {
        gl = g;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setLight(light) {
        this.light = light;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    getBuffer() {
        return Promise.all(
            this.scene.bin.map((url) => {
                if (typeof url === 'string') {
                    if (/base64/.test(url)) {
                        const base64Index = url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                        const base64 = url.substring(base64Index);
                        const raw = window.atob(base64);
                        const buffer = new ArrayBuffer(raw.length);
                        const array = new Uint8Array(buffer);
                        for (let i = 0; i < raw.length; i++) {
                            array[i] = raw.charCodeAt(i);
                        }
                        return buffer;
                    } else {
                        return fetchBinary(`${this.host}${url}`) /*.then(res => res.arrayBuffer())*/;
                    }
                } else {
                    return Promise.resolve(url);
                }
            }),
        ).then((buffers) => {
            this.arrayBuffer = buffers;
        });
    }

    createProgram(defines) {
        let program;
        const programHash = defines.map((define) => `${define.name}${define.value ?? 1}`).join('');
        if (this.programs[programHash]) {
            program = this.programs[programHash];
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
            this.programs[programHash] = createProgram(shaders[0], shaders[1]);
            program = this.programs[programHash];
        }

        return program;
    }

    buildPrim(el, parent, name, skin, weights, primitive) {
        const m = this.json.materials && this.json.materials[primitive.material];
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            this.defines.push({
                name: 'SPHERICAL_HARMONICS',
                value: Math.ceil(Math.log(this.json.extensions.EXT_lights_image_based.lights[0].specularImageSize) * Math.LOG2E) + 10,
            });
        }
        if (this.json.extensionsUsed && this.json.extensionsUsed.includes('KHR_texture_basisu')) {
            this.defines.push({ name: 'BASISU' });
        }
        const defines = [...this.defines];
        const material = new Material(m, this.textures, defines, this.lights);
        if (skin !== undefined) {
            defines.push({
                name: 'JOINTNUMBER',
                value: this.skins[skin].jointNames.length,
            });
        }
        if (primitive.indices !== undefined || primitive.attributes['TANGENT'] !== undefined) {
            defines.push({ name: 'TANGENT' });
        }
        if (primitive.attributes['TEXCOORD_1'] !== undefined || primitive.attributes['TEXCOORD_2'] !== undefined) {
            defines.push({ name: 'MULTIUV' });
        }
        if (primitive.attributes['COLOR_0']) {
            defines.push({ name: 'COLOR' });
        }

        const mesh = skin !== undefined ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
        const geometry = new Geometry(this.json, this.arrayBuffer, weights, this.draco, primitive);
        if (geometry.attributes.COLOR_0 && geometry.attributes.COLOR_0.constructor !== Float32Array) {
            defines.push({ name: 'COLOR_255' });
        }
        if (primitive.attributes.TANGENT === undefined) {
            defines.push({ name: 'USERIGHTHANDEDSYSTEM' });
        }

        if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
            const variants = primitive.extensions.KHR_materials_variants.mappings.map((m) => {
                return { ...m, m: new Material(this.json.materials[m.material], this.textures, [...defines], this.lights) };
            });
            mesh.setVariants(variants);
        }
        mesh.setMode(primitive.mode);
        mesh.setMaterial(material);
        mesh.setGeometry(geometry);
        if (el.scale && el.scale[0] < 0) {
            mesh.setFrontFace();
        }
        if (el.scale && material.thicknessFactor) {
            material.thicknessFactor *= el.scale[0];
        }
        mesh.setDefines(material.defines);
        if (mesh instanceof SkinnedMesh) {
            mesh.skin = skin;
        }
        mesh.updateMatrix();
        mesh.calculateBounding();

        return mesh;
    }

    buildNode(parent, name) {
        const el = this.json.nodes[name];
        let child;

        if (el.camera !== undefined) {
            const camera = Object.assign(
                {
                    zoom: 1,
                    aspect: this.canvas ? this.canvas.offsetWidth / this.canvas.offsetHeight : 1,
                },
                this.json.cameras[el.camera],
            );

            child = new Camera(camera, name, parent);
            const proj = calculateProjection(child.props);
            child.setProjection(proj);

            this.cameras.push(child);
        } else if (el.extensions && el.extensions.KHR_lights_punctual) {
            const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
            light.isInitial = false;

            child = new Light(light, name, parent);
            this.lights.push(child);
        } else {
            if (el.isBone !== undefined) {
                child = new Bone(name, parent);
            } else {
                child = new Object3D(name, parent);
            }
        }

        if (el.translation || el.rotation || el.scale) {
            child.setPosition(el.translation, el.rotation, el.scale);
        } else if (el.matrix) {
            child.setMatrix(el.matrix);
        }
        child.updateMatrix();

        child.id = el.name;
        parent.children.push(child);
        parent = child;

        if (el.mesh !== undefined) {
            parent.children.push(
                ...this.json.meshes[el.mesh].primitives.map(
                    this.buildPrim.bind(this, el, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights),
                ),
            );
        }

        if (el.children && el.children.length) {
            el.children.forEach(this.buildNode.bind(this, parent));
        }
    }

    calculateFov(isInitial) {
        const box = new Box();
        walk(this.scene, (node) => {
            if (node instanceof Mesh) {
                box.expand(node.geometry.boundingSphere);
            }
        });
        const size = box.getSize();

        if (isInitial) {
            const center = new Vector3().add(box.min).add(box.max).scale(0.5);
            const matrix = new Matrix4();
            matrix.translate(center.x, center.y, center.z);
            matrix.invert();
            this.scene.matrixWorld.multiply(matrix);
            walk(this.scene, (node) => {
                if (node instanceof Object3D) {
                    node.updateMatrix();
                }
            });
        }

        this.cameras.forEach((c) => {
            c.modelSize = size;
        });

        this.resize();
    }

    async buildMesh() {
        if (this.json.extensionsUsed && this.json.extensionsUsed.includes('KHR_draco_mesh_compression')) {
            this.draco = await DecoderModule();
        }
        if (this.json.extensions && this.json.extensions.KHR_materials_variants) {
            this.scene.variants = this.json.extensions.KHR_materials_variants.variants;
        }
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach((n) => {
            if (this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
        });

        if (this.lights.length === 0 && this.light) {
            this.lights.push(this.light);
        }

        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach((n) => {
            if (this.json.nodes[n].children && this.json.nodes[n].children.length && !this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes[n].mesh !== undefined) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes[n].camera !== undefined) {
                this.buildNode(this.scene, n);
            }
        });

        walk(this.scene, (mesh) => {
            if (mesh instanceof Mesh) {
                if (mesh.material.alpha) {
                    this.scene.transparentChildren.push(mesh);
                } else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
                // @ts-ignore
                mesh.material.defines.push({ name: 'LIGHTNUMBER', value: this.lights.length });
                // @ts-ignore
                mesh.material.defines.push({ name: 'LIGHTINDEX', value: 0 });
            }
            if (mesh instanceof Light) {
                const i = this.lights.findIndex(l => l === mesh);
                mesh.parent.children.forEach(m => {
                    if (m instanceof Mesh) {
                        // @ts-ignore
                        m.material.defines.find(d => d.name === 'LIGHTINDEX').value = i;
                    }
                });
            }
        });

        this.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
        this.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
    }

    buildAnimation() {
        if (!this.json.animations) {
            return true;
        }
        for (const animation of this.json.animations) {
            const tracks = [];
            for (const channel of animation.channels) {
                const duration = 0;
                const sampler = animation.samplers[channel.sampler];

                if (sampler) {
                    const { target } = channel;
                    let name = target.node;
                    let path = target.path;
                    if (name === undefined) {
                        const s = target.extensions.KHR_animation_pointer.pointer.split('/');
                        const mat = this.json.materials[s[2]].name;
                        // @ts-ignore
                        name = this.scene.meshes.find(m => m.material.name === mat).name;
                        path = s[s.length - 1];
                    }
                    const input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
                    const output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

                    const inputAccessor = this.json.accessors[input];
                    const outputAccessor = this.json.accessors[output];
                    const inputBuffer = this.json.bufferViews[inputAccessor.bufferView];
                    const outputBuffer = this.json.bufferViews[outputAccessor.bufferView];

                    const inputArray = buildArray(
                        this.arrayBuffer[inputBuffer.buffer],
                        inputAccessor.componentType,
                        calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset),
                        getDataType(inputAccessor.type) * inputAccessor.count,
                    );
                    const outputArray = buildArray(
                        this.arrayBuffer[outputBuffer.buffer],
                        outputAccessor.componentType,
                        calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
                        getDataType(outputAccessor.type) * outputAccessor.count,
                    );

                    const meshes = [];
                    walk(this.scene, (node) => {
                        if (node.name === name) {
                            if (path === 'weights' && node instanceof Object3D) {
                                meshes.push(...node.children);
                            } else {
                                meshes.push(node);
                            }
                        }
                    });

                    let component = getDataType(outputAccessor.type) || meshes[0].geometry.targets.length;
                    if (sampler.interpolation === 'CUBICSPLINE') {
                        component = component * 3;
                    }
                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);

                        keys.push({
                            time: firstT,
                            value: normalize(firstV),
                        });
                    }
                    if (keys.length >= 2) {
                        if (meshes.length) {
                            tracks.push({
                                duration: Math.max(keys[keys.length - 1].time, duration),
                                stoped: false,
                                meshes: meshes,
                                component,
                                type: path,
                                name: `${meshes[0].name}.${path}`,
                                keys: keys,
                                interpolation: sampler.interpolation,
                            });
                        }
                    }
                }
            }
            this.tracks.push(tracks);
        }
    }

    buildSkin() {
        if (!this.json.skins) {
            return true;
        }
        for (const skin of this.json.skins) {
            const acc = this.json.accessors[skin.inverseBindMatrices];
            const buffer = this.json.bufferViews[acc.bufferView];
            const array = buildArray(
                this.arrayBuffer[buffer.buffer],
                acc.componentType,
                calculateOffset(buffer.byteOffset, acc.byteOffset),
                getDataType(acc.type) * acc.count,
            );

            const v = {
                jointNames: skin.joints,
                inverseBindMatrices: array,
                bones: [],
                boneInverses: [],
            };

            let i = 0;
            for (const join of v.jointNames) {
                //walk(this.scene, this.buildBones.bind(this, join, v));
                this.json.nodes[join].isBone = true;
                const m = v.inverseBindMatrices;
                const mat = new Matrix4().set(m.slice(i * 16, (i + 1) * 16));
                v.boneInverses.push(mat);
                i++;
            }
            this.skins.push(v);
        }
    }

    getJson() {
        if (/glb/.test(this.url)) {
            return fetchBinary(this.url).then((b: ArrayBuffer) => {
                const decoder = new TextDecoder('utf-8');
                const [jsonLength] = new Uint32Array(b, 12, 1);
                const jsonBuffer = new Uint8Array(b, 20, jsonLength);
                const json = JSON.parse(decoder.decode(jsonBuffer));
                const [bufferLength] = new Uint32Array(b, 20 + jsonLength, 1);
                const buffer = b.slice(28 + jsonLength, 28 + jsonLength + bufferLength);

                this.json = json;

                this.scene.bin.push(buffer);
            });
        } else {
            return fetchJSON(this.url).then((json: GlTf) => {
                for (const key in json.buffers) {
                    this.scene.bin.push(json.buffers[key].uri);
                }
                this.json = json;

                return true;
            });
        }
    }

    createSamplers() {
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map((s) => {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, s.minFilter || gl.NEAREST_MIPMAP_LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, s.magFilter || gl.LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, s.wrapS || gl.REPEAT);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, s.wrapT || gl.REPEAT);
            return sampler;
        });
    }

    createSamplersWebGPU(WebGPU: WEBGPU) {
        function getSamplerParam(value) {
            const map = {
                9729: 'linear',
                9728: 'linear',
                10497: 'repeat',
                33648: 'mirror-repeat',
                33071: 'clamp-to-edge',
            };
            return map[value];
        }
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map((s) => {
            const sampler = WebGPU.device.createSampler({
                mipmapFilter: 'linear',
                magFilter: getSamplerParam(s.minFilter) || 'linear',
                minFilter: getSamplerParam(s.magFilter) || 'nearest',
                addressModeU: getSamplerParam(s.wrapS) || 'repeat',
                addressModeV: getSamplerParam(s.wrapT) || 'repeat',
                addressModeW: getSamplerParam(s.wrapS) || 'repeat',
            });
            return sampler;
        });
    }

    createTexturesWebGPU(WebGPU: WEBGPU) {
        this.createTextures(this.handleTextureLoadedWebGPU.bind(this, WebGPU));
    }

    createTexturesWebGL() {
        this.createTextures(this.handleTextureLoaded.bind(this));
    }

    createTextures(callback) {
        this.scene.meshes.forEach((mesh) => {
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
                'diffuseTransmissionTexture',
                'diffuseTransmissionColorTexture',
                'anisotropyTexture',
            ];
            const textureSRGB = [
                'baseColorTexture',
                'sheenColorTexture',
                'emissiveTexture',
                //@ts-ignore
                mesh.defines.find((d) => d.name === 'SPECULARGLOSSINESSMAP') && 'metallicRoughnessTexture',
            ];

            for (let i = 0; i < textureTypes.length; i++) {
                for (const material of materials) {
                    const textureType = textureTypes[i];
                    const t = material[textureType];
                    if (!t) {
                        continue;
                    }
                    if (textureSRGB.find((name) => name === textureType)) {
                        t.srgb = true;
                    }
                    material[textureType] = callback(t, textureType);
                }
            }
        });
    }

    async initTextures(isbitmap) {
        if (!this.json.textures) {
            return true;
        }
        const texturesMap: texturesMap = {};
        let hasBasisu = false;
        this.json.textures.forEach((t) => {
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
            const m = await import(/*webpackChunkName: "libktx"*/ '../libktx');
            // @ts-ignore
            m.default({ preinitializedWebGLContext: gl }).then((module) => {
                const transcoderConfig = {
                    astcSupported: gl.getExtension('WEBGL_compressed_texture_astc'),
                    etc1Supported: gl.getExtension('WEBGL_compressed_texture_etc1'),
                    etc2Supported: gl.getExtension('WEBGL_compressed_texture_etc'),
                    dxtSupported: gl.getExtension('WEBGL_compressed_texture_s3tc'),
                    bptcSupported: gl.getExtension('EXT_texture_compression_bptc'),
                    pvrtcSupported:
                        gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
                };
                window.LIBKTX = module;
                window.LIBKTX.transcoderConfig = transcoderConfig;
                window.LIBKTX.GL.makeContextCurrent(window.LIBKTX.GL.registerContext(gl, { majorVersion: 2.0 }));
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const promiseArr = Object.values(texturesMap).map((t) => {
            let s = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
            s = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : s;
            const source = this.json.images[s];
            // @ts-ignore
            return fetchImage(
                isbitmap,
                this,
                //@ts-ignore
                source,
                {
                    url: `${this.host}${source.uri}`,
                    name: t.name,
                },
                t.sampler,
            );
        });

        return Promise.all(promiseArr).then((textures: Texture[]) => {
            this.textures = this.json.textures.map((t) => {
                return textures.find((j) => j.name === t.name);
            });
            return true;
        });
    }

    handleTextureLoadedWebGPU(WebGPU: WEBGPU, { bitmap, sampler, srgb, name }, textureType) {
        if (this.images.get(name)) {
            return this.images.get(name);
        }
        const { device } = WebGPU;
        const s = this.samplers[sampler !== undefined ? sampler : 0];
        const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(bitmap.width, bitmap.height))) - 2);

        const tex = device.createTexture({
            label: textureType,
            size: [bitmap.width, bitmap.height, 1],
            format: srgb ? 'rgba8unorm-srgb' : 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount,
        });
        device.queue.copyExternalImageToTexture(
            { source: bitmap },
            { premultipliedAlpha: false, texture: tex, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
            { width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1 },
        );
        //@ts-ignore
        tex.sampler = s;

        generateMipmaps(device, tex, bitmap.width, bitmap.height, mipLevelCount);
        this.images.set(name, tex);

        return tex;
    }

    handleTextureLoaded({ image, name, mimeType, sampler, srgb }) {
        const s = this.samplers[sampler !== undefined ? sampler : 0];
        if (mimeType) {
            image.sampler = s;
            return image;
        }
        if (this.images.get(name)) {
            return this.images.get(name);
        }
        const t = gl.createTexture();
        t.name = name;
        t.image = image.src.substr(image.src.lastIndexOf('/'));
        t.sampler = s;

        gl.activeTexture(gl[`TEXTURE${31}`]);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, srgb ? gl.SRGB8_ALPHA8 : gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.images.set(name, t);

        return t;
    }

    async getEnv(isBuffer) {
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            const [env] = this.json.extensions.EXT_lights_image_based.lights;
            env.specularImages = env.specularImages.map((cube) => {
                return cube.map((img) => {
                    const accessor = this.json.images[img];
                    const bufferView = this.json.bufferViews[accessor.bufferView];
                    const { buffer, byteLength, byteOffset } = bufferView;
                    const view = new Uint8Array(this.arrayBuffer[buffer], byteOffset, byteLength);
                    const blob = new Blob([view], { type: accessor.mimeType });
                    const imageUrl = window.URL.createObjectURL(blob);
                    const imageEl = new Image();
                    imageEl.src = imageUrl;

                    return imageEl;
                });
            });
            await new Promise((r) => setTimeout(r, 200));
            if (isBuffer) {
                for (const images of env.specularImages) {
                    for (const image of images) {
                        image.bitmap = await createImageBitmap(image);
                    }
                }
            }
            return env;
        }
    }
}
