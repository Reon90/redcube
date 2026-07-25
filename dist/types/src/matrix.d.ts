/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */
declare class Matrix2 {
    elements: Float32Array;
    constructor(opt_src?: Matrix2);
    set(src: ArrayLike<number>): this | undefined;
}
/**
 * Constructor of Matrix3
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
declare class Matrix3 {
    elements: Float32Array;
    constructor(opt_src?: Matrix3);
    set(src: ArrayLike<number>): this | undefined;
    normalFromMat4(src: Matrix4): this | null;
    multiply(matrix: Matrix3): this;
}
/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
declare class Matrix4 {
    elements: Float32Array;
    animated?: boolean;
    constructor(opt_src?: Matrix4);
    /**
     * Copy matrix.
     * @param src source matrix
     * @return this
     */
    set(src: ArrayLike<number>): this | undefined;
    multiply(matrix: Matrix4): this;
    /**
     * Multiply the matrix from the right.
     * @param other The multiply matrix
     * @return this
     */
    concat({ elements }: Matrix4): this;
    /**
     * Calculate the inverse matrix of specified matrix, and set to this.
     * @param other The source matrix
     * @return this
     */
    setInverseOf({ elements }: Matrix4): this;
    /**
     * Calculate the inverse matrix of this, and set to this.
     * @return this
     */
    invert(): this;
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    /**
     * Set the orthographic projection matrix.
     * @param left The coordinate of the left of clipping plane.
     * @param right The coordinate of the right of clipping plane.
     * @param bottom The coordinate of the bottom of clipping plane.
     * @param top The coordinate of the top top clipping plane.
     * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
     * @return this
     */
    setOrtho(r: number, t: number, near: number, far: number): this;
    /**
     * Set the perspective projection matrix by fovy and aspect.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    setPerspective(fovy: number, aspect: number, near: number, far: number): this;
    /**
     * Multiply the perspective projection matrix from the right.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    perspective(fovy: number, aspect: number, near: number, far: number): this;
    /**
     * Multiply the four-dimensional vector.
     * @param pos  The multiply vector
     * @return The result of multiplication(Float32Array)
     */
    multiplyVector4({ elements }: Vector4): Vector4;
    getScaling(): Vector3;
    scale(vec3: Vector3): this;
    restoreScale(vec3: Vector3): this;
    setTranslate(vec3: Vector3): this;
    /**
     * Multiply the matrix for translation from the right.
     * @param x The X value of a translation.
     * @param y The Y value of a translation.
     * @param z The Z value of a translation.
     * @return this
     */
    translate(x: number, y: number, z: number): this;
    getMaxScaleOnAxis(): number;
    rotate(axis: Vector3, rad: number): this | null;
    makeRotationAxis(axis: Vector3, angle: number): this;
    makeRotationFromQuaternion(q: ArrayLike<number>): this;
    transpose(): this;
}
declare class Vector {
    elements: Float32Array;
    constructor(src: Float32Array);
    lerp(a: ArrayLike<number>, b: ArrayLike<number>, t: number): this;
}
/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
declare class Vector3 {
    elements: Float32Array;
    get x(): number;
    get y(): number;
    get z(): number;
    set x(v: number);
    set y(v: number);
    set z(v: number);
    static FromArrayToRef(array: ArrayLike<number>, offset: number, result: Vector3): void;
    constructor(opt_src?: Array<number> | Float32Array);
    projectOnVector(vector: Vector3): Vector3;
    applyQuaternion({ elements }: Vector4): this;
    /**
     * Normalize.
     * @return this
     */
    normalize(): this;
    /**
     * Scales a vec3 by a scalar number
     *
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */
    add(vector: Vector3): this;
    addS(b: number): this;
    scale(b: number): this;
    scale2(scale: number): Vector3;
    subtract2(otherVector: Vector3): Vector3;
    add2(otherVector: Vector3): Vector3;
    distanceToSquared(x: number, y: number, z: number): number;
    subtract(vector: Vector3): this;
    divideScalar(scalar: number): this;
    applyMatrix4({ elements }: Matrix4): this;
    lerp(a: ArrayLike<number>, b: ArrayLike<number>, t: number): this;
    lengthSq(): number;
    multiply({ elements }: Vector3): this;
    static angle(a: Vector3, b: Vector3): number;
    static cross(vecA: Vector3, vecB: Vector3): Vector3;
    static dot(vecA: Vector3, vecB: Vector3): number;
    length(): number;
    min(v: Vector3): this;
    max(v: Vector3): this;
    subVectors(a: Vector3, b: Vector3): this;
}
declare class Box {
    min: Vector3;
    max: Vector3;
    expand(box: {
        min: Vector3;
        max: Vector3;
    }): void;
    getSize(): number;
}
/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
declare class Vector4 {
    elements: Float32Array;
    constructor(opt_src?: Array<number> | Float32Array);
    set(e: ArrayLike<number>): this;
    add(vector: Vector4): this;
    normalize(): this;
    setFromRotationMatrix({ elements }: Matrix4): this;
    lerp(a: ArrayLike<number>, b: ArrayLike<number>, t: number): this;
    inverse(): this;
}
declare class Vector2 {
    elements: Float32Array;
    get x(): number;
    get y(): number;
    set x(v: number);
    set y(v: number);
    constructor(opt_src?: Array<number> | Float32Array);
    subtract(vector: Vector2): this;
    lerp(a: ArrayLike<number>, b: ArrayLike<number>, t: number): this;
}
declare function Frustum(m: Matrix4): Vector4[];
export { Matrix2, Matrix3, Matrix4, Vector, Vector2, Vector3, Vector4, Frustum, Box };
