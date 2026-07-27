import { PostProcessor } from './base';
import type { PostProcessing } from '../postprocessing';

export class Shadow extends PostProcessor {
    gl!: WebGL2RenderingContext;

    setGL(g: WebGL2RenderingContext) {
        this.gl = g;
    }

    preProcessing(PP: PostProcessing) {
        const { gl } = this;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.enable(gl.RASTERIZER_DISCARD);

        PP.renderScene({ isprepender: true });

        //gl.disable(gl.RASTERIZER_DISCARD);
    }

    buildScreenBuffer() {
        return { name: 'SHADOW' };
    }
    attachUniform() {}
    postProcessing() {}
}
