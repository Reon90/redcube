import { Scene, Camera, Object3D } from './objects/index';
import { Events } from './events';
import { State, Skin } from './state';
declare class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    state: State;
    constructor(url: string, canvas: HTMLCanvasElement, _pp: string[], envUrl?: string);
    getState(): State;
    private withPatch;
    private withPatchAsync;
    webgpuInit(): Promise<WEBGPU>;
    setActiveCamera(camera: Camera): void;
    init(cb: (scene: Scene) => void): Promise<void>;
    buildBones(join: number, v: Skin, node: Object3D | Scene): void;
    resize(): void;
    renderScene(renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    }): void;
    redraw(type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]): void;
    setVariant(variant: string | number): void;
    draw(): void;
}
export { RedCube };
