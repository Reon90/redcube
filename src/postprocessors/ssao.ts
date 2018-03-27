import { Vector3 } from '../matrix';
import { PostProcessor } from './base';
import { random, compileShader, lerp } from '../utils';

import quadShader from '../shaders/quad.glsl';
import ssaoShader from '../shaders/ssao.glsl';
import ssaoBlurShader from '../shaders/blurSsao.glsl';

let gl;
const noiceSize = 4;
const kernelSize = 64;

interface Texture extends WebGLTexture {
    index: number;
}

export class SSAO extends PostProcessor {
    ssaoBlurTexture: Texture;
    ssaoTexture: Texture;
    noice: Texture;
    ssaobuffer: WebGLFramebuffer;
    kernels: Float32Array;
    ssaoProgram: WebGLProgram;
    ssaoBlurProgram: WebGLProgram;

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i( gl.getUniformLocation(program, 'ssao'), this.ssaoBlurTexture.index);
    }

    postProcessing(screenTexture, positionTexture, normalTexture, depthTexture) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

        gl.useProgram(this.ssaoProgram);
        const cameraProps = this.camera.props.perspective || this.camera.props.orthographic;
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'posBuff'), positionTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'normBuff'), normalTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'depthBuff'), depthTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.ssaoProgram, 'noice'), this.noice.index);
        gl.uniform2f( gl.getUniformLocation(this.ssaoProgram, 'noiseScale'), this.width / noiceSize, this.height / noiceSize);
        gl.uniform1f( gl.getUniformLocation(this.ssaoProgram, 'zFar'), cameraProps.zfar);
        gl.uniform1f( gl.getUniformLocation(this.ssaoProgram, 'zNear'), cameraProps.znear);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'proj'), false, this.camera.projection.elements);
        gl.uniform3fv(gl.getUniformLocation(this.ssaoProgram, 'kernels'), this.kernels);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);

        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

        gl.useProgram(this.ssaoBlurProgram);

        gl.uniform1i( gl.getUniformLocation(this.ssaoBlurProgram, 'ssaoInput'), this.ssaoTexture.index);

        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }

    buildScreenBuffer(pp) {
        this.ssaobuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
        this.ssaoTexture = pp.createOneChannelTexture();
        this.ssaoBlurTexture = pp.createOneChannelTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

        this.ssaoProgram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, this.ssaoProgram);
        compileShader(gl.FRAGMENT_SHADER, ssaoShader, this.ssaoProgram);
        gl.linkProgram(this.ssaoProgram);

        this.ssaoBlurProgram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quadShader, this.ssaoBlurProgram);
        compileShader(gl.FRAGMENT_SHADER, ssaoBlurShader, this.ssaoBlurProgram);
        gl.linkProgram(this.ssaoBlurProgram);

        this.buildNoice(pp);
        this.buildKernels();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return {name: 'SSAO'};
    }

    buildNoice(pp) {
        const noice = new Float32Array(noiceSize * noiceSize * 3);
        for (let i = 0; i < noiceSize * noiceSize; i++) {
            const v = new Vector3([random(0, 1) * 2.0 - 1.0, random(0, 1) * 2.0 - 1.0, 0.1]); // Z is 0.1 because surface is not flat
            noice[i * 3] = v.elements[0];
            noice[i * 3 + 1] = v.elements[1];
            noice[i * 3 + 2] = v.elements[2];
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
}
