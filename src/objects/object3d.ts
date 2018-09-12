import { Matrix4, Vector3 } from '../matrix';

export class Object3D {
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

    getPosition() {
        return new Float32Array([this.matrixWorld.elements[12], this.matrixWorld.elements[13], this.matrixWorld.elements[14]]);
    }

    getAxisX() {
        return new Float32Array([this.matrixWorld.elements[0], this.matrixWorld.elements[1], this.matrixWorld.elements[2]]);
    }
    getAxisY() {
        return new Float32Array([this.matrixWorld.elements[4], this.matrixWorld.elements[5], this.matrixWorld.elements[6]]);
    }
    getAxisZ() {
        return new Float32Array([this.matrixWorld.elements[8], this.matrixWorld.elements[9], this.matrixWorld.elements[10]]);
    }

    TestRayOBBIntersection(
        tMin,
        tMax,
        ray_origin,        // Ray origin, in world space
        ray_direction,     // Ray direction (NOT target position!), in world space. Must be normalize()'d.
        //aabb_min,          // Minimum X,Y,Z coords of the mesh when not transformed at all.
        //aabb_max,          // Maximum X,Y,Z coords. Often aabb_min*-1 if your mesh is centered, but it's not always the case.
        //ModelMatrix,       // Transformation applied to the mesh (which will thus be also applied to its bounding box)
        //intersection_distance // Output : distance between ray_origin and the intersection with the OBB
    ) {
        //let tMin = 0.0;
        //let tMax = 100000.0;
    {
        const OBBposition_worldspace = new Vector3(this.getPosition());
        const delta = OBBposition_worldspace.subtract(new Vector3(ray_origin));

        const xaxis = new Vector3(this.getAxisX());
        const e = Vector3.dot(xaxis, delta);
        const f = Vector3.dot(new Vector3(ray_direction), xaxis);

        // Beware, don't do the division if f is near 0 ! See full source code for details.
        let t1 = (e+this.geometry.boundingSphere.min.elements[0])/f; // Intersection with the "left" plane
        let t2 = (e+this.geometry.boundingSphere.max.elements[0])/f; // Intersection with the "right" plane

        if (t1>t2){ // if wrong order
            let w=t1;t1=t2;t2=w; // swap t1 and t2
        }

        // tMax is the nearest "far" intersection (amongst the X,Y and Z planes pairs)
        if ( t2 < tMax ) tMax = t2;
        // tMin is the farthest "near" intersection (amongst the X,Y and Z planes pairs)
        if ( t1 > tMin ) tMin = t1;

        if (tMax < tMin )
        console.log(false);
        else
        console.log(true);
    }
    {
        const OBBposition_worldspace = new Vector3(this.getPosition());
        const delta = OBBposition_worldspace.subtract(new Vector3(ray_origin));

        const xaxis = new Vector3(this.getAxisY());
        const e = Vector3.dot(xaxis, delta);
        const f = Vector3.dot(new Vector3(ray_direction), xaxis);

        // Beware, don't do the division if f is near 0 ! See full source code for details.
        let t1 = (e+this.geometry.boundingSphere.min.elements[1])/f; // Intersection with the "left" plane
        let t2 = (e+this.geometry.boundingSphere.max.elements[1])/f; // Intersection with the "right" plane

        if (t1>t2){ // if wrong order
            let w=t1;t1=t2;t2=w; // swap t1 and t2
        }

        // tMax is the nearest "far" intersection (amongst the X,Y and Z planes pairs)
        if ( t2 < tMax ) tMax = t2;
        // tMin is the farthest "near" intersection (amongst the X,Y and Z planes pairs)
        if ( t1 > tMin ) tMin = t1;

        if (tMax < tMin )
        console.log(false);
        else
        console.log(true);
    }
    {
        const OBBposition_worldspace = new Vector3(this.getPosition());
        const delta = OBBposition_worldspace.subtract(new Vector3(ray_origin));

        const xaxis = new Vector3(this.getAxisZ());
        const e = Vector3.dot(xaxis, delta);
        const f = Vector3.dot(new Vector3(ray_direction), xaxis);

        // Beware, don't do the division if f is near 0 ! See full source code for details.
        let t1 = (e+this.geometry.boundingSphere.min.elements[2])/f; // Intersection with the "left" plane
        let t2 = (e+this.geometry.boundingSphere.max.elements[2])/f; // Intersection with the "right" plane

        if (t1>t2){ // if wrong order
            let w=t1;t1=t2;t2=w; // swap t1 and t2
        }

        // tMax is the nearest "far" intersection (amongst the X,Y and Z planes pairs)
        if ( t2 < tMax ) tMax = t2;
        // tMin is the farthest "near" intersection (amongst the X,Y and Z planes pairs)
        if ( t1 > tMin ) tMin = t1;

        if (tMax < tMin )
        console.log(false);
        else
        console.log(true);
    }
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
