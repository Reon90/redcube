import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light, Object3D, UniformBuffer } from './objects/index';
import { UniformBufferLike } from './objects/uniform';
import { Events } from './events';
import { Env } from './env.webgpu';
import { Parse, Skin } from './parse';
import { PostProcessing } from './postprocessing.webgpu';
declare class RedCube {
    url: string;
    envUrl: string;
    canvas: HTMLCanvasElement;
    events: Events;
    ioc: Container;
    isIBL: boolean;
    isDefaultLight: boolean;
    renderState: {
        isprepender?: boolean;
        isprerefraction?: boolean;
    };
    stateBuffer: UniformBuffer;
    cameraBuffer: UniformBuffer;
    lightPosBuffer: UniformBuffer;
    lightColorBuffer: UniformBuffer;
    transformsStorage: UniformBufferLike;
    materialStorage: UniformBufferLike;
    constructor(url: string, canvas: HTMLCanvasElement, _pp: string[], envUrl?: string);
    webgpuInit(): Promise<WEBGPU>;
    get camera(): Camera;
    get light(): Light;
    get renderer(): Renderer;
    get scene(): Scene;
    get parse(): Parse;
    get env(): Env;
    get PP(): PostProcessing;
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
    getState(): {
        lightColorBuffer: UniformBuffer;
        transformsStorage: UniformBufferLike;
        materialStorage: UniformBufferLike;
        lightPosBuffer: UniformBuffer;
        cameraBuffer: UniformBuffer;
        stateBuffer: UniformBuffer;
        renderState: {
            isprepender?: boolean;
            isprerefraction?: boolean;
        };
        lights: Light[];
        isIBL: boolean;
        isDefaultLight: boolean;
        camera: Camera;
        light: Light;
        needUpdateView: boolean;
        needUpdateProjection: boolean;
    };
}
export { RedCube };
