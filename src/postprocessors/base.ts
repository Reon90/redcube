import { Camera, Light } from '../objects/index';

export abstract class PostProcessor {
    canvas: HTMLCanvasElement;
    camera: Camera;
    light: Light;
    framebuffer: WebGLFramebuffer;
    abstract postProcessing(PP)
    abstract preProcessing(PP)
    abstract buildScreenBuffer(pp)
    abstract setGL(gl)
    abstract attachUniform(program)
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    setLight(light) {
        this.light = light;
    }
    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }
    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    } 
}
