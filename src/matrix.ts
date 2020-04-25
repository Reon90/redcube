/* eslint-disable */

/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

class Matrix2 {
    elements: Float32Array;

    constructor(opt_src?: Matrix2) {
        let i;
        let s;
        let d;
        if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
            s = opt_src.elements;
            d = new Float32Array(4);
            for (i = 0; i < 4; ++i) {
                d[i] = s[i];
            }
            this.elements = d;
        } else {
            this.elements = new Float32Array([1, 0, 0, 1]);
        }
    }

    set(src) {
        let i;
        let s;
        let d;

        s = src;
        d = this.elements;

        if (s === d) {
            return;
        }

        for (i = 0; i < 4; ++i) {
            d[i] = s[i];
        }

        return this;
    }
}

/**
 * Constructor of Matrix3
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
class Matrix3 {
    elements: Float32Array;

    constructor(opt_src?: Matrix3) {
        let i;
        let s;
        let d;
        if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
            s = opt_src.elements;
            d = new Float32Array(9);
            for (i = 0; i < 9; ++i) {
                d[i] = s[i];
            }
            this.elements = d;
        } else {
            this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        }
    }

    set(src) {
        let i;
        let s;
        let d;

        s = src;
        d = this.elements;

        if (s === d) {
            return;
        }

        for (i = 0; i < 9; ++i) {
            d[i] = s[i];
        }

        return this;
    }

    normalFromMat4(a) {
        const e = this.elements;
        a = a.elements;

        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a13 = a[7];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a23 = a[11];
        const a30 = a[12];
        const a31 = a[13];
        const a32 = a[14];
        const a33 = a[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        e[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        e[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        e[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        e[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        e[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        e[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        e[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        e[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        e[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return this;
    }

    multiply(matrix) {
        const ae = this.elements;
        const be = matrix.elements;
        const te = this.elements;

        const a11 = ae[0],
            a12 = ae[3],
            a13 = ae[6];
        const a21 = ae[1],
            a22 = ae[4],
            a23 = ae[7];
        const a31 = ae[2],
            a32 = ae[5],
            a33 = ae[8];

        const b11 = be[0],
            b12 = be[3],
            b13 = be[6];
        const b21 = be[1],
            b22 = be[4],
            b23 = be[7];
        const b31 = be[2],
            b32 = be[5],
            b33 = be[8];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    }
}

/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
class Matrix4 {
    elements: Float32Array;

    constructor(opt_src?: Matrix4) {
        let i;
        let s;
        let d;
        if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
            s = opt_src.elements;
            d = new Float32Array(16);
            for (i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            this.elements = d;
        } else {
            this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
    }

    /**
     * Copy matrix.
     * @param src source matrix
     * @return this
     */
    set(src) {
        let i;
        let s;
        let d;

        s = src;
        d = this.elements;

        if (s === d) {
            return;
        }

        for (i = 0; i < 16; ++i) {
            d[i] = s[i];
        }

        return this;
    }

    multiply(matrix) {
        this.concat(matrix);
        return this;
    }

    /**
     * Multiply the matrix from the right.
     * @param other The multiply matrix
     * @return this
     */
    concat({ elements }) {
        let i;
        let e;
        let a;
        let b;
        let ai0;
        let ai1;
        let ai2;
        let ai3;

        // Calculate e = a * b
        e = this.elements;
        a = this.elements;
        b = elements;

        // If e equals b, copy b to temporary matrix.
        if (e === b) {
            b = new Float32Array(16);
            for (i = 0; i < 16; ++i) {
                b[i] = e[i];
            }
        }

        for (i = 0; i < 4; i++) {
            ai0 = a[i];
            ai1 = a[i + 4];
            ai2 = a[i + 8];
            ai3 = a[i + 12];
            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }

        return this;
    }

    /**
     * Calculate the inverse matrix of specified matrix, and set to this.
     * @param other The source matrix
     * @return this
     */
    setInverseOf({ elements }) {
        let i;
        let s;
        let d;
        let inv;
        let det;

        s = elements;
        d = this.elements;
        inv = new Float32Array(16);

        inv[0] =
            s[5] * s[10] * s[15] -
            s[5] * s[11] * s[14] -
            s[9] * s[6] * s[15] +
            s[9] * s[7] * s[14] +
            s[13] * s[6] * s[11] -
            s[13] * s[7] * s[10];
        inv[4] =
            -s[4] * s[10] * s[15] +
            s[4] * s[11] * s[14] +
            s[8] * s[6] * s[15] -
            s[8] * s[7] * s[14] -
            s[12] * s[6] * s[11] +
            s[12] * s[7] * s[10];
        inv[8] =
            s[4] * s[9] * s[15] -
            s[4] * s[11] * s[13] -
            s[8] * s[5] * s[15] +
            s[8] * s[7] * s[13] +
            s[12] * s[5] * s[11] -
            s[12] * s[7] * s[9];
        inv[12] =
            -s[4] * s[9] * s[14] +
            s[4] * s[10] * s[13] +
            s[8] * s[5] * s[14] -
            s[8] * s[6] * s[13] -
            s[12] * s[5] * s[10] +
            s[12] * s[6] * s[9];

        inv[1] =
            -s[1] * s[10] * s[15] +
            s[1] * s[11] * s[14] +
            s[9] * s[2] * s[15] -
            s[9] * s[3] * s[14] -
            s[13] * s[2] * s[11] +
            s[13] * s[3] * s[10];
        inv[5] =
            s[0] * s[10] * s[15] -
            s[0] * s[11] * s[14] -
            s[8] * s[2] * s[15] +
            s[8] * s[3] * s[14] +
            s[12] * s[2] * s[11] -
            s[12] * s[3] * s[10];
        inv[9] =
            -s[0] * s[9] * s[15] +
            s[0] * s[11] * s[13] +
            s[8] * s[1] * s[15] -
            s[8] * s[3] * s[13] -
            s[12] * s[1] * s[11] +
            s[12] * s[3] * s[9];
        inv[13] =
            s[0] * s[9] * s[14] -
            s[0] * s[10] * s[13] -
            s[8] * s[1] * s[14] +
            s[8] * s[2] * s[13] +
            s[12] * s[1] * s[10] -
            s[12] * s[2] * s[9];

        inv[2] =
            s[1] * s[6] * s[15] -
            s[1] * s[7] * s[14] -
            s[5] * s[2] * s[15] +
            s[5] * s[3] * s[14] +
            s[13] * s[2] * s[7] -
            s[13] * s[3] * s[6];
        inv[6] =
            -s[0] * s[6] * s[15] +
            s[0] * s[7] * s[14] +
            s[4] * s[2] * s[15] -
            s[4] * s[3] * s[14] -
            s[12] * s[2] * s[7] +
            s[12] * s[3] * s[6];
        inv[10] =
            s[0] * s[5] * s[15] -
            s[0] * s[7] * s[13] -
            s[4] * s[1] * s[15] +
            s[4] * s[3] * s[13] +
            s[12] * s[1] * s[7] -
            s[12] * s[3] * s[5];
        inv[14] =
            -s[0] * s[5] * s[14] +
            s[0] * s[6] * s[13] +
            s[4] * s[1] * s[14] -
            s[4] * s[2] * s[13] -
            s[12] * s[1] * s[6] +
            s[12] * s[2] * s[5];

        inv[3] =
            -s[1] * s[6] * s[11] +
            s[1] * s[7] * s[10] +
            s[5] * s[2] * s[11] -
            s[5] * s[3] * s[10] -
            s[9] * s[2] * s[7] +
            s[9] * s[3] * s[6];
        inv[7] =
            s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
        inv[11] =
            -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
        inv[15] =
            s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

        det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
        if (det === 0) {
            return this;
        }

        det = 1 / det;
        for (i = 0; i < 16; i++) {
            d[i] = inv[i] * det;
        }

        return this;
    }

    /**
     * Calculate the inverse matrix of this, and set to this.
     * @return this
     */
    invert() {
        return this.setInverseOf(this);
    }

    makeOrthographic(left, right, top, bottom, near, far) {
        var te = this.elements;
        var w = 1.0 / (right - left);
        var h = 1.0 / (top - bottom);
        var p = 1.0 / (far - near);

        var x = (right + left) * w;
        var y = (top + bottom) * h;
        var z = (far + near) * p;

        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;

        return this;
    }

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
    setOrtho(r, t, near, far) {
        let e;
        let rw;
        let rh;
        let rd;

        rw = 1 / r;
        rh = 1 / t;
        rd = 2 / (near - far);

        e = this.elements;

        e[0] = rw;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;

        e[4] = 0;
        e[5] = rh;
        e[6] = 0;
        e[7] = 0;

        e[8] = 0;
        e[9] = 0;
        e[10] = rd;
        e[11] = (far + near) / (near - far);

        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;

        return this;
    }

    /**
     * Set the perspective projection matrix by fovy and aspect.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    setPerspective(fovy, aspect, near, far) {
        let e;
        let rd;
        let s;
        let ct;

        if (near === far || aspect === 0) {
            throw 'null frustum';
        }
        if (near <= 0) {
            throw 'near <= 0';
        }
        if (far <= 0) {
            throw 'far <= 0';
        }

        fovy /= 2;
        s = Math.sin(fovy);
        if (s === 0) {
            throw 'null frustum';
        }

        rd = 1 / (far - near);
        ct = Math.cos(fovy) / s;

        e = this.elements;

        e[0] = ct / aspect;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;

        e[4] = 0;
        e[5] = ct;
        e[6] = 0;
        e[7] = 0;

        e[8] = 0;
        e[9] = 0;
        e[10] = -(far + near) * rd;
        e[11] = -1;

        e[12] = 0;
        e[13] = 0;
        e[14] = -2 * near * far * rd;
        e[15] = 0;

        return this;
    }

    /**
     * Multiply the perspective projection matrix from the right.
     * @param fovy The angle between the upper and lower sides of the frustum.
     * @param aspect The aspect ratio of the frustum. (width/height)
     * @param near The distances to the nearer depth clipping plane. This value must be plus value.
     * @param far The distances to the farther depth clipping plane. This value must be plus value.
     * @return this
     */
    perspective(fovy, aspect, near, far) {
        return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
    }

    /**
     * Multiply the four-dimensional vector.
     * @param pos  The multiply vector
     * @return The result of multiplication(Float32Array)
     */
    multiplyVector4({ elements }) {
        const e = this.elements;
        const p = elements;
        const v = new Vector4();
        const result = v.elements;

        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
        result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

        return v;
    }

    getScaling() {
        let e = this.elements;
        let m11 = e[0];
        let m12 = e[1];
        let m13 = e[2];
        let m21 = e[4];
        let m22 = e[5];
        let m23 = e[6];
        let m31 = e[8];
        let m32 = e[9];
        let m33 = e[10];
        let out = new Vector3([
            Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
            Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
            Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
        ]);
        return out;
    }

    scale(vec3: Vector3) {
        const x = vec3.elements[0];
        const y = vec3.elements[1];
        const z = vec3.elements[2];
        const e = this.elements;
        e[0] *= x;
        e[4] *= y;
        e[8] *= z;
        e[1] *= x;
        e[5] *= y;
        e[9] *= z;
        e[2] *= x;
        e[6] *= y;
        e[10] *= z;
        e[3] *= x;
        e[7] *= y;
        e[11] *= z;
        return this;
    }

    restoreScale(vec3: Vector3) {
        const x = vec3.elements[0];
        const y = vec3.elements[1];
        const z = vec3.elements[2];
        const e = this.elements;
        e[0] /= x;
        e[4] /= y;
        e[8] /= z;
        e[1] /= x;
        e[5] /= y;
        e[9] /= z;
        e[2] /= x;
        e[6] /= y;
        e[10] /= z;
        e[3] /= x;
        e[7] /= y;
        e[11] /= z;
        return this;
    }

    setTranslate(vec3: Vector3) {
        const e = this.elements;
        const x = vec3.elements[0];
        const y = vec3.elements[1];
        const z = vec3.elements[2];
        e[12] = x;
        e[13] = y;
        e[14] = z;
        e[15] = 1;
        return this;
    }

    /**
     * Multiply the matrix for translation from the right.
     * @param x The X value of a translation.
     * @param y The Y value of a translation.
     * @param z The Z value of a translation.
     * @return this
     */
    translate(x, y, z) {
        const e = this.elements;
        e[12] += e[0] * x + e[4] * y + e[8] * z;
        e[13] += e[1] * x + e[5] * y + e[9] * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this;
    }

    getMaxScaleOnAxis() {
        const te = this.elements;

        const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
        const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
        const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }

    rotate(axis, rad) {
        let x = axis.elements[0],
          y = axis.elements[1],
          z = axis.elements[2];
        let len = Math.hypot(x, y, z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;
      
        if (len < Number.EPSILON) {
          return null;
        }
      
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
      
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
        let a = this.elements;
      
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
      
        // Construct the elements of the rotation matrix
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;
      
        // Perform rotation-specific matrix multiplication
        a[0] = a00 * b00 + a10 * b01 + a20 * b02;
        a[1] = a01 * b00 + a11 * b01 + a21 * b02;
        a[2] = a02 * b00 + a12 * b01 + a22 * b02;
        a[3] = a03 * b00 + a13 * b01 + a23 * b02;
        a[4] = a00 * b10 + a10 * b11 + a20 * b12;
        a[5] = a01 * b10 + a11 * b11 + a21 * b12;
        a[6] = a02 * b10 + a12 * b11 + a22 * b12;
        a[7] = a03 * b10 + a13 * b11 + a23 * b12;
        a[8] = a00 * b20 + a10 * b21 + a20 * b22;
        a[9] = a01 * b20 + a11 * b21 + a21 * b22;
        a[10] = a02 * b20 + a12 * b21 + a22 * b22;
        a[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
      }

    makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp

        const te = this.elements;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const x = axis.elements[0],
            y = axis.elements[1],
            z = axis.elements[2];
        const tx = t * x,
            ty = t * y;

        te[0] = tx * x + c;
        te[1] = tx * y - s * z;
        te[2] = tx * z + s * y;
        te[3] = 0;
        te[4] = tx * y + s * z;
        te[5] = ty * y + c;
        te[6] = ty * z - s * x;
        te[7] = 0;
        te[8] = tx * z - s * y;
        te[9] = ty * z + s * x;
        te[10] = t * z * z + c;
        te[11] = 0;
        // te[12] = 0;
        // te[13] = 0;
        // te[14] = 0;
        te[15] = 1;

        return this;
    }

    makeRotationFromQuaternion(q) {
        const te = this.elements;

        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;

        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;

        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);

        return this;
    }

    transpose() {
        let e;
        let t;

        e = this.elements;

        t = e[1];
        e[1] = e[4];
        e[4] = t;
        t = e[2];
        e[2] = e[8];
        e[8] = t;
        t = e[3];
        e[3] = e[12];
        e[12] = t;
        t = e[6];
        e[6] = e[9];
        e[9] = t;
        t = e[7];
        e[7] = e[13];
        e[13] = t;
        t = e[11];
        e[11] = e[14];
        e[14] = t;

        return this;
    }
}

