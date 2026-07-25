import { Matrix4 } from '../matrix';
import { ProjectionCamera } from '../utils';
import { Object3D } from './object3d';
import type { Scene } from './scene';
export interface CameraProps extends ProjectionCamera {
    zoom: number;
    isInitial: boolean;
    aspect: number;
    type: string;
}
export declare class Camera extends Object3D {
    isInitial?: boolean;
    props: CameraProps;
    matrixWorldInvert: Matrix4;
    projection: Matrix4;
    modelSize?: number;
    modelXSize?: number;
    modelYSize?: number;
    yaw: number;
    pitch: number;
    matrixInitial?: Matrix4;
    rotation: Matrix4;
    constructor(props: CameraProps, name?: string | number, parent?: Object3D | Scene);
    setProjection(matrix: Matrix4): void;
    setMatrixWorld(matrix: ArrayLike<number>): void;
    setZ(z: number): void;
    getViewProjMatrix(): Matrix4;
    pan(coordsStart: [number, number], coordsMove: [number, number], width: number, height: number): void;
    rotate(coordsStart: [number, number], coordsMove: [number, number]): void;
    zoom(value: number): void;
    updateNF(): void;
}
