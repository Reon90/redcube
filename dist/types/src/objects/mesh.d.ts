import { Matrix4, Vector4 } from '../matrix';
import { Object3D } from './object3d';
import { Geometry } from './geometry';
import { Material } from './material';
import { UniformBufferLike } from './uniform';
import type { Scene } from './scene';
import type { Define, Skin } from '../parse';
import type { State, RenderPassState } from '../renderer';
export declare class Mesh extends Object3D {
    geometry: Geometry;
    material: Material;
    program: WebGLProgram | null;
    defines: Array<Define> | null;
    mode: number;
    frontFace?: boolean;
    distance: number;
    variants: {
        m: Material;
        variants: number[];
    }[];
    order: number;
    uniformBindGroup1: GPUBindGroup;
    pipeline: GPURenderPipeline;
    pipeline2?: GPURenderPipeline;
    constructor(name?: string | number, parent?: Object3D | Scene);
    setDefines(defines: Array<Define>): void;
    setBlend(value: string): void;
    setMaterial(material: Material): void;
    drawWebGPU(WebGPU: WEBGPU, passEncoder: GPURenderPassEncoder, i: number, { renderState, materialStorage, transformsStorage, }: {
        renderState: RenderPassState;
        materialStorage: UniformBufferLike;
        transformsStorage: UniformBufferLike;
    }): void;
    draw(gl: WebGL2RenderingContext, { lights, camera, needUpdateProjection, preDepthTexture, colorTexture, renderState, fakeDepth, isIBL, isDefaultLight }: State): void;
    setGeometry(geometry: Geometry): void;
    setProgram(value: WebGLProgram): void;
    setMode(value?: number): void;
    setVariants(variants: {
        m: Material;
        variants: number[];
    }[]): void;
    setFrontFace(): void;
    isVisible(planes: Vector4[]): boolean;
    calculateBounding(): void;
}
export declare class SkinnedMesh extends Mesh {
    bones: Array<Bone>;
    boneInverses: Array<Matrix4>;
    skin: number;
    skinBuffer: GPUBuffer;
    constructor(name?: string | number, parent?: Object3D | Scene);
    setSkinWebGPU(WebGPU: WEBGPU, skin: Skin): {
        binding: number;
        resource: GPUBuffer;
    };
    setSkin(gl: WebGL2RenderingContext, skin: Skin): this;
    getJointMatrix(): Matrix4[];
}
export declare class Bone extends Object3D {
}
