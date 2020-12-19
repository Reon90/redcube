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
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        PP.renderScene({isprerefraction: true});
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.texture = pp.createDefaultTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'REFRACTION' };
    }
    attachUniform() {}
    postProcessing() {}
}
