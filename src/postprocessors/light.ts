import { PostProcessor } from './base';
import { createProgram } from '../utils';

import lightShader from '../shaders/light.glsl';
import lightVertShader from '../shaders/light-vert.glsl';
import { Matrix4 } from '../matrix';
import { calculateProjection } from './../utils';
import { quadVertex } from '../vertex';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}

export class Light extends PostProcessor {
    texture: Texture;
    program: WebGLProgram;
    scale: number;
    quadVAO: WebGLVertexArrayObjectOES;

    constructor() {
        super();

        this.scale = 2;
    }

    setGL(g) {
        gl = g;
    }

    preProcessing(PP) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        PP.renderScene(true, true);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.useProgram(this.program);
        gl.viewport(0, 0, this.width / this.scale, this.height / this.scale);
        gl.bindVertexArray(this.quadVAO);

        const cam = Object.assign({}, this.camera.props, { zoom: 1 });
        const proj = calculateProjection(cam);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Iproj'), false, new Matrix4().setInverseOf(proj).elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'proj'), false, proj.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Iview'), false, this.camera.matrixWorld.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'view'), false, this.camera.matrixWorldInvert.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'light'), false, this.light.matrixWorldInvert.elements);
        gl.uniform1i(gl.getUniformLocation(this.program, 'lightTexture'), PP.preDepthTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'cameraTexture'), PP.depthTexture.index);
        gl.uniform3fv(gl.getUniformLocation(this.program, 'viewPos'), this.camera.getPosition());
        gl.uniform3fv(gl.getUniformLocation(this.program, 'lightPos'), this.light.getPosition());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
    }

    buildScreenBuffer(PP) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.texture = PP.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        this.program = createProgram(lightVertShader, lightShader);

        this.quadVAO = gl.createVertexArray();
        gl.bindVertexArray(this.quadVAO);
        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertex), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'LIGHT' };
    }

    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'light'), this.texture.index);
    }

    postProcessing() {}
}
