import { Matrix4, Vector3 } from '../matrix';
import { Object3D } from './object3d';
import type { Scene } from './scene';
interface Spot {
    innerConeAngle?: number;
    outerConeAngle?: number;
}
export interface LightProps {
    type: 'point' | 'directional' | 'spot';
    color?: number[];
    intensity?: number;
    isInitial?: boolean;
    spot?: Spot;
    range?: number;
}
export declare class Light extends Object3D {
    matrixWorldInvert: Matrix4;
    type: 'point' | 'directional' | 'spot';
    color: Vector3;
    intensity?: number;
    isInitial?: boolean;
    spot: Spot;
    range: number;
    constructor(props: LightProps, name?: string | number, parent?: Object3D | Scene);
    setMatrixWorld(matrix: ArrayLike<number>): void;
    setZ(z: number): void;
    update(v: number): void;
}
export {};
