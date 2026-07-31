import { Scene, Light } from './objects/index';
import { ParseContext, Define } from './parseContext';
export type { Track, Key, Skin, Define } from './parseContext';
export declare class Parse {
    context: ParseContext;
    constructor(url: string, defines: Array<Define>, resize: () => void, scene: Scene, light?: Light, canvas?: HTMLCanvasElement, gl?: WebGL2RenderingContext | WEBGPU);
    private withPatch;
    private withPatchAsync;
    get tracks(): import("./parseContext").Track[][];
    get json(): import("../GLTF").GlTf;
    get lights(): Light[];
    get cameras(): import("./objects/camera").Camera[];
    get skins(): import("./parseContext").Skin[];
    getJson(): Promise<void | boolean>;
    getBuffer(): Promise<void>;
    getEnv(isBuffer: boolean): Promise<any>;
    calculateFov(isInitial: boolean): void;
    buildMesh(): Promise<void>;
    buildSkin(): true | undefined;
    buildAnimation(): true | undefined;
    createProgram(defines: Define[]): WebGLProgram;
    createSamplers(): void;
    createSamplersWebGPU(WebGPU: WEBGPU): void;
    createTexturesWebGPU(WebGPU: WEBGPU): void;
    createTexturesWebGL(): void;
    initTextures(isbitmap: boolean): Promise<boolean>;
}
