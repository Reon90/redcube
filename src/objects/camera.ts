import { Matrix4, Vector3 } from '../matrix';
import { sceneToArcBall, canvasToWorld, calculateProjection } from '../utils';
import { Object3D } from './object3d';

interface CameraProps {
    zoom: number;
    isInitial: boolean;
    aspect: number;
    perspective: CameraPerspective;
    orthographic: CameraPerspective;
}
interface CameraPerspective {
    yfov: number;
    znear: number;
    zfar: number;
}

export class Camera extends Object3D {
    isInitial: boolean;
    props: CameraProps;
    matrixWorldInvert: Matrix4;
    projection: Matrix4;
    modelSize: number;
    modelXSize: number;
    modelYSize: number;

    constructor(props, name?, parent?) {
        super(name, parent);

        this.matrixWorldInvert = new Matrix4();
        this.projection = new Matrix4();
        this.props = props;
    }

    setProjection(matrix) {
        this.projection.set(matrix.elements);
    }

    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    }

    setZ(z) {
        this.matrix.elements[14] = z;
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
        const pan = this.modelSize * 100;
        const delta = p1.subtract(p0).scale(pan);

        this.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
        this.setMatrixWorld(this.matrixWorld.elements);
    }

    rotate(coordsStart, coordsMove, width, height) {
        const coordsStartWorld = canvasToWorld(coordsStart, this.projection, width, height);
        const coordsMoveWorld = canvasToWorld(coordsMove, this.projection, width, height);
        const p0 = new Vector3(sceneToArcBall(coordsStartWorld));
        const p1 = new Vector3(sceneToArcBall(coordsMoveWorld));
        const angle = (Vector3.angle(p1, p0) * 30) / this.props.aspect;
        if (angle < 1e-6 || isNaN(angle)) {
            return;
        }

        const camStart = new Vector3(p0.elements).applyMatrix4(this.matrixWorld);
        const camEnd = new Vector3(p1.elements).applyMatrix4(this.matrixWorld);
        const camVector = Vector3.cross(camEnd, camStart).normalize();
        const camMatrix = new Matrix4();
        camMatrix.makeRotationAxis(camVector, angle);
        camMatrix.multiply(this.matrixWorld);

        this.setMatrixWorld(camMatrix.elements);
    }

    zoom(value) {
        this.props.zoom = value; //Math.max(Math.min(coordsStart, 3 / this.camera.props.aspect), 0.5);
        this.updateNF();
        this.setProjection(calculateProjection(this.props));
    }

    updateNF() {
        const cameraZ = Math.abs(this.matrixWorldInvert.elements[14]);
        const cameraProps = this.props.perspective || this.props.orthographic;
        if (cameraZ > this.modelSize) {
            cameraProps.znear = Math.max(cameraZ - this.modelSize, 0.001);
            cameraProps.zfar = cameraZ + this.modelSize;
        } else {
            cameraProps.znear = 1;
            cameraProps.zfar = 10000;
        }
        this.setProjection(calculateProjection(this.props));
    }
}
