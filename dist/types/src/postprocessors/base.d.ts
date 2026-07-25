import { Camera, Light } from '../objects/index';
export declare abstract class PostProcessor {
    canvas: HTMLCanvasElement;
    camera: Camera;
    light: Light;
    framebuffer: WebGLFramebuffer;
    abstract postProcessing(PP: unknown): unknown;
    abstract preProcessing(PP?: unknown): unknown;
    abstract buildScreenBuffer(pp: unknown): {
        name: string;
        value?: number;
    };
    abstract setGL(gl: unknown): unknown;
    abstract attachUniform(program: unknown): unknown;
    setCanvas(canvas: HTMLCanvasElement): void;
    setCamera(camera: Camera): void;
    setLight(light: Light): void;
    get width(): number;
    get height(): number;
}
