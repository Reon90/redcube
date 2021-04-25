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

    buildScreenBuffer(pp) {
        this.texture = pp.createDefaultTexture();
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pp.preframebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'REFRACTION' };
    }
    attachUniform() {}
    postProcessing() {}
}
