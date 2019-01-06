import { buildArray, getDataType, walk, getAnimationComponent, calculateProjection, createProgram, calculateOffset } from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, UniformBuffer, Material } from './objects/index';
import { Matrix4, Frustum } from './matrix';
import { GlTf } from '../GLTF';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { Geometry } from './objects/geometry';

let gl;
const BASE64_MARKER = ';base64,';

interface Track {
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

export class Parse {
    tracks: Array<Track>;
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
                        return fetch(`${this.host}${url}`).then(res => res.arrayBuffer());
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
        const program = this.createProgram(defines);
        material.createUniforms(gl, program);
        material.updateUniforms(gl, program, this.camera, this.lights);

        const mesh = skin !== undefined ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
        const geometry = new Geometry(gl, this.json, this.arrayBuffer, weights, primitive, material.hasNormal());

        mesh.setProgram(program);
        mesh.setMode(primitive.mode);
        mesh.setMaterial(material);
        mesh.setGeometry(geometry);
        mesh.setDefines(material.defines);
        if (mesh instanceof SkinnedMesh) {
            mesh.skin = skin;
        }
        mesh.updateMatrix();

        return mesh;
    }

    buildNode(parent, name) {
        const el = this.json.nodes[name];
        let child;

        if (el.camera !== undefined) {
            // @ts-ignore
            Parse.__update(
                'camera',
                Object.assign(
                    {
                        zoom: 1,
                        aspect: this.canvas.offsetWidth / this.canvas.offsetHeight
                    },
                    this.json.cameras[el.camera]
                ),
                name,
                parent
            );

            child = this.camera;
            const proj = calculateProjection(child.props);
            child.setProjection(proj);

            this.cameras.push(child);
        } else if (el.extensions && el.extensions.KHR_lights_punctual) {
            const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
            light.isInitial = false;

            // @ts-ignore
            Parse.__update('light', light, name, parent);

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

    calculateFov() {
        let biggestMesh;
        walk(this.scene, node => {
            if (node instanceof Mesh) {
                if (!biggestMesh) {
                    biggestMesh = node;
                }
                const candidateZ = node.matrixWorld.getScaleZ();
                const z = biggestMesh.matrixWorld.getScaleZ();
                if (node.geometry.boundingSphere.radius * candidateZ > biggestMesh.geometry.boundingSphere.radius * z) {
                    biggestMesh = node;
                }
            }
        });
        const z = biggestMesh.matrixWorld.getScaleZ();
        const pos = Math.hypot(...biggestMesh.getPosition());
        this.camera.modelSize =
            biggestMesh.geometry.boundingSphere.radius * z + pos + Math.hypot(...biggestMesh.geometry.boundingSphere.center.elements) * z;

        this.resize();
    }

    buildMesh() {
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
        });

        if (this.lights.length === 0) {
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

        this.calculateFov();

        const planes = Frustum(this.camera.getViewProjMatrix());

        walk(this.scene, mesh => {
            if (mesh instanceof Mesh) {
                mesh.geometry.updateUniforms(gl, mesh.program, mesh.matrixWorld, this.camera, this.light);

                if (mesh.material.alpha) {
                    this.scene.transparentChildren.push(mesh);
                } else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
                mesh.visible = mesh.isVisible(planes);

                if (mesh instanceof SkinnedMesh) {
                    for (const join of this.skins[mesh.skin].jointNames) {
                        walk(this.scene, this.buildBones.bind(this, join, this.skins[mesh.skin]));
                    }
                    mesh.setSkin(gl, this.skins[mesh.skin]);
                }
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
                            value: firstV
                        });
                    }
                    if (keys.length >= 2) {
                        this.duration = Math.max(keys[keys.length - 1].time, this.duration);

                        if (meshes.length) {
                            this.tracks.push({
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

    buildBones(join, v, node) {
        if (node.name === join) {
            v.bones.push(node);
        }
    }

    getJson() {
        if (/glb/.test(this.url)) {
            return fetch(this.url)
                .then(res => res.arrayBuffer())
                .then(b => {
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
                .then(res => res.json())
                .then(j => {
                    for (const key in j.buffers) {
                        this.scene.bin.push(j.buffers[key].uri);
                    }
                    this.json = j;

                    return true;
                });
        }
    }

    initTextures() {
        if (!this.json.textures) {
            return true;
        }
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map(s => {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, s.minFilter || 9986);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, s.magFilter || 9729);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, s.wrapS || 10497);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, s.wrapT || 10497);
            return sampler;
        });

        const texturesMap: texturesMap = {};
        this.json.textures.forEach(t => {
            const name = String(t.sampler) + String(t.source);
            texturesMap[name] = t;
            texturesMap[name].name = name;
            t.name = name;
        });
        const promiseArr = Object.values(texturesMap).map(t => {
            return new Promise((resolve, reject) => {
                const sampler = this.samplers[t.sampler !== undefined ? t.sampler : 0];
                const source = this.json.images[t.source];
                const image = new Image();
                image.onload = () => {
                    resolve(this.handleTextureLoaded(sampler, image, t.name));
                };
                image.onerror = err => {
                    reject(err);
                };
                image.crossOrigin = 'anonymous';
                if (source.bufferView !== undefined) {
                    const bufferView = this.json.bufferViews[source.bufferView];
                    const buffer = new Uint8Array(this.arrayBuffer[bufferView.buffer], bufferView.byteOffset, bufferView.byteLength);
                    const blob = new Blob([buffer], { type: source.mimeType });
                    image.src = URL.createObjectURL(blob);
                } else if (/base64/.test(source.uri)) {
                    image.src = source.uri;
                } else {
                    image.src = `${this.host}${source.uri}`;
                }
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
}
