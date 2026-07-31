import { Mesh } from './objects/index';
import { FPS } from './fps';
import { Attributes } from './objects/geometry';
import type { Track, State } from './state';
export type { State, RenderPassState, Track, Key, Skin, Define } from './state';
declare global {
    interface Window {
        __FORCE_DETERMINISTIC__?: boolean;
    }
}
export declare class Renderer {
    fps: FPS;
    getState: () => State;
    reflow: boolean;
    needUpdateView: boolean;
    needUpdateProjection: boolean;
    currentTrack: number;
    constructor(getState: () => State);
    step(sec: number, v: Track): false | undefined;
    spline(sec: number, v: Track): false | undefined;
    updateGeometry(mesh: Mesh, geometry: Attributes): void;
    interpolation(sec: number, v: Track): false | undefined;
    updateMaterial(mesh: Mesh, type: string, out: {
        elements: Float32Array;
    }): void;
    animate(sec: number): void;
    render(time?: number): void;
    renderScene(): void;
    clean(): void;
}
