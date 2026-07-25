import { PostProcessor } from './base';
import type { PostProcessing } from '../postprocessing';

let gl: WebGL2RenderingContext;

export class Shadow extends PostProcessor {
    setGL(g: WebGL2RenderingContext) {
        gl = g;
    }

    preProcessing(PP: PostProcessing) {
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
