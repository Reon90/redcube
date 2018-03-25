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
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture1'), this.blurTexture.index);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture2'), this.blurTexture2.index);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture3'), this.blurTexture3.index);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture4'), this.blurTexture4.index);
    }

    postProcessing(screenTexture) {
        gl.useProgram(this.program);

        gl.activeTexture(gl[`TEXTURE${screenTexture.index}`]);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.renderBlur(screenTexture, this.program, 0.0, this.blurTexture, true);
        this.renderBlur(screenTexture, this.program, 1.0, this.blurTexture2);
        this.renderBlur(screenTexture, this.program, 2.0, this.blurTexture3);
        this.renderBlur(screenTexture, this.program, 3.0, this.blurTexture4);
    }

    buildScreenBuffer(pp) {
        this.tempBlurTexture = pp.createMipmapTexture();
        this.blurTexture = pp.createDefaultTexture();
        this.blurTexture2 = pp.createDefaultTexture();
        this.blurTexture3 = pp.createDefaultTexture();
        this.blurTexture4 = pp.createDefaultTexture();

        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, blurShader, this.program);
        gl.linkProgram(this.program);

        return {name: 'BLOOM'};
    }

    renderBlur(screenTexture, program, level, out, needMipmap?) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), screenTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 1.2 / this.width, 0);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), level);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        if (needMipmap) {
            gl.activeTexture(gl[`TEXTURE${this.tempBlurTexture.index}`]);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, out, 0);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);
        gl.uniform1i( gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'offset'), 0, 1.2 / this.height);
        gl.uniform1f(gl.getUniformLocation(program, 'level'), 0.0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
}
