import { Camera, Scene, Light } from './objects/index';
import { getJson, getBuffer, getEnv } from './parseLoader';
import { buildMesh, buildSkin, buildAnimation, calculateFov } from './parseSceneBuilder';
import {
    createShaderProgram,
    createSamplers,
    createSamplersWebGPU,
    createTexturesWebGPU,
    createTexturesWebGL,
    initTextures,
} from './parseTextures';
import { ParseContext, Define, commit } from './parseContext';

export type { Track, Key, Skin, Define } from './parseContext';

// Parse is a thin facade over ParseContext: it owns the mutable state that
// glTF loading needs, and delegates the actual work to three focused
// modules (parseLoader.ts, parseSceneBuilder.ts, parseTextures.ts), passing
// context explicitly rather than those modules depending on Parse itself.
// The public method/field surface below is unchanged so every existing call
// site (redcube.ts, redcube.webgpu.ts, redcube.node.ts, renderer.ts) keeps
// working as-is.
export class Parse {
    context: ParseContext;

    constructor(url: string, defines: Array<Define>, resize: () => void) {
        this.context = new ParseContext(url, defines, resize);
    }

    // Runs a function that writes into a fresh patch instead of the live
    // context, then commits that patch in one place - so call sites below
    // don't each repeat "make a patch, call, commit."
    private withPatch<T>(run: (patch: Partial<ParseContext>) => T): T {
        const patch: Partial<ParseContext> = {};
        const result = run(patch);
        commit(this.context, patch);
        return result;
    }

    private async withPatchAsync<T>(run: (patch: Partial<ParseContext>) => Promise<T>): Promise<T> {
        const patch: Partial<ParseContext> = {};
        const result = await run(patch);
        commit(this.context, patch);
        return result;
    }

    get tracks() {
        return this.context.tracks;
    }
    get json() {
        return this.context.json;
    }
    get lights() {
        return this.context.lights;
    }
    get cameras() {
        return this.context.cameras;
    }
    get skins() {
        return this.context.skins;
    }

    setScene(scene: Scene) {
        this.context.scene = scene;
    }

    setGl(g: WebGL2RenderingContext | WEBGPU) {
        this.context.gl = g;
    }

    setCamera(camera: Camera) {
        this.context.camera = camera;
    }

    setLight(light: Light) {
        this.context.light = light;
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.context.canvas = canvas;
    }

    getJson() {
        return this.withPatchAsync<void | boolean>((patch) => getJson(this.context, patch));
    }

    getBuffer() {
        return this.withPatchAsync((patch) => getBuffer(this.context, patch));
    }

    getEnv(isBuffer: boolean) {
        return getEnv(this.context, isBuffer);
    }

    calculateFov(isInitial: boolean) {
        return calculateFov(this.context, isInitial);
    }

    buildMesh() {
        return this.withPatchAsync((patch) => buildMesh(this.context, patch));
    }

    buildSkin() {
        return buildSkin(this.context);
    }

    buildAnimation() {
        return buildAnimation(this.context);
    }

    createProgram(defines: Define[]) {
        return createShaderProgram(this.context, defines);
    }

    createSamplers() {
        this.withPatch((patch) => createSamplers(this.context, patch));
    }

    createSamplersWebGPU(WebGPU: WEBGPU) {
        this.withPatch((patch) => createSamplersWebGPU(this.context, patch, WebGPU));
    }

    createTexturesWebGPU(WebGPU: WEBGPU) {
        return createTexturesWebGPU(this.context, WebGPU);
    }

    createTexturesWebGL() {
        return createTexturesWebGL(this.context);
    }

    initTextures(isbitmap: boolean) {
        return this.withPatchAsync((patch) => initTextures(this.context, patch, isbitmap));
    }
}
