import { Camera, Light } from '../objects/index';

export abstract class PostProcessor {
    canvas!: HTMLCanvasElement;
    camera!: Camera;
    light!: Light;
    framebuffer!: WebGLFramebuffer;
    abstract postProcessing(PP: unknown): unknown;
    abstract preProcessing(PP?: unknown): unknown;
    abstract buildScreenBuffer(pp: unknown): { name: string; value?: number };
    abstract setGL(gl: unknown): unknown;
    abstract attachUniform(program: unknown): unknown;
    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
    setCamera(camera: Camera) {
        this.camera = camera;
    }
    setLight(light: Light) {
        this.light = light;
    }
    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }
    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }
}
