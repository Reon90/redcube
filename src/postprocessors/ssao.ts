import { Vector3, Matrix4 } from '../matrix';
import { PostProcessor } from './base';
import { random, createProgram, lerp, clearColor } from '../utils';

import quadShader from '../shaders/quad.glsl';
import ssaoShader from '../shaders/ssao.glsl';
import ssaoBlurShader from '../shaders/blur.glsl';

let gl;
const noiceSize = 4;
const kernelSize = 32;

interface Texture extends WebGLTexture {
    index: number;
}

export class SSAO extends PostProcessor {
    ssaoBlurTexture: Texture;
    ssaoTexture: Texture;
    noice: Texture;
    kernels: Float32Array;
    ssaoProgram: WebGLProgram;
    ssaoBlurProgram: WebGLProgram;
    scale: number;

    constructor() {
        super();

        this.scale = 2;
    }

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i( gl.getUniformLocation(program, 'ssao'), this.ssaoTexture.index);
    }

    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        gl.clearColor(...clearColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.ssaoProgram);
        const cameraProps = this.camera.props.perspective || this.camera.props.orthographic;
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'normBuff'), PP.normalTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'depthBuff'), PP.depthTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'noice'), this.noice.index);
        gl.uniform2f( gl.getUniformLocation(this.ssaoProgram, 'noiseScale'), this.width / this.scale / noiceSize, this.height / this.scale / noiceSize);
        gl.uniform1f( gl.getUniformLocation(this.ssaoProgram, 'zFar'), cameraProps.zfar);
        gl.uniform1f( gl.getUniformLocation(this.ssaoProgram, 'zNear'), cameraProps.znear);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'proj'), false, this.camera.projection.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'view'), false, this.camera.matrixWorldInvert.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'projI'), false, new Matrix4().setInverseOf(this.camera.projection).elements);
        gl.uniform3fv(gl.getUniformLocation(this.ssaoProgram, 'kernels'), this.kernels);

        gl.viewport( 0, 0, this.width / this.scale, this.height / this.scale);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.ssaoBlurProgram);

        gl.uniform1i( gl.getUniformLocation(this.ssaoBlurProgram, 'uTexture'), this.ssaoTexture.index);
        gl.uniform2f(gl.getUniformLocation(this.ssaoBlurProgram, 'denom'), 1, 0);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);
        gl.uniform1i( gl.getUniformLocation(this.ssaoBlurProgram, 'uTexture'), this.ssaoBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(this.ssaoBlurProgram, 'denom'), 0, 1);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.ssaoTexture = pp.createOneChannelTexture(this.scale);
        this.ssaoBlurTexture = pp.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        this.ssaoProgram = createProgram(quadShader, ssaoShader);
        this.ssaoBlurProgram = createProgram(quadShader, ssaoBlurShader);

        this.buildNoice(pp);
        this.buildKernels();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return {name: 'SSAO'};
    }

    buildNoice(pp) {
        const noice = new Float32Array(noiceSize * noiceSize * 3);
        for (let i = 0; i < noiceSize * noiceSize; i++) {
            const v = new Vector3([random(0, 1) * 2.0 - 1.0, random(0, 1) * 2.0 - 1.0, 0.1]); // Z is 0.1 because surface is not flat
            /* eslint-disable */
            noice[i * 3] = v.elements[0];
            noice[i * 3 + 1] = v.elements[1];
            noice[i * 3 + 2] = v.elements[2];
            /* eslint-enable */
        }
        this.noice = pp.createNoiceTexture(noiceSize, noice);
    }

    buildKernels() {
        const kernels = new Array(kernelSize);
        for (let i = 0; i < kernels.length; i++) {
            kernels[i] = new Vector3([random(0, 1) * 2 - 1, random(0, 1) * 2 - 1, random(0, 1)]);
            kernels[i].normalize();
            kernels[i].scale(random(0, 1));
            let scale = i / kernels.length;
            scale = lerp(0.1, 1.0, scale * scale);
            kernels[i].scale(scale);
        }
        this.kernels = new Float32Array(kernels.length * 3);
        let j = 0;
        for (const m of kernels) {
            this.kernels.set(m.elements, j * 3);
            j++;
        }
    }

    preProcessing() {}
}
