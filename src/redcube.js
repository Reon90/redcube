import { Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera } from './objects';
import { Matrix3, Matrix4, Vector3, Vector4, Frustum } from './matrix';
import { Events } from './events';
import { setGl, isMatrix, getMatrixType, getDataType, getComponentType, getMethod, getAnimationComponent, getAnimationMethod, interpolation, buildArray, degToRad } from './utils';

let gl;
class RedCube {
    constructor(url, canvas) {
        this.reflow = true;
        this.scene = new Scene();
        this.color = [0.6, 0.6, 0.6, 1.0];
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.canvas = canvas;
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.cameras = [];
        this._camera = new Camera;
        this._camera.props = {
            type: 'perspective', 
            perspective: {
                yfov: null,
                znear: 1,
                zfar: 2e6,
                aspectRatio: null
            }
        };
        this.zoom = 1;
        this._camera.setZ(5);

        this.unblendEnable = {};
        this.blendEnable = {};
        this.blendTechnique = {};
        this.tracks = [];
        this.skins = {};
        this.json = null;
        this.glEnum = {};
        this.textures = {};

        this.events = new Events(this.redraw.bind(this));
        this.cameraPosition = new Vector3([0, 0, 0.05]);
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.zoom = coordsStart;
            this._camera.setProjection(this.buildCamera(this._camera.props).elements);
        }
        if (type === 'rotate') {
            const deltaX = coordsMove[0] - coordsStart[0];
            const newRotationMatrix = new Matrix4;
            newRotationMatrix.rotate(degToRad(-deltaX / 5), [0, 1, 0]);

            const deltaY = coordsMove[1] - coordsStart[1];
            newRotationMatrix.rotate(degToRad(-deltaY / 5), [1, 0, 0]);

            this._camera.matrix.multiply(newRotationMatrix);
            this._camera.setMatrixWorld(this._camera.matrix.elements);
        }
        if (type === 'pan') {
            const p0 = new Vector3(this.canvasToWorld(...coordsStart).elements);
            const p1 = new Vector3(this.canvasToWorld(...coordsMove).elements);
            const pan = this._camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);

