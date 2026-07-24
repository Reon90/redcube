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

export class Light extends Object3D {
    matrixWorldInvert: Matrix4;
    type: 'point' | 'directional' | 'spot';
    color: Vector3;
    intensity?: number;
    isInitial?: boolean;
    spot: Spot;
    range: number;

    constructor(props: LightProps, name?: string | number, parent?: Object3D | Scene) {
        super(name, parent);

        const { type, color = [1, 1, 1], intensity, isInitial, spot = {}, range = -1 } = props;
        this.type = type;
        this.color = new Vector3(color);
        this.intensity = intensity;
        this.isInitial = isInitial;
        this.spot = spot;
        this.range = range;

        this.matrixWorldInvert = new Matrix4();
    }

    setMatrixWorld(matrix: ArrayLike<number>) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    }

    setZ(z: number) {
        // this.matrix.elements[13] = 0.5;
        // this.matrix.elements[14] = -3;
        this.matrix.elements[13] = z;
        this.matrix.elements[14] = z;
        this.setMatrixWorld(this.matrix.elements);
    }

    update(v: number) {
        if (this.isInitial || this.type === 'directional') {
            const camMatrix = new Matrix4();
            camMatrix.makeRotationAxis(new Vector3([0, 1, 0]), v);
            camMatrix.multiply(this.matrix);
            this.setMatrixWorld(camMatrix.elements);
        }
    }
}
