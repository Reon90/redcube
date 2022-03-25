import { Matrix4, Vector3 } from '../matrix';
import { canvasToWorld, calculateProjection } from '../utils';
import { Object3D } from './object3d';

interface CameraProps {
    zoom: number;
    isInitial: boolean;
    aspect: number;
    perspective: CameraPerspective;
    orthographic: CameraPerspective;
    type: string;
}
interface CameraPerspective {
    yfov: number;
    znear: number;
    zfar: number;
}

function clamp(a, b, c) {
    return a < b ? b : a > c ? c : a;
}

let x;

export class Camera extends Object3D {
    isInitial: boolean;
    props: CameraProps;
    matrixWorldInvert: Matrix4;
    projection: Matrix4;
    modelSize: number;
    modelXSize: number;
    modelYSize: number;
    yaw: number;
    pitch: number;
    matrixInitial: Matrix4;
    rotation: Matrix4;

    constructor(props, name?, parent?) {
        super(name, parent);

        this.matrixWorldInvert = new Matrix4();
        this.projection = new Matrix4();
        this.props = props;

        this.yaw = 0;
        this.pitch = -Math.PI;
        this.rotation = new Matrix4();
    }

    setProjection(matrix) {
        this.projection.set(matrix.elements);
    }

    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
        if (!this.matrixInitial) {
            this.matrixInitial = new Matrix4(this.matrixWorld);
        }
    }

    setZ(z) {
        this.matrix.elements[14] = z;
        this.matrixInitial = new Matrix4(this.matrix);
        this.setMatrixWorld(this.matrix.elements);
    }

    getViewProjMatrix() {
        const m = new Matrix4();
        m.multiply(this.projection);
        m.multiply(this.matrixWorldInvert);

        return m;
    }

    pan(coordsStart, coordsMove, width, height) {
        const coordsStartWorld = canvasToWorld(coordsStart, this.projection, width, height);
        const coordsMoveWorld = canvasToWorld(coordsMove, this.projection, width, height);
        const p0 = new Vector3([...coordsStartWorld, 0]);
        const p1 = new Vector3([...coordsMoveWorld, 0]);
        if (this.props.type === 'orthographic') {
            const pan = 2 * this.matrixWorld.elements[14];
            const delta = p0.subtract(p1).scale(pan);
            this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
        } else {
            const pan = 10 * this.matrixWorld.elements[14];
            const delta = p1.subtract(p0).scale(pan);
            this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
        }

        const res = new Matrix4(this.rotation);
        res.multiply(this.matrixInitial);

        this.setMatrixWorld(res.elements);
    }

    rotate(coordsStart, coordsMove) {
        this.yaw += (coordsStart[0] - coordsMove[0]) * 0.01;
        this.pitch += (coordsStart[1] - coordsMove[1]) * 0.01;
        this.pitch = clamp(this.pitch, -1.5 * Math.PI, -0.5 * Math.PI);
        const m = new Matrix4();
        m.rotate(new Vector3([1, 0, 0]), this.pitch);
        m.rotate(new Vector3([0, 1, 0]), -this.yaw);
        m.rotate(new Vector3([1, 0, 0]), Math.PI);
        this.rotation = m;

        const res = new Matrix4(m);
        res.multiply(this.matrixInitial);

        this.setMatrixWorld(res.elements);
    }

    zoom(value) {
        if (this.matrixInitial.elements[14] > this.modelSize * 5 && value > 0) {
            return;
        }
        this.matrixInitial.elements[14] += value * this.modelSize * 0.001;

        const m = new Matrix4(this.rotation);
        m.multiply(this.matrixInitial);

        this.setMatrixWorld(m.elements);
        this.updateNF();
    }

    updateNF() {
        if (this.props.isInitial) {
            const scale = Math.min(...this.matrixWorld.getScaling().elements);
            const modelSize = this.modelSize / scale;
            const cameraZ = Math.abs(this.matrixWorldInvert.elements[14]);
            const cameraProps = this.props.perspective || this.props.orthographic;
            cameraProps.znear = Math.max(cameraZ - modelSize, modelSize * 0.05);
            cameraProps.zfar = cameraZ + modelSize;
        }

        this.setProjection(calculateProjection(this.props));
    }
}