            this._camera.matrix.translate(delta.elements[0], delta.elements[1], 0);
            this._camera.setMatrixWorld(this._camera.matrix.elements);
        }
        if (type === 'resize') {
            this.resize();
        }
        
        this.reflow = true;
    }

    resize() {
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        gl.viewport( 0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight );
        this._camera.setProjection(this.buildCamera(this._camera.props).elements);
    }

    sceneToArcBall(pos) {
        let len = pos.elements[0] * pos.elements[0] + pos.elements[1] * pos.elements[1];
        const sz = 0.04 * 0.04 - len;
        if (sz > 0) {
            return [pos.elements[0], pos.elements[1], Math.sqrt(sz)];
        } else {
            len = Math.sqrt(len);
            return [0.04 * pos.elements[0] / len, 0.04 * pos.elements[1] / len, 0];
        }
    }

    canvasToWorld(x, y) {
        const newM = new Matrix4();
        newM.setTranslate(...this.cameraPosition.elements);
        const m = new Matrix4(this._camera.projection);
        m.multiply(newM);

        const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
        mp.elements[0] = (2 * x / this.canvas.offsetWidth - 1) * mp.elements[3];
        mp.elements[1] = (-2 * y / this.canvas.offsetHeight + 1) * mp.elements[3];

        return m.invert().multiplyVector4(mp);
    }

    init() {
        return this.getJson()
            .then(this.glInit.bind(this))
            .then(this.getBuffer.bind(this))
            .then(this.buildMesh.bind(this))
            .then(this.initTextures.bind(this))
            .then(this.buildAnimation.bind(this))
            .then(this.buildSkin.bind(this))
            .then(this.draw.bind(this))
            .catch(console.error);
    }

    setColor(color) {
        this.color = color;
    }

    walk(node, callback) {
        function _walk(node) {
            callback(node);
            if (node.children) {
                node.children.forEach(_walk);
            }
        }
        _walk(node);
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
        const isBlend = technique.states.enable.some(s => this.glEnum[s] === 'BLEND');
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

    calculateFov() {
        let biggestMesh;
        this.walk(this.scene, node => {
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
            const z = this._camera.modelSize / (this.canvas.offsetWidth / 100) * 100;
            this._camera.setZ(z);
            this._camera.props.perspective.yfov = 0.6;
        }
        this.resize();
    }

    buildCamera(cam) {
        let proj;
        if ( cam.type === 'perspective' && cam.perspective ) {
            const {yfov} = cam.perspective;
            const aspectRatio = cam.perspective.aspectRatio || this.aspect;
            const xfov = yfov * this.aspect;

            if (this.aspect !== aspectRatio) {
                console.warn('this.canvas size and this.canvas size from scene dont equal');
            }

            proj = new Matrix4().setPerspective(xfov * this.zoom * (180 / Math.PI), this.aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
        } else if ( cam.type === 'orthographic' && cam.orthographic ) {
            proj = new Matrix4().setOrtho( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, cam.orthographic.znear, cam.orthographic.zfar);
        }

        return proj;
    }

    walkByMesh(parent, name) {
        const el = this.json.nodes[name];
        let child;
        
        if (el.camera) {
            const proj = this.buildCamera(this.json.cameras[el.camera]);
            child = new Camera(name, parent);
            child.props = this.json.cameras[el.camera];
            child.setProjection(proj.elements);
            child.setMatrix(el.matrix);
            child.setMatrixWorld(el.matrix);
            this._camera = child;

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
                const proj = this.buildCamera(this.json.cameras[this.json.nodes[n].camera]);
                this._camera = new Camera();
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
                this.walk(this.scene, this.buildBones.bind(this, join, v));
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

    buildBuffer(indexBuffer, ...buffer) {
        if (indexBuffer) {
            if (indexBuffer.buffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            } else {
                const bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.value, gl.STATIC_DRAW);
                indexBuffer.buffer = bufferGL;
            }
        }

        buffer.forEach(b => {
            if (!b.buffer) {
                const bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ARRAY_BUFFER, b.value, gl.STATIC_DRAW);
                b.buffer = bufferGL;
            }
        });
    }

    glInit() {
        gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        for (const k in gl) {
            const v = gl[k];
            if (typeof v === 'number') {
                this.glEnum[v] = k;
            }
        }
        setGl(this.glEnum);

        const shaderArr = [];
        for (const p of this.scene.program) {
            shaderArr.push(fetch(`${this.host}${p.fragmentShader}.glsl`).then(res => res.text()));
            shaderArr.push(fetch(`${this.host}${p.vertexShader}.glsl`).then(res => res.text()));
        }

        return Promise.all(shaderArr)
            .then(res => {
                let program;
                let i = 0;
                for (const sh of res) {
                    if (!program) {
                        program = gl.createProgram();
                    }

                    let type;
                    if (/gl_Position/.test(sh)) {
                        type = gl.VERTEX_SHADER;
                    } else {
                        type = gl.FRAGMENT_SHADER;
                    }

                    const shader = gl.createShader(type);
                    gl.shaderSource(shader, sh);
                    gl.compileShader(shader);
                    gl.attachShader(program, shader);

                    const index = this.scene.program[i].shaders.push(shader);
                    if (index === 2) {
                        this.scene.program[i].program = program;
                        gl.linkProgram(program);
                        program = null;
                        i++;
                    }
                }

                return true;
            });
    }

    animate(sec) {
        for (const v of this.tracks) {
            const val = interpolation(sec, v.keys);

            if (val[0] === -1 || val[1] === -1 || v.stoped) {
                continue;
            }
            if (val[0] === v.keys.length - 1) {
                v.stoped = true;
            }

            const startFrame = v.keys[ val[0] ];
            const endFrame = v.keys[ val[1] ];
            // eslint-disable-next-line
            const t = val[2];
            
            const component = getAnimationComponent(v.type);
            const vectorC = component === 3 ? Vector3 : Vector4;
            const vector = new vectorC(startFrame.value);
            const vector2 = new vectorC(endFrame.value);

            if (v.type === 'rotation') {
                const out = new Vector4;
                out.lerp(vector.elements, vector2.elements, t);
                
                v.mesh.matrixAnimation[getAnimationMethod(v.type)](out.elements);
            } else {
                const out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                v.mesh.matrixAnimation[getAnimationMethod(v.type)](...out.elements);
            }

            this.reflow = true;
        }
    }

    setMesh(blends, nonBlends, node) {
        if ( node.parent && node.parent.matrixWorld ) {
            const m = new Matrix4();
            m.multiply( node.parent.matrixWorld );
            m.multiply(node.matrixAnimation);
            
            node.setMatrixWorld(m.elements);
        }

        if (node instanceof SkinnedMesh) {
            node.bones = this.skins[node.skin].bones;
            node.boneInverses = this.skins[node.skin].boneInverses;
            node.bindShapeMatrix = this.skins[node.skin].bindShapeMatrix;
        }

        if (node instanceof SkinnedMesh || node instanceof Mesh) {
            if (node.material.blend) {
                blends.push(node);
            } else {
                nonBlends.push(node);
            }
        }
    }

    draw() {
        gl.clearColor(...this.color);

        this.render();
    }

    render(time) {
        const sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            const blends = [];
            const nonBlends = [];
            this.walk(this.scene, this.setMesh.bind(this, blends, nonBlends));

            const planes = Frustum(this._camera.getViewProjMatrix());

            if (nonBlends.length) {
                for (const e in this.unblendEnable) {
                    gl.enable(e);
                }
                for (const mesh of nonBlends) {
                    if (mesh.isVisible(planes)) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                }
                for (const e in this.unblendEnable) {
                    gl.disable(e);
                }
            }

            if (blends.length) {
                const blendsSorted = [];
                for (const mesh of blends) {
                    if (mesh.isVisible(planes)) {
                        blendsSorted.push(mesh);
                    }
                }
                if (blendsSorted.length) {
                    blendsSorted.sort((a, b) => a.distance - b.distance);

                    for (const e in this.blendEnable) {
                        gl.enable(e);
                    }
                    for (const f in this.blendTechnique) {
                        gl[f](...this.blendTechnique[f]);
                    }
                    for (const mesh of blendsSorted) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                    for (const e in this.blendEnable) {
                        gl.disable(e);
                    }
                    for (const f in this.blendTechnique) {
                        if (f === 'depthMask') {
                            gl[f](true);
                        }
                        if (f === 'blendFuncSeparate') {
                            gl[f](gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
                        }
                        if (f === 'blendEquationSeparate') {
                            gl[f](gl.FUNC_ADD, gl.FUNC_ADD);
                        }
                    }
                }
            }
        }

        this.reflow = false;
        requestAnimationFrame(this.render.bind(this));
    }

    _draw(mesh) {
        gl.useProgram(mesh.program);

        const {_camera} = this;
        
        for (const k in mesh.geometry.attributes) {
            const v = mesh.geometry.attributes[k];

            gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer);
            
            let a;
            if (v[k] !== undefined) {
                a = v[k];
            } else {
                a = gl.getAttribLocation(mesh.program, k);
                if (a !== 0 && !a) {
                    console.warn(`dont get ${k} from shader`);
                    delete mesh.geometry.attributes[k];
                    continue;
                }
                v[k] = a;
                gl.enableVertexAttribArray(a);
            }

            gl.vertexAttribPointer(a, getComponentType(v.type), gl.FLOAT, false, 0, 0);
        }

        let texCount = 0;
        for (const k in mesh.material.uniforms) {
            const v = mesh.material.uniforms[k];
            let matricies;
            
            if (v.type === gl.SAMPLER_2D) {
                gl.activeTexture(gl[`TEXTURE${texCount}`]);
                gl.bindTexture(mesh.material.texture[texCount].target, this.textures[mesh.material.texture[texCount].name].data);
                v.value = [texCount];
                texCount++;
            }

            switch (v.semantic) {
            case 'MODELVIEWPROJECTION':
                v.value = mesh.getModelViewProjMatrix(_camera);
                break;
            case 'MODELVIEWPROJECTIONINVERSE':
                v.value = mesh.getModelViewProjMatrix(_camera).invert();
                break;
            case 'VIEW':
                v.value = mesh.getViewMatrix(_camera);
                break;
            case 'VIEWINVERSE':
                v.value = mesh.getViewMatrix(_camera).invert();
                break;
            case 'MODEL':
                v.value = mesh.matrixWorld;
                break;
            case 'MODELINVERSETRANSPOSE':
                v.value = new Matrix3().normalFromMat4(mesh.matrixWorld);
                break;
            case 'MODELINVERSE':
                v.value = new Matrix4(mesh.matrixWorld).invert();
                break;
            case 'MODELVIEW':
                v.value = mesh.getModelViewMatrix(v.node, _camera);
                break;
            case 'MODELVIEWINVERSE':
                v.value = mesh.getModelViewMatrix(v.node, _camera).invert();
                break;
            case 'PROJECTION':
                v.value = mesh.getProjectionMatrix(_camera);
                break;
            case 'PROJECTIONINVERSE':
                v.value = new Matrix4(mesh.getProjectionMatrix(_camera)).invert();
                break;
            case 'MODELVIEWINVERSETRANSPOSE':
                v.value = mesh.getNormalMatrix();
                break;
            case 'VIEWPORT':
                v.value = new Float32Array([0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight]);
                break;
            case 'JOINTMATRIX':
                matricies = mesh.getJointMatrix();
                break;
            }

            let u;
            if (v[k] !== undefined) {
                u = v[k];
            } else {
                u = gl.getUniformLocation(mesh.program, k);
                if (u !== 0 && !u) {
                    console.warn(`dont get ${k} from shader`);
                    delete mesh.material.uniforms[k];
                    continue;
                }
                v[k] = u;
            }

            const value = v.value || v.node;

            if (value.elements) {
                gl[getMethod(v.type)](u, false, value.elements);
            } else if (matricies) {
                const concatArr = new Float32Array(matricies.length * 16);
                let i = 0;
                for (const m of matricies) {
                    concatArr.set(m.elements, i * 16);
                    i++;
                }

                gl[getMethod(v.type)](u, false, concatArr);
            } else {
                gl[getMethod(v.type)](u, ...value);
            }
        }

        if (mesh.geometry.indicesBuffer) {
            gl.drawElements(mesh.mode, mesh.geometry.indicesBuffer.value.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.mode, 0, mesh.geometry.attributes.a_position.value.length / 3);
        }
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
        this.walk(this.scene, this.walkTexture.bind(this));
        
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
        gl.bindTexture(t.target, t.data);
        gl.texImage2D(t.target, 0, t.format, t.internalFormat, t.type, image);
        gl.texParameteri(t.target, gl.TEXTURE_WRAP_S, t.wrapS);
        gl.texParameteri(t.target, gl.TEXTURE_WRAP_T, t.wrapT);
        gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, t.magFilter);
        gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, t.minFilter);
        gl.generateMipmap(t.target);
    }
}

export { RedCube };
