import { Camera } from '../objects';

export abstract class PostProcessor {
    canvas: HTMLCanvasElement;
    camera: Camera;
    framebuffer: WebGLFramebuffer;
    abstract postProcessing(PP)
    abstract buildScreenBuffer(pp)
    abstract setGL(gl)
    abstract attachUniform(program)
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }
    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    } 
}
