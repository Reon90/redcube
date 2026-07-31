import { Scene, Camera, Object3D } from './objects/index';
import { Events } from './events';
import { State, Define, Skin } from './state';
import '../webgl-memory';
declare global {
    interface Window {
        __TEST_READY__?: boolean;
    }
}
declare class RedCube {
    canvas: HTMLCanvasElement;
    events: Events;
    processors: Array<string>;
    url: string;
    envUrl: string;
    defines: Array<Define>;
    state: State;
    constructor(url: string, canvas: HTMLCanvasElement, processors?: string[], envUrl?: string, mode?: string);
    getState(): State;
    private withPatch;
    private withPatchAsync;
    setActiveCamera(camera: Camera): void;
    setVariant(variant: string | number): void;
    init(cb: (scene: Scene) => void): Promise<void>;
    buildBones(join: number, v: Skin, node: Object3D | Scene): void;
    renderScene(renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    }): void;
    redraw(type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]): void;
    resize(isResizeEvent?: boolean): void;
    glInit(): void;
    draw(): void;
    initialDraw(): void;
}
export { RedCube };
