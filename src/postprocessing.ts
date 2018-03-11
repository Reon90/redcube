import { Vector3 } from './matrix';
import { random, compileShader } from './utils';
import { Camera } from './objects';

import quadShader from './shaders/quad.glsl';
import blurShader from './shaders/blur.glsl';
import bloomShader from './shaders/bloom.glsl';
import ssaoShader from './shaders/ssao.glsl';
import ssaoBlurShader from './shaders/blurSsao.glsl';

let gl;
let screenTextureCount = 1;
const randSize = 4;

interface Texture extends WebGLTexture {
    index: number;
}

export class PostProcessing {
    screenTexture: Texture;
    tempBlurTexture: Texture;
    blurTexture: Texture;
    blurTexture2: Texture;
    blurTexture3: Texture;
    blurTexture4: Texture;
    normalTexture: Texture;
    depthTexture: Texture;
    positionTexture: Texture;
    ssaoBlurTexture: Texture;
    ssaoTexture: Texture;
    randMap: Texture;
    _camera: Camera;
    canvas: HTMLCanvasElement;
    framebuffer: WebGLFramebuffer;
    ssaobuffer: WebGLFramebuffer;
    screenQuadVBO: WebGLBuffer;
    rndTable: Float32Array;

    setCamera(camera) {
        this._camera = camera;
    }

    setGl(g) {
        gl = g;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    get width() {
        return this.canvas.offsetWidth;
    }

    get height() {
        return this.canvas.offsetHeight;
    }

    bindBuffer() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.positionTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
    }

    postProcessing() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

        const ssaoProgram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, ssaoProgram);
        compileShader(gl.FRAGMENT_SHADER, ssaoShader, ssaoProgram);
        gl.linkProgram(ssaoProgram);
        gl.useProgram(ssaoProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'posBuff'), this.positionTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'normBuff'), this.normalTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'depthBuff'), this.depthTexture.index);
        gl.uniform1i( gl.getUniformLocation(ssaoProgram, 'randMap'), this.randMap.index);
        gl.uniform2f( gl.getUniformLocation(ssaoProgram, 'scr'), this.width / randSize, this.height / randSize);
        gl.uniformMatrix4fv(gl.getUniformLocation(ssaoProgram, 'proj'), false, this._camera.projection.elements);
        gl.uniform3fv(gl.getUniformLocation(ssaoProgram, 'rndTable'), this.rndTable);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);

        const ssaoBlurProgram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, ssaoBlurProgram);
        compileShader(gl.FRAGMENT_SHADER, ssaoBlurShader, ssaoBlurProgram);
        gl.linkProgram(ssaoBlurProgram);
        gl.useProgram(ssaoBlurProgram);

        gl.uniform1i( gl.getUniformLocation(ssaoBlurProgram, 'ssaoInput'), this.ssaoTexture.index);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        const program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, program);
        compileShader(gl.FRAGMENT_SHADER, blurShader, program);
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
        compileShader(gl.VERTEX_SHADER, quadShader, program2);
        compileShader(gl.FRAGMENT_SHADER, bloomShader, program2);
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

    renderBlur(program, level, out, needMipmap?) {
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.screenTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 1.2 / this.width, 0);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), level);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        if (needMipmap) {
            gl.activeTexture(gl.TEXTURE2);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 0, 1.2 / this.height);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), 0.0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, out, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }

    createTexture(needMipmap?, type?) {
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${screenTextureCount}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        switch (type) {
        case 'depth':
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
            break;
        case 'red':
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.width, this.height, 0, gl.RED, gl.UNSIGNED_BYTE, null);
            break;
        default:
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, needMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
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
        //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

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
}
