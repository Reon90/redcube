import { WebGPUProfiler } from './profile';
import { Renderer } from './renderer';
import { Env } from './env';
import { PostProcessing } from './postprocessing.webgpu';
import { Mesh } from './objects/index';
import { Attributes } from './objects/geometry';
export declare class RendererWebGPU extends Renderer {
    profiler: WebGPUProfiler;
    setEnv(env: Env): void;
    setGl(g: WebGL2RenderingContext | WEBGPU): void;
    setPp(pp: PostProcessing): void;
    render(time?: number): Promise<void>;
    updateGeometry(mesh: Mesh, geometry: Attributes): void;
    updateMaterial(mesh: Mesh, type: string, out: {
        elements: Float32Array;
    }): void;
    renderScene(): Promise<void>;
}
