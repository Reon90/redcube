import { Matrix4 } from '../matrix';
import type { Scene } from './scene';
export declare class Object3D {
    uuid: number;
    name?: string | number;
    id?: string;
    children: Array<Object3D>;
    matrix: Matrix4;
    matrixWorld: Matrix4;
    parent?: Object3D | Scene;
    reflow?: boolean;
    repaint?: boolean;
    visible: boolean;
    instances: number;
    matrices: Matrix4[];
    constructor(name?: string | number, parent?: Object3D | Scene);
    getPosition(): Float32Array<ArrayBuffer>;
    setPosition(translation?: number[], rotation?: number[], scale?: number[]): void;
    setMatrix(matrix: ArrayLike<number>): void;
    setMatrixWorld(matrix: ArrayLike<number>): void;
    updateMatrix(): void;
}
