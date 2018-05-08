import { compileShader, getTextureIndex, calculateProjection } from './utils';
import { Matrix4 } from './matrix';
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
        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO);

        const m = new Matrix4;
        const cam = Object.assign({}, this._camera.props, {
            perspective: {
                yfov: 0.6,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));
        m.multiply(this._camera.matrixWorldInvert);
        m.multiply(this.envMatrix);
        gl.uniform1f(this.level, 3);
        gl.uniform1i(this.diffuse, this.texture.count);
        gl.uniformMatrix4fv(this.MVPMatrix, false, m.elements);

        gl.drawElements(gl.TRIANGLES, this.IndexBufferLength, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    createEnvironmentBuffer() {

        const latitudeBands = 10;
        const longitudeBands = 10;
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

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        }
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        }
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            this.IndexBufferLength = indexData.length;
        }
        gl.bindVertexArray(null);

        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, envShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, envBlurShader, this.program);
        gl.linkProgram(this.program);

        this.level = gl.getUniformLocation(this.program, 'level');
        this.diffuse = gl.getUniformLocation(this.program, 'diffuse');
        this.MVPMatrix = gl.getUniformLocation(this.program, 'MVPMatrix');

        return new Promise((resolve, reject) => {
            const index = getTextureIndex();
            this.texture = {
                data: gl.createTexture(),
                count: index
            };
            const img = new Image;
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                gl.activeTexture(gl[`TEXTURE${this.texture.count}`]);
                gl.bindTexture(gl.TEXTURE_2D, this.texture.data);
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
}
