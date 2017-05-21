import {Matrix2, Matrix3, Matrix4, Vector3, Vector4, Frustum} from './matrix';

class Object3D {
    constructor(name, parent) {
        this.uuid = Math.floor(Date.now() * Math.random());
        this.name = name;
        this.children = [];
        this.matrix = new Matrix4();
        this.matrixWorld = new Matrix4();
        this.matrixAnimation = new Matrix4();
        this.parent = parent;
    }

    setPosition(translation, rotation, scale) {
        this.hasPosition = true;
        this.matrix.makeRotationFromQuaternion(rotation);
        this.matrix.scale(...scale);
        this.matrix.setTranslate(...translation);
        this.matrixAnimation.set(this.matrix.elements);
    }

    setMatrix(matrix) {
        this.matrix.set(matrix);
        this.matrixAnimation.set(matrix);
    }

    setMatrixWorld(matrix) {
        this.matrixWorld.set(matrix);
    }
}

class Mesh extends Object3D {
    constructor(name, parent) {
        super(name, parent);

        this.geometry = {
            boundingSphere: {
                center: new Vector3
            }
        };
        this.material = {};
        this.program = null;
        this.mode = 4;
    }

    setBlend(value) {
        this.material.blend = value;
    }

    calculateBounding() {
        let vertices = this.geometry.attributes.a_position.value;
        let verticesGrouped = [];
        let maxRadiusSq = 0;

        let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < vertices.length; i = i + 3) {
            let x = vertices[i];
            let y = vertices[i + 1];
            let z = vertices[i + 2];

            min[0] = Math.min(min[0], x);
            min[1] = Math.min(min[1], y);
            min[2] = Math.min(min[2], z);

            max[0] = Math.max(max[0], x);
            max[1] = Math.max(max[1], y);
            max[2] = Math.max(max[2], z);
        }

        this.geometry.boundingSphere.center
            .add( new Vector3(min) )
            .add( new Vector3(max) )
            .scale( 0.5 );
        
        for (let i = 0; i < vertices.length; i = i + 3) {
            maxRadiusSq = Math.max( maxRadiusSq, this.geometry.boundingSphere.center.distanceToSquared( vertices[i], vertices[i + 1], vertices[i + 2] ) );
        }
        this.geometry.boundingSphere.radius = Math.sqrt( maxRadiusSq );
    }

    setIndicesBuffer(value) {
        this.geometry.indicesBuffer = value;
    }

    setAttributes(value) {
        this.geometry.attributes = value;
        this.calculateBounding();
    }

    setTextures(value) {
        this.material.texture = value;
    }

    setUniforms(value) {
        this.material.uniforms = value;
    }

    setTechnique(value) {
        this.material.technique = value;
    }

    setProgram(value) {
        this.program = value;
    }

    setMode(value) {
        this.mode = value;
    }

    getJointMatrix() {
        let m4v = this.material.uniforms.u_jointMat.value;
        let m = new Matrix4(this.matrixWorld).invert();
        let resArray = [];

        for ( let mi = 0; mi < m4v.length; mi++ ) {
            let res = new Matrix4(m4v[ mi ])
                .multiply( m )
                .multiply( this.bones[ mi ].matrixWorld )
                .multiply( this.boneInverses[ mi ] )
                .multiply( this.bindShapeMatrix );
            resArray.push(res);
        }

        return resArray;
    }
    getModelViewProjMatrix(_camera) {
        let m = new Matrix4();
        m.multiply(_camera.projection);
        m.multiply(_camera.matrixWorldInvert);
        m.multiply(this.matrixWorld);

        return m;
    }
    getViewMatrix(_camera) {
        let m = new Matrix4();
        m.multiply(_camera.matrixWorldInvert);

        return m;
    }
    getModelViewMatrix(value, _camera) {
        let m = new Matrix4();
        m.multiply(_camera.matrixWorldInvert);
        m.multiply(value ? value : this.matrixWorld);

        return m;
    }
    getProjectionMatrix(_camera) {
        return _camera.projection;
    }
    getNormalMatrix() {
        let normalMatrix = new Matrix3();
        normalMatrix.normalFromMat4(this.material.uniforms.u_modelViewMatrix.value);
        return normalMatrix;
    }

    isVisible(planes) {
        let c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
        let r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
        let dist;
        let visible = true;
        for ( let p of planes ) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if( dist < -r ) {
                visible = false;
                break;
            }
        }
        this.distance = dist + r;

        return visible;
    }
}

class SkinnedMesh extends Mesh {
    constructor(name, parent) {
        super(name, parent);
    }

    setSkin(value) {
        this.skin = value;
    }
}

class Bone extends Object3D {
    constructor(name, parent) {
        super(name, parent);
    }

    setJointName(value) {
        this.jointName = value;
    }
}

class Camera extends Object3D {
    constructor(name, parent) {
        super(name, parent);

        this.matrixWorldInvert = new Matrix4();
        this.projection = new Matrix4();
    }

    setProjection(matrix) {
        this.projection.set(matrix);
    }

    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    }

    setMatrixWorldInvert(look) {
        this.matrixWorldInvert.lookAt(...look);
    }

    getViewProjMatrix() {
        let m = new Matrix4();
        m.multiply(this.projection);
        m.multiply(this.matrixWorldInvert);

        return m;
    }
}

class Scene {
    constructor() {
        this.children = [];
        this.program = [];
        this.matrixWorld = new Matrix4();
        this.bin = [];
    }
}

export {Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera};