class Vector {
    elements: Float32Array;

    constructor(src: Float32Array) {
        this.elements = src.slice();
    }

    lerp(a, b, t) {
        const out = this.elements;

        for (let i = 0; i < out.length; i++) {
            out[i] = a[i] + t * (b[i] - a[i]);
        }

        return this;
    }
}

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
class Vector3 {
    elements: Float32Array;

    get x() {
        return this.elements[0];
    }
    get y() {
        return this.elements[1];
    }
    get z() {
        return this.elements[2];
    }
    set x(v) {
        this.elements[0] = v;
    }
    set y(v) {
        this.elements[1] = v;
    }
    set z(v) {
        this.elements[2] = v;
    }

    constructor(opt_src?: Array<number> | Float32Array) {
        const v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
            v[2] = opt_src[2];
        }
        this.elements = v;
    }

    projectOnVector( vector ) {
        const scalar = Vector3.dot( vector, this ) / vector.lengthSq();
        return new Vector3( vector ).scale( scalar );
    }

    applyQuaternion({ elements }) {
        const x = this.elements[0];
        const y = this.elements[1];
        const z = this.elements[2];
        const qx = elements[0];
        const qy = elements[1];
        const qz = elements[2];
        const qw = elements[3];

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.elements[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.elements[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.elements[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    }

    /**
     * Normalize.
     * @return this
     */
    normalize() {
        const v = this.elements;
        const c = v[0];
        const d = v[1];
        const e = v[2];
        let g = Math.sqrt(c * c + d * d + e * e);
        if (g) {
            if (g == 1) {
                return this;
            }
        } else {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            return this;
        }
        g = 1 / g;
        v[0] = c * g;
        v[1] = d * g;
        v[2] = e * g;
        return this;
    }

    /**
     * Scales a vec3 by a scalar number
     *
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */
    add(b) {
        const a = this.elements;
        b = b.elements;
        a[0] = a[0] + b[0];
        a[1] = a[1] + b[1];
        a[2] = a[2] + b[2];
        return this;
    }

    addS(b) {
        const a = this.elements;
        a[0] = a[0] + b;
        a[1] = a[1] + b;
        a[2] = a[2] + b;
        return this;
    }

    scale(b) {
        const a = this.elements;
        a[0] = a[0] * b;
        a[1] = a[1] * b;
        a[2] = a[2] * b;
        return this;
    }

    distanceToSquared(x, y, z) {
        const dx = this.elements[0] - x;
        const dy = this.elements[1] - y;
        const dz = this.elements[2] - z;

        return dx * dx + dy * dy + dz * dz;
    }

    subtract(b) {
        const out = this.elements;
        b = b.elements;
        out[0] = out[0] - b[0];
        out[1] = out[1] - b[1];
        out[2] = out[2] - b[2];
        return this;
    }

    divideScalar(scalar) {
        return this.scale(1 / scalar);
    }

    applyMatrix4({ elements }) {
        const x = this.elements[0];
        const y = this.elements[1];
        const z = this.elements[2];
        const e = elements;

        this.elements[0] = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.elements[1] = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.elements[2] = e[2] * x + e[6] * y + e[10] * z + e[14];
        const w = e[3] * x + e[7] * y + e[11] * z + e[15];

        return this.divideScalar(w);
    }

    lerp(a, b, t) {
        const out = this.elements;
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        out[2] = az + t * (b[2] - az);
        return this;
    }

    lengthSq() {
        return this.elements[0] * this.elements[0] + this.elements[1] * this.elements[1] + this.elements[2] * this.elements[2];
    }

    multiply({ elements }) {
        this.elements[0] *= elements[0];
        this.elements[1] *= elements[1];
        this.elements[2] *= elements[2];

        return this;
    }

    static angle(a, b) {
        const tempA = new Vector3(a.elements);
        const tempB = new Vector3(b.elements);

        tempA.normalize();
        tempB.normalize();

        const cosine = Vector3.dot(tempA, tempB);

        if (cosine > 1.0) {
            return 0;
        } else {
            return Math.acos(cosine);
        }
    }

    static cross(a, b) {
        a = a.elements;
        b = b.elements;
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const bx = b[0];
        const by = b[1];
        const bz = b[2];

        const out = new Vector3();
        out.elements[0] = ay * bz - az * by;
        out.elements[1] = az * bx - ax * bz;
        out.elements[2] = ax * by - ay * bx;
        return out;
    }

    static dot(a, b) {
        a = a.elements;
        b = b.elements;
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
}

/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
class Vector4 {
    elements: Float32Array;

    constructor(opt_src?: Array<number> | Float32Array) {
        const v = new Float32Array(4);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
            v[2] = opt_src[2];
            v[3] = opt_src[3];
        }
        this.elements = v;
    }

    set(e) {
        const a = this.elements;
        a[0] = e[0];
        a[1] = e[1];
        a[2] = e[2];
        a[3] = e[3];
        return this;
    }

    add(b) {
        const a = this.elements;
        b = b.elements;
        a[0] = b[0];
        a[1] = b[1];
        a[2] = b[2];
        a[3] = a[3] + b[3];
        return this;
    }

    normalize() {
        const x = this.elements[0];
        const y = this.elements[1];
        const z = this.elements[2];
        const w = this.elements[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.elements[0] = x * len;
            this.elements[1] = y * len;
            this.elements[2] = z * len;
            this.elements[3] = w * len;
        }
        return this;
    }

    setFromRotationMatrix({ elements }) {
        const te = elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6];
        const m33 = te[10];
        const trace = m11 + m22 + m33;
        let s;

        if (trace > 0) {
            s = 0.5 / Math.sqrt(trace + 1.0);

            this.elements[3] = 0.25 / s;
            this.elements[0] = (m32 - m23) * s;
            this.elements[1] = (m13 - m31) * s;
            this.elements[2] = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this.elements[3] = (m32 - m23) / s;
            this.elements[0] = 0.25 * s;
            this.elements[1] = (m12 + m21) / s;
            this.elements[2] = (m13 + m31) / s;
        } else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this.elements[3] = (m13 - m31) / s;
            this.elements[0] = (m12 + m21) / s;
            this.elements[1] = 0.25 * s;
            this.elements[2] = (m23 + m32) / s;
        } else {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this.elements[3] = (m21 - m12) / s;
            this.elements[0] = (m13 + m31) / s;
            this.elements[1] = (m23 + m32) / s;
            this.elements[2] = 0.25 * s;
        }

        return this;
    }

    lerp(a, b, t) {
        const out = this.elements;

        if (t === 0) return this;
        if (t === 1) {
            out[0] = b[0];
            out[1] = b[1];
            out[2] = b[2];
            out[3] = b[3];

            return this;
        }

        const x = a[0],
            y = a[1],
            z = a[2],
            w = a[3];

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        let cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];

        if (cosHalfTheta < 0) {
            out[3] = -b[3];
            out[0] = -b[0];
            out[1] = -b[1];
            out[2] = -b[2];

            cosHalfTheta = -cosHalfTheta;
        } else {
            out[0] = b[0];
            out[1] = b[1];
            out[2] = b[2];
            out[3] = b[3];
        }

        if (cosHalfTheta >= 1.0) {
            out[3] = w;
            out[0] = x;
            out[1] = y;
            out[2] = z;

            return this;
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
            var s = 1 - t;
            out[3] = s * w + t * out[3];
            out[0] = s * x + t * out[0];
            out[1] = s * y + t * out[1];
            out[2] = s * z + t * out[2];

            return this.normalize();
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        out[3] = w * ratioA + out[3] * ratioB;
        out[0] = x * ratioA + out[0] * ratioB;
        out[1] = y * ratioA + out[1] * ratioB;
        out[2] = z * ratioA + out[2] * ratioB;

        return this;
    }
}

