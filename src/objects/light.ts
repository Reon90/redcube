import { Matrix4, Vector3 } from '../matrix';
import { Object3D } from './object3d';

export class Light extends Object3D {
    matrixWorldInvert: Matrix4;

    constructor(name?, parent?) {
        super(name, parent);

        this.matrixWorldInvert = new Matrix4;
    }

    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    }

    setZ(z) {
        this.matrix.elements[14] = z;
        this.setMatrixWorld(this.matrix.elements);
    }

    update(v) {
        const camMatrix = new Matrix4;
        camMatrix.makeRotationAxis(new Vector3([0, 1, 0]), v);
        camMatrix.multiply(this.matrix);
        this.setMatrixWorld(camMatrix.elements);
    }
}
