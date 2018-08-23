import { compileShader, getTextureIndex, calculateProjection } from './utils';
import { Matrix4, Vector3 } from './matrix';
import { Camera } from './objects';
import envTexture from './images/env.jpg';
import envShader from './shaders/env.glsl';
import envBlurShader from './shaders/env-frag.glsl';

let gl;

interface Buffer extends WebGLBuffer {
    itemSize: number;
    numItems: number;
}

interface Texture extends WebGLTexture {
    count: number;
    data: WebGLBuffer;
}

export class Env {
    _camera: Camera;
    envMatrix: Matrix4;
    VAO: WebGLBuffer;
    IndexBufferLength: number;
    program: WebGLProgram;
    level: WebGLUniformLocation;
    diffuse: WebGLUniformLocation;
    MVPMatrix: WebGLUniformLocation;
    texture: Texture;
    framebuffer: WebGLFramebuffer;
    views: Array<Matrix4>;
    map: Texture;

    constructor() {
        this.envMatrix = new Matrix4;
    }

    setCamera(camera) {
        this._camera = camera;
    }

    setGl(g) {
        gl = g;
    }

    createEnvironment() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO);
        gl.viewport(0, 0, 512, 512);

        const m = new Matrix4;
        const cam = Object.assign({}, this._camera.props, {
            perspective: {
                yfov: 0.6,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        gl.uniform1i(this.diffuse, this.texture.count);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'projection'), false, m.elements);

        for (let i = 0; i < 6; i++) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.map, 0);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'view'), false, this.views[i].elements);
            //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }

        //gl.bindVertexArray(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, 943, 943);

        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'projection'), false, m.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'view'), false,  this._camera.matrixWorldInvert.elements);
        gl.uniform1i(this.diffuse, this.map.count);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    createEnvironmentBuffer() {
        const captureRBO = gl.createRenderbuffer();
        const captureFBO = gl.createFramebuffer();
        this.framebuffer = captureFBO;

        gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);
        gl.bindRenderbuffer(gl.RENDERBUFFER, captureRBO);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, 512, 512);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, captureRBO);

        const count = getTextureIndex();
        const texture = gl.createTexture();
        texture.count = count;
        gl.activeTexture(gl[`TEXTURE${count}`]);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        for (let i = 0; i < 6; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, 512, 512, 0, gl.RGBA, gl.FLOAT, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, 0);
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.map = texture;

        const views = [
            [new Vector3([0, 0, 0]), 0],
            [new Vector3([0, 1, 0]), Math.PI / 2],
            [new Vector3([0, 1, 0]), Math.PI],
            [new Vector3([0, 1, 0]), Math.PI + Math.PI / 2],
            [new Vector3([1, 0, 0]), Math.PI / 2],
            [new Vector3([1, 0, 0]), Math.PI + Math.PI / 2]
        ];
        this.views = views.map(view => {
            const m = new Matrix4;
            m.makeRotationAxis(view[0], view[1]);
            //m.multiply(this.matrix);
            return new Matrix4().setInverseOf(m);
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        const verts = [         
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
    
            -1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,
    
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
    
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
    
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
    
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0
        ];
        // const latitudeBands = 10;
        // const longitudeBands = 10;
        // const radius = this._camera.modelSize * 10;

        // const vertexPositionData = [];
        // const normalData = [];
        // const textureCoordData = [];
        // for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        //     const theta = latNumber * Math.PI / latitudeBands;
        //     const sinTheta = Math.sin(theta);
        //     const cosTheta = Math.cos(theta);

        //     for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        //         const phi = longNumber * 2 * Math.PI / longitudeBands;
        //         const sinPhi = Math.sin(phi);
        //         const cosPhi = Math.cos(phi);

        //         const x = cosPhi * sinTheta;
        //         const y = cosTheta;
        //         const z = sinPhi * sinTheta;
        //         const u = 1 - (longNumber / longitudeBands);
        //         const v = 1 - (latNumber / latitudeBands);

        //         normalData.push(x);
        //         normalData.push(y);
        //         normalData.push(z);
        //         textureCoordData.push(u);
        //         textureCoordData.push(v);
        //         vertexPositionData.push(radius * x);
        //         vertexPositionData.push(radius * y);
        //         vertexPositionData.push(radius * z);
        //     }
        // }


        // const indexData = [];
        // for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
        //     for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
        //         const first = (latNumber * (longitudeBands + 1)) + longNumber;
        //         const second = first + longitudeBands + 1;
        //         indexData.push(first);
        //         indexData.push(second);
        //         indexData.push(first + 1);

        //         indexData.push(second);
        //         indexData.push(second + 1);
        //         indexData.push(first + 1);
        //     }
        // }

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        }
        // {
        //     const VBO = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
        //     gl.enableVertexAttribArray(1);
        //     gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        // }
        // {
        //     const VBO = gl.createBuffer();
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
        //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        //     this.IndexBufferLength = indexData.length;
        // }
        gl.bindVertexArray(null);

        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, envShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, envBlurShader, this.program);
        gl.linkProgram(this.program);

        this.level = gl.getUniformLocation(this.program, 'level');
        this.diffuse = gl.getUniformLocation(this.program, 'diffuse');
        this.MVPMatrix = gl.getUniformLocation(this.program, 'MVPMatrix');

        return fetch(`../hdr.bin`).then(res => res.arrayBuffer()).then(buffer => {
            const data = new Float32Array(buffer);

            const index = getTextureIndex();
            this.texture = {
                data: gl.createTexture(),
                count: index
            };
            gl.activeTexture(gl[`TEXTURE${this.texture.count}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.texture.data);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 512, 256, 0, gl.RGBA, gl.FLOAT, data);

            return true;
        });

        // return new Promise((resolve, reject) => {
        //     const index = getTextureIndex();
        //     this.texture = {
        //         data: gl.createTexture(),
        //         count: index
        //     };
        //     const img = new Image;
        //     img.crossOrigin = 'anonymous';
        //     img.onload = () => {
        //         gl.activeTexture(gl[`TEXTURE${this.texture.count}`]);
        //         gl.bindTexture(gl.TEXTURE_2D, this.texture.data);
        //         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //         gl.generateMipmap(gl.TEXTURE_2D);
        //         resolve();
        //     };
        //     img.onerror = err => {
        //         reject(err);
        //     };
        //     img.src = envTexture;
        // });
    }
}
