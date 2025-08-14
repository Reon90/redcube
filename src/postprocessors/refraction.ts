import { generateMipmaps } from '../utils';
import { PostProcessor } from './base';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}

export class Refraction extends PostProcessor {
    texture: Texture;

    setGL(g) {
        gl = g;
    }

    preProcessing(PP) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        PP.renderScene({ isprerefraction: true });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.activeTexture(gl[`TEXTURE${this.texture.index}`]);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    preProcessingWebGPU(PP) {
        PP.target = [
            {
                 // @ts-expect-error
                view: this.texture.view,
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear' as GPULoadOp,
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
            },
            ...(PP.pipeline.pass.colorAttachments.slice(1))
        ];
        PP.renderScene({ isprerefraction: true });

        const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(PP.width, PP.height))) - 2);
        // @ts-expect-error
        generateMipmaps(gl.device, this.texture.texture, PP.width, PP.height, mipLevelCount);
    }

    buildScreenBuffer(pp) {
        this.texture = pp.createDefaultTexture(1, true);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pp.preframebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'REFRACTION' };
    }
    buildScreenBufferWebGPU(pp) {
        this.texture = pp.createDefaultTexture('refractionTexture');
        return { name: 'REFRACTION' };
    }
    attachUniform() {}
    postProcessing() {}
    postProcessingWebGPU() {}
}
