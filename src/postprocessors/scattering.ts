import { createProgram } from '../utils';
import { PostProcessor } from './base';

import quadShader from '../shaders/quad.glsl';
import blurShader from '../shaders/scattering.glsl';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}

export class Scattering extends PostProcessor {
    output: Texture;
    program: WebGLProgram;

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'scattering'), this.output.index);
    }

    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.useProgram(this.program);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.output, 0);

        gl.uniform1i(gl.getUniformLocation(this.program, 'textureSampler'), PP.screenTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'depthSampler'), PP.depthTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'albedoSampler'), PP.albedoTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'irradianceSampler'), PP.irradianceTexture.index);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.output = pp.createByteTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.program = createProgram(quadShader, blurShader);

        return { name: 'SCATTERING' };
    }

    preProcessing() {}
}
