import { createProgram } from '../utils';
import { PostProcessor } from './base';

import quadShader from '../shaders/quad.glsl';
import quadShader2 from '../shaders/quad.webgpu.glsl';
import blurShader from '../shaders/scattering.glsl';
import blurShader2 from '../shaders/scattering.webgpu.glsl';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}

export class Scattering extends PostProcessor {
    output: Texture;
    program: WebGLProgram;
    pipeline: GPUPipelineBase;
    bindGroup: GPUBindGroup;

    setGL(g) {
        gl = g;
    }

    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'scattering'), this.output.index);
    }

    attachUniformWebGPU() {
        return {
            binding: 8,
            // @ts-expect-error
            resource: this.output.view
        };
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

    postProcessingWebGPU(PP) {
        const { device } = gl;
        const commandEncoder = device.createCommandEncoder();
        const shadowPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                // @ts-expect-error
               view: this.output.view,
               storeOp: 'store' as GPUStoreOp,
               loadOp: 'clear' as GPULoadOp,
               clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
           }]
        });
        shadowPass.setPipeline(this.pipeline);
        shadowPass.setVertexBuffer(0, PP.vertexBuffer);
        shadowPass.setBindGroup(
            0,
            this.bindGroup
        );
        shadowPass.draw(6);

        shadowPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.output = pp.createByteTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.program = createProgram(quadShader, blurShader);

        return { name: 'SCATTERING' };
    }

    buildScreenBufferWebGPU(pp) {
        const entries = [
            {
                binding: 4,
                resource: pp.depthTexture.sampler
            },
            {
                binding: 5,
                resource: pp.screenTexture.sampler
            },
            {
                binding: 0,
                resource: pp.screenTexture.view
            },
            {
                binding: 1,
                resource: pp.depthTexture.view
            },
            {
                binding: 2,
                resource: pp.albedoTexture.view
            },
            {
                binding: 3,
                resource: pp.irradianceTexture.view
            }
        ];
        this.pipeline = pp.buildPipeline(
            gl,
            quadShader2,
            blurShader2,
            2,
            [
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'non-filtering',
                    }
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float'
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ],
            false,
            'scaterring'
        );
        this.bindGroup = gl.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries
        });
        this.output = pp.createDefaultTexture();
        return { name: 'SCATTERING' };
    }

    preProcessing() {}
    preProcessingWebGPU() {}
}
