import { PostProcessor } from './base';

let gl;

export class Shadow extends PostProcessor {
    setGL(g) {
        gl = g;
    }

    preProcessing(PP) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.enable(gl.RASTERIZER_DISCARD);

        PP.renderScene(true, true);

        //gl.disable(gl.RASTERIZER_DISCARD);
    }

    buildScreenBuffer() {
        return {name: 'SHADOW'};
    }
    attachUniform() {}
    postProcessing() {}
}
