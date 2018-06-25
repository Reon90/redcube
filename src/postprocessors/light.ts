import { PostProcessor } from './base';
import { compileShader } from '../utils';

import quadShader from '../shaders/quad.glsl';
import lightShader from '../shaders/light.glsl';

let gl;

export class Light extends PostProcessor {
    constructor() {
        super();

        this.scale = 2;
    }

    setGL(g) {
        gl = g;
    }

    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        gl.useProgram(this.program);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.viewport( 0, 0, this.width / 2, this.height / 2);
        gl.uniform1i( gl.getUniformLocation(this.program, 'lightTexture'), PP.screenTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.program, 'cameraTexture'), PP.depthTexture.index);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport( 0, 0, this.width, this.height);
    }

    buildScreenBuffer(PP) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.texture = PP.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, lightShader, this.program);
        gl.linkProgram(this.program);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return {name: 'LIGHT'};
    }

    attachUniform(program) {
        gl.uniform1i( gl.getUniformLocation(program, 'light'), this.texture.index);
    }

    preProcessing() {}
}