class Vector2 {
    elements: Float32Array;

    get x() {
        return this.elements[0];
    }
    get y() {
        return this.elements[1];
    }
    set x(v) {
        this.elements[0] = v;
    }
    set y(v) {
        this.elements[1] = v;
    }

    constructor(opt_src?: Array<number> | Float32Array) {
        const v = new Float32Array(2);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
        }
        this.elements = v;
    }

    subtract(b) {
        const out = this.elements;
        b = b.elements;
        out[0] = out[0] - b[0];
        out[1] = out[1] - b[1];
        return this;
    }

    lerp(a, b, t) {
        const out = this.elements;
        const ax = a[0];
        const ay = a[1];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        return this;
    }
}

// { 0: right, 1: left, 2: bottom. 3: top, 4: far, 5: near }
function Frustum(m) {
    const planes = [new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4()];
    const me = m.elements;
    let me0 = me[0],
        me1 = me[1],
        me2 = me[2],
        me3 = me[3];
    let me4 = me[4],
        me5 = me[5],
        me6 = me[6],
        me7 = me[7];
    let me8 = me[8],
        me9 = me[9],
        me10 = me[10],
        me11 = me[11];
    let me12 = me[12],
        me13 = me[13],
        me14 = me[14],
        me15 = me[15];

    planes[0].set([me3 - me0, me7 - me4, me11 - me8, me15 - me12]).normalize();
    planes[1].set([me3 + me0, me7 + me4, me11 + me8, me15 + me12]).normalize();
    planes[2].set([me3 + me1, me7 + me5, me11 + me9, me15 + me13]).normalize();
    planes[3].set([me3 - me1, me7 - me5, me11 - me9, me15 - me13]).normalize();
    planes[4].set([me3 - me2, me7 - me6, me11 - me10, me15 - me14]).normalize();
    planes[5].set([me3 + me2, me7 + me6, me11 + me10, me15 + me14]).normalize();

    return planes;
}

export { Matrix2, Matrix3, Matrix4, Vector, Vector2, Vector3, Vector4, Frustum };
