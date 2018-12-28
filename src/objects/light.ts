import { Matrix4, Vector3 } from '../matrix';
import { Object3D } from './object3d';

interface Spot {
    innerConeAngle: number;
    outerConeAngle: number;
}

export class Light extends Object3D {
    matrixWorldInvert: Matrix4;
    type: 'point' | 'directional' | 'spot';
    color: Vector3;
    intensity: number;
    isInitial: boolean;
    spot: Spot;

    constructor(props, name?, parent?) {
        super(name, parent);

        const { type, color, intensity, isInitial, spot = {} } = props;
        this.type = type;
        this.color = new Vector3(color);
        this.intensity = intensity;
        this.isInitial = isInitial;
        this.spot = spot;

        this.matrixWorldInvert = new Matrix4();
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
        if (this.isInitial || this.type === 'directional') {
            const camMatrix = new Matrix4();
            camMatrix.makeRotationAxis(new Vector3([0, 1, 0]), v);
            camMatrix.multiply(this.matrix);
            this.setMatrixWorld(camMatrix.elements);
        }
    }
}
