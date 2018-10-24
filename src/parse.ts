import { buildArray, getDataType, walk, getAnimationComponent, calculateProjection, createProgram, calculateOffset, getAttributeIndex, calculateBinormals } from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, UniformBuffer } from './objects/index';
import { Matrix3, Matrix4, Frustum } from './matrix';
import { GlTf } from './GLTF';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { Geometry } from './objects/geometry';

let gl;

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
    programs: object;
    scene: Scene;
    _camera: Camera;
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
        this._camera = camera;
    }

    setLight(light) {
        this.light = light;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    getBuffer() {
        return Promise.all(
            this.scene.bin.map(url => fetch(`${this.host}${url}`).then(res => res.arrayBuffer())))
            .then(buffers => {
                this.arrayBuffer = buffers;
            });
    }

    buildPrim(parent, name, skin, weights, primitive) {
        const material = primitive.material !== undefined ? JSON.parse(JSON.stringify(this.json.materials[primitive.material])) : {pbrMetallicRoughness: {baseColorFactor: [0.8, 0.8, 0.8, 1.0]}};
        const defines = [...this.defines];
        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            material.pbrMetallicRoughness.metallicRoughnessTexture = this.textures[material.pbrMetallicRoughness.metallicRoughnessTexture.index];
            defines.push({name: 'METALROUGHNESSMAP'});
        }
        if (material.normalTexture) {
            material.normalTexture = this.textures[material.normalTexture.index];
            defines.push({name: 'NORMALMAP'});
        }
        if (material.occlusionTexture) {
            material.occlusionTexture = this.textures[material.occlusionTexture.index];
            defines.push({name: 'OCCLUSIONMAP'});
        }
        if (material.pbrMetallicRoughness.baseColorTexture) {
            const extensions = material.pbrMetallicRoughness.baseColorTexture.extensions;
            material.pbrMetallicRoughness.baseColorTexture = this.textures[material.pbrMetallicRoughness.baseColorTexture.index];
            defines.push({name: 'BASECOLORTEXTURE'});

            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    const translation = ex.offset && new Matrix3().set([1, 0, 0, 0, 1, 0, ex.offset[0], ex.offset[1], 1]);
                    const rotation = ex.rotation && new Matrix3().set([-Math.sin(ex.rotation), Math.cos(ex.rotation), 0, Math.cos(ex.rotation), Math.sin(ex.rotation), 0, 0, 0, 1]);
                    const scale = ex.scale && new Matrix3().set([ex.scale[0], 0, 0, 0, ex.scale[1], 0, 0, 0, 1]);

                    const matrix = new Matrix3();
                    if (scale) {
                        matrix.multiply(scale);
                    }
                    if (rotation) {
                        matrix.multiply(rotation);
                    }
                    if (translation) {
                        matrix.multiply(translation);
                    }
                    material.matrix = matrix;
                    defines.push({name: 'TEXTURE_TRANSFORM'});
                }
            }
        }
        if (material.emissiveTexture) {
            const { texCoord } = material.emissiveTexture;
            material.emissiveTexture = this.textures[material.emissiveTexture.index];
            defines.push({name: 'EMISSIVEMAP', value: texCoord ? 2 : 1});
        }

        if (skin !== undefined) {
            defines.push({name: 'JOINTNUMBER', value: this.skins[skin].jointNames.length});
        }
        if (primitive.attributes.TANGENT || material.normalTexture) {
            defines.push({name: 'TANGENT'});
        }

        if (material.alphaMode === 'MASK') {
            defines.push({name: 'ALPHATEST', value: material.alphaCutoff || 0.5});
        } else if (material.alphaMode === 'BLEND') {
            defines.push({name: 'ALPHATEST', value: 0.01});
        }

        let program;
        if (this.programs[defines.map(define => `${define.name}${define.value || 1}`).join('')]) {
            program = this.programs[defines.map(define => `${define.name}${define.value || 1}`).join('')];
        } else {
            const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
            program = createProgram(vertexShader.replace(/\n/, `\n${ defineStr}`), fragmentShader.replace(/\n/, `\n${ defineStr}`));
            this.programs[defines.map(define => `${define.name}${define.value || 1}`).join('')] = program;
        }

        const mesh = skin !== undefined ? new SkinnedMesh(name, parent).setSkin(skin) : new Mesh(name, parent);
        const geometry = new Geometry(gl, this.json, this.arrayBuffer, weights, primitive, material.normalTexture);
        
        mesh.setProgram(program);
        mesh.setMode(primitive.mode);
        mesh.setMaterial(material);
        mesh.setGeometry(geometry);
        mesh.setDefines(defines);
        mesh.updateMatrix();

        if (material.pbrMetallicRoughness.baseColorTexture) {
            mesh.material.uniforms.baseColorTexture = gl.getUniformLocation(mesh.program, 'baseColorTexture');
        }
        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            mesh.material.uniforms.metallicRoughnessTexture = gl.getUniformLocation(mesh.program, 'metallicRoughnessTexture');
        }
        if (material.normalTexture) {
            mesh.material.uniforms.normalTexture = gl.getUniformLocation(mesh.program, 'normalTexture');
        }
        if (material.occlusionTexture) {
            mesh.material.uniforms.occlusionTexture = gl.getUniformLocation(mesh.program, 'occlusionTexture');
        }
        if (material.emissiveTexture) {
            mesh.material.uniforms.emissiveTexture = gl.getUniformLocation(mesh.program, 'emissiveTexture');
        }

        return mesh;
    }

    walkByMesh(parent, name) {
        const el = this.json.nodes[name];
        let child;

        if (el.camera !== undefined) {
            // @ts-ignore
            Parse.__update('camera', Object.assign({
                zoom: 1,
                aspect: this.canvas.offsetWidth / this.canvas.offsetHeight
            }, this.json.cameras[el.camera]), name, parent);

            child = this._camera;
            const proj = calculateProjection(child.props);
            child.setProjection(proj);

            this.cameras.push(child);
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

        parent.children.push(child);
        parent = child;

        if (el.mesh !== undefined) {
            if (el.skin !== undefined) {
                for (const join of this.skins[el.skin].jointNames) {
                    walk(this.scene, this.buildBones.bind(this, join, this.skins[el.skin]));
                }
            }
            parent.children.push(...this.json.meshes[el.mesh].primitives.map(this.buildPrim.bind(this, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights)));
        }

        if (el.children && el.children.length) {
            el.children.forEach(this.walkByMesh.bind(this, parent));
        }
    }

    calculateFov() {
        let biggestMesh;
        walk(this.scene, node => {
            if (node instanceof Mesh) {
                if (!biggestMesh) {
                    biggestMesh = node;
                }
                if (node.geometry.boundingSphere.radius > biggestMesh.geometry.boundingSphere.radius) {
                    biggestMesh = node;
                }
            }
        });
        const z = Math.max(biggestMesh.matrixWorld.getScaleZ(), 1);
        const pos = Math.hypot(...biggestMesh.getPosition());
        this._camera.modelSize = biggestMesh.geometry.boundingSphere.radius * z + pos + Math.hypot(...biggestMesh.geometry.boundingSphere.center.elements);

        this.resize();
    }

    buildMesh() {
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].children && this.json.nodes[n].children.length) {
                this.walkByMesh(this.scene, n);
            }
            if (this.json.nodes[n].mesh !== undefined) {
                this.walkByMesh(this.scene, n);
            }
            if (this.json.nodes[n].camera !== undefined) {
                this.walkByMesh(this.scene, n);
            }
        });

        this.calculateFov();

        const planes = Frustum(this._camera.getViewProjMatrix());

        walk(this.scene, mesh => {
            if (mesh instanceof SkinnedMesh) {
                mesh.bones = this.skins[mesh.skin].bones;
                mesh.boneInverses = this.skins[mesh.skin].boneInverses;

                const jointMatrix = mesh.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                const uIndex = gl.getUniformBlockIndex(mesh.program, 'Skin');
                gl.uniformBlockBinding(mesh.program, uIndex, 2);
                const UBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
                gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
                mesh.geometry.SKIN = UBO;
                gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            }
            if (mesh instanceof Mesh) {
                const materialUniformBuffer = new UniformBuffer();
                materialUniformBuffer.add('baseColorFactor', mesh.material.pbrMetallicRoughness.baseColorFactor || [0.8, 0.8, 0.8, 1.0]);
                materialUniformBuffer.add('lightPos', this.light.getPosition());
                materialUniformBuffer.add('viewPos', this._camera.getPosition());
                materialUniformBuffer.add('textureMatrix', (mesh.material.matrix && mesh.material.matrix.elements) || new Matrix3().elements);
                materialUniformBuffer.done();

                const mIndex = gl.getUniformBlockIndex(mesh.program, 'Material');
                gl.uniformBlockBinding(mesh.program, mIndex, 1);
                const mUBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
                gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
                mesh.material.UBO = mUBO;
                mesh.material.uniformBuffer = materialUniformBuffer;

                const normalMatrix = new Matrix4(mesh.matrixWorld);
                normalMatrix.invert().transpose();

                const uniformBuffer = new UniformBuffer();
                uniformBuffer.add('model', mesh.matrixWorld.elements);
                uniformBuffer.add('normalMatrix', normalMatrix.elements);
                uniformBuffer.add('view', this._camera.matrixWorldInvert.elements);
                uniformBuffer.add('projection', this._camera.projection.elements);
                uniformBuffer.add('light', this.light.matrixWorldInvert.elements);
                uniformBuffer.add('isShadow', new Float32Array([0]));
                uniformBuffer.done();

                const uIndex = gl.getUniformBlockIndex(mesh.program, 'Matrices');
                gl.uniformBlockBinding(mesh.program, uIndex, 0);
                const UBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
                gl.bufferData(gl.UNIFORM_BUFFER, uniformBuffer.store, gl.DYNAMIC_DRAW);
                mesh.geometry.UBO = UBO;
                mesh.geometry.uniformBuffer = uniformBuffer;
                gl.bindBuffer(gl.UNIFORM_BUFFER, null);

                if (mesh.material.alphaMode) {
                    this.scene.transparentChildren.push(mesh);
                } else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
                mesh.visible = mesh.isVisible(planes);
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
            for ( const channel of animation.channels ) {
                const sampler = animation.samplers[ channel.sampler ];

                if ( sampler ) {
                    const {target} = channel;
                    const name = target.node;
                    const input = animation.parameters !== undefined ? animation.parameters[ sampler.input ] : sampler.input;
                    const output = animation.parameters !== undefined ? animation.parameters[ sampler.output ] : sampler.output;

                    const inputAccessor = this.json.accessors[ input ];
                    const outputAccessor = this.json.accessors[ output ];
                    const inputBuffer = this.json.bufferViews[ inputAccessor.bufferView ];
                    const outputBuffer = this.json.bufferViews[ outputAccessor.bufferView ];

                    const inputArray = buildArray(this.arrayBuffer[inputBuffer.buffer], inputAccessor.componentType, calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset), getDataType(inputAccessor.type) * inputAccessor.count);
                    const outputArray = buildArray(this.arrayBuffer[outputBuffer.buffer], outputAccessor.componentType, calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset), getDataType(outputAccessor.type) * outputAccessor.count);

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

                    const component = getAnimationComponent(target.path) || meshes[0].geometry.targets.length;
                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);

                        keys.push({
                            time: firstT,
                            value: firstV
                        });
                    }
                    this.duration = Math.max(keys[keys.length - 1].time, this.duration);

                    if ( meshes.length ) {
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

    buildSkin() {
        if (!this.json.skins) {
            return true;
        }
        for (const skin of this.json.skins) {
            const acc = this.json.accessors[ skin.inverseBindMatrices ];
            const buffer = this.json.bufferViews[ acc.bufferView ];
            const array = buildArray(this.arrayBuffer[buffer.buffer], acc.componentType, calculateOffset(buffer.byteOffset, acc.byteOffset), getDataType(acc.type) * acc.count);

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
                const mat = new Matrix4().set( m.slice(i * 16, (i + 1) * 16) );
                v.boneInverses.push( mat );
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
                image.src = `${this.host}${source.uri}`;
            });
        });

        return Promise.all(promiseArr)
            .then((textures: Texture[]) => {
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
