import { Matrix4 } from './matrix';
import { perlin3 } from './perlin';
import { createTexture, compileShader, createProgram } from './utils';
import { Camera } from './objects/index';

import instanceShader from './shaders/instance.glsl';
import instanceFragShader from './shaders/instance-frag.glsl';
import instanceFragShader2 from './shaders/empty-frag.glsl';
import instanceTransShader from './shaders/instance-trans.glsl';

interface Texture extends WebGLTexture {
    index: number;
}

let gl;
const amount = 1000;

export class Particles {
    currentSourceIdx: number;
    program: WebGLProgram;
    program2: WebGLProgram;
    VAO: Array<WebGLVertexArrayObjectOES>;
    TFO: Array<WebGLVertexArrayObjectOES>;
    texture3d: Texture;
    camera: Camera;
    getLight: Function;

    constructor(getLight) {
        this.getLight = getLight;
    }

    setGl(g) {
        gl = g;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    build() {
        this.currentSourceIdx = 0;
        const program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, instanceTransShader, program);
        compileShader(gl.FRAGMENT_SHADER, instanceFragShader2, program);

        const varyings = ['v_position', 'v_velocity', 'v_spawntime', 'v_lifetime'];
        gl.transformFeedbackVaryings(program, varyings, gl.SEPARATE_ATTRIBS);

        gl.linkProgram(program);
        this.program = program;

        const program2 = createProgram(instanceShader, instanceFragShader);
        this.program2 = program2;

        const VAO = [gl.createVertexArray(), gl.createVertexArray()];
        const TFO = [gl.createTransformFeedback(), gl.createTransformFeedback()];
        this.VAO = VAO;
        this.TFO = TFO;

        for (const b of [0,1]) {
            gl.bindVertexArray(VAO[b]);
            const VBOs = [];

            {
                const vertexPositionData = new Float32Array(amount * 3);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 3] = 0;
                    vertexPositionData[i * 3 + 1] = 0;
                    vertexPositionData[i * 3 + 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(0);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(0, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 3);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 3] = 0;
                    vertexPositionData[i * 3 + 1] = 0;
                    vertexPositionData[i * 3 + 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(1);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(1, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 1);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(2);
                gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(2, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 1);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(3);
                gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(3, 1);
                VBOs.push(VBO);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, TFO[b]);
            let index = 0;
            for (const v of VBOs) {
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, index, v);
                index++;
            }
        }

        const SIZE = 128;
        const denom = SIZE / 16;
        const data = new Uint8Array(SIZE * SIZE * SIZE);
        for (var k = 0; k < SIZE; ++k) {
            for (var j = 0; j < SIZE; ++j) {
                for (var i = 0; i < SIZE; ++i) {
                    var value = perlin3(i / denom, j / denom, k / denom);
                    value = (1 + value) * 128;
                    data[i + j * SIZE + k * SIZE * SIZE] = value;
                }
            }
        }

        this.texture3d = createTexture(gl.TEXTURE_3D);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(SIZE));
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage3D(
            gl.TEXTURE_3D,  // target
            0,              // level
            gl.R8,        // internalformat
            SIZE,           // width
            SIZE,           // height
            SIZE,           // depth
            0,              // border
            gl.RED,         // format
            gl.UNSIGNED_BYTE,       // type
            data            // pixel
            );
        gl.generateMipmap(gl.TEXTURE_3D);
    }

    draw(time) {
        const destinationIdx = (this.currentSourceIdx + 1) % 2;
        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO[this.currentSourceIdx]);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.TFO[destinationIdx]);

        const m = new Matrix4;
        m.multiply(this.camera.projection);
        m.multiply(this.camera.matrixWorldInvert);
        gl.uniform1f(gl.getUniformLocation(this.program, 'u_time'), time + 5000);
        gl.uniform1f(gl.getUniformLocation(this.program, 'count'), amount);
        gl.uniform1i(gl.getUniformLocation(this.program, 'noize'), this.texture3d.index);

        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArraysInstanced(gl.POINTS, 0, 1, amount);
        gl.endTransformFeedback();
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
        const sync = gl.fenceSync( gl.SYNC_GPU_COMMANDS_COMPLETE, 0 );

        gl.waitSync( sync, 0, gl.TIMEOUT_IGNORED );
        gl.deleteSync( sync );

        gl.useProgram(this.program2);
        gl.bindVertexArray(this.VAO[destinationIdx]);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, 'MVPMatrix'), false, m.elements);
        gl.uniform1i( gl.getUniformLocation(this.program2, 'light'), this.getLight());
        gl.drawArraysInstanced(gl.POINTS, 0, 1, amount);

        this.currentSourceIdx = (this.currentSourceIdx + 1) % 2;
    }
}
