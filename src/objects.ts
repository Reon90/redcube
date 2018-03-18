import { Matrix4, Vector3 } from './matrix';

class Object3D {
    uuid: number;
    name: string;
    children: Array<Object3D>;
    matrix: Matrix4;
    matrixWorld: Matrix4;
    parent: Object3D;
    reflow: boolean;

    constructor(name, parent) {
        this.uuid = Math.floor(Date.now() * Math.random());
        this.name = name;
        this.children = [];
        this.matrix = new Matrix4;
        this.matrixWorld = new Matrix4;
        this.parent = parent;
    }

    setPosition(translation, rotation, scale) {
        if (rotation) {
            this.matrix.makeRotationFromQuaternion(rotation);
        }
        if (scale) {
            this.matrix.scale(new Vector3(scale));
        }
        if (translation) {
            this.matrix.setTranslate(new Vector3(translation));
        }
    }

    setMatrix(matrix) {
        this.matrix.set(matrix);
    }

    setMatrixWorld(matrix) {
        this.matrixWorld.set(matrix);
    }

    updateMatrix() {
        const m = new Matrix4;
        m.multiply( this.parent.matrixWorld );
        m.multiply(this.matrix);
        this.setMatrixWorld(m.elements);
    }
}

interface Material {
    blend: string;
    uniforms: Uniforms;
    alphaMode: string;
    UBO: WebGLBuffer;
    pbrMetallicRoughness: PBR;
}
interface PBR {
    baseColorFactor: Array<number>;
}
interface Uniforms {
    baseColorTexture: WebGLUniformLocation;
    metallicRoughnessTexture: WebGLUniformLocation;
    normalTexture: WebGLUniformLocation;
    occlusionTexture: WebGLUniformLocation;
    emissiveTexture: WebGLUniformLocation;
}

interface Geometry {
    UBO: WebGLBuffer;
    VAO: WebGLBuffer;
    indicesBuffer: WebGLBuffer;
    attributes: Attributes;
    targets: Attributes;
    blend: string;
    uniforms: object;
    SKIN: WebGLBuffer;
    boundingSphere: BoundingSphere;
}
interface Attributes {
    'POSITION': Float32Array;
    'NORMAL': Float32Array;
    'TEXCOORD_0': Float32Array;
    'JOINTS_0': Float32Array;
    'WEIGHTS_0': Float32Array;
    'TANGENT': Float32Array;
}
interface BoundingSphere {
    min: Vector3;
    max: Vector3;
    center: Vector3;
    radius: number;
}

class Mesh extends Object3D {
    geometry: Geometry;
    material: Material;
    program: WebGLProgram;
    defines: Array<string>;
    mode: number;
    distance: number;

    constructor(name, parent) {
        super(name, parent);

        this.geometry = {
            boundingSphere: {
                center: new Vector3,
                radius: null,
                min: null,
                max: null
            },
            UBO: null,
            VAO: null,
            indicesBuffer: null,
            attributes: null,
            targets: null,
            blend: null,
            uniforms: null,
            SKIN: null
        };
        this.material = {
            blend: null,
            uniforms: null,
            alphaMode: null,
            UBO: null,
            pbrMetallicRoughness: null
        };
        this.program = null;
        this.defines = null;
        this.mode = 4;
    }

    setBlend(value) {
        this.material.blend = value;
    }

    setMaterial(material) {
        this.material = material;
        this.material.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            emissiveTexture: null
        };
    }

    calculateBounding() {
        const vertices = this.geometry.attributes.POSITION;
        let maxRadiusSq = 0;

        this.geometry.boundingSphere.center
            .add( this.geometry.boundingSphere.min )
            .add( this.geometry.boundingSphere.max )
            .scale( 0.5 );
        
        for (let i = 0; i < vertices.length; i = i + 3) {
            maxRadiusSq = Math.max( maxRadiusSq, this.geometry.boundingSphere.center.distanceToSquared( vertices[i], vertices[i + 1], vertices[i + 2] ) );
        }
        this.geometry.boundingSphere.radius = Math.sqrt( maxRadiusSq );
    }

    setBoundingBox({min, max}) {
        this.geometry.boundingSphere.min = new Vector3(min);
        this.geometry.boundingSphere.max = new Vector3(max);
        this.calculateBounding();
    }

    setIndicesBuffer(value) {
        this.geometry.indicesBuffer = value;
    }

    setAttributes(value) {
        this.geometry.attributes = value;
    }

    setTargets(value) {
        this.geometry.targets = value;
    }

    setProgram(value) {
        this.program = value;
    }

    setMode(value) {
        this.mode = value;
    }

    isVisible(planes) {
        const c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
        const r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
        let dist;
        let visible = true;
        for ( const p of planes ) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if ( dist < -r ) {
                visible = false;
                break;
            }
        }
        this.distance = dist + r;

        return visible;
    }
}

class SkinnedMesh extends Mesh {
    bones: Array<Bone>;
    skin: string;
    boneInverses: Array<Matrix4>;

    constructor(name, parent) {
        super(name, parent);
    }

    setSkin(value) {
        this.skin = value;
        return this;
    }

    getJointMatrix() {
        const m = new Matrix4(this.matrixWorld).invert();
        const resArray = [];

        for ( let mi = 0; mi < this.boneInverses.length; mi++ ) {
            const res = new Matrix4()
                .multiply( m )
                .multiply( this.bones[ mi ].matrixWorld )
                .multiply( this.boneInverses[ mi ] );
            resArray.push(res);
        }

        return resArray;
    }
}

class Bone extends Object3D {
    
}

interface CameraProps {
    zoom: number;
    isInitial: boolean;
    aspect: number;
}

class Camera extends Object3D {
    isInitial: boolean;
    props: CameraProps;
    matrixWorldInvert: Matrix4;
    projection: Matrix4;
    modelSize: number;
    modelXSize: number;
    modelYSize: number;

    constructor(name?, parent?) {
        super(name, parent);

        this.matrixWorldInvert = new Matrix4;
        this.projection = new Matrix4;
    }

    setProps(props) {
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
        const m = new Matrix4;
        m.multiply(this.projection);
        m.multiply(this.matrixWorldInvert);

        return m;
    }
}

class Scene {
    children: Array<Object3D>;
    bin: Array<object>;
    matrixWorld: Matrix4;
    transparentChildren: Array<Mesh>;
    opaqueChildren: Array<Mesh>;

    constructor() {
        this.opaqueChildren = [];
        this.transparentChildren = [];
        this.children = [];
        this.bin = [];
        this.matrixWorld = new Matrix4;
    }
}

export { Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera };
