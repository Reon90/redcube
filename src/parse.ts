import {
    buildArray,
    getDataType,
    walk,
    generateMipmaps,
    calculateProjection,
    createProgram,
    calculateOffset,
    normalize,
    LoadedTexture,
} from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, Material } from './objects/index';
import type { CameraProps } from './objects/camera';
import { Matrix4, Box, Vector3 } from './matrix';
import { GlTf, Node, MeshPrimitive } from '../GLTF';
import { fetchJSON, fetchBinary, fetchImage, FetchedImage, ImageSource } from './fetch';
import { DecoderModule, DracoModule } from './decoder';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import fragGLSL from './shaders/frag.h';
import vertGLSL from './shaders/vert.h';
import { Geometry } from './objects/geometry';

declare global {
    interface Constructable<T> {
        new (...args: unknown[]): T;
    }
    interface KtxTexture {
        needsTranscoding: boolean;
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

let gl: WebGL2RenderingContext | WEBGPU;
const BASE64_MARKER = ';base64,';

export interface Track {
    keys: Array<Key>;
    stoped: boolean;
    type: string;
    component: number;
    meshes: Array<Mesh>;
    name: string;
    interpolation: string;
    duration: number;
}
interface Key {
    time: number;
    value: Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | number[];
}
export interface Skin {
    jointNames: Array<number>;
    bones: Array<Bone>;
    boneInverses: Array<Matrix4>;
}
interface texturesMap {
    [key: string]: TextureJSON;
}
type TextureJSON = GlTf['textures'] extends (infer T)[] | undefined ? T & { name?: string } : never;
export interface Define {
    name: string;
    value?: number;
}

export class Parse {
    tracks: Array<Track[]>;
    url: string;
    host: string;
    skins: Array<Skin>;
    textures: LoadedTexture[] | null;
    images: Map<string, unknown>;
    samplers: Array<WebGLSampler | GPUSampler> | null;
    arrayBuffer: ArrayBufferLike[] | null;
    cameras: Array<Camera>;
    lights: Array<Light>;
    programs: Record<string, WebGLProgram>;
    scene!: Scene;
    camera!: Camera;
    light!: Light;
    aspect?: number;
    zoom?: number;
    canvas!: HTMLCanvasElement;
    resize: () => void;
    json!: GlTf;
    defines: Array<Define>;
    draco?: DracoModule;

    constructor(url: string, defines: Array<Define>, resize: () => void) {
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

    setScene(scene: Scene) {
        this.scene = scene;
    }

    setGl(g: WebGL2RenderingContext | WEBGPU) {
        gl = g;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    setLight(light: Light) {
        this.light = light;
    }

    setCanvas(canvas: HTMLCanvasElement) {
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
                        return fetchBinary(`${this.host}${url}`); /*.then(res => res.arrayBuffer())*/
                    }
                } else {
                    return Promise.resolve(url);
                }
            }),
        ).then((buffers) => {
            this.arrayBuffer = buffers;
        });
    }

    createProgram(defines: Define[]) {
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
            this.programs[programHash] = createProgram(gl as WebGL2RenderingContext, shaders[0], shaders[1]);
            program = this.programs[programHash];
        }

        return program;
    }

    buildPrim(el: Node, parent: Object3D, name: string, skin: number | undefined, weights: number[] | undefined, primitive: MeshPrimitive) {
        const m = this.json.materials && this.json.materials[primitive.material!];
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
        const material = new Material(m, this.textures!, defines);
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
        if (primitive.attributes['TEXCOORD_2'] !== undefined) {
            defines.push({ name: 'MULTIUV2' });
        }
        if (primitive.attributes['COLOR_0']) {
            defines.push({ name: 'COLOR' });
        }

        const mesh = skin !== undefined ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
        const geometry = new Geometry(this.json, this.arrayBuffer!, weights!, this.draco, primitive);
        if (primitive.attributes.TANGENT === undefined) {
            defines.push({ name: 'USERIGHTHANDEDSYSTEM' });
        }

        if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
            const variants = primitive.extensions.KHR_materials_variants.mappings.map((m: { material: number; variants: number[] }) => {
                return { ...m, m: new Material(this.json.materials![m.material], this.textures!, [...defines]) };
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
            mesh.skin = skin!;
        }
        mesh.matrices = parent.matrices;
        mesh.updateMatrix();
        mesh.calculateBounding();
        mesh.visible = parent.visible;
        mesh.instances = parent.instances;

        return mesh;
    }

    buildNode(parent: Object3D | Scene, name: number) {
        const el = this.json.nodes![name];
        let child: Object3D;

        if (el.camera !== undefined) {
            const camera = Object.assign(
                {
                    zoom: 1,
                    isInitial: false,
                    aspect: this.canvas ? this.canvas.offsetWidth / this.canvas.offsetHeight : 1,
                },
                this.json.cameras![el.camera],
            ) as unknown as CameraProps;

            const camObj = new Camera(camera, name, parent);
            const proj = calculateProjection(camObj.props);
            camObj.setProjection(proj!);

            this.cameras.push(camObj);
            child = camObj;
        } else if (el.extensions && el.extensions.KHR_lights_punctual) {
            if (this.lights.find((l) => l.id === el.name)) {
                return;
            }
            const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
            light.isInitial = false;

            const lightObj = new Light(light, name, parent);
            this.lights.push(lightObj);
            child = lightObj;
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

        child.visible = parent.visible;
        if (el.extensions && el.extensions.KHR_node_visibility) {
            child.visible = el.extensions.KHR_node_visibility.visible;
        }

        if (el.extensions && el.extensions.EXT_mesh_gpu_instancing) {
            const { attributes } = el.extensions.EXT_mesh_gpu_instancing;
            const keys = ['ROTATION', 'SCALE', 'TRANSLATION'];
            for (const key of keys) {
                if (!attributes[key]) {
                    continue;
                }
                const stride = key === 'ROTATION' ? 4 : 3;
                const accessor = this.json.accessors![attributes[key]];
                const bufferView = this.json.bufferViews![accessor.bufferView!];
                const buffer = buildArray(
                    this.arrayBuffer![bufferView.buffer],
                    accessor.componentType,
                    calculateOffset(bufferView.byteOffset, accessor.byteOffset),
                    getDataType(accessor.type)! * accessor.count,
                )!;
                if (child.instances === 1) {
                    child.instances = buffer.length / stride;
                    child.matrices = Array.from({ length: child.instances });
                    for (let i = 0; i < child.instances; i++) {
                        child.matrices[i] = new Matrix4();
                    }
                }
                for (let i = 0; i < buffer.length; i += stride) {
                    const m = child.matrices[i / stride];
                    if (key === 'ROTATION') {
                        m.makeRotationFromQuaternion([buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]]);
                    } else if (key === 'SCALE') {
                        m.scale(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
                    } else if (key === 'TRANSLATION') {
                        m.setTranslate(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
                    }
                }
            }
        }

        child.id = el.name;
        parent.children.push(child);
        parent = child;

        if (el.mesh !== undefined) {
            parent.children.push(
                ...this.json.meshes![el.mesh].primitives.map(
                    this.buildPrim.bind(this, el, parent, this.json.meshes![el.mesh].name, el.skin, this.json.meshes![el.mesh].weights),
                ),
            );
        }

        if (el.children && el.children.length) {
            el.children.forEach(this.buildNode.bind(this, parent));
        }
    }

    calculateFov(isInitial: boolean) {
        const box = new Box();
        walk(this.scene, (node: Object3D | Scene) => {
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
            walk(this.scene, (node: Object3D | Scene) => {
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

        this.json.scenes![this.json.scene !== undefined ? this.json.scene : 0].nodes!.forEach((n) => {
            if (this.json.nodes![n].extensions !== undefined) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes![n].children && this.json.nodes![n].children!.length) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes![n].mesh !== undefined) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes![n].camera !== undefined) {
                this.buildNode(this.scene, n);
            }
        });
        if (this.lights.length === 0 && this.light) {
            this.lights.push(this.light);
        }

        walk(this.scene, (mesh: Object3D | Scene) => {
            if (mesh instanceof Mesh) {
                if (mesh.material.alpha) {
                    this.scene.transparentChildren.push(mesh);
                } else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
                mesh.material.defines.push({ name: 'LIGHTNUMBER', value: this.lights.length });

                this.lights.forEach((light, i) => {
                    if (light.visible) {
                        if (light.type === 'directional') {
                            mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
                        } else {
                            const p = mesh.getPosition();
                            const distance = new Vector3(light.getPosition()).distanceToSquared(p[0], p[1], p[2]);
                            const attenuation =
                                Math.max(Math.min(1.0 - Math.pow(distance / light.range, 4.0), 1.0), 0.0) / Math.pow(distance, 2.0);
                            if (attenuation > 0) {
                                mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
                            }
                        }
                    }
                });
            }
        });
        this.scene.meshes.forEach((m) => {
            if (m.material.lights[0] === -1) {
                m.material.lights[0] = 0;
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
            const tracks: Track[] = [];
            for (const channel of animation.channels) {
                const duration = 0;
                const sampler = animation.samplers[channel.sampler];

                if (sampler) {
                    const { target } = channel;
                    let name: string | number | undefined = target.node;
                    let { path } = target;
                    if (name === undefined) {
                        const s = target.extensions.KHR_animation_pointer.pointer.split('/');
                        if (s[1] === 'materials') {
                            const mat = this.json.materials![Number(s[2])].name;
                            ({ name } = this.scene.meshes.find((m) => m.material.name === mat)!);
                            path = s.splice(3).join('/');
                        }
                        if (s[1] === 'nodes') {
                            ({ name } = this.json.nodes![Number(s[2])]);
                            path = s[5];
                        }
                    }
                    const input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
                    const output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

                    const inputAccessor = this.json.accessors![input];
                    const outputAccessor = this.json.accessors![output];
                    const inputBuffer = this.json.bufferViews![inputAccessor.bufferView!];
                    const outputBuffer = this.json.bufferViews![outputAccessor.bufferView!];

                    const inputArray = buildArray(
                        this.arrayBuffer![inputBuffer.buffer],
                        inputAccessor.componentType,
                        calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset),
                        getDataType(inputAccessor.type)! * inputAccessor.count,
                    )!;
                    const outputArray = buildArray(
                        this.arrayBuffer![outputBuffer.buffer],
                        outputAccessor.componentType,
                        calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
                        getDataType(outputAccessor.type)! * outputAccessor.count,
                    )!;

                    const meshes: Mesh[] = [];
                    walk(this.scene, (node: Object3D | Scene) => {
                        if ((node as Object3D).name === name || (node as Object3D).id === name) {
                            if (path === 'weights' && node instanceof Object3D) {
                                meshes.push(...(node.children as Mesh[]));
                            } else {
                                meshes.push(node as Mesh);
                            }
                        }
                    });

                    let component = path === 'weights' ? meshes[0].geometry.targets.length : getDataType(outputAccessor.type)!;
                    if (sampler.interpolation === 'CUBICSPLINE') {
                        component = component * 3;
                    }
                    const keys: Key[] = [];
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
                                interpolation: sampler.interpolation!,
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
            const acc = this.json.accessors![skin.inverseBindMatrices!];
            const buffer = this.json.bufferViews![acc.bufferView!];
            const array = buildArray(
                this.arrayBuffer![buffer.buffer],
                acc.componentType,
                calculateOffset(buffer.byteOffset, acc.byteOffset),
                getDataType(acc.type)! * acc.count,
            )!;

            const v: Skin & { inverseBindMatrices: typeof array } = {
                jointNames: skin.joints,
                inverseBindMatrices: array,
                bones: [],
                boneInverses: [],
            };

            let i = 0;
            for (const join of v.jointNames) {
                //walk(this.scene, this.buildBones.bind(this, join, v));
                this.json.nodes![join].isBone = true;
                const m = v.inverseBindMatrices;
                const mat = new Matrix4().set(m.slice(i * 16, (i + 1) * 16))!;
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
                    this.scene.bin.push(json.buffers![Number(key)].uri!);
                }
                this.json = json;

                return true;
            });
        }
    }

    createSamplers() {
        const webglGl = gl as WebGL2RenderingContext;
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map((s) => {
            const sampler = webglGl.createSampler()!;
            webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MIN_FILTER, s.minFilter || webglGl.LINEAR_MIPMAP_LINEAR);
            webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MAG_FILTER, s.magFilter || webglGl.LINEAR);
            webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_S, s.wrapS || webglGl.REPEAT);
            webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_T, s.wrapT || webglGl.REPEAT);
            return sampler;
        });
    }

    createSamplersWebGPU(WebGPU: WEBGPU) {
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
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map((s) => {
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

    createTexturesWebGPU(WebGPU: WEBGPU) {
        this.createTextures((t, textureType) =>
            this.handleTextureLoadedWebGPU(
                WebGPU,
                t as unknown as { image: ImageBitmap; sampler?: number; srgb?: boolean; name: string },
                textureType,
            ),
        );
    }

    createTexturesWebGL() {
        this.createTextures((t) =>
            this.handleTextureLoaded(
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

    createTextures(callback: (t: LoadedTexture, textureType: string) => unknown) {
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

    async initTextures(isbitmap: boolean) {
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
            await import(/*webpackChunkName: "libktx"*/ '../libktx');
            (globalThis as unknown as LibktxGlobal).LIBKTX({ preinitializedWebGLContext: gl }).then((module) => {
                const transcoderConfig = (gl as WEBGPU).device
                    ? {
                          astcSupported: (gl as WEBGPU).features.has('texture-compression-astc'),
                          etc1Supported: (gl as WEBGPU).features.has('texture-compression-etc2'),
                          etc2Supported: (gl as WEBGPU).features.has('texture-compression-etc2'),
                          bptcSupported: (gl as WEBGPU).features.has('texture-compression-bc'),
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
                window.LIBKTX.GL.makeContextCurrent(window.LIBKTX.GL.registerContext(gl, { majorVersion: 2.0 }));
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const promiseArr = Object.values(texturesMap).map((t) => {
            let s = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
            s = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : s;
            const source = this.json.images![s!];
            return fetchImage(
                isbitmap,
                this as unknown as ImageSource,
                source,
                {
                    url: `${this.host}${source.uri}`,
                    name: t.name,
                },
                t.sampler,
            );
        });

        return Promise.all(promiseArr).then((textures: FetchedImage[]) => {
            this.textures = this.json.textures!.map((t) => {
                return textures.find((j) => j.name === t.name);
            }) as unknown as LoadedTexture[];
            return true;
        });
    }

    handleTextureLoadedWebGPU(
        WebGPU: WEBGPU,
        { image: bitmap, sampler, srgb, name }: { image: ImageBitmap; sampler?: number; srgb?: boolean; name: string },
        textureType: string,
    ) {
        if (this.images.get(name)) {
            return this.images.get(name);
        }
        const { device } = WebGPU;
        const s = this.samplers![sampler !== undefined ? sampler : 0];
        const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(bitmap.width, bitmap.height))) - 2);

        const tex = device.createTexture({
            label: textureType,
            size: [bitmap.width, bitmap.height, 1],
            format: srgb ? 'rgba8unorm-srgb' : 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount,
        }) as LoadedTexture;
        device.queue.copyExternalImageToTexture(
            { source: bitmap },
            { premultipliedAlpha: false, texture: tex as GPUTexture, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
            { width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1 },
        );
        tex.sampler = s;
        tex.view = (tex as GPUTexture).createView();

        generateMipmaps(device, tex as GPUTexture, bitmap.width, bitmap.height, mipLevelCount);
        this.images.set(name, tex);

        return tex;
    }

    handleTextureLoaded({
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
    }) {
        const s = this.samplers![sampler !== undefined ? sampler : 0] as WebGLSampler;
        if (mimeType) {
            image.sampler = s;
            return image;
        }
        if (this.images.has(name + srgb)) {
            return this.images.get(name + srgb);
        }
        const webglGl = gl as WebGL2RenderingContext;
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
        this.images.set(name + srgb, t);

        return t;
    }

    async getEnv(isBuffer: boolean) {
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            const [env] = this.json.extensions.EXT_lights_image_based.lights;
            const specularImages: (HTMLImageElement & { bitmap?: ImageBitmap })[][] = env.specularImages.map((cube: number[]) => {
                return cube.map((img: number) => {
                    const accessor = this.json.images![img];
                    const bufferView = this.json.bufferViews![accessor.bufferView!];
                    const { buffer, byteLength, byteOffset } = bufferView;
                    const view = new Uint8Array(this.arrayBuffer![buffer], byteOffset, byteLength);
                    const blob = new Blob([view as BlobPart], { type: accessor.mimeType });
                    const imageUrl = window.URL.createObjectURL(blob);
                    const imageEl = new Image();
                    imageEl.src = imageUrl;

                    return imageEl;
                });
            });
            env.specularImages = specularImages;
            await new Promise((r) => setTimeout(r, 200));
            if (isBuffer) {
                for (const images of specularImages) {
                    for (const image of images) {
                        image.bitmap = await createImageBitmap(image);
                    }
                }
            }
            return env;
        }
    }
}
