import { PostProcessor } from './base';
import { createProgram, clearColor } from '../utils';

import quadShader from '../shaders/quad.glsl';
import blurShader from '../shaders/blur.glsl';
import bloomShader from '../shaders/bloom.glsl';

interface Texture extends WebGLTexture {
    index: number;
}

let gl;

export class Bloom extends PostProcessor {
    tempBlurTexture: Texture;
    blurTexture: Texture;
    blurTexture2: Texture;
    blurTexture3: Texture;
    blurTexture4: Texture;
    program: WebGLProgram;
    bloorProgram: WebGLProgram;
    hdrTexture: Texture;

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'bloom'), this.blurTexture.index);
    }

    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.useProgram(this.bloorProgram);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.hdrTexture, 0);
        gl.uniform1i(gl.getUniformLocation(this.bloorProgram, 'diff'), PP.screenTexture.index);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(this.program);

        gl.viewport(0, 0, this.width / 2, this.height / 2);
        this.renderBlur(this.hdrTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.tempBlurTexture = pp.createDefaultTexture(2);
        this.blurTexture = pp.createDefaultTexture(2);
        this.hdrTexture = pp.createByteTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.program = createProgram(quadShader, blurShader);
        this.bloorProgram = createProgram(quadShader, bloomShader);

        return { name: 'BLOOM' };
    }

    renderBlur(inTexture, program) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.clearColor(...clearColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), inTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 1, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.blurTexture, 0);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 0, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    preProcessing() {}
}
