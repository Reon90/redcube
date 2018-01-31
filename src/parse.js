import { isMatrix, buildArray, getDataType, walk, getMatrixType, getAnimationComponent } from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D } from './objects';
import { Matrix4 } from './matrix';

let gl;
let glEnum;
let sceneTextureCount = 13;

export class Parse {
    constructor(url) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.unblendEnable = {};
        this.blendEnable = {};
        this.tracks = [];
        this.skins = {};
        this.textures = {};
        this.blendTechnique = {};
        this.cameras = [];
    }

    setScene(scene) {
        this.scene = scene;
    }

    setGl(g) {
        gl = g;
    }

    setGlEnum(g) {
        glEnum = g;
    }

    setCamera(camera) {
        this._camera = camera;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setResize(resize) {
        this.resize = resize;
    }

    setCalculateProjection(calculateProjection) {
        this.calculateProjection = calculateProjection;
    }

    get width() {
        return this.canvas.offsetWidth;
    }

    getBuffer() {
        return fetch(`${this.host}${this.scene.bin[0]}`)
            .then(res => res.arrayBuffer())
            .then(res => {
                this.arrayBuffer = res;
                return true;
            });
    }

    buildPrim(parent, source, name, p) {
        const indicesAccessor = this.json.accessors[p.indices];
        const vertexAccessor = {};
        for (const a in p.attributes) {
            vertexAccessor[a.toLowerCase().replace(/_(\d)/, '$1')] = this.json.accessors[p.attributes[a]];
        }

        const material = this.json.materials[p.material].values;
        const tech = this.json.materials[p.material].technique;
        const technique = this.json.techniques[tech];

        const attributes = {};
        for (const k in technique.attributes) {
            attributes[k] = {
                type: technique.parameters[technique.attributes[k]].type,
                semantic: technique.parameters[technique.attributes[k]].semantic,
            };
        }
        const uniforms = {};
        for (const k in technique.uniforms) {
            const key = technique.parameters[technique.uniforms[k]];
            let {node} = key;
            const {value} = key;

            if (node) {
                node = this.json.nodes[node].matrix;
            }

            uniforms[k] = {
                type: key.type,
                value: value,
                semantic: key.semantic,
                node: node,
                count: key.count
            };
        }
        for (const k in material) {
            if (material[k] !== undefined) {
                uniforms[`u_${k}`].value = material[k];
            }
        }

        const textures = [];
        for (const k in uniforms) {
            const u = uniforms[k];

            if (u.type === gl.SAMPLER_2D) {
                const t = Object.assign({}, this.json.textures[u.value]);
                Object.assign(t, this.json.samplers[t.sampler]);
                Object.assign(t, this.json.images[t.source]);
                t.name = u.value;
                textures.push(t);
            }

            if (u.value !== undefined && !Array.isArray(u.value)) {
                u.value = [u.value];
            }
            if (u.node !== undefined && !Array.isArray(u.node)) {
                u.node = [u.node];
            }

            if (u.value && isMatrix(u.type)) {
                const matrixConstr = getMatrixType(u.type);
                u.value = new matrixConstr().set(u.value);
            }
            if (u.node && isMatrix(u.type)) {
                const matrixConstr = getMatrixType(u.type);
                u.node = new matrixConstr().set(u.node);
            }
            if (u.count && !u.value) {
                const constr = getMatrixType(u.type);
                u.value = new Array(u.count).fill(1).map(() => new constr);
            }
        }

        let indicesBuffer;
        if (indicesAccessor) {
            indicesBuffer = {};
            const bufferView = this.json.bufferViews[indicesAccessor.bufferView];
            indicesBuffer.value = buildArray(this.arrayBuffer, indicesAccessor.componentType, bufferView.byteOffset + indicesAccessor.byteOffset, getDataType(indicesAccessor.type) * indicesAccessor.count);
        }
        for (const k in vertexAccessor) {
            if (attributes[`a_${k}`]) {
                const accessor = vertexAccessor[k];
                const bufferView = this.json.bufferViews[accessor.bufferView];
                attributes[`a_${k}`].value = buildArray(this.arrayBuffer, accessor.componentType, bufferView.byteOffset + accessor.byteOffset, getDataType(accessor.type) * accessor.count);
            }
        }

        let mesh;
        if (source.skin) {
            mesh = new SkinnedMesh(name, parent);
            mesh.setSkin(source.skin);
        } else {
            mesh = new Mesh(name, parent);
        }
        const isBlend = technique.states.enable.some(s => glEnum[s] === 'BLEND');
        if (isBlend) {
            mesh.setBlend(isBlend);
            Object.assign(this.blendTechnique, technique.states.functions);
            for (const e of technique.states.enable) {
                this.blendEnable[e] = true;
            }
        } else {
            for (const e of technique.states.enable) {
                this.unblendEnable[e] = true;
            }
        }
        mesh.setTechnique(technique.states);
        mesh.setProgram(this.scene.program.find(p => p.name === technique.program).program);
        mesh.setMode(p.mode);
        mesh.setUniforms(uniforms);
        mesh.setAttributes(attributes);
        mesh.setIndicesBuffer(indicesBuffer);
        mesh.setTextures(textures);

        return mesh;
    }

    walkByMesh(parent, name) {
        const el = this.json.nodes[name];
        let child;
        
        if (el.camera) {
            const proj = this.calculateProjection(this.json.cameras[el.camera]);
            child = new Camera(name, parent);
            child.props = this.json.cameras[el.camera];
            child.setProjection(proj.elements);
            child.setMatrix(el.matrix);
            child.setMatrixWorld(el.matrix);
            
            //this._camera = child;

            this.cameras.push(child);
        } else {
            if (el.jointName) {
                child = new Bone(name, parent);
                child.setJointName(el.jointName);
            } else {
                child = new Object3D(name, parent);
            }
            if (el.translation && el.rotation && el.scale) {
                child.setPosition(el.translation, el.rotation, el.scale);
            } else if (el.matrix) {
                child.setMatrix(el.matrix);
            }
        }

        parent.children.push(child);
        parent = child;

        if (el.children && el.children.length) {
            el.children.forEach(this.walkByMesh.bind(this, parent));
        } else if (el.meshes && el.meshes.length) {
            el.meshes.forEach(m => {
                parent.children.push(...this.json.meshes[m].primitives.map(this.buildPrim.bind(this, parent, el, m)));
            });
        }
    }

    calculateFov() {
        let biggestMesh;
        walk(this.scene, node => {
            if (node instanceof SkinnedMesh || node instanceof Mesh) {
                if (!biggestMesh) {
                    biggestMesh = node;
                }
                if (node.geometry.boundingSphere.radius > biggestMesh.geometry.boundingSphere.radius) {
                    biggestMesh = node;
                }
            }
        });
        const a = Math.abs;
        const min = biggestMesh.geometry.boundingSphere.min.elements;
        const max = biggestMesh.geometry.boundingSphere.max.elements;
        this._camera.modelXSize = Math.max(a(min[0]), a(min[2]), a(max[0]), a(max[2]), Math.sqrt(min[0] * min[0] + min[2] * min[2]), Math.sqrt(max[0] * max[0] + max[2] * max[2]));
        this._camera.modelYSize = Math.max(a(min[1]), a(min[2]), a(max[1]), a(max[2]));
        this._camera.modelSize = Math.max(this._camera.modelYSize, this._camera.modelXSize);

        if (!this._camera.props.perspective.yfov) {
            console.warn('Camera not found');
            const z = this._camera.modelSize / (this.width / 100) * 30;
            this._camera.setZ(z);
            this._camera.props.perspective.yfov = 0.6;
        }
        this.resize();
    }

    buildMesh() {
        this.json.scenes.defaultScene.nodes.forEach(n => {
            if (this.json.nodes[n].children.length) {
                this.walkByMesh(this.scene, n);
            }
            if (this.json.nodes[n].meshes && this.json.nodes[n].meshes.length) {
                this.json.nodes[n].meshes.forEach(m => {
                    this.scene.children.push(...this.json.meshes[m].primitives.map(this.buildPrim.bind(this, this.scene, this.json.nodes[n], m)));
                });
            }
            if (this.json.nodes[n].camera) {
                const proj = this.calculateProjection(this.json.cameras[this.json.nodes[n].camera]);
                
                //this._camera = new Camera();
                this._camera.props = this.json.cameras[this.json.nodes[n].camera];
                this._camera.setProjection(proj.elements);
                this._camera.setMatrix(this.json.nodes[n].matrix);
                this._camera.setMatrixWorld(this.json.nodes[n].matrix);
            }
        });

        this.calculateFov();

        return true;
    }

    buildAnimation() {
        for (const k in this.json.animations) {
            const animation = this.json.animations[k];
            for ( const channelId in animation.channels ) {
                const channel = animation.channels[ channelId ];
                const sampler = animation.samplers[ channel.sampler ];

                if ( sampler ) {
                    const {target} = channel;
                    const name = target.id;
                    const input = animation.parameters !== undefined ? animation.parameters[ sampler.input ] : sampler.input;
                    const output = animation.parameters !== undefined ? animation.parameters[ sampler.output ] : sampler.output;

                    const inputAccessor = this.json.accessors[ input ];
                    const outputAccessor = this.json.accessors[ output ];
                    const inputBuffer = this.json.bufferViews[ inputAccessor.bufferView ];
                    const outputBuffer = this.json.bufferViews[ outputAccessor.bufferView ];

                    const inputArray = buildArray(this.arrayBuffer, inputAccessor.componentType, inputBuffer.byteOffset + inputAccessor.byteOffset, getDataType(inputAccessor.type) * inputAccessor.count);
                    const outputArray = buildArray(this.arrayBuffer, outputAccessor.componentType, outputBuffer.byteOffset + outputAccessor.byteOffset, getDataType(outputAccessor.type) * outputAccessor.count);

                    const component = getAnimationComponent(target.path);

                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);

                        keys.push({
                            time: firstT,
                            value: firstV
                        });
                    }

                    const node = this.json.nodes[name];
                    let mesh;
                    let exist;
                    // eslint-disable-next-line
                    function walk(node) {
                        if (exist) {
                            return;
                        }
                        if (`${node.name }Node` === name || node.name === name) {
                            mesh = node;
                            exist = true;
                        }
                        if (node.children) {
                            node.children.forEach(walk);
                        }
                    }
                    walk(this.scene);

                    if ( node ) {
                        this.tracks.push({
                            mesh: mesh,
                            type: target.path,
                            name: `${node.name}.${target.path}`,
                            keys: keys,
                            interpolation: sampler.interpolation
                        });
                    }
                }
            }
        }

        return true;
    }

    buildSkin() {
        for (const k in this.json.skins) {
            const skin = this.json.skins[k];
            const bindShapeMatrix = new Matrix4();

            if ( skin.bindShapeMatrix !== undefined ) {
                bindShapeMatrix.set(skin.bindShapeMatrix);
            }

            const acc = this.json.accessors[ skin.inverseBindMatrices ];
            const buffer = this.json.bufferViews[ acc.bufferView ];
            const array = buildArray(this.arrayBuffer, acc.componentType, buffer.byteOffset + acc.byteOffset, getDataType(acc.type) * acc.count);

            this.skins[k] = {
                bindShapeMatrix: bindShapeMatrix,
                jointNames: skin.jointNames,
                inverseBindMatrices: array
            };

            let i = 0;
            const v = this.skins[k];
            v.bones = [];
            v.boneInverses = [];

            for (const join of v.jointNames) {
                walk(this.scene, this.buildBones.bind(this, join, v));
                const m = v.inverseBindMatrices;
                const mat = new Matrix4().set( m.slice(i * 16, (i + 1) * 16) );
                v.boneInverses.push( mat );
                i++;
            }
        }

        return true;
    }

    buildBones(join, v, node) {
        if (node.jointName === join) {
            v.bones.push(node);
        }
    }

    getJson() {
        return fetch(this.url)
            .then(res => res.json())
            .then(j => {
                for (const k in j.programs) {
                    j.programs[k].shaders = [];
                    j.programs[k].name = k;
                    this.scene.program.push(j.programs[k]);
                }
                for (const key in j.buffers) {
                    this.scene.bin.push(j.buffers[key].uri);
                }
                this.json = j;

                return true;
            });
    }

    walkTexture(node) {
        if (node.material && node.material.texture) {
            node.material.texture.forEach(t => {
                if (!this.textures[t.name]) {
                    this.textures[t.name] = t;
                }
            });
        }
    }

    initTextures() {
        walk(this.scene, this.walkTexture.bind(this));
        
        const promiseArr = Object.values(this.textures).map(t => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    this.handleTextureLoaded(t, image);
                    resolve();
                };
                image.onerror = err => {
                    reject(err);
                };
                image.crossOrigin = 'anonymous';
                image.src = `${this.host}${t.uri}`;
            });
        });

        return Promise.all(promiseArr);
    }

    handleTextureLoaded(t, image) {
        t.data = gl.createTexture();
        t.count = sceneTextureCount;
        gl.activeTexture(gl[`TEXTURE${sceneTextureCount}`]);
        gl.bindTexture(t.target, t.data);
        gl.texImage2D(t.target, 0, t.format, t.internalFormat, t.type, image);
        gl.texParameteri(t.target, gl.TEXTURE_WRAP_S, t.wrapS);
        gl.texParameteri(t.target, gl.TEXTURE_WRAP_T, t.wrapT);
        gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, t.magFilter);
        gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, t.minFilter);
        gl.generateMipmap(t.target);
        sceneTextureCount++;
    }
}
