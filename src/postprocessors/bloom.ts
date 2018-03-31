import { PostProcessor } from './base';
import { compileShader } from '../utils';

import quadShader from '../shaders/quad.glsl';
import blurShader from '../shaders/blur.glsl';

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

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i( gl.getUniformLocation(program, 'bloom'), this.blurTexture.index);
    }

    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.useProgram(this.program);

        this.renderBlur(PP.hdrTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.tempBlurTexture = pp.createDefaultTexture();
        this.blurTexture = pp.createDefaultTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, blurShader, this.program);
        gl.linkProgram(this.program);

        return {name: 'BLOOM'};
    }

    renderBlur(inTexture, program) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), inTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 1, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.blurTexture, 0);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 0, 1);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
}
