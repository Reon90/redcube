import {Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera} from './objects';
import {Matrix2, Matrix3, Matrix4, Vector3, Vector4, Frustum} from './matrix';

let gl;
class RedCube {
    constructor(url, canvas) {
        this.reflow = true;
        this.scene = new Scene();

        this.color = [0.6, 0.6, 0.6, 1.0];
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.canvas = canvas;
        this.cameras = [];
        this.aspect = this.canvas.width / this.canvas.height;
        this._camera = new Camera;
        this._camera.setProjection(new Matrix4().setPerspective(30, this.aspect, 1, 1000).elements);
        this._camera.setMatrixWorldInvert([5, 5, 5, 0, 1, 0, 0, 1, 0]);

        this.unblendEnable = {};
        this.blendEnable = {};
        this.blendTechnique = {};
        this.tracks = [];
        this.skins = {};
        this.json = null;
        this.glEnum = {};
        this.textures = {};
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

    isMatrix(type) {
        return this.glEnum[type] === 'FLOAT_MAT4' || this.glEnum[type] === 'FLOAT_MAT3' || this.glEnum[type] === 'FLOAT_MAT2';
    }

    getMatrixType(type) {
        if (this.glEnum[type] === 'FLOAT_MAT4') {
            return Matrix4;
        }
        if (this.glEnum[type] === 'FLOAT_MAT3') {
            return Matrix3;
        }
        if (this.glEnum[type] === 'FLOAT_MAT2') {
            return Matrix2;
        }
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
        for (let a in p.attributes) {
            vertexAccessor[a.toLowerCase().replace(/_(\d)/, '$1')] = this.json.accessors[p.attributes[a]]
        }

        const material = this.json.materials[p.material].values;
        const tech = this.json.materials[p.material].technique;
        const technique = this.json.techniques[tech];

        const attributes = {};
        for (let k in technique.attributes) {
            attributes[k] = {
                type: technique.parameters[technique.attributes[k]].type,
                semantic: technique.parameters[technique.attributes[k]].semantic,
            };
        }
        const uniforms = {};
        for (let k in technique.uniforms) {
            let key = technique.parameters[technique.uniforms[k]];
            let node = key.node;
            let value = key.value;

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
        for (let k in material) {
            if (material[k] !== undefined) {
                uniforms[`u_${k}`].value = material[k];
            }
        }

        const textures = [];
        for (let k in uniforms) {
            let u = uniforms[k];

            if (u.type === gl.SAMPLER_2D) {
                let t = Object.assign({}, this.json.textures[u.value]);
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

            if (u.value && this.isMatrix(u.type)) {
                let matrixConstr = this.getMatrixType(u.type);
                u.value = new matrixConstr().set(u.value);
            }
            if (u.node && this.isMatrix(u.type)) {
                let matrixConstr = this.getMatrixType(u.type);
                u.node = new matrixConstr().set(u.node);
            }
            if (u.count && !u.value) {
                let constr = this.getMatrixType(u.type);
                u.value = new Array(u.count).fill(1).map(it => new constr);
            }
        }

        let indicesBuffer;
        if (indicesAccessor) {
            indicesBuffer = {};
            const bufferView = this.json.bufferViews[indicesAccessor.bufferView];
            indicesBuffer.value = this.buildArray(indicesAccessor.componentType, bufferView.byteOffset + indicesAccessor.byteOffset, this.getDataType(indicesAccessor.type) * indicesAccessor.count);
        }
        for (let k in vertexAccessor) {
            if (attributes[`a_${k}`]) {
                let accessor = vertexAccessor[k];
                const bufferView = this.json.bufferViews[accessor.bufferView];
                attributes[`a_${k}`].value = this.buildArray(accessor.componentType, bufferView.byteOffset + accessor.byteOffset, this.getDataType(accessor.type) * accessor.count);
            }
        };

        let mesh;
        if (source.skin) {
            mesh = new SkinnedMesh(name, parent);
            mesh.setSkin(source.skin);
        } else {
            mesh = new Mesh(name, parent);
        }
        let isBlend = technique.states.enable.some(s => this.glEnum[s] === 'BLEND');
        if (isBlend) {
            mesh.setBlend(isBlend);
            Object.assign(this.blendTechnique, technique.states.functions);
            for (let e of technique.states.enable) {
                this.blendEnable[e] = true;
            }
        } else {
            for (let e of technique.states.enable) {
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

    buildCamera(cam) {
        let proj;
        if ( cam.type == "perspective" && cam.perspective ) {
            const yfov = cam.perspective.yfov;
            const aspectRatio = cam.perspective.aspectRatio || this.aspect;
            const xfov = yfov * aspectRatio;

            if (this.aspect !== aspectRatio) {
                console.error('this.canvas size and this.canvas size from scene dont equal');
            }

            proj = new Matrix4().setPerspective(xfov * (180/Math.PI), this.aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
        } else if ( cam.type == "orthographic" && cam.orthographic ) {
            proj = new Matrix4().setOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, cam.orthographic.znear, cam.orthographic.zfar);
        }

        return proj;
    }

    buildMesh() {
        this.json.scenes.defaultScene.nodes.forEach(n => {
            if (this.json.nodes[n].children.length) {
                function walk(parent, name) {
                    let el = this.json.nodes[name];
                    let child;
                    
                    if (el.camera) {
                        const proj = this.buildCamera(this.json.cameras[el.camera]);
                        child = new Camera(name, parent);
                        child.setProjection(proj.elements);
                        child.setMatrix(el.matrix);
                        child.setMatrixWorld(el.matrix);

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
                        el.children.forEach(walk.bind(this, parent));
                    } else if (el.meshes && el.meshes.length) {
                        el.meshes.forEach(m => {
                            parent.children.push(...this.json.meshes[m].primitives.map(this.buildPrim.bind(this, parent, el, m)));
                        });
                    }
                }
                walk.call(this, this.scene, n);
            }
            if (this.json.nodes[n].meshes && this.json.nodes[n].meshes.length) {
                this.json.nodes[n].meshes.forEach(m => {
                    this.scene.children.push(...this.json.meshes[m].primitives.map(this.buildPrim.bind(this, this.scene, this.json.nodes[n], m)));
                });
            }
            if (this.json.nodes[n].camera) {
                const proj = this.buildCamera(this.json.cameras[this.json.nodes[n].camera]);
                this._camera = new Camera();
                this._camera.setProjection(proj.elements);
                this._camera.setMatrix(this.json.nodes[n].matrix);
                this._camera.setMatrixWorld(this.json.nodes[n].matrix);
            }
        });

        return true;
    }

    buildAnimation() {
        for (let k in this.json.animations) {
            let animation = this.json.animations[k];
            for ( let channelId in animation.channels ) {
                let channel = animation.channels[ channelId ];
                let sampler = animation.samplers[ channel.sampler ];

                if ( sampler ) {
                    let target = channel.target;
                    let name = target.id;
                    let input = animation.parameters !== undefined ? animation.parameters[ sampler.input ] : sampler.input;
                    let output = animation.parameters !== undefined ? animation.parameters[ sampler.output ] : sampler.output;

                    let inputAccessor = this.json.accessors[ input ];
                    let outputAccessor = this.json.accessors[ output ];
                    let inputBuffer = this.json.bufferViews[ inputAccessor.bufferView ];
                    let outputBuffer = this.json.bufferViews[ outputAccessor.bufferView ];

                    let inputArray = this.buildArray(inputAccessor.componentType, inputBuffer.byteOffset + inputAccessor.byteOffset, this.getDataType(inputAccessor.type) * inputAccessor.count);
                    let outputArray = this.buildArray(outputAccessor.componentType, outputBuffer.byteOffset + outputAccessor.byteOffset, this.getDataType(outputAccessor.type) * outputAccessor.count);

                    let component = this.getAnimationComponent(target.path);

                    let keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        let firstV, firstT;

                        firstT = inputArray[i];
                        firstV = outputArray.slice(i * component, (i+1) * component);

                        keys.push({
                            time: firstT,
                            value: firstV
                        })
                    }

                    let node = this.json.nodes[name];
                    let mesh;
                    let exist;
                    function walk(node) {
                        if (exist) return;
                        if (node.name + 'Node' === name || node.name === name) {
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
        for (let k in this.json.skins) {
            let skin = this.json.skins[k];
            let bindShapeMatrix = new Matrix4();

            if ( skin.bindShapeMatrix !== undefined ) bindShapeMatrix.set(skin.bindShapeMatrix);

            let acc = this.json.accessors[ skin.inverseBindMatrices ];
            let buffer = this.json.bufferViews[ acc.bufferView ];
            let array = this.buildArray(acc.componentType, buffer.byteOffset + acc.byteOffset, this.getDataType(acc.type) * acc.count);

            this.skins[k] = {
                bindShapeMatrix: bindShapeMatrix,
                jointNames: skin.jointNames,
                inverseBindMatrices: array
            };

            let i = 0;
            let v = this.skins[k];
            v.bones = [];
            v.boneInverses = [];

            for (let join of v.jointNames) {
                this.walk(this.scene, this.buildBones.bind(this, join, v));
                let m = v.inverseBindMatrices;
                let mat = new Matrix4().set( m.slice(i * 16, (i + 1) * 16) );
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

    buildArray(type, offset, length) {
        let arr;
        switch(this.glEnum[type]) {
            case 'BYTE':
                arr = new Int8Array(this.arrayBuffer, offset, length);
                break;
            case 'UNSIGNED_BYTE':
                arr = new Uint8Array(this.arrayBuffer, offset, length);
                break;
            case 'SHORT':
                arr = new Int16Array(this.arrayBuffer, offset, length);
                break;
            case 'UNSIGNED_SHORT':
                arr = new Uint16Array(this.arrayBuffer, offset, length);
                break;
            case 'FLOAT':
                arr = new Float32Array(this.arrayBuffer, offset, length);
                break;
        }
        return arr;
    }

    getDataType(type) {
        let count;
        switch(type) {
            case 'MAT2':
                count = 4;
                break;
            case 'MAT3':
                count = 9;
                break;
            case 'MAT4':
                count = 16;
                break;
            case 'VEC4':
                count = 4;
                break;
            case 'VEC3':
                count = 3;
                break;
            case 'VEC2':
                count = 2;
                break;
            case 'SCALAR':
                count = 1;
                break;
        }
        return count;
    }

    getComponentType(type) {
        let count;
        switch(this.glEnum[type]) {
            case 'FLOAT_VEC4':
                count = 4;
                break;
            case 'FLOAT_VEC3':
                count = 3;
                break;
            case 'FLOAT_VEC2':
                count = 2;
                break;
        }
        return count;
    }

    getJson() {
        return fetch(this.url)
            .then(res => res.json())
            .then(j => {
                for (let k in j.programs) {
                    j.programs[k].shaders = [];
                    j.programs[k].name = k;
                    this.scene.program.push(j.programs[k]);
                }
                for (let key in j.buffers) {
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
                let bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.value, gl.STATIC_DRAW);
                indexBuffer.buffer = bufferGL;
            }
        }

        buffer.forEach(b => {
            if (!b.buffer) {
                let bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ARRAY_BUFFER, b.value, gl.STATIC_DRAW);
                b.buffer = bufferGL;
            }
        });
    }

    glInit() {
        gl = this.canvas.getContext('webgl');

        for (let k in gl) {
            let v = gl[k];
            if (typeof v === 'number') {
                this.glEnum[v] = k;
            }
        }

        let shaderArr = [];
        for (let p of this.scene.program) {

            shaderArr.push(fetch(`${this.host}${p.fragmentShader}.glsl`).then(res => res.text()));
            shaderArr.push(fetch(`${this.host}${p.vertexShader}.glsl`).then(res => res.text()));
        }

        return Promise.all(shaderArr)
        .then(res => {
            let program;
            let i = 0;
            for (let sh of res) {
                if (!program) {
                    program = gl.createProgram();
                }

                let type;
                if (/gl_Position/.test(sh)) {
                    type = gl.VERTEX_SHADER;
                } else {
                    type = gl.FRAGMENT_SHADER;
                }

                let shader = gl.createShader(type);
                gl.shaderSource(shader, sh);
                gl.compileShader(shader);
                gl.attachShader(program, shader);

                let index = this.scene.program[i].shaders.push(shader);
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

    getMethod(type) {
        let method;
        switch(this.glEnum[type]) {
            case "FLOAT_VEC2":
                method = 'uniform2f';
                break;
            case "FLOAT_VEC4":
                method = 'uniform4f';
                break;
            case 'FLOAT':
                method = 'uniform1f';
                break;
            case "FLOAT_VEC3":
                method = 'uniform3f';
                break;
            case 'FLOAT_MAT4':
                method = 'uniformMatrix4fv';
                break;
            case 'FLOAT_MAT3':
                method = 'uniformMatrix3fv';
                break;
            case 'FLOAT_MAT2':
                method = 'uniformMatrix2fv';
                break;
            case "SAMPLER_2D":
                method = 'uniform1i';
                break;
        }
        return method;
    }

    getAnimationComponent(type) {
        if (type === 'rotation') {
            return 4;
        } else {
            return 3;
        }
    }

    getAnimationMethod(type) {
        if (type === 'rotation') {
            return 'makeRotationFromQuaternion';
        }
        if (type === 'scale') {
            return 'scale';
        }
        if (type === 'translation') {
            return 'setTranslate';
        }
    }

    range(min, max, value) {
        return (value - min) / (max - min)
    }

    interpolation(time, frames) {
        if (frames.length === 0)
            return [-1, -1, 0];

        let prev = -1
        for (let i = frames.length - 1; i >= 0; i--) {
            if (time >= frames[i].time) {
                prev = i
                break
            }
        }

        if (prev === -1 || prev === frames.length - 1) {
            if (prev < 0)
                prev = 0
            return [prev, prev, 0];
        } 
        else {
            let startFrame = frames[prev]
            let endFrame = frames[prev + 1]

            time = Math.max(startFrame.time, Math.min(time, endFrame.time))
            let t = this.range(startFrame.time, endFrame.time, time)

            return [prev, prev + 1, t]
        }
    }

    animate(sec) {
        for (let v of this.tracks) {
            let val = this.interpolation(sec, v.keys);

            if (val[0] === -1 || val[1] === -1 || v.stoped) continue;
            if (val[0] === v.keys.length - 1) {
                v.stoped = true;
            }

            let startFrame = v.keys[ val[0] ];
            let endFrame = v.keys[ val[1] ];
            let t = val[2];
            
            let component = this.getAnimationComponent(v.type);
            let vector, vector2, vectorC = component === 3 ? Vector3 : Vector4;

            vector = new vectorC(startFrame.value);
            vector2 = new vectorC(endFrame.value);

            if (v.type === 'rotation') {
                let out = new Vector4;
                out.lerp(vector.elements, vector2.elements, t);
                
                v.mesh.matrixAnimation[this.getAnimationMethod(v.type)](out);
            } else {
                let out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                v.mesh.matrixAnimation[this.getAnimationMethod(v.type)](...out);
            }

            this.reflow = true;
        }
    }

    setMesh(blends, nonBlends, node) {
        if ( node.parent && node.parent.matrixWorld ) {
            let m = new Matrix4();
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
        let sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            let blends = [];
            let nonBlends = [];
            this.walk(this.scene, this.setMesh.bind(this, blends, nonBlends));

            let planes = Frustum(this._camera.getViewProjMatrix());

            if (nonBlends.length) {
                for (let e in this.unblendEnable) {
                    gl.enable(e);
                }
                for (let mesh of nonBlends) {
                    if (mesh.isVisible(planes)) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                }
                for (let e in this.unblendEnable) {
                    gl.disable(e);
                }
            }

            if (blends.length) {
                let blendsSorted = [];
                for (let mesh of blends) {
                    if (mesh.isVisible(planes)) {
                        blendsSorted.push(mesh);
                    }
                }
                if (blendsSorted.length) {
                    blendsSorted.sort((a, b) => a.distance - b.distance);

                    for (let e in this.blendEnable) {
                        gl.enable(e);
                    }
                    for (let f in this.blendTechnique) {
                        gl[f](...this.blendTechnique[f]);
                    }
                    for (let mesh of blendsSorted) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                    for (let e in this.blendEnable) {
                        gl.disable(e);
                    }
                    for (let f in this.blendTechnique) {
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

        let _camera = this._camera;
        
        for (let k in mesh.geometry.attributes) {
            let v = mesh.geometry.attributes[k];

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

            gl.vertexAttribPointer(a, this.getComponentType(v.type), gl.FLOAT, false, 0, 0);
        }

        let texCount = 0;
        for (let k in mesh.material.uniforms) {
            let v = mesh.material.uniforms[k], matricies;
            
            if (v.type === gl.SAMPLER_2D) {
                gl.activeTexture(gl[`TEXTURE${texCount}`]);
                gl.bindTexture(mesh.material.texture[texCount].target, this.textures[mesh.material.texture[texCount].name].data);
                v.value = [texCount];
                texCount++;
            }

            switch(v.semantic) {
                case "MODELVIEWPROJECTION":
                    v.value = mesh.getModelViewProjMatrix(_camera);
                    break;
                case "MODELVIEWPROJECTIONINVERSE":
                    v.value = mesh.getModelViewProjMatrix(_camera).invert();
                    break;
                case "VIEW":
                    v.value = mesh.getViewMatrix(_camera);
                    break;
                case "VIEWINVERSE":
                    v.value = mesh.getViewMatrix(_camera).invert();
                    break;
                case "MODEL":
                    v.value = mesh.matrixWorld;
                    break;
                case "MODELINVERSETRANSPOSE":
                    let normalMatrix = new Matrix3();
                    normalMatrix.normalFromMat4(mesh.matrixWorld);
                    v.value = normalMatrix;
                    break;
                case "MODELINVERSE":
                    v.value = new Matrix4(mesh.matrixWorld).invert();
                    break;
                case "MODELVIEW":
                    v.value = mesh.getModelViewMatrix(v.node, _camera);
                    break;
                case "MODELVIEWINVERSE":
                    v.value = mesh.getModelViewMatrix(v.node, _camera).invert();
                    break;
                case "PROJECTION":
                    v.value = mesh.getProjectionMatrix(_camera);
                    break;
                case "PROJECTIONINVERSE":
                    v.value = new Matrix4(mesh.getProjectionMatrix(_camera)).invert();
                    break;
                case "MODELVIEWINVERSETRANSPOSE":
                    v.value = mesh.getNormalMatrix();
                    break;
                case "VIEWPORT":
                    v.value = new Float32Array([0, 0, this.canvas.width, this.canvas.height]);
                    break;
                case "JOINTMATRIX":
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

            let value;
            if (v.value !== undefined) {
                value = v.value;
            } else if (v.node !== undefined) {
                value = v.node;
            }

            if (value.elements) {
                gl[this.getMethod(v.type)](u, false, value.elements);
            } else if (matricies) {
                let concatArr = new Float32Array(matricies.length * 16);
                let i = 0;
                for (let m of matricies) {
                    concatArr.set(m.elements, i * 16);
                    i++;
                }

                gl[this.getMethod(v.type)](u, false, concatArr);
            } else {
                gl[this.getMethod(v.type)](u, ...value);
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
        
        let promiseArr = Object.values(this.textures).map(t => {
            return new Promise((resolve, reject) => {
                let image = new Image();
                image.onload = () => {
                    this.handleTextureLoaded(t, image);
                    resolve();
                }
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

export {RedCube};
