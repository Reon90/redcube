import { PostProcessor } from './base';

let gl;

export class Refraction extends PostProcessor {
    setGL(g) {
        gl = g;
    }

    preProcessing(PP) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
debugger
        PP.renderScene(true);
    }

    buildScreenBuffer() {
        return { name: 'REFRACTION' };
    }
    attachUniform() {}
    postProcessing() {}
}
