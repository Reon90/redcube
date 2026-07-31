import { WebGPUProfiler } from './profile';
import { Renderer } from './renderer';
import { Mesh } from './objects/index';
import { Attributes } from './objects/geometry';
import type { State } from './state';
export declare class RendererWebGPU extends Renderer {
    profiler: WebGPUProfiler;
    constructor(getState: () => State);
    private get pp();
    render(time?: number): Promise<void>;
    updateGeometry(mesh: Mesh, geometry: Attributes): void;
    updateMaterial(mesh: Mesh, type: string, out: {
        elements: Float32Array;
    }): void;
    renderScene(): Promise<void>;
}
