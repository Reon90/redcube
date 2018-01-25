import { Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera } from './objects';
import { Matrix3, Matrix4, Vector3, Vector4, Frustum } from './matrix';
import { Events } from './events';
import { setGl, isMatrix, getMatrixType, getDataType, getComponentType, getMethod, getAnimationComponent, getAnimationMethod, interpolation, buildArray, random } from './utils';

import envTexture from './images/env.jpg';
import quadShader from './shaders/quad.glsl';
import blurShader from './shaders/blur.glsl';
import bloomShader from './shaders/bloom.glsl';
import envShader from './shaders/env.glsl';
import envBlurShader from './shaders/blurEnv.glsl';
import ssaoShader from './shaders/ssao.glsl';
import ssaoBlurShader from './shaders/blurSsao.glsl';

let screenTextureCount = 1;
let sceneTextureCount = 13;
let gl;
const randSize = 4;

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

        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;
    }

    init() {
        return this.getJson()
            .then(this.glInit.bind(this))
            .then(this.buildScreenBuffer.bind(this))
            .then(this.getBuffer.bind(this))
            .then(this.buildMesh.bind(this))
            .then(this.initTextures.bind(this))
            .then(this.buildAnimation.bind(this))
            .then(this.buildSkin.bind(this))
            .then(this.createEnvironmentBuffer.bind(this))
            .then(this.draw.bind(this))
            .catch(console.error);
    }

    setColor(color) {
        this.color = color;
    }

    createEnvironment() {
        const program = gl.createProgram();
        this.compileShader(gl.VERTEX_SHADER, envShader, program);
        this.compileShader(gl.FRAGMENT_SHADER, envBlurShader, program);
        gl.linkProgram(program);
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexPositionBuffer);
        gl.vertexAttribPointer(0, this.envVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexTextureCoordBuffer);
        gl.vertexAttribPointer(1, this.envVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.envVertexIndexBuffer);

        const m = new Matrix4();
        m.multiply(this._camera.projection);
        m.multiply(this._camera.matrixWorldInvert);
        m.multiply(this.envMatrix);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMVPMatrix'), false, m.elements);

        gl.drawElements(gl.TRIANGLES, this.envVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    createEnvironmentBuffer() {
        const latitudeBands = 30;
        const longitudeBands = 30;
        const radius = this._camera.modelSize * 10;

        const vertexPositionData = [];
        const normalData = [];
        const textureCoordData = [];
        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            const theta = latNumber * Math.PI / latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                const phi = longNumber * 2 * Math.PI / longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;
                const u = 1 - (longNumber / longitudeBands);
                const v = 1 - (latNumber / latitudeBands);

                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
                textureCoordData.push(u);
                textureCoordData.push(v);
                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);
            }
        }

        const indexData = [];
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const first = (latNumber * (longitudeBands + 1)) + longNumber;
                const second = first + longitudeBands + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }

        const vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
        vertexTextureCoordBuffer.itemSize = 2;
        vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

        const vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = vertexPositionData.length / 3;

        const vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        vertexIndexBuffer.itemSize = 1;
        vertexIndexBuffer.numItems = indexData.length;

        this.envMatrix = new Matrix4;
        this.envVertexIndexBuffer = vertexIndexBuffer;
        this.envVertexPositionBuffer = vertexPositionBuffer;
        this.envVertexTextureCoordBuffer = vertexTextureCoordBuffer;

        return new Promise((resolve, reject) => {
            const texture = gl.createTexture();
            const img = new Image;
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                resolve();
            };
            img.onerror = err => {
                reject(err);
            };
            img.src = envTexture;
        });
    }

    postProcessing() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

        const ssaoProgram = gl.createProgram();
        this.compileShader(gl.VERTEX_SHADER, quadShader, ssaoProgram);
        this.compileShader(gl.FRAGMENT_SHADER, ssaoShader, ssaoProgram);
        gl.linkProgram(ssaoProgram);
        gl.useProgram(ssaoProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'posBuff'), this.positionTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'normBuff'), this.normalTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'depthBuff'), this.depthTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'randMap'), this.randMap.index);
        gl.uniform2f( gl.getUniformLocation(ssaoProgram, 'scr'), this.canvas.offsetWidth / randSize, this.canvas.offsetHeight / randSize);
        gl.uniformMatrix4fv(gl.getUniformLocation(ssaoProgram, 'proj'), false, this._camera.projection.elements);
        gl.uniform3fv(gl.getUniformLocation(ssaoProgram, 'rndTable'), this.rndTable);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);

        const ssaoBlurProgram = gl.createProgram();
        this.compileShader(gl.VERTEX_SHADER, quadShader, ssaoBlurProgram);
        this.compileShader(gl.FRAGMENT_SHADER, ssaoBlurShader, ssaoBlurProgram);
        gl.linkProgram(ssaoBlurProgram);
        gl.useProgram(ssaoBlurProgram);

        gl.uniform1i( gl.getUniformLocation(ssaoBlurProgram, 'ssaoInput'), this.ssaoTexture.index);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        const program = gl.createProgram();
        this.compileShader(gl.VERTEX_SHADER, quadShader, program);
        this.compileShader(gl.FRAGMENT_SHADER, blurShader, program);
        gl.linkProgram(program);
        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE1);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.renderBlur(program, 0.0, this.blurTexture, true);
        this.renderBlur(program, 1.0, this.blurTexture2);
        this.renderBlur(program, 2.0, this.blurTexture3);
        this.renderBlur(program, 3.0, this.blurTexture4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        const program2 = gl.createProgram();
        this.compileShader(gl.VERTEX_SHADER, quadShader, program2);
        this.compileShader(gl.FRAGMENT_SHADER, bloomShader, program2);
        gl.linkProgram(program2);
        gl.useProgram(program2);

        gl.uniform1i( gl.getUniformLocation(program2, 'uOriginal'), this.screenTexture.index);
        gl.uniform1i( gl.getUniformLocation(program2, 'ssao'), this.ssaoBlurTexture.index);
        gl.uniform1i( gl.getUniformLocation(program2, 'uTexture1'), this.blurTexture.index);
        gl.uniform1i( gl.getUniformLocation(program2, 'uTexture2'), this.blurTexture2.index);
        gl.uniform1i( gl.getUniformLocation(program2, 'uTexture3'), this.blurTexture3.index);
        gl.uniform1i( gl.getUniformLocation(program2, 'uTexture4'), this.blurTexture4.index);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }

    renderBlur(program, level, out, needMipmap) {
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.screenTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 1.2 / this.canvas.offsetWidth, 0);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), level);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        if (needMipmap) {
            gl.activeTexture(gl.TEXTURE2);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 0, 1.2 / this.canvas.offsetHeight);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), 0.0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, out, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }

    compileShader(type, shaderSource, program) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
        const log = gl.getShaderInfoLog(shader);
        if (log) {
            console.error(log);
        }
    }

    createTexture(needMipmap, type) {
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${screenTextureCount}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        switch (type) {
        case 'depth':
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.canvas.offsetWidth, this.canvas.offsetHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
            break;
        case 'red':
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.canvas.offsetWidth, this.canvas.offsetHeight, 0, gl.RED, gl.UNSIGNED_BYTE, null);
            break;
        default:
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, needMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.canvas.offsetWidth, this.canvas.offsetHeight, 0, gl.RGBA, gl.FLOAT, null);
            break;
        }
        texture.index = screenTextureCount;
        screenTextureCount++;
        return texture;
    }

    buildRandomTexture() {
        const rnd = new Uint8Array(randSize * randSize * 3);
        for (let i = 0; i < randSize * randSize; i++) {
            const v = new Vector3([random(-1, 1), random(-1, 1), 0]);
            v.normalize();
            v.scale(0.5);
            v.addS(0.5);
            rnd[i * 3] = v.elements[0] * 255;
            rnd[i * 3 + 1] = v.elements[1] * 255;
            rnd[i * 3 + 2] = v.elements[2] * 255;
        }
        this.randMap = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${screenTextureCount}`]);
        gl.bindTexture(gl.TEXTURE_2D, this.randMap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, randSize, randSize, 0, gl.RGB, gl.UNSIGNED_BYTE, rnd);
        this.randMap.index = screenTextureCount;
        screenTextureCount++;
    }

    buildRandomKernels() {
        const rndTable = [];
        const kernels = 64;
        for (let i = 0; i < kernels; i++) {
            rndTable[i] = new Vector3([random(-1, 1), random(-1, 1), random(-1, 0)]);
            rndTable[i].normalize();
            rndTable[i].scale((i + 1) / kernels);
        }
        this.rndTable = new Float32Array(rndTable.length * 3);
        let j = 0;
        for (const m of rndTable) {
            this.rndTable.set(m.elements, j * 3);
            j++;
        }
    }

    buildScreenBuffer() {
        const verts = [
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ];
        this.screenQuadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.getExtension('EXT_color_buffer_float');
        gl.getExtension('OES_texture_float_linear');

        this.screenTexture = this.createTexture(true);
        this.tempBlurTexture = this.createTexture(true);
        this.blurTexture = this.createTexture();
        this.blurTexture2 = this.createTexture();
        this.blurTexture3 = this.createTexture();
        this.blurTexture4 = this.createTexture();
        this.normalTexture = this.createTexture();
        this.depthTexture = this.createTexture(false, 'depth');
        this.positionTexture = this.createTexture();

        //const renderbuffer = gl.createRenderbuffer();
        //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.offsetWidth, this.canvas.offsetHeight);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.positionTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
        //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        this.ssaobuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
        this.ssaoTexture = this.createTexture(false, 'red');
        this.ssaoBlurTexture = this.createTexture(false, 'red');
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        this.buildRandomTexture();

        this.buildRandomKernels();

        return true;
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.zoom = coordsStart;
            this._camera.setProjection(this.buildCamera(this._camera.props).elements);
        }
        if (type === 'rotate') {
            const p0 = new Vector3(this.sceneToArcBall(this.canvasToWorld(...coordsStart)));
            const p1 = new Vector3(this.sceneToArcBall(this.canvasToWorld(...coordsMove)));
            const angle = Vector3.angle(p0, p1) * 2;
            if (angle < 1e-6 || isNaN(angle)) {
                return;
            }

            const v = Vector3.cross(p0, p1).normalize();
            const sin = Math.sin(angle / 2);
            const q = new Vector4([v.elements[0] * -sin, v.elements[1] * -sin, v.elements[2] * -sin, Math.cos(angle / 2)]);

            const m = new Matrix4();
            m.makeRotationFromQuaternion(q.elements);

            this.scene.matrixWorld.multiply(m);
            this.envMatrix.multiply(m);
        }
        if (type === 'pan') {
            const p0 = new Vector3(this.canvasToWorld(...coordsStart).elements);
            const p1 = new Vector3(this.canvasToWorld(...coordsMove).elements);
            const pan = this._camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);

            this.scene.matrixWorld.translate(-delta.elements[0], -delta.elements[1], 0);
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
        mp.elements[0] = (2 * x / this.canvas.width - 1) * mp.elements[3];
        mp.elements[1] = (-2 * y / this.canvas.height + 1) * mp.elements[3];

        return m.invert().multiplyVector4(mp);
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
            const z = this._camera.modelSize / (this.canvas.offsetWidth / 100) * 30;
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
        gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.gl = gl;

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
                    const log = gl.getShaderInfoLog(shader);
                    if (log) {
                        console.error(log);
                    }

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

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.positionTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            this.createEnvironment();

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

            this.postProcessing();
        }

        this.fps++;
        this.elapsedTime += (time - this.lastTime);
        this.lastTime = time;
        if (this.elapsedTime >= 1000) {
            this.counterEl.innerHTML = this.fps;
            this.fps = 0;
            this.elapsedTime -= 1000;
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

        for (const k in mesh.material.uniforms) {
            const v = mesh.material.uniforms[k];
            let matricies, value;
            
            if (v.type === gl.SAMPLER_2D) {
                value = [this.textures[v.value[0]].count];
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

            if (v.type !== gl.SAMPLER_2D) {
                value = v.value || v.node;
            }

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

export { RedCube };
