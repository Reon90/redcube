(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("redcube", [], factory);
	else if(typeof exports === 'object')
		exports["redcube"] = factory();
	else
		root["redcube"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */

/** 
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

var Matrix2 = function Matrix2(opt_src) {
    var i = void 0,
        s = void 0,
        d = void 0;
    if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(4);
        for (i = 0; i < 4; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 1]);
    }
};

Matrix2.prototype.set = function (src) {
    var i = void 0,
        s = void 0,
        d = void 0;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }

    for (i = 0; i < 4; ++i) {
        d[i] = s[i];
    }

    return this;
};

/**
 * Constructor of Matrix3
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
var Matrix3 = function Matrix3(opt_src) {
    var i = void 0,
        s = void 0,
        d = void 0;
    if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(9);
        for (i = 0; i < 9; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }
};

Matrix3.prototype.set = function (src) {
    var i = void 0,
        s = void 0,
        d = void 0;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }

    for (i = 0; i < 9; ++i) {
        d[i] = s[i];
    }

    return this;
};

Matrix3.prototype.normalFromMat4 = function (a) {
    var e = this.elements;
    a = a.elements;

    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11],
        a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15],
        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,


    // Calculate the determinant
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
};

/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
var Matrix4 = function Matrix4(opt_src) {
    var i = void 0,
        s = void 0,
        d = void 0;
    if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object' && opt_src.hasOwnProperty('elements')) {
        s = opt_src.elements;
        d = new Float32Array(16);
        for (i = 0; i < 16; ++i) {
            d[i] = s[i];
        }
        this.elements = d;
    } else {
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
};

/**
 * Copy matrix.
 * @param src source matrix
 * @return this
 */
Matrix4.prototype.set = function (src) {
    var i = void 0,
        s = void 0,
        d = void 0;

    s = src;
    d = this.elements;

    if (s === d) {
        return;
    }

    for (i = 0; i < 16; ++i) {
        d[i] = s[i];
    }

    return this;
};

/**
 * Multiply the matrix from the right.
 * @param other The multiply matrix
 * @return this
 */
Matrix4.prototype.concat = function (other) {
    var i = void 0,
        e = void 0,
        a = void 0,
        b = void 0,
        ai0 = void 0,
        ai1 = void 0,
        ai2 = void 0,
        ai3 = void 0;

    // Calculate e = a * b
    e = this.elements;
    a = this.elements;
    b = other.elements;

    // If e equals b, copy b to temporary matrix.
    if (e === b) {
        b = new Float32Array(16);
        for (i = 0; i < 16; ++i) {
            b[i] = e[i];
        }
    }

    for (i = 0; i < 4; i++) {
        ai0 = a[i];ai1 = a[i + 4];ai2 = a[i + 8];ai3 = a[i + 12];
        e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
        e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
        e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
        e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }

    return this;
};
Matrix4.prototype.multiply = Matrix4.prototype.concat;

/**
 * Calculate the inverse matrix of specified matrix, and set to this.
 * @param other The source matrix
 * @return this
 */
Matrix4.prototype.setInverseOf = function (other) {
    var i = void 0,
        s = void 0,
        d = void 0,
        inv = void 0,
        det = void 0;

    s = other.elements;
    d = this.elements;
    inv = new Float32Array(16);

    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
        return this;
    }

    det = 1 / det;
    for (i = 0; i < 16; i++) {
        d[i] = inv[i] * det;
    }

    return this;
};

/**
 * Calculate the inverse matrix of this, and set to this.
 * @return this
 */
Matrix4.prototype.invert = function () {
    return this.setInverseOf(this);
};

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
Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
    var e = void 0,
        rw = void 0,
        rh = void 0,
        rd = void 0;

    if (left === right || bottom === top || near === far) {
        throw 'null frustum';
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = this.elements;

    e[0] = 2 * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
};

/**
 * Multiply the orthographic projection matrix from the right.
 * @param left The coordinate of the left of clipping plane.
 * @param right The coordinate of the right of clipping plane.
 * @param bottom The coordinate of the bottom of clipping plane.
 * @param top The coordinate of the top top clipping plane.
 * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
 * @return this
 */
Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
    return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

/**
 * Set the perspective projection matrix by fovy and aspect.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
    var e = void 0,
        rd = void 0,
        s = void 0,
        ct = void 0;

    if (near === far || aspect === 0) {
        throw 'null frustum';
    }
    if (near <= 0) {
        throw 'near <= 0';
    }
    if (far <= 0) {
        throw 'far <= 0';
    }

    fovy = Math.PI * fovy / 180 / 2;
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
};

/**
 * Multiply the perspective projection matrix from the right.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
    return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
};

/**
 * Multiply the four-dimensional vector.
 * @param pos  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
Matrix4.prototype.multiplyVector4 = function (pos) {
    var e = this.elements;
    var p = pos.elements;
    var v = new Vector4();
    var result = v.elements;

    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
    result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

    return v;
};

/**
 * Multiply the matrix for scaling from the right.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.scale = function (x, y, z) {
    var e = this.elements;
    e[0] *= x;e[4] *= y;e[8] *= z;
    e[1] *= x;e[5] *= y;e[9] *= z;
    e[2] *= x;e[6] *= y;e[10] *= z;
    e[3] *= x;e[7] *= y;e[11] *= z;
    return this;
};

/**
 * Set the matrix for translation.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.setTranslate = function (x, y, z) {
    var e = this.elements;
    e[12] = x;
    e[13] = y;
    e[14] = z;
    e[15] = 1;
    return this;
};

/**
 * Multiply the matrix for translation from the right.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.translate = function (x, y, z) {
    var e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
};

Matrix4.prototype.getMaxScaleOnAxis = function () {

    var te = this.elements;

    var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
};

Matrix4.prototype.makeRotationFromQuaternion = function (q) {
    var te = this.elements;

    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    var xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    var yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    var wx = w * x2,
        wy = w * y2,
        wz = w * z2;

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
};

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector3 = function Vector3(opt_src) {
    var v = new Float32Array(3);
    if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object') {
        v[0] = opt_src[0];v[1] = opt_src[1];v[2] = opt_src[2];
    }
    this.elements = v;
};

Vector3.angle = function (a, b) {
    var tempA = new Vector3(a.elements);
    var tempB = new Vector3(b.elements);

    tempA.normalize();
    tempB.normalize();

    var cosine = Vector3.dot(tempA, tempB);

    if (cosine > 1.0) {
        return 0;
    } else {
        return Math.acos(cosine);
    }
};

Vector3.cross = function (a, b) {
    a = a.elements;
    b = b.elements;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    var out = new Vector3();
    out.elements[0] = ay * bz - az * by;
    out.elements[1] = az * bx - ax * bz;
    out.elements[2] = ax * by - ay * bx;
    return out;
};

Vector3.dot = function (a, b) {
    a = a.elements;
    b = b.elements;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
  * Normalize.
  * @return this
  */
Vector3.prototype.normalize = function () {
    var v = this.elements;
    var c = v[0],
        d = v[1],
        e = v[2],
        g = Math.sqrt(c * c + d * d + e * e);
    if (g) {
        if (g == 1) {
            return this;
        }
    } else {
        v[0] = 0;v[1] = 0;v[2] = 0;
        return this;
    }
    g = 1 / g;
    v[0] = c * g;v[1] = d * g;v[2] = e * g;
    return this;
};

/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
Vector3.prototype.add = function (b) {
    var a = this.elements;
    b = b.elements;
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    a[2] = a[2] + b[2];
    return this;
};

Vector3.prototype.addS = function (b) {
    var a = this.elements;
    a[0] = a[0] + b;
    a[1] = a[1] + b;
    a[2] = a[2] + b;
    return this;
};

Vector3.prototype.scale = function (b) {
    var a = this.elements;
    a[0] = a[0] * b;
    a[1] = a[1] * b;
    a[2] = a[2] * b;
    return this;
};

Vector3.prototype.distanceToSquared = function (x, y, z) {

    var dx = this.elements[0] - x,
        dy = this.elements[1] - y,
        dz = this.elements[2] - z;

    return dx * dx + dy * dy + dz * dz;
};

Vector3.prototype.subtract = function (b) {
    var out = this.elements;
    b = b.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    out[2] = out[2] - b[2];
    return this;
};

/**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector4 = function Vector4(opt_src) {
    var v = new Float32Array(4);
    if (opt_src && (typeof opt_src === 'undefined' ? 'undefined' : _typeof(opt_src)) === 'object') {
        v[0] = opt_src[0];v[1] = opt_src[1];v[2] = opt_src[2];v[3] = opt_src[3];
    }
    this.elements = v;
};

Vector4.prototype.set = function (e) {
    var a = this.elements;
    a[0] = e[0];
    a[1] = e[1];
    a[2] = e[2];
    a[3] = e[3];
    return this;
};

Vector4.prototype.add = function (b) {
    var a = this.elements;
    b = b.elements;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = a[3] + b[3];
    return this;
};

Vector4.prototype.normalize = function () {
    var x = this.elements[0],
        y = this.elements[1],
        z = this.elements[2],
        w = this.elements[3];
    var len = x * x + y * y + z * z + w * w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        this.elements[0] = x * len;
        this.elements[1] = y * len;
        this.elements[2] = z * len;
        this.elements[3] = w * len;
    }
    return this;
};

Vector3.prototype.divideScalar = function (scalar) {
    return this.scale(1 / scalar);
};

Vector3.prototype.applyMatrix4 = function (m) {

    var x = this.elements[0],
        y = this.elements[1],
        z = this.elements[2];
    var e = m.elements;

    this.elements[0] = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.elements[1] = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.elements[2] = e[2] * x + e[6] * y + e[10] * z + e[14];
    var w = e[3] * x + e[7] * y + e[11] * z + e[15];

    return this.divideScalar(w);
};

Vector4.prototype.lerp = function (a, b, t) {
    var out = this.elements;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return this;
};

Vector3.prototype.lerp = function (a, b, t) {
    var out = this.elements;
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return this;
};

function Frustum(m) {
    var planes = [new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4()];
    var me = m.elements;
    var me0 = me[0],
        me1 = me[1],
        me2 = me[2],
        me3 = me[3];
    var me4 = me[4],
        me5 = me[5],
        me6 = me[6],
        me7 = me[7];
    var me8 = me[8],
        me9 = me[9],
        me10 = me[10],
        me11 = me[11];
    var me12 = me[12],
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

exports.Matrix2 = Matrix2;
exports.Matrix3 = Matrix3;
exports.Matrix4 = Matrix4;
exports.Vector3 = Vector3;
exports.Vector4 = Vector4;
exports.Frustum = Frustum;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setGlEnum = setGlEnum;
exports.setGl = setGl;
exports.isMatrix = isMatrix;
exports.random = random;
exports.getMatrixType = getMatrixType;
exports.getDataType = getDataType;
exports.getComponentType = getComponentType;
exports.getMethod = getMethod;
exports.getAnimationComponent = getAnimationComponent;
exports.getAnimationMethod = getAnimationMethod;
exports.range = range;
exports.interpolation = interpolation;
exports.buildArray = buildArray;
exports.compileShader = compileShader;
exports.walk = walk;

var _matrix = __webpack_require__(0);

var glEnum = void 0;
var gl = void 0;

function setGlEnum(g) {
    glEnum = g;
}
function setGl(g) {
    gl = g;
}

function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function getMatrixType(type) {
    if (glEnum[type] === 'FLOAT_MAT4') {
        return _matrix.Matrix4;
    }
    if (glEnum[type] === 'FLOAT_MAT3') {
        return _matrix.Matrix3;
    }
    if (glEnum[type] === 'FLOAT_MAT2') {
        return _matrix.Matrix2;
    }
}

function getDataType(type) {
    var count = void 0;
    switch (type) {
        case 'MAT2':
            count = 4;
            break;
        case 'MAT3':
            count = 9;
            break;
        case 'MAT4':
            count = 16;
            break;
        case 'VEC4':
            count = 4;
            break;
        case 'VEC3':
            count = 3;
            break;
        case 'VEC2':
            count = 2;
            break;
        case 'SCALAR':
            count = 1;
            break;
    }
    return count;
}

function getComponentType(type) {
    var count = void 0;
    switch (glEnum[type]) {
        case 'FLOAT_VEC4':
            count = 4;
            break;
        case 'FLOAT_VEC3':
            count = 3;
            break;
        case 'FLOAT_VEC2':
            count = 2;
            break;
    }
    return count;
}

function getMethod(type) {
    var method = void 0;
    switch (glEnum[type]) {
        case 'FLOAT_VEC2':
            method = 'uniform2f';
            break;
        case 'FLOAT_VEC4':
            method = 'uniform4f';
            break;
        case 'FLOAT':
            method = 'uniform1f';
            break;
        case 'FLOAT_VEC3':
            method = 'uniform3f';
            break;
        case 'FLOAT_MAT4':
            method = 'uniformMatrix4fv';
            break;
        case 'FLOAT_MAT3':
            method = 'uniformMatrix3fv';
            break;
        case 'FLOAT_MAT2':
            method = 'uniformMatrix2fv';
            break;
        case 'SAMPLER_2D':
            method = 'uniform1i';
            break;
    }
    return method;
}

function getAnimationComponent(type) {
    if (type === 'rotation') {
        return 4;
    } else {
        return 3;
    }
}

function getAnimationMethod(type) {
    if (type === 'rotation') {
        return 'makeRotationFromQuaternion';
    }
    if (type === 'scale') {
        return 'scale';
    }
    if (type === 'translation') {
        return 'setTranslate';
    }
}

function range(min, max, value) {
    return (value - min) / (max - min);
}

function interpolation(time, frames) {
    if (frames.length === 0) {
        return [-1, -1, 0];
    }

    var prev = -1;
    for (var i = frames.length - 1; i >= 0; i--) {
        if (time >= frames[i].time) {
            prev = i;
            break;
        }
    }

    if (prev === -1 || prev === frames.length - 1) {
        if (prev < 0) {
            prev = 0;
        }
        return [prev, prev, 0];
    } else {
        var startFrame = frames[prev];
        var endFrame = frames[prev + 1];

        time = Math.max(startFrame.time, Math.min(time, endFrame.time));
        var t = range(startFrame.time, endFrame.time, time);

        return [prev, prev + 1, t];
    }
}

function buildArray(arrayBuffer, type, offset, length) {
    var arr = void 0;
    switch (glEnum[type]) {
        case 'BYTE':
            arr = new Int8Array(arrayBuffer, offset, length);
            break;
        case 'UNSIGNED_BYTE':
            arr = new Uint8Array(arrayBuffer, offset, length);
            break;
        case 'SHORT':
            arr = new Int16Array(arrayBuffer, offset, length);
            break;
        case 'UNSIGNED_SHORT':
            arr = new Uint16Array(arrayBuffer, offset, length);
            break;
        case 'FLOAT':
            arr = new Float32Array(arrayBuffer, offset, length);
            break;
    }
    return arr;
}

function compileShader(type, shaderSource, program) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    var log = gl.getShaderInfoLog(shader);
    if (log) {
        console.error(log);
    }
}

function walk(node, callback) {
    function _walk(node) {
        callback(node);
        if (node.children) {
            node.children.forEach(_walk);
        }
    }
    _walk(node);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Env = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(1);

var _matrix = __webpack_require__(0);

var _env = __webpack_require__(12);

var _env2 = _interopRequireDefault(_env);

var _env3 = __webpack_require__(9);

var _env4 = _interopRequireDefault(_env3);

var _blurEnv = __webpack_require__(7);

var _blurEnv2 = _interopRequireDefault(_blurEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var Env = exports.Env = function () {
    function Env() {
        _classCallCheck(this, Env);
    }

    _createClass(Env, [{
        key: 'setCamera',
        value: function setCamera(camera) {
            this._camera = camera;
        }
    }, {
        key: 'setGl',
        value: function setGl(g) {
            gl = g;
        }
    }, {
        key: 'createEnvironment',
        value: function createEnvironment() {
            var program = gl.createProgram();
            (0, _utils.compileShader)(gl.VERTEX_SHADER, _env4.default, program);
            (0, _utils.compileShader)(gl.FRAGMENT_SHADER, _blurEnv2.default, program);
            gl.linkProgram(program);
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexPositionBuffer);
            gl.vertexAttribPointer(0, this.envVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexTextureCoordBuffer);
            gl.vertexAttribPointer(1, this.envVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(1);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.envVertexIndexBuffer);

            var m = new _matrix.Matrix4();
            m.multiply(this._camera.projection);
            m.multiply(this._camera.matrixWorldInvert);
            m.multiply(this.envMatrix);
            gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMVPMatrix'), false, m.elements);

            gl.drawElements(gl.TRIANGLES, this.envVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
    }, {
        key: 'createEnvironmentBuffer',
        value: function createEnvironmentBuffer() {
            var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = this._camera.modelSize * 10;

            var vertexPositionData = [];
            var normalData = [];
            var textureCoordData = [];
            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                    var sinPhi = Math.sin(phi);
                    var cosPhi = Math.cos(phi);

                    var x = cosPhi * sinTheta;
                    var y = cosTheta;
                    var z = sinPhi * sinTheta;
                    var u = 1 - longNumber / longitudeBands;
                    var v = 1 - latNumber / latitudeBands;

                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
                    textureCoordData.push(u);
                    textureCoordData.push(v);
                    vertexPositionData.push(radius * x);
                    vertexPositionData.push(radius * y);
                    vertexPositionData.push(radius * z);
                }
            }

            var indexData = [];
            for (var _latNumber = 0; _latNumber < latitudeBands; _latNumber++) {
                for (var _longNumber = 0; _longNumber < longitudeBands; _longNumber++) {
                    var first = _latNumber * (longitudeBands + 1) + _longNumber;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }

            var vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
            vertexTextureCoordBuffer.itemSize = 2;
            vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

            var vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            vertexPositionBuffer.itemSize = 3;
            vertexPositionBuffer.numItems = vertexPositionData.length / 3;

            var vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            vertexIndexBuffer.itemSize = 1;
            vertexIndexBuffer.numItems = indexData.length;

            this.envMatrix = new _matrix.Matrix4();
            this.envVertexIndexBuffer = vertexIndexBuffer;
            this.envVertexPositionBuffer = vertexPositionBuffer;
            this.envVertexTextureCoordBuffer = vertexTextureCoordBuffer;

            return new Promise(function (resolve, reject) {
                var texture = gl.createTexture();
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function () {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    resolve();
                };
                img.onerror = function (err) {
                    reject(err);
                };
                img.src = _env2.default;
            });
        }
    }]);

    return Env;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
    function Events(redraw) {
        _classCallCheck(this, Events);

        this.redraw = redraw;
        document.addEventListener('wheel', this);
        document.addEventListener('mousedown', this);
        document.addEventListener('mousemove', this);
        document.addEventListener('mouseup', this);
        document.addEventListener('keyup', this);
        document.addEventListener('keydown', this);
        addEventListener('resize', this);

        this.position = [0, 0, 0];
    }

    _createClass(Events, [{
        key: 'handleEvent',
        value: function handleEvent(e) {
            switch (e.type) {
                case 'wheel':
                    this.zoom(e);
                    break;
                case 'mousedown':
                    this.onStart(e);
                    break;
                case 'mousemove':
                    this.onMove(e);
                    break;
                case 'mouseup':
                    this.onEnd(e);
                    break;
                case 'keyup':
                    this.onKeyUp(e);
                    break;
                case 'keydown':
                    this.onKeyDown(e);
                    break;
                case 'resize':
                    this.onResize(e);
                    break;
            }
        }
    }, {
        key: 'onResize',
        value: function onResize() {
            this.redraw('resize');
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            if (e.shiftKey || e.ctrlKey) {
                this.isPan = true;
            }
        }
    }, {
        key: 'onKeyUp',
        value: function onKeyUp() {
            this.isPan = false;
        }
    }, {
        key: 'onStart',
        value: function onStart(e) {
            this.x = e.clientX;
            this.y = e.clientY;
            this.isDrag = true;
        }
    }, {
        key: 'onMove',
        value: function onMove(e) {
            if (this.isDrag) {
                if (this.isPan) {
                    this.redraw('pan', [this.x, this.y], [e.clientX, e.clientY]);
                } else {
                    this.redraw('rotate', [this.x, this.y], [e.clientX, e.clientY]);
                }
                this.x = e.clientX;
                this.y = e.clientY;
            }
        }
    }, {
        key: 'onEnd',
        value: function onEnd() {
            this.isDrag = false;
        }
    }, {
        key: 'zoom',
        value: function zoom(e) {
            if (!this.zoom.v) {
                this.zoom.v = 0;
            }
            this.zoom.v = Math.min(this.zoom.v + e.deltaY, 1250);
            this.redraw('zoom', Math.pow(1.001, this.zoom.v));
        }
    }]);

    return Events;
}();

exports.Events = Events;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Camera = exports.Bone = exports.SkinnedMesh = exports.Mesh = exports.Object3D = exports.Scene = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix3 = __webpack_require__(0);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Object3D = function () {
    function Object3D(name, parent) {
        _classCallCheck(this, Object3D);

        this.uuid = Math.floor(Date.now() * Math.random());
        this.name = name;
        this.children = [];
        this.matrix = new _matrix3.Matrix4();
        this.matrixWorld = new _matrix3.Matrix4();
        this.matrixAnimation = new _matrix3.Matrix4();
        this.parent = parent;
    }

    _createClass(Object3D, [{
        key: 'setPosition',
        value: function setPosition(translation, rotation, scale) {
            var _matrix, _matrix2;

            this.hasPosition = true;
            this.matrix.makeRotationFromQuaternion(rotation);
            (_matrix = this.matrix).scale.apply(_matrix, _toConsumableArray(scale));
            (_matrix2 = this.matrix).setTranslate.apply(_matrix2, _toConsumableArray(translation));
            this.matrixAnimation.set(this.matrix.elements);
        }
    }, {
        key: 'setMatrix',
        value: function setMatrix(matrix) {
            this.matrix.set(matrix);
            this.matrixAnimation.set(matrix);
        }
    }, {
        key: 'setMatrixWorld',
        value: function setMatrixWorld(matrix) {
            this.matrixWorld.set(matrix);
        }
    }]);

    return Object3D;
}();

var Mesh = function (_Object3D) {
    _inherits(Mesh, _Object3D);

    function Mesh(name, parent) {
        _classCallCheck(this, Mesh);

        var _this = _possibleConstructorReturn(this, (Mesh.__proto__ || Object.getPrototypeOf(Mesh)).call(this, name, parent));

        _this.geometry = {
            boundingSphere: {
                center: new _matrix3.Vector3(),
                radius: null,
                min: null,
                max: null
            }
        };
        _this.material = {};
        _this.program = null;
        _this.mode = 4;
        return _this;
    }

    _createClass(Mesh, [{
        key: 'setBlend',
        value: function setBlend(value) {
            this.material.blend = value;
        }
    }, {
        key: 'calculateBounding',
        value: function calculateBounding() {
            var vertices = this.geometry.attributes.a_position.value;
            var maxRadiusSq = 0;

            var min = [Infinity, Infinity, Infinity],
                max = [-Infinity, -Infinity, -Infinity];
            for (var i = 0; i < vertices.length; i = i + 3) {
                var x = vertices[i];
                var y = vertices[i + 1];
                var z = vertices[i + 2];

                min[0] = Math.min(min[0], x);
                min[1] = Math.min(min[1], y);
                min[2] = Math.min(min[2], z);

                max[0] = Math.max(max[0], x);
                max[1] = Math.max(max[1], y);
                max[2] = Math.max(max[2], z);
            }

            this.geometry.boundingSphere.min = new _matrix3.Vector3(min);
            this.geometry.boundingSphere.max = new _matrix3.Vector3(max);

            this.geometry.boundingSphere.center.add(this.geometry.boundingSphere.min).add(this.geometry.boundingSphere.max).scale(0.5);

            for (var _i = 0; _i < vertices.length; _i = _i + 3) {
                maxRadiusSq = Math.max(maxRadiusSq, this.geometry.boundingSphere.center.distanceToSquared(vertices[_i], vertices[_i + 1], vertices[_i + 2]));
            }
            this.geometry.boundingSphere.radius = Math.sqrt(maxRadiusSq);
        }
    }, {
        key: 'setIndicesBuffer',
        value: function setIndicesBuffer(value) {
            this.geometry.indicesBuffer = value;
        }
    }, {
        key: 'setAttributes',
        value: function setAttributes(value) {
            this.geometry.attributes = value;
            this.calculateBounding();
        }
    }, {
        key: 'setTextures',
        value: function setTextures(value) {
            this.material.texture = value;
        }
    }, {
        key: 'setUniforms',
        value: function setUniforms(value) {
            this.material.uniforms = value;
        }
    }, {
        key: 'setTechnique',
        value: function setTechnique(value) {
            this.material.technique = value;
        }
    }, {
        key: 'setProgram',
        value: function setProgram(value) {
            this.program = value;
        }
    }, {
        key: 'setMode',
        value: function setMode(value) {
            this.mode = value;
        }
    }, {
        key: 'getJointMatrix',
        value: function getJointMatrix() {
            var m4v = this.material.uniforms.u_jointMat.value;
            var m = new _matrix3.Matrix4(this.matrixWorld).invert();
            var resArray = [];

            for (var mi = 0; mi < m4v.length; mi++) {
                var res = new _matrix3.Matrix4(m4v[mi]).multiply(m).multiply(this.bones[mi].matrixWorld).multiply(this.boneInverses[mi]).multiply(this.bindShapeMatrix);
                resArray.push(res);
            }

            return resArray;
        }
    }, {
        key: 'getModelViewProjMatrix',
        value: function getModelViewProjMatrix(_camera) {
            var m = new _matrix3.Matrix4();
            m.multiply(_camera.projection);
            m.multiply(_camera.matrixWorldInvert);
            m.multiply(this.matrixWorld);

            return m;
        }
    }, {
        key: 'getViewMatrix',
        value: function getViewMatrix(_camera) {
            var m = new _matrix3.Matrix4();
            m.multiply(_camera.matrixWorldInvert);

            return m;
        }
    }, {
        key: 'getModelViewMatrix',
        value: function getModelViewMatrix(value, _camera) {
            var m = new _matrix3.Matrix4();
            m.multiply(_camera.matrixWorldInvert);
            m.multiply(value ? value : this.matrixWorld);

            return m;
        }
    }, {
        key: 'getProjectionMatrix',
        value: function getProjectionMatrix(_camera) {
            return _camera.projection;
        }
    }, {
        key: 'getNormalMatrix',
        value: function getNormalMatrix() {
            var normalMatrix = new _matrix3.Matrix3();
            normalMatrix.normalFromMat4(this.material.uniforms.u_modelViewMatrix.value);
            return normalMatrix;
        }
    }, {
        key: 'isVisible',
        value: function isVisible(planes) {
            var c = new _matrix3.Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
            var r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
            var dist = void 0;
            var visible = true;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = planes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
                    if (dist < -r) {
                        visible = false;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.distance = dist + r;

            return visible;
        }
    }]);

    return Mesh;
}(Object3D);

var SkinnedMesh = function (_Mesh) {
    _inherits(SkinnedMesh, _Mesh);

    function SkinnedMesh(name, parent) {
        _classCallCheck(this, SkinnedMesh);

        return _possibleConstructorReturn(this, (SkinnedMesh.__proto__ || Object.getPrototypeOf(SkinnedMesh)).call(this, name, parent));
    }

    _createClass(SkinnedMesh, [{
        key: 'setSkin',
        value: function setSkin(value) {
            this.skin = value;
        }
    }]);

    return SkinnedMesh;
}(Mesh);

var Bone = function (_Object3D2) {
    _inherits(Bone, _Object3D2);

    function Bone(name, parent) {
        _classCallCheck(this, Bone);

        return _possibleConstructorReturn(this, (Bone.__proto__ || Object.getPrototypeOf(Bone)).call(this, name, parent));
    }

    _createClass(Bone, [{
        key: 'setJointName',
        value: function setJointName(value) {
            this.jointName = value;
        }
    }]);

    return Bone;
}(Object3D);

var Camera = function (_Object3D3) {
    _inherits(Camera, _Object3D3);

    function Camera(name, parent) {
        _classCallCheck(this, Camera);

        var _this4 = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this, name, parent));

        _this4.matrixWorldInvert = new _matrix3.Matrix4();
        _this4.projection = new _matrix3.Matrix4();
        return _this4;
    }

    _createClass(Camera, [{
        key: 'setProjection',
        value: function setProjection(matrix) {
            this.projection.set(matrix);
        }
    }, {
        key: 'setMatrixWorld',
        value: function setMatrixWorld(matrix) {
            _get(Camera.prototype.__proto__ || Object.getPrototypeOf(Camera.prototype), 'setMatrixWorld', this).call(this, matrix);
            this.matrixWorldInvert.setInverseOf(this.matrixWorld);
        }
    }, {
        key: 'setZ',
        value: function setZ(z) {
            this.matrix.elements[14] = z;
            this.setMatrixWorld(this.matrix.elements);
        }
    }, {
        key: 'getViewProjMatrix',
        value: function getViewProjMatrix() {
            var m = new _matrix3.Matrix4();
            m.multiply(this.projection);
            m.multiply(this.matrixWorldInvert);

            return m;
        }
    }]);

    return Camera;
}(Object3D);

var Scene = function Scene() {
    _classCallCheck(this, Scene);

    this.children = [];
    this.program = [];
    this.matrixWorld = new _matrix3.Matrix4();
    this.bin = [];
};

exports.Scene = Scene;
exports.Object3D = Object3D;
exports.Mesh = Mesh;
exports.SkinnedMesh = SkinnedMesh;
exports.Bone = Bone;
exports.Camera = Camera;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D uOriginal;\r\nuniform sampler2D ssao;\r\nuniform sampler2D uTexture1;\r\nuniform sampler2D uTexture2;\r\nuniform sampler2D uTexture3;\r\nuniform sampler2D uTexture4;\r\n\r\nvoid main() \r\n{\r\n    vec4 vOriginal = texture(uOriginal, uv);\r\n    vec4 vT1 = texture(uTexture1, uv);\r\n    vec4 vT2 = texture(uTexture2, uv);\r\n    vec4 vT3 = texture(uTexture3, uv);\r\n    vec4 vT4 = texture(uTexture4, uv);\r\n    vec4 c = vOriginal + vT1 + vT2 + vT3 + vT4;\r\n    color = vec4(c.rgb * texture(ssao, uv).r, 1.0);\r\n}\r\n"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform vec2 offset;\r\nuniform float level;\r\nuniform sampler2D uTexture;\r\n\r\nvoid main() \r\n{\r\n    vec4 c = vec4(0);\r\n    c += 15.0 * vec4(textureLod(uTexture, uv - offset, level).rgb * 0.1, 1.0);\r\n    c += 16.0 * vec4(textureLod(uTexture, uv, level).rgb * 0.1, 1.0);\r\n    c += 15.0 * vec4(textureLod(uTexture, uv + offset, level).rgb * 0.1, 1.0);\r\n    color = c / 16.0;\r\n}\r\n"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D uTexture;\r\n\r\nvoid main() {\r\n    color = texture(uTexture, uv);\r\n}\r\n"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout float color;\r\n\r\nuniform sampler2D ssaoInput;\r\n\r\nvoid main() \r\n{\r\n    vec2 texelSize = 1.0 / vec2(textureSize(ssaoInput, 0));\r\n    float result = 0.0;\r\n    for (int x = -2; x < 2; ++x) \r\n    {\r\n        for (int y = -2; y < 2; ++y) \r\n        {\r\n            vec2 offset = vec2(float(x), float(y)) * texelSize;\r\n            result += texture(ssaoInput, uv + offset).r;\r\n        }\r\n    }\r\n    color = result / (4.0 * 4.0);\r\n}\r\n"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 pos;\r\nlayout (location = 1) in vec2 aUV;\r\n\r\nuniform mat4 uMVPMatrix;\r\n\r\nout vec2 uv;\r\n\r\nvoid main() {\r\n\tuv = aUV;\r\n    gl_Position = uMVPMatrix * vec4(pos, 1.0);\r\n}\r\n"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nlayout (location = 0) in vec2 pos;\r\n\r\nout vec2 uv;\r\n\r\nvoid main() {\r\n    uv = pos * 0.5 + 0.5;\r\n    gl_Position = vec4(pos, 0.0, 1.0); \r\n}\r\n"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\nprecision highp float;\n\nin vec2 uv;\nout float color;\n\nconst int samples = 64;\nconst float radius = 2.5;\nconst float bias = -0.5;\nconst float power = 1.0;\nconst float zFar = 40.0;\nconst float zNear = 1.0; \n\nuniform sampler2D normBuff;\nuniform sampler2D posBuff;\nuniform sampler2D depthBuff;\nuniform sampler2D randMap;\nuniform vec2 scr;\nuniform vec3 rndTable[samples];\nuniform mat4 proj;\n\nvoid main() {\n\tfloat depth = texture(depthBuff, uv).x;\n\tdepth = (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));\n\tif (depth==1.0) {\n\t\tdiscard;\n\t}\n\n\tvec3 pos = texture(posBuff, uv).xyz;\n\tvec3 normal = normalize(texture(normBuff, uv).xyz);\n\tvec3 rvec = normalize(texture(randMap, uv*scr).xyz);\n\n\tvec3 tangent = normalize(rvec-normal * dot(rvec, normal));\n\tvec3 bitangent = cross(tangent, normal);\n\tmat3 rotate = mat3(tangent, bitangent, normal);\n\n\tfloat occlusion  = 0.0;\n\tfor (int i = 0; i < samples; i++) {\n\t\tvec3 samplePos = rotate * rndTable[i];\n\t\tsamplePos = pos + samplePos * radius;\n\n\t\tvec4 shift = proj * vec4(samplePos, 1.0);\n\t\tshift.xy /= shift.w;\n\t\tshift.xy = shift.xy * 0.5 + 0.5;\n\n\t\tfloat sampleDepth = texture(posBuff, shift.xy).z;\n\n\t\tfloat distanceCheck = smoothstep(0.0, 1.0, radius / abs(pos.z - sampleDepth));\n\t\tocclusion  += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0) * distanceCheck;\n\t}\n\n\tocclusion = (occlusion / float(samples));\n\tcolor = pow(occlusion, power);\n}\n"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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dENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNA/IAAAAAAAoAAP///////wAAOEJJTQQNAAAAAAAEAAAAHjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADUQAAAAYAAAAAAAAAAAAAFxoAAC40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"

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RedCube = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = __webpack_require__(4);

var _matrix = __webpack_require__(0);

var _events = __webpack_require__(3);

var _env = __webpack_require__(2);

var _parse = __webpack_require__(18);

var _postprocessing = __webpack_require__(16);

var _utils = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var RedCube = function () {
    function RedCube(url, canvas) {
        _classCallCheck(this, RedCube);

        this.reflow = true;
        this.scene = new _objects.Scene();
        this.color = [0.6, 0.6, 0.6, 1.0];
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.canvas = canvas;
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this._camera = new _objects.Camera();
        this._camera.props = {
            type: 'perspective',
            perspective: {
                yfov: null,
                znear: 1,
                zfar: 2e6,
                aspectRatio: null
            }
        };
        this.zoom = 1;
        this._camera.setZ(5);

        this.glEnum = {};

        this.events = new _events.Events(this.redraw.bind(this));
        this.cameraPosition = new _matrix.Vector3([0, 0, 0.05]);

        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;

        this.env = new _env.Env();
        this.env.setCamera(this._camera);

        this.PP = new _postprocessing.PostProcessing();
        this.PP.setCanvas(this.canvas);
        this.PP.setCamera(this._camera);

        this.parse = new _parse.Parse(url);
        this.parse.setScene(this.scene);
        this.parse.setCamera(this._camera);
        this.parse.setCanvas(this.canvas);
        this.parse.setResize(this.resize.bind(this));
    }

    _createClass(RedCube, [{
        key: 'init',
        value: function init() {
            return this.parse.getJson().then(this.glInit.bind(this)).then(this.PP.buildScreenBuffer.bind(this.PP)).then(this.parse.getBuffer.bind(this.parse)).then(this.parse.buildMesh.bind(this.parse)).then(this.parse.initTextures.bind(this.parse)).then(this.parse.buildAnimation.bind(this.parse)).then(this.parse.buildSkin.bind(this.parse)).then(this.env.createEnvironmentBuffer.bind(this.env)).then(this.draw.bind(this)).catch(console.error);
        }
    }, {
        key: 'setColor',
        value: function setColor(color) {
            this.color = color;
        }
    }, {
        key: 'redraw',
        value: function redraw(type, coordsStart, coordsMove) {
            if (type === 'zoom') {
                this.zoom = coordsStart;
                this._camera.setProjection(this.calculateProjection(this._camera.props).elements);
            }
            if (type === 'rotate') {
                var p0 = new _matrix.Vector3(this.sceneToArcBall(this.canvasToWorld.apply(this, _toConsumableArray(coordsStart))));
                var p1 = new _matrix.Vector3(this.sceneToArcBall(this.canvasToWorld.apply(this, _toConsumableArray(coordsMove))));
                var angle = _matrix.Vector3.angle(p0, p1) * 2;
                if (angle < 1e-6 || isNaN(angle)) {
                    return;
                }

                var v = _matrix.Vector3.cross(p0, p1).normalize();
                var sin = Math.sin(angle / 2);
                var q = new _matrix.Vector4([v.elements[0] * -sin, v.elements[1] * -sin, v.elements[2] * -sin, Math.cos(angle / 2)]);

                var m = new _matrix.Matrix4();
                m.makeRotationFromQuaternion(q.elements);

                this.scene.matrixWorld.multiply(m);
                this.env.envMatrix.multiply(m);
            }
            if (type === 'pan') {
                var _p = new _matrix.Vector3(this.canvasToWorld.apply(this, _toConsumableArray(coordsStart)).elements);
                var _p2 = new _matrix.Vector3(this.canvasToWorld.apply(this, _toConsumableArray(coordsMove)).elements);
                var pan = this._camera.modelSize * 100;
                var delta = _p2.subtract(_p).scale(pan);

                this.scene.matrixWorld.translate(-delta.elements[0], -delta.elements[1], 0);
            }
            if (type === 'resize') {
                this.resize();
            }

            this.reflow = true;
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            gl.viewport(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
            this._camera.setProjection(this.calculateProjection(this._camera.props).elements);
        }
    }, {
        key: 'sceneToArcBall',
        value: function sceneToArcBall(pos) {
            var len = pos.elements[0] * pos.elements[0] + pos.elements[1] * pos.elements[1];
            var sz = 0.04 * 0.04 - len;
            if (sz > 0) {
                return [pos.elements[0], pos.elements[1], Math.sqrt(sz)];
            } else {
                len = Math.sqrt(len);
                return [0.04 * pos.elements[0] / len, 0.04 * pos.elements[1] / len, 0];
            }
        }
    }, {
        key: 'canvasToWorld',
        value: function canvasToWorld(x, y) {
            var newM = new _matrix.Matrix4();
            newM.setTranslate.apply(newM, _toConsumableArray(this.cameraPosition.elements));
            var m = new _matrix.Matrix4(this._camera.projection);
            m.multiply(newM);

            var mp = m.multiplyVector4(new _matrix.Vector4([0, 0, 0, 1]));
            mp.elements[0] = (2 * x / this.canvas.width - 1) * mp.elements[3];
            mp.elements[1] = (-2 * y / this.canvas.height + 1) * mp.elements[3];

            return m.invert().multiplyVector4(mp);
        }
    }, {
        key: 'calculateProjection',
        value: function calculateProjection(cam) {
            var proj = void 0;
            if (cam.type === 'perspective' && cam.perspective) {
                var yfov = cam.perspective.yfov;

                var aspectRatio = cam.perspective.aspectRatio || this.aspect;
                var xfov = yfov * this.aspect;

                if (this.aspect !== aspectRatio) {
                    console.warn('this.canvas size and this.canvas size from scene dont equal');
                }

                proj = new _matrix.Matrix4().setPerspective(xfov * this.zoom * (180 / Math.PI), this.aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
            } else if (cam.type === 'orthographic' && cam.orthographic) {
                proj = new _matrix.Matrix4().setOrtho(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, cam.orthographic.znear, cam.orthographic.zfar);
            }

            return proj;
        }
    }, {
        key: 'buildBuffer',
        value: function buildBuffer(indexBuffer) {
            if (indexBuffer) {
                if (indexBuffer.buffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
                } else {
                    var bufferGL = gl.createBuffer();
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferGL);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.value, gl.STATIC_DRAW);
                    indexBuffer.buffer = bufferGL;
                }
            }

            for (var _len = arguments.length, buffer = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                buffer[_key - 1] = arguments[_key];
            }

            buffer.forEach(function (b) {
                if (!b.buffer) {
                    var _bufferGL = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, _bufferGL);
                    gl.bufferData(gl.ARRAY_BUFFER, b.value, gl.STATIC_DRAW);
                    b.buffer = _bufferGL;
                }
            });
        }
    }, {
        key: 'glInit',
        value: function glInit() {
            gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            this.gl = gl;

            for (var k in gl) {
                var v = gl[k];
                if (typeof v === 'number') {
                    this.glEnum[v] = k;
                }
            }
            (0, _utils.setGlEnum)(this.glEnum);
            (0, _utils.setGl)(gl);
            this.env.setGl(gl);
            this.PP.setGl(gl);
            this.parse.setGl(gl);
            this.parse.setGlEnum(this.glEnum);

            var shaderArr = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.scene.program[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    shaderArr.push(fetch('' + this.host + p.fragmentShader + '.glsl').then(function (res) {
                        return res.text();
                    }));
                    shaderArr.push(fetch('' + this.host + p.vertexShader + '.glsl').then(function (res) {
                        return res.text();
                    }));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return Promise.all(shaderArr).then(this.compileShader.bind(this));
        }
    }, {
        key: 'compileShader',
        value: function compileShader(res) {
            var program = void 0;
            var i = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = res[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var sh = _step2.value;

                    if (!program) {
                        program = gl.createProgram();
                    }

                    var type = void 0;
                    if (/gl_Position/.test(sh)) {
                        type = gl.VERTEX_SHADER;
                    } else {
                        type = gl.FRAGMENT_SHADER;
                    }

                    var index = this.scene.program[i].shaders.push((0, _utils.compileShader)(type, sh, program));
                    if (index === 2) {
                        this.scene.program[i].program = program;
                        gl.linkProgram(program);
                        program = null;
                        i++;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return true;
        }
    }, {
        key: 'animate',
        value: function animate(sec) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.parse.tracks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var v = _step3.value;

                    var val = (0, _utils.interpolation)(sec, v.keys);

                    if (val[0] === -1 || val[1] === -1 || v.stoped) {
                        continue;
                    }
                    if (val[0] === v.keys.length - 1) {
                        v.stoped = true;
                    }

                    var startFrame = v.keys[val[0]];
                    var endFrame = v.keys[val[1]];
                    // eslint-disable-next-line
                    var t = val[2];

                    var component = (0, _utils.getAnimationComponent)(v.type);
                    var vectorC = component === 3 ? _matrix.Vector3 : _matrix.Vector4;
                    var vector = new vectorC(startFrame.value);
                    var vector2 = new vectorC(endFrame.value);

                    if (v.type === 'rotation') {
                        var out = new _matrix.Vector4();
                        out.lerp(vector.elements, vector2.elements, t);

                        v.mesh.matrixAnimation[(0, _utils.getAnimationMethod)(v.type)](out.elements);
                    } else {
                        var _v$mesh$matrixAnimati;

                        var _out = new _matrix.Vector3();
                        _out.lerp(vector.elements, vector2.elements, t);

                        (_v$mesh$matrixAnimati = v.mesh.matrixAnimation)[(0, _utils.getAnimationMethod)(v.type)].apply(_v$mesh$matrixAnimati, _toConsumableArray(_out.elements));
                    }

                    this.reflow = true;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: 'setMesh',
        value: function setMesh(blends, nonBlends, node) {
            if (node.parent && node.parent.matrixWorld) {
                var m = new _matrix.Matrix4();
                m.multiply(node.parent.matrixWorld);
                m.multiply(node.matrixAnimation);

                node.setMatrixWorld(m.elements);
            }

            if (node instanceof _objects.SkinnedMesh) {
                node.bones = this.parse.skins[node.skin].bones;
                node.boneInverses = this.parse.skins[node.skin].boneInverses;
                node.bindShapeMatrix = this.parse.skins[node.skin].bindShapeMatrix;
            }

            if (node instanceof _objects.SkinnedMesh || node instanceof _objects.Mesh) {
                if (node.material.blend) {
                    blends.push(node);
                } else {
                    nonBlends.push(node);
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _gl;

            (_gl = gl).clearColor.apply(_gl, _toConsumableArray(this.color));

            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var sec = time / 1000;

            this.animate(sec);

            if (this.reflow) {
                this.PP.bindBuffer();

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

                this.env.createEnvironment();

                var blends = [];
                var nonBlends = [];
                (0, _utils.walk)(this.scene, this.setMesh.bind(this, blends, nonBlends));

                var planes = (0, _matrix.Frustum)(this._camera.getViewProjMatrix());

                if (nonBlends.length) {
                    for (var e in this.parse.unblendEnable) {
                        gl.enable(e);
                    }
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = nonBlends[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var mesh = _step4.value;

                            if (mesh.isVisible(planes)) {
                                this.buildBuffer.apply(this, [mesh.geometry.indicesBuffer].concat(_toConsumableArray(Object.values(mesh.geometry.attributes))));
                                this._draw(mesh);
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    for (var _e in this.parse.unblendEnable) {
                        gl.disable(_e);
                    }
                }

                if (blends.length) {
                    var blendsSorted = [];
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = blends[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _mesh2 = _step5.value;

                            if (_mesh2.isVisible(planes)) {
                                blendsSorted.push(_mesh2);
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    if (blendsSorted.length) {
                        blendsSorted.sort(function (a, b) {
                            return a.distance - b.distance;
                        });

                        for (var _e2 in this.parse.blendEnable) {
                            gl.enable(_e2);
                        }
                        for (var f in this.parse.blendTechnique) {
                            var _gl2;

                            (_gl2 = gl)[f].apply(_gl2, _toConsumableArray(this.parse.blendTechnique[f]));
                        }
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = blendsSorted[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var _mesh = _step6.value;

                                this.buildBuffer.apply(this, [_mesh.geometry.indicesBuffer].concat(_toConsumableArray(Object.values(_mesh.geometry.attributes))));
                                this._draw(_mesh);
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }

                        for (var _e3 in this.parse.blendEnable) {
                            gl.disable(_e3);
                        }
                        for (var _f in this.parse.blendTechnique) {
                            if (_f === 'depthMask') {
                                gl[_f](true);
                            }
                            if (_f === 'blendFuncSeparate') {
                                gl[_f](gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
                            }
                            if (_f === 'blendEquationSeparate') {
                                gl[_f](gl.FUNC_ADD, gl.FUNC_ADD);
                            }
                        }
                    }
                }

                this.PP.postProcessing();
            }

            this.fps++;
            this.elapsedTime += time - this.lastTime;
            this.lastTime = time;
            if (this.elapsedTime >= 1000) {
                this.counterEl.innerHTML = this.fps;
                this.fps = 0;
                this.elapsedTime -= 1000;
            }

            this.reflow = false;
            requestAnimationFrame(this.render.bind(this));
        }
    }, {
        key: '_draw',
        value: function _draw(mesh) {
            gl.useProgram(mesh.program);

            var _camera = this._camera;


            for (var k in mesh.geometry.attributes) {
                var v = mesh.geometry.attributes[k];

                gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer);

                var a = void 0;
                if (v[k] !== undefined) {
                    a = v[k];
                } else {
                    a = gl.getAttribLocation(mesh.program, k);
                    if (a !== 0 && !a) {
                        console.warn('dont get ' + k + ' from shader');
                        delete mesh.geometry.attributes[k];
                        continue;
                    }
                    v[k] = a;
                    gl.enableVertexAttribArray(a);
                }

                gl.vertexAttribPointer(a, (0, _utils.getComponentType)(v.type), gl.FLOAT, false, 0, 0);
            }

            for (var _k in mesh.material.uniforms) {
                var _v = mesh.material.uniforms[_k];
                var matricies = void 0,
                    value = void 0;

                if (_v.type === gl.SAMPLER_2D) {
                    value = [this.parse.textures[_v.value[0]].count];
                }

                switch (_v.semantic) {
                    case 'MODELVIEWPROJECTION':
                        _v.value = mesh.getModelViewProjMatrix(_camera);
                        break;
                    case 'MODELVIEWPROJECTIONINVERSE':
                        _v.value = mesh.getModelViewProjMatrix(_camera).invert();
                        break;
                    case 'VIEW':
                        _v.value = mesh.getViewMatrix(_camera);
                        break;
                    case 'VIEWINVERSE':
                        _v.value = mesh.getViewMatrix(_camera).invert();
                        break;
                    case 'MODEL':
                        _v.value = mesh.matrixWorld;
                        break;
                    case 'MODELINVERSETRANSPOSE':
                        _v.value = new _matrix.Matrix3().normalFromMat4(mesh.matrixWorld);
                        break;
                    case 'MODELINVERSE':
                        _v.value = new _matrix.Matrix4(mesh.matrixWorld).invert();
                        break;
                    case 'MODELVIEW':
                        _v.value = mesh.getModelViewMatrix(_v.node, _camera);
                        break;
                    case 'MODELVIEWINVERSE':
                        _v.value = mesh.getModelViewMatrix(_v.node, _camera).invert();
                        break;
                    case 'PROJECTION':
                        _v.value = mesh.getProjectionMatrix(_camera);
                        break;
                    case 'PROJECTIONINVERSE':
                        _v.value = new _matrix.Matrix4(mesh.getProjectionMatrix(_camera)).invert();
                        break;
                    case 'MODELVIEWINVERSETRANSPOSE':
                        _v.value = mesh.getNormalMatrix();
                        break;
                    case 'VIEWPORT':
                        _v.value = new Float32Array([0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight]);
                        break;
                    case 'JOINTMATRIX':
                        matricies = mesh.getJointMatrix();
                        break;
                }

                var u = void 0;
                if (_v[_k] !== undefined) {
                    u = _v[_k];
                } else {
                    u = gl.getUniformLocation(mesh.program, _k);
                    if (u !== 0 && !u) {
                        console.warn('dont get ' + _k + ' from shader');
                        delete mesh.material.uniforms[_k];
                        continue;
                    }
                    _v[_k] = u;
                }

                if (_v.type !== gl.SAMPLER_2D) {
                    value = _v.value || _v.node;
                }

                if (value.elements) {
                    gl[(0, _utils.getMethod)(_v.type)](u, false, value.elements);
                } else if (matricies) {
                    var concatArr = new Float32Array(matricies.length * 16);
                    var i = 0;
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = matricies[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var m = _step7.value;

                            concatArr.set(m.elements, i * 16);
                            i++;
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }

                    gl[(0, _utils.getMethod)(_v.type)](u, false, concatArr);
                } else {
                    var _gl3;

                    (_gl3 = gl)[(0, _utils.getMethod)(_v.type)].apply(_gl3, [u].concat(_toConsumableArray(value)));
                }
            }

            if (mesh.geometry.indicesBuffer) {
                gl.drawElements(mesh.mode, mesh.geometry.indicesBuffer.value.length, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawArrays(mesh.mode, 0, mesh.geometry.attributes.a_position.value.length / 3);
            }
        }
    }]);

    return RedCube;
}();

exports.RedCube = RedCube;

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PostProcessing = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = __webpack_require__(0);

var _utils = __webpack_require__(1);

var _quad = __webpack_require__(10);

var _quad2 = _interopRequireDefault(_quad);

var _blur = __webpack_require__(6);

var _blur2 = _interopRequireDefault(_blur);

var _bloom = __webpack_require__(5);

var _bloom2 = _interopRequireDefault(_bloom);

var _ssao = __webpack_require__(11);

var _ssao2 = _interopRequireDefault(_ssao);

var _blurSsao = __webpack_require__(8);

var _blurSsao2 = _interopRequireDefault(_blurSsao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var screenTextureCount = 1;
var randSize = 4;

var PostProcessing = exports.PostProcessing = function () {
    function PostProcessing() {
        _classCallCheck(this, PostProcessing);
    }

    _createClass(PostProcessing, [{
        key: 'setCamera',
        value: function setCamera(camera) {
            this._camera = camera;
        }
    }, {
        key: 'setGl',
        value: function setGl(g) {
            gl = g;
        }
    }, {
        key: 'setCanvas',
        value: function setCanvas(canvas) {
            this.canvas = canvas;
        }
    }, {
        key: 'bindBuffer',
        value: function bindBuffer() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.positionTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
        }
    }, {
        key: 'postProcessing',
        value: function postProcessing() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

            gl.clearColor(1, 1, 1, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            var ssaoProgram = gl.createProgram();
            (0, _utils.compileShader)(gl.VERTEX_SHADER, _quad2.default, ssaoProgram);
            (0, _utils.compileShader)(gl.FRAGMENT_SHADER, _ssao2.default, ssaoProgram);
            gl.linkProgram(ssaoProgram);
            gl.useProgram(ssaoProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            gl.uniform1i(gl.getUniformLocation(ssaoProgram, 'posBuff'), this.positionTexture.index);
            gl.uniform1i(gl.getUniformLocation(ssaoProgram, 'normBuff'), this.normalTexture.index);
            gl.uniform1i(gl.getUniformLocation(ssaoProgram, 'depthBuff'), this.depthTexture.index);
            gl.uniform1i(gl.getUniformLocation(ssaoProgram, 'randMap'), this.randMap.index);
            gl.uniform2f(gl.getUniformLocation(ssaoProgram, 'scr'), this.width / randSize, this.height / randSize);
            gl.uniformMatrix4fv(gl.getUniformLocation(ssaoProgram, 'proj'), false, this._camera.projection.elements);
            gl.uniform3fv(gl.getUniformLocation(ssaoProgram, 'rndTable'), this.rndTable);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);

            var ssaoBlurProgram = gl.createProgram();
            (0, _utils.compileShader)(gl.VERTEX_SHADER, _quad2.default, ssaoBlurProgram);
            (0, _utils.compileShader)(gl.FRAGMENT_SHADER, _blurSsao2.default, ssaoBlurProgram);
            gl.linkProgram(ssaoBlurProgram);
            gl.useProgram(ssaoBlurProgram);

            gl.uniform1i(gl.getUniformLocation(ssaoBlurProgram, 'ssaoInput'), this.ssaoTexture.index);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            var program = gl.createProgram();
            (0, _utils.compileShader)(gl.VERTEX_SHADER, _quad2.default, program);
            (0, _utils.compileShader)(gl.FRAGMENT_SHADER, _blur2.default, program);
            gl.linkProgram(program);
            gl.useProgram(program);

            gl.activeTexture(gl.TEXTURE1);
            gl.generateMipmap(gl.TEXTURE_2D);

            this.renderBlur(program, 0.0, this.blurTexture, true);
            this.renderBlur(program, 1.0, this.blurTexture2);
            this.renderBlur(program, 2.0, this.blurTexture3);
            this.renderBlur(program, 3.0, this.blurTexture4);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            var program2 = gl.createProgram();
            (0, _utils.compileShader)(gl.VERTEX_SHADER, _quad2.default, program2);
            (0, _utils.compileShader)(gl.FRAGMENT_SHADER, _bloom2.default, program2);
            gl.linkProgram(program2);
            gl.useProgram(program2);

            gl.uniform1i(gl.getUniformLocation(program2, 'uOriginal'), this.screenTexture.index);
            gl.uniform1i(gl.getUniformLocation(program2, 'ssao'), this.ssaoBlurTexture.index);
            gl.uniform1i(gl.getUniformLocation(program2, 'uTexture1'), this.blurTexture.index);
            gl.uniform1i(gl.getUniformLocation(program2, 'uTexture2'), this.blurTexture2.index);
            gl.uniform1i(gl.getUniformLocation(program2, 'uTexture3'), this.blurTexture3.index);
            gl.uniform1i(gl.getUniformLocation(program2, 'uTexture4'), this.blurTexture4.index);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }, {
        key: 'renderBlur',
        value: function renderBlur(program, level, out, needMipmap) {
            gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), this.screenTexture.index);
            gl.uniform2f(gl.getUniformLocation(program, 'offset'), 1.2 / this.width, 0);
            gl.uniform1f(gl.getUniformLocation(program, 'level'), level);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (needMipmap) {
                gl.activeTexture(gl.TEXTURE2);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
            gl.uniform2f(gl.getUniformLocation(program, 'offset'), 0, 1.2 / this.height);
            gl.uniform1f(gl.getUniformLocation(program, 'level'), 0.0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, out, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }, {
        key: 'createTexture',
        value: function createTexture(needMipmap, type) {
            var texture = gl.createTexture();
            gl.activeTexture(gl['TEXTURE' + screenTextureCount]);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            switch (type) {
                case 'depth':
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
                    break;
                case 'red':
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.width, this.height, 0, gl.RED, gl.UNSIGNED_BYTE, null);
                    break;
                default:
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, needMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
                    break;
            }
            texture.index = screenTextureCount;
            screenTextureCount++;
            return texture;
        }
    }, {
        key: 'buildRandomTexture',
        value: function buildRandomTexture() {
            var rnd = new Uint8Array(randSize * randSize * 3);
            for (var i = 0; i < randSize * randSize; i++) {
                var v = new _matrix.Vector3([(0, _utils.random)(-1, 1), (0, _utils.random)(-1, 1), 0]);
                v.normalize();
                v.scale(0.5);
                v.addS(0.5);
                rnd[i * 3] = v.elements[0] * 255;
                rnd[i * 3 + 1] = v.elements[1] * 255;
                rnd[i * 3 + 2] = v.elements[2] * 255;
            }
            this.randMap = gl.createTexture();
            gl.activeTexture(gl['TEXTURE' + screenTextureCount]);
            gl.bindTexture(gl.TEXTURE_2D, this.randMap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, randSize, randSize, 0, gl.RGB, gl.UNSIGNED_BYTE, rnd);
            this.randMap.index = screenTextureCount;
            screenTextureCount++;
        }
    }, {
        key: 'buildRandomKernels',
        value: function buildRandomKernels() {
            var rndTable = [];
            var kernels = 64;
            for (var i = 0; i < kernels; i++) {
                rndTable[i] = new _matrix.Vector3([(0, _utils.random)(-1, 1), (0, _utils.random)(-1, 1), (0, _utils.random)(-1, 0)]);
                rndTable[i].normalize();
                rndTable[i].scale((i + 1) / kernels);
            }
            this.rndTable = new Float32Array(rndTable.length * 3);
            var j = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rndTable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var m = _step.value;

                    this.rndTable.set(m.elements, j * 3);
                    j++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'buildScreenBuffer',
        value: function buildScreenBuffer() {
            var verts = [1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0];
            this.screenQuadVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

            gl.getExtension('EXT_color_buffer_float');
            gl.getExtension('OES_texture_float_linear');

            this.screenTexture = this.createTexture(true);
            this.tempBlurTexture = this.createTexture(true);
            this.blurTexture = this.createTexture();
            this.blurTexture2 = this.createTexture();
            this.blurTexture3 = this.createTexture();
            this.blurTexture4 = this.createTexture();
            this.normalTexture = this.createTexture();
            this.depthTexture = this.createTexture(false, 'depth');
            this.positionTexture = this.createTexture();

            //const renderbuffer = gl.createRenderbuffer();
            //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
            //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.positionTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
            //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

            this.ssaobuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaobuffer);
            this.ssaoTexture = this.createTexture(false, 'red');
            this.ssaoBlurTexture = this.createTexture(false, 'red');
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);

            this.buildRandomTexture();

            this.buildRandomKernels();

            return true;
        }
    }, {
        key: 'width',
        get: function get() {
            return this.canvas.offsetWidth;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.canvas.offsetHeight;
        }
    }]);

    return PostProcessing;
}();

/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Parse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(1);

var _objects = __webpack_require__(4);

var _matrix = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var glEnum = void 0;
var sceneTextureCount = 13;

var Parse = exports.Parse = function () {
    function Parse(url) {
        _classCallCheck(this, Parse);

        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.unblendEnable = {};
        this.blendEnable = {};
        this.tracks = [];
        this.skins = {};
        this.textures = {};
        this.blendTechnique = {};
        this.cameras = [];
    }

    _createClass(Parse, [{
        key: 'setScene',
        value: function setScene(scene) {
            this.scene = scene;
        }
    }, {
        key: 'setGl',
        value: function setGl(g) {
            gl = g;
        }
    }, {
        key: 'setGlEnum',
        value: function setGlEnum(g) {
            glEnum = g;
        }
    }, {
        key: 'setCamera',
        value: function setCamera(camera) {
            this._camera = camera;
        }
    }, {
        key: 'setCanvas',
        value: function setCanvas(canvas) {
            this.canvas = canvas;
        }
    }, {
        key: 'setResize',
        value: function setResize(resize) {
            this.resize = resize;
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer() {
            var _this = this;

            return fetch('' + this.host + this.scene.bin[0]).then(function (res) {
                return res.arrayBuffer();
            }).then(function (res) {
                _this.arrayBuffer = res;
                return true;
            });
        }
    }, {
        key: 'buildPrim',
        value: function buildPrim(parent, source, name, p) {
            var indicesAccessor = this.json.accessors[p.indices];
            var vertexAccessor = {};
            for (var a in p.attributes) {
                vertexAccessor[a.toLowerCase().replace(/_(\d)/, '$1')] = this.json.accessors[p.attributes[a]];
            }

            var material = this.json.materials[p.material].values;
            var tech = this.json.materials[p.material].technique;
            var technique = this.json.techniques[tech];

            var attributes = {};
            for (var k in technique.attributes) {
                attributes[k] = {
                    type: technique.parameters[technique.attributes[k]].type,
                    semantic: technique.parameters[technique.attributes[k]].semantic
                };
            }
            var uniforms = {};
            for (var _k in technique.uniforms) {
                var key = technique.parameters[technique.uniforms[_k]];
                var node = key.node;
                var value = key.value;


                if (node) {
                    node = this.json.nodes[node].matrix;
                }

                uniforms[_k] = {
                    type: key.type,
                    value: value,
                    semantic: key.semantic,
                    node: node,
                    count: key.count
                };
            }
            for (var _k2 in material) {
                if (material[_k2] !== undefined) {
                    uniforms['u_' + _k2].value = material[_k2];
                }
            }

            var textures = [];
            for (var _k3 in uniforms) {
                var u = uniforms[_k3];

                if (u.type === gl.SAMPLER_2D) {
                    var t = Object.assign({}, this.json.textures[u.value]);
                    Object.assign(t, this.json.samplers[t.sampler]);
                    Object.assign(t, this.json.images[t.source]);
                    t.name = u.value;
                    textures.push(t);
                }

                if (u.value !== undefined && !Array.isArray(u.value)) {
                    u.value = [u.value];
                }
                if (u.node !== undefined && !Array.isArray(u.node)) {
                    u.node = [u.node];
                }

                if (u.value && (0, _utils.isMatrix)(u.type)) {
                    var matrixConstr = (0, _utils.getMatrixType)(u.type);
                    u.value = new matrixConstr().set(u.value);
                }
                if (u.node && (0, _utils.isMatrix)(u.type)) {
                    var _matrixConstr = (0, _utils.getMatrixType)(u.type);
                    u.node = new _matrixConstr().set(u.node);
                }
                if (u.count && !u.value) {
                    (function () {
                        var constr = (0, _utils.getMatrixType)(u.type);
                        u.value = new Array(u.count).fill(1).map(function () {
                            return new constr();
                        });
                    })();
                }
            }

            var indicesBuffer = void 0;
            if (indicesAccessor) {
                indicesBuffer = {};
                var bufferView = this.json.bufferViews[indicesAccessor.bufferView];
                indicesBuffer.value = (0, _utils.buildArray)(this.arrayBuffer, indicesAccessor.componentType, bufferView.byteOffset + indicesAccessor.byteOffset, (0, _utils.getDataType)(indicesAccessor.type) * indicesAccessor.count);
            }
            for (var _k4 in vertexAccessor) {
                if (attributes['a_' + _k4]) {
                    var accessor = vertexAccessor[_k4];
                    var _bufferView = this.json.bufferViews[accessor.bufferView];
                    attributes['a_' + _k4].value = (0, _utils.buildArray)(this.arrayBuffer, accessor.componentType, _bufferView.byteOffset + accessor.byteOffset, (0, _utils.getDataType)(accessor.type) * accessor.count);
                }
            }

            var mesh = void 0;
            if (source.skin) {
                mesh = new _objects.SkinnedMesh(name, parent);
                mesh.setSkin(source.skin);
            } else {
                mesh = new _objects.Mesh(name, parent);
            }
            var isBlend = technique.states.enable.some(function (s) {
                return glEnum[s] === 'BLEND';
            });
            if (isBlend) {
                mesh.setBlend(isBlend);
                Object.assign(this.blendTechnique, technique.states.functions);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = technique.states.enable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var e = _step.value;

                        this.blendEnable[e] = true;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = technique.states.enable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _e = _step2.value;

                        this.unblendEnable[_e] = true;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            mesh.setTechnique(technique.states);
            mesh.setProgram(this.scene.program.find(function (p) {
                return p.name === technique.program;
            }).program);
            mesh.setMode(p.mode);
            mesh.setUniforms(uniforms);
            mesh.setAttributes(attributes);
            mesh.setIndicesBuffer(indicesBuffer);
            mesh.setTextures(textures);

            return mesh;
        }
    }, {
        key: 'walkByMesh',
        value: function walkByMesh(parent, name) {
            var _this2 = this;

            var el = this.json.nodes[name];
            var child = void 0;

            if (el.camera) {
                var proj = this.buildCamera(this.json.cameras[el.camera]);
                child = new _objects.Camera(name, parent);
                child.props = this.json.cameras[el.camera];
                child.setProjection(proj.elements);
                child.setMatrix(el.matrix);
                child.setMatrixWorld(el.matrix);

                //this._camera = child;

                this.cameras.push(child);
            } else {
                if (el.jointName) {
                    child = new _objects.Bone(name, parent);
                    child.setJointName(el.jointName);
                } else {
                    child = new _objects.Object3D(name, parent);
                }
                if (el.translation && el.rotation && el.scale) {
                    child.setPosition(el.translation, el.rotation, el.scale);
                } else if (el.matrix) {
                    child.setMatrix(el.matrix);
                }
            }

            parent.children.push(child);
            parent = child;

            if (el.children && el.children.length) {
                el.children.forEach(this.walkByMesh.bind(this, parent));
            } else if (el.meshes && el.meshes.length) {
                el.meshes.forEach(function (m) {
                    var _parent$children;

                    (_parent$children = parent.children).push.apply(_parent$children, _toConsumableArray(_this2.json.meshes[m].primitives.map(_this2.buildPrim.bind(_this2, parent, el, m))));
                });
            }
        }
    }, {
        key: 'calculateFov',
        value: function calculateFov() {
            var biggestMesh = void 0;
            (0, _utils.walk)(this.scene, function (node) {
                if (node instanceof _objects.SkinnedMesh || node instanceof _objects.Mesh) {
                    if (!biggestMesh) {
                        biggestMesh = node;
                    }
                    if (node.geometry.boundingSphere.radius > biggestMesh.geometry.boundingSphere.radius) {
                        biggestMesh = node;
                    }
                }
            });
            var a = Math.abs;
            var min = biggestMesh.geometry.boundingSphere.min.elements;
            var max = biggestMesh.geometry.boundingSphere.max.elements;
            this._camera.modelXSize = Math.max(a(min[0]), a(min[2]), a(max[0]), a(max[2]), Math.sqrt(min[0] * min[0] + min[2] * min[2]), Math.sqrt(max[0] * max[0] + max[2] * max[2]));
            this._camera.modelYSize = Math.max(a(min[1]), a(min[2]), a(max[1]), a(max[2]));
            this._camera.modelSize = Math.max(this._camera.modelYSize, this._camera.modelXSize);

            if (!this._camera.props.perspective.yfov) {
                console.warn('Camera not found');
                var z = this._camera.modelSize / (this.width / 100) * 30;
                this._camera.setZ(z);
                this._camera.props.perspective.yfov = 0.6;
            }
            this.resize();
        }
    }, {
        key: 'buildMesh',
        value: function buildMesh() {
            var _this3 = this;

            this.json.scenes.defaultScene.nodes.forEach(function (n) {
                if (_this3.json.nodes[n].children.length) {
                    _this3.walkByMesh(_this3.scene, n);
                }
                if (_this3.json.nodes[n].meshes && _this3.json.nodes[n].meshes.length) {
                    _this3.json.nodes[n].meshes.forEach(function (m) {
                        var _scene$children;

                        (_scene$children = _this3.scene.children).push.apply(_scene$children, _toConsumableArray(_this3.json.meshes[m].primitives.map(_this3.buildPrim.bind(_this3, _this3.scene, _this3.json.nodes[n], m))));
                    });
                }
                if (_this3.json.nodes[n].camera) {
                    var proj = _this3.buildCamera(_this3.json.cameras[_this3.json.nodes[n].camera]);

                    //this._camera = new Camera();
                    _this3._camera.props = _this3.json.cameras[_this3.json.nodes[n].camera];
                    _this3._camera.setProjection(proj.elements);
                    _this3._camera.setMatrix(_this3.json.nodes[n].matrix);
                    _this3._camera.setMatrixWorld(_this3.json.nodes[n].matrix);
                }
            });

            this.calculateFov();

            return true;
        }
    }, {
        key: 'buildAnimation',
        value: function buildAnimation() {
            var _this4 = this;

            for (var k in this.json.animations) {
                var animation = this.json.animations[k];
                for (var channelId in animation.channels) {
                    var channel = animation.channels[channelId];
                    var sampler = animation.samplers[channel.sampler];

                    if (sampler) {
                        (function () {
                            // eslint-disable-next-line
                            var walk = function walk(node) {
                                if (exist) {
                                    return;
                                }
                                if (node.name + 'Node' === name || node.name === name) {
                                    mesh = node;
                                    exist = true;
                                }
                                if (node.children) {
                                    node.children.forEach(walk);
                                }
                            };

                            var target = channel.target;

                            var name = target.id;
                            var input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
                            var output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

                            var inputAccessor = _this4.json.accessors[input];
                            var outputAccessor = _this4.json.accessors[output];
                            var inputBuffer = _this4.json.bufferViews[inputAccessor.bufferView];
                            var outputBuffer = _this4.json.bufferViews[outputAccessor.bufferView];

                            var inputArray = (0, _utils.buildArray)(_this4.arrayBuffer, inputAccessor.componentType, inputBuffer.byteOffset + inputAccessor.byteOffset, (0, _utils.getDataType)(inputAccessor.type) * inputAccessor.count);
                            var outputArray = (0, _utils.buildArray)(_this4.arrayBuffer, outputAccessor.componentType, outputBuffer.byteOffset + outputAccessor.byteOffset, (0, _utils.getDataType)(outputAccessor.type) * outputAccessor.count);

                            var component = (0, _utils.getAnimationComponent)(target.path);

                            var keys = [];
                            for (var i = 0; i < inputArray.length; i++) {
                                var firstT = inputArray[i];
                                var firstV = outputArray.slice(i * component, (i + 1) * component);

                                keys.push({
                                    time: firstT,
                                    value: firstV
                                });
                            }

                            var node = _this4.json.nodes[name];
                            var mesh = void 0;
                            var exist = void 0;
                            walk(_this4.scene);

                            if (node) {
                                _this4.tracks.push({
                                    mesh: mesh,
                                    type: target.path,
                                    name: node.name + '.' + target.path,
                                    keys: keys,
                                    interpolation: sampler.interpolation
                                });
                            }
                        })();
                    }
                }
            }

            return true;
        }
    }, {
        key: 'buildSkin',
        value: function buildSkin() {
            for (var k in this.json.skins) {
                var skin = this.json.skins[k];
                var bindShapeMatrix = new _matrix.Matrix4();

                if (skin.bindShapeMatrix !== undefined) {
                    bindShapeMatrix.set(skin.bindShapeMatrix);
                }

                var acc = this.json.accessors[skin.inverseBindMatrices];
                var buffer = this.json.bufferViews[acc.bufferView];
                var array = (0, _utils.buildArray)(this.arrayBuffer, acc.componentType, buffer.byteOffset + acc.byteOffset, (0, _utils.getDataType)(acc.type) * acc.count);

                this.skins[k] = {
                    bindShapeMatrix: bindShapeMatrix,
                    jointNames: skin.jointNames,
                    inverseBindMatrices: array
                };

                var i = 0;
                var v = this.skins[k];
                v.bones = [];
                v.boneInverses = [];

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = v.jointNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var join = _step3.value;

                        (0, _utils.walk)(this.scene, this.buildBones.bind(this, join, v));
                        var m = v.inverseBindMatrices;
                        var mat = new _matrix.Matrix4().set(m.slice(i * 16, (i + 1) * 16));
                        v.boneInverses.push(mat);
                        i++;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            return true;
        }
    }, {
        key: 'buildBones',
        value: function buildBones(join, v, node) {
            if (node.jointName === join) {
                v.bones.push(node);
            }
        }
    }, {
        key: 'getJson',
        value: function getJson() {
            var _this5 = this;

            return fetch(this.url).then(function (res) {
                return res.json();
            }).then(function (j) {
                for (var k in j.programs) {
                    j.programs[k].shaders = [];
                    j.programs[k].name = k;
                    _this5.scene.program.push(j.programs[k]);
                }
                for (var key in j.buffers) {
                    _this5.scene.bin.push(j.buffers[key].uri);
                }
                _this5.json = j;

                return true;
            });
        }
    }, {
        key: 'walkTexture',
        value: function walkTexture(node) {
            var _this6 = this;

            if (node.material && node.material.texture) {
                node.material.texture.forEach(function (t) {
                    if (!_this6.textures[t.name]) {
                        _this6.textures[t.name] = t;
                    }
                });
            }
        }
    }, {
        key: 'initTextures',
        value: function initTextures() {
            var _this7 = this;

            (0, _utils.walk)(this.scene, this.walkTexture.bind(this));

            var promiseArr = Object.values(this.textures).map(function (t) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.onload = function () {
                        _this7.handleTextureLoaded(t, image);
                        resolve();
                    };
                    image.onerror = function (err) {
                        reject(err);
                    };
                    image.crossOrigin = 'anonymous';
                    image.src = '' + _this7.host + t.uri;
                });
            });

            return Promise.all(promiseArr);
        }
    }, {
        key: 'handleTextureLoaded',
        value: function handleTextureLoaded(t, image) {
            t.data = gl.createTexture();
            t.count = sceneTextureCount;
            gl.activeTexture(gl['TEXTURE' + sceneTextureCount]);
            gl.bindTexture(t.target, t.data);
            gl.texImage2D(t.target, 0, t.format, t.internalFormat, t.type, image);
            gl.texParameteri(t.target, gl.TEXTURE_WRAP_S, t.wrapS);
            gl.texParameteri(t.target, gl.TEXTURE_WRAP_T, t.wrapT);
            gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, t.magFilter);
            gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, t.minFilter);
            gl.generateMipmap(t.target);
            sceneTextureCount++;
        }
    }, {
        key: 'width',
        get: function get() {
            return this.canvas.offsetWidth;
        }
    }]);

    return Parse;
}();

/***/ })
/******/ ]);
});