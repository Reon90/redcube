import { generateMipmaps, GLTexture } from '../utils';
import { PostProcessor } from './base';
import type { PostProcessing as PostProcessingWebGL } from '../postprocessing';
import type { PostProcessing as PostProcessingWebGPU } from '../postprocessing.webgpu';

type Texture = GLTexture;
type GPUTextureSet = { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView };

export class Refraction extends PostProcessor {
    gl!: WebGL2RenderingContext & { device?: GPUDevice };
    texture!: Texture | GPUTextureSet;

    setGL(g: WebGL2RenderingContext & { device?: GPUDevice }) {
        this.gl = g;
    }

    preProcessing(PP: PostProcessingWebGL) {
        const { gl } = this;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        PP.renderScene({ isprerefraction: true });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        const glTexture = this.texture as Texture;
        gl.activeTexture((gl as unknown as Record<string, number>)[`TEXTURE${glTexture.index}`]);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    preProcessingWebGPU(PP: PostProcessingWebGPU) {
        const { gl } = this;
        const gpuTexture = this.texture as GPUTextureSet;
        PP.target = [
            {
                view: gpuTexture.view,
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear' as GPULoadOp,
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
            },
            ...PP.pipeline.pass!.colorAttachments.slice(1),
        ] as GPURenderPassColorAttachment[];
        PP.renderScene({ isprerefraction: true });

        const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(PP.width, PP.height))) - 2);
        generateMipmaps(gl.device!, gpuTexture.texture, PP.width, PP.height, mipLevelCount);
    }

    buildScreenBuffer(pp: PostProcessingWebGL) {
        const { gl } = this;
        this.texture = pp.createDefaultTexture(1, true);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pp.preframebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'REFRACTION' };
    }
    buildScreenBufferWebGPU(pp: PostProcessingWebGPU) {
        this.texture = pp.createDefaultTexture('refractionTexture');
        return { name: 'REFRACTION' };
    }
    attachUniform() {}
    postProcessing() {}
    postProcessingWebGPU() {}
}
