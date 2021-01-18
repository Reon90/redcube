import { buildArray, getDataType, walk, getAnimationComponent, calculateProjection, createProgram, calculateOffset, normalize } from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, UniformBuffer, Material } from './objects/index';
import { Matrix4, Box, Vector3 } from './matrix';
import { GlTf } from '../GLTF';
import { fetch, fetchBinary, fetchImage } from './fetch';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { Geometry } from './objects/geometry';

let gl;
const BASE64_MARKER = ';base64,';

export interface Track {
    keys: Array<Key>;
    stoped: boolean;
    type: string;
    meshes: Array<Mesh>;
    name: string;
    interpolation: string;
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

interface Draco {
    decoderModule: Function;
    decodeDracoData: Function;
    getArray: Function;
    DecoderModule: Promise<unknown>;
}

export class Parse {
    tracks: Array<Track[]>;
    duration: number;
    url: string;
    host: string;
    skins: Array<Skin>;
    textures: Array<object>;
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
    draco?: Draco;

    constructor(url, defines, resize) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.tracks = [];
        this.duration = 0;
        this.skins = [];
        this.textures = null;
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
            this.scene.bin.map(url => {
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
                        return fetchBinary(`${this.host}${url}`)/*.then(res => res.arrayBuffer())*/;
                    }
                } else {
                    return Promise.resolve(url);
                }
            })
        ).then(buffers => {
            this.arrayBuffer = buffers;
        });
    }

    createProgram(defines) {
        let program;
        const programHash = defines.map(define => `${define.name}${define.value || 1}`).join('');
        if (this.programs[programHash]) {
            program = this.programs[programHash];
        } else {
            const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
            program = createProgram(vertexShader.replace(/\n/, `\n${defineStr}`), fragmentShader.replace(/\n/, `\n${defineStr}`));
            this.programs[programHash] = program;
        }

        return program;
    }

    buildPrim(parent, name, skin, weights, primitive) {
        const m = this.json.materials && this.json.materials[primitive.material];
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            this.defines.push({ name: 'SPHERICAL_HARMONICS' });
        }
        const defines = [...this.defines];
        const material = new Material(m, this.textures, defines, this.lights);
        if (skin !== undefined) {
            defines.push({
                name: 'JOINTNUMBER',
                value: this.skins[skin].jointNames.length
            });
        }
        if (primitive.attributes.TANGENT || material.hasNormal()) {
            defines.push({ name: 'TANGENT' });
        }

        const mesh = skin !== undefined ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
        const geometry = new Geometry(this.json, this.arrayBuffer, weights, this.draco, primitive);
        if (geometry.attributes.COLOR_0 && geometry.attributes.COLOR_0.constructor !== Float32Array) {
            defines.push({ name: 'COLOR_255' });
        }

        if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
            const variants = primitive.extensions.KHR_materials_variants.mappings.map(m => {
                return { ...m, m: new Material(this.json.materials[m.material], this.textures, [...defines], this.lights)};
            });
            mesh.setVariants(variants);
        }
        mesh.setMode(primitive.mode);
        mesh.setMaterial(material);
        mesh.setGeometry(geometry);
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
                    aspect: this.canvas ? (this.canvas.offsetWidth / this.canvas.offsetHeight) : 1
                },
                this.json.cameras[el.camera]
            );
            // @ts-ignore
            if (Parse.__update) {
                // @ts-ignore
                Parse.__update(
                    'camera',
                    camera,
                    name,
                    parent
                );
            } else {
                this.camera = new Camera(camera, name, parent);
            }

            child = this.camera;
            const proj = calculateProjection(child.props);
            child.setProjection(proj);

            this.cameras.push(child);
        } else if (el.extensions && el.extensions.KHR_lights_punctual) {
            const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
            light.isInitial = false;

            // @ts-ignore
            if (Parse.__update) {
                // @ts-ignore
                Parse.__update('light', light, name, parent);
            } else {
                this.light = new Light(light, name, parent);
            }

            child = this.light;
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
                    this.buildPrim.bind(this, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights)
                )
            );
        }

        if (el.children && el.children.length) {
            el.children.forEach(this.buildNode.bind(this, parent));
        }
    }

    calculateFov(isInitial) {
        const box = new Box();
        walk(this.scene, node => {
            if (node instanceof Mesh) {
                box.expand(node.geometry.boundingSphere);
            }
        });
        const size = box.getSize();

        if (isInitial) {
            const center = new Vector3()
            .add(box.min)
            .add(box.max)
            .scale(0.5);
            const matrix = new Matrix4;
            matrix.translate(center.x, center.y, center.z);
            matrix.invert();
            this.scene.matrixWorld.multiply(matrix);
            walk(this.scene, node => {
                if (node instanceof Object3D) {
                    node.updateMatrix();
                }
            });
        }

        this.cameras.forEach(c => {
            c.modelSize = size;
        });

        this.resize();
    }

    async buildMesh() {
        if (this.json.extensionsUsed && this.json.extensionsUsed.includes('KHR_draco_mesh_compression')) {
            this.draco = await import('./decoder');
            await this.draco.DecoderModule;
        }
        if (this.json.extensions && this.json.extensions.KHR_materials_variants) {
            this.scene.variants = this.json.extensions.KHR_materials_variants.variants;
        }
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
        });

        if (this.lights.length === 0 && this.light) {
            this.lights.push(this.light);
        }

        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
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

        walk(this.scene, mesh => {
            if (mesh instanceof Mesh) {

                if (mesh.material.alpha) {
                    this.scene.transparentChildren.push(mesh);
                } else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
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
                const sampler = animation.samplers[channel.sampler];

                if (sampler) {
                    const { target } = channel;
                    const name = target.node;
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
                        getDataType(inputAccessor.type) * inputAccessor.count
                    );
                    const outputArray = buildArray(
                        this.arrayBuffer[outputBuffer.buffer],
                        outputAccessor.componentType,
                        calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
                        getDataType(outputAccessor.type) * outputAccessor.count
                    );

                    const meshes = [];
                    walk(this.scene, node => {
                        if (node.name === name) {
                            if (target.path === 'weights' && node instanceof Object3D) {
                                // eslint-disable-next-line
                                node = node.children[0];
                            }
                            meshes.push(node);
                        }
                    });

                    let component = getAnimationComponent(target.path) || meshes[0].geometry.targets.length;
                    if (sampler.interpolation === 'CUBICSPLINE') {
                        component = component * 3;
                    }
                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);

                        keys.push({
                            time: firstT,
                            value: normalize(firstV)
                        });
                    }
                    if (keys.length >= 2) {
                        this.duration = Math.max(keys[keys.length - 1].time, this.duration);

                        if (meshes.length) {
                            tracks.push({
                                stoped: false,
                                meshes: meshes,
                                type: target.path,
                                name: `${meshes[0].name}.${target.path}`,
                                keys: keys,
                                interpolation: sampler.interpolation
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
                getDataType(acc.type) * acc.count
            );

            const v = {
                jointNames: skin.joints,
                inverseBindMatrices: array,
                bones: [],
                boneInverses: []
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
            return fetchBinary(this.url)
                .then((b: ArrayBuffer) => {
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
            return fetch(this.url)
                // .then(res => res.json())
                .then((json: GlTf) => {
                    for (const key in json.buffers) {
                        this.scene.bin.push(json.buffers[key].uri);
                    }
                    this.json = json;

                    return true;
                });
        }
    }

    createTextures() {
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map(s => {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, s.minFilter || 9986);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, s.magFilter || 9729);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, s.wrapS || 10497);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, s.wrapT || 10497);
            return sampler;
        });

        this.scene.meshes.forEach((mesh) => {
            const materials = [mesh.material, ...mesh.variants.map(m => m.m)];
            const textureTypes = ['baseColorTexture', 'metallicRoughnessTexture', 'emissiveTexture', 'normalTexture', 'occlusionTexture', 'clearcoatTexture', 'clearcoatRoughnessTexture', 'clearcoatNormalTexture', 'sheenColorTexture', 'sheenRoughnessTexture'];

            for (let i=0; i < textureTypes.length; i++) {
                for (const material of materials) {
                const textureType = textureTypes[i];
                const t = material[textureType];
                if (!t) {
                    continue;
                }
                const sampler = this.samplers[t.sampler !== undefined ? t.sampler : 0];

                material[textureType] = this.handleTextureLoaded(sampler, t.image, t.name);
                }
            }
        });
    }

    initTextures() {
        if (!this.json.textures) {
            return true;
        }
        const texturesMap: texturesMap = {};
        this.json.textures.forEach(t => {
            const name = String(t.sampler) + String(t.source);
            texturesMap[name] = t;
            texturesMap[name].name = name;
            t.name = name;
        });
        const promiseArr = Object.values(texturesMap).map(t => {
            const source = this.json.images[t.source];
            // @ts-ignore
            return fetchImage(this, source, {
                url: `${this.host}${source.uri}`,
                name: t.name,
            });
        });

        return Promise.all(promiseArr).then((textures: Texture[]) => {
            this.textures = this.json.textures.map(t => {
                return textures.find(j => j.name === t.name);
            });
            return true;
        });
    }

    handleTextureLoaded(sampler, image, name) {
        const t = gl.createTexture();
        t.name = name;
        t.image = image.src.substr(image.src.lastIndexOf('/'));
        t.sampler = sampler;

        gl.activeTexture(gl[`TEXTURE${31}`]);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);

        return t;
    }

    async getEnv() {
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            const env = this.json.extensions.EXT_lights_image_based.lights[0];
            env.specularImages = env.specularImages.map(cube => {
                return cube.map(img => {
                    const accessor = this.json.images[img];
                    const bufferView = this.json.bufferViews[accessor.bufferView];
                    const { buffer, byteLength, byteOffset } = bufferView;
                    const view = new Uint8Array(this.arrayBuffer[buffer], byteOffset, byteLength);
                    const blob = new Blob( [ view ], { type: accessor.mimeType } );
                    const imageUrl = window.URL.createObjectURL( blob );
                    const imageEl = new Image;
                    imageEl.src = imageUrl;

                    return imageEl;
                });
            });
            await new Promise(r => setTimeout(r, 200));
            return env;
        }
    }
}
