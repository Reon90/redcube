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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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

Matrix4.prototype.rotate = function (rad, axis) {
    var te = this.elements;
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s = void 0,
        c = void 0,
        t = void 0;
    var a00 = void 0,
        a01 = void 0,
        a02 = void 0,
        a03 = void 0;
    var a10 = void 0,
        a11 = void 0,
        a12 = void 0,
        a13 = void 0;
    var a20 = void 0,
        a21 = void 0,
        a22 = void 0,
        a23 = void 0;
    var b00 = void 0,
        b01 = void 0,
        b02 = void 0;
    var b10 = void 0,
        b11 = void 0,
        b12 = void 0;
    var b20 = void 0,
        b21 = void 0,
        b22 = void 0;

    if (Math.abs(len) < Number.EPSILON) {
        return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = te[0];a01 = te[1];a02 = te[2];a03 = te[3];
    a10 = te[4];a11 = te[5];a12 = te[6];a13 = te[7];
    a20 = te[8];a21 = te[9];a22 = te[10];a23 = te[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    te[0] = a00 * b00 + a10 * b01 + a20 * b02;
    te[1] = a01 * b00 + a11 * b01 + a21 * b02;
    te[2] = a02 * b00 + a12 * b01 + a22 * b02;
    te[3] = a03 * b00 + a13 * b01 + a23 * b02;
    te[4] = a00 * b10 + a10 * b11 + a20 * b12;
    te[5] = a01 * b10 + a11 * b11 + a21 * b12;
    te[6] = a02 * b10 + a12 * b11 + a22 * b12;
    te[7] = a03 * b10 + a13 * b11 + a23 * b12;
    te[8] = a00 * b20 + a10 * b21 + a20 * b22;
    te[9] = a01 * b20 + a11 * b21 + a21 * b22;
    te[10] = a02 * b20 + a12 * b21 + a22 * b22;
    te[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
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
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setGl = setGl;
exports.isMatrix = isMatrix;
exports.getMatrixType = getMatrixType;
exports.getDataType = getDataType;
exports.getComponentType = getComponentType;
exports.getMethod = getMethod;
exports.getAnimationComponent = getAnimationComponent;
exports.getAnimationMethod = getAnimationMethod;
exports.range = range;
exports.interpolation = interpolation;
exports.buildArray = buildArray;
exports.degToRad = degToRad;

var _matrix = __webpack_require__(0);

var glEnum = void 0;

function setGl(gl) {
    glEnum = gl;
}

function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
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

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D uOriginal;\r\nuniform sampler2D uTexture1;\r\nuniform sampler2D uTexture2;\r\nuniform sampler2D uTexture3;\r\nuniform sampler2D uTexture4;\r\n\r\nvoid main() \r\n{\r\n    vec4 vOriginal = texture(uOriginal, uv);\r\n    vec4 vT1 = texture(uTexture1, uv);\r\n    vec4 vT2 = texture(uTexture2, uv);\r\n    vec4 vT3 = texture(uTexture3, uv);\r\n    vec4 vT4 = texture(uTexture4, uv);\r\n    color = vOriginal + vT1 + vT2 + vT3 + vT4;\r\n}\r\n"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform vec2 offset;\r\nuniform float level;\r\nuniform sampler2D uTexture;\r\n\r\nvoid main() \r\n{\r\n    vec4 c = vec4(0);\r\n    c += 15.0 * vec4(textureLod(uTexture, uv - offset, level).rgb * 0.1, 1.0);\r\n    c += 16.0 * vec4(textureLod(uTexture, uv, level).rgb * 0.1, 1.0);\r\n    c += 15.0 * vec4(textureLod(uTexture, uv + offset, level).rgb * 0.1, 1.0);\r\n    color = c / 16.0;\r\n}\r\n"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 pos;\r\nlayout (location = 1) in vec2 aUV;\r\n\r\nuniform mat4 uMVPMatrix;\r\n\r\nout vec2 uv;\r\n\r\nvoid main() {\r\n\tuv = aUV;\r\n    gl_Position = uMVPMatrix * vec4(pos, 1.0);\r\n}\r\n"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nlayout (location = 0) in vec2 pos;\r\n\r\nout vec2 uv;\r\n\r\nvoid main() {\r\n    uv = pos * 0.5 + 0.5;\r\n    gl_Position = vec4(pos, 0.0, 1.0); \r\n}\r\n"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D uTexture;\r\n\r\nvoid main() {\r\n    color = texture(uTexture, uv);\r\n}\r\n"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RedCube = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = __webpack_require__(2);

var _matrix = __webpack_require__(0);

var _events = __webpack_require__(1);

var _utils = __webpack_require__(3);

var _quad = __webpack_require__(7);

var _quad2 = _interopRequireDefault(_quad);

var _blur = __webpack_require__(5);

var _blur2 = _interopRequireDefault(_blur);

var _bloom = __webpack_require__(4);

var _bloom2 = _interopRequireDefault(_bloom);

var _env = __webpack_require__(6);

var _env2 = _interopRequireDefault(_env);

var _texture = __webpack_require__(8);

var _texture2 = _interopRequireDefault(_texture);

var _env3 = __webpack_require__(9);

var _env4 = _interopRequireDefault(_env3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var screenTextureCount = 1;
var sceneTextureCount = 7;
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
        this.cameras = [];
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

        this.unblendEnable = {};
        this.blendEnable = {};
        this.blendTechnique = {};
        this.tracks = [];
        this.skins = {};
        this.json = null;
        this.glEnum = {};
        this.textures = {};

        this.events = new _events.Events(this.redraw.bind(this));
        this.cameraPosition = new _matrix.Vector3([0, 0, 0.05]);

        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;
    }

    _createClass(RedCube, [{
        key: 'init',
        value: function init() {
            return this.getJson().then(this.glInit.bind(this)).then(this.buildScreenBuffer.bind(this)).then(this.getBuffer.bind(this)).then(this.buildMesh.bind(this)).then(this.initTextures.bind(this)).then(this.buildAnimation.bind(this)).then(this.buildSkin.bind(this)).then(this.createEnvironmentBuffer.bind(this)).then(this.draw.bind(this)).catch(console.error);
        }
    }, {
        key: 'setColor',
        value: function setColor(color) {
            this.color = color;
        }
    }, {
        key: 'createEnvironment',
        value: function createEnvironment() {
            var program = gl.createProgram();
            this.compileShader(gl.VERTEX_SHADER, _env2.default, program);
            this.compileShader(gl.FRAGMENT_SHADER, _texture2.default, program);
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
                img.src = _env4.default;
            });
        }
    }, {
        key: 'postProcessing',
        value: function postProcessing() {
            var program = gl.createProgram();
            this.compileShader(gl.VERTEX_SHADER, _quad2.default, program);
            this.compileShader(gl.FRAGMENT_SHADER, _blur2.default, program);
            gl.linkProgram(program);
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            gl.activeTexture(gl.TEXTURE1);
            gl.generateMipmap(gl.TEXTURE_2D);

            this.renderBlur(program, 0.0, this.blurTexture, true);
            this.renderBlur(program, 1.0, this.blurTexture2);
            this.renderBlur(program, 2.0, this.blurTexture3);
            this.renderBlur(program, 3.0, this.blurTexture4);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            var program2 = gl.createProgram();
            this.compileShader(gl.VERTEX_SHADER, _quad2.default, program2);
            this.compileShader(gl.FRAGMENT_SHADER, _bloom2.default, program2);
            gl.linkProgram(program2);
            gl.useProgram(program2);

            gl.uniform1i(gl.getUniformLocation(program2, 'uOriginal'), this.screenTexture.index);
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
            gl.uniform2f(gl.getUniformLocation(program, 'offset'), 1.2 / this.canvas.offsetWidth, 0);
            gl.uniform1f(gl.getUniformLocation(program, 'level'), level);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (needMipmap) {
                gl.activeTexture(gl.TEXTURE2);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
            gl.uniform2f(gl.getUniformLocation(program, 'offset'), 0, 1.2 / this.canvas.offsetHeight);
            gl.uniform1f(gl.getUniformLocation(program, 'level'), 0.0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, out, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }, {
        key: 'compileShader',
        value: function compileShader(type, shaderSource, program) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, shaderSource);
            gl.compileShader(shader);
            gl.attachShader(program, shader);
            var log = gl.getShaderInfoLog(shader);
            if (log) {
                console.error(log);
            }
        }
    }, {
        key: 'createTexture',
        value: function createTexture(needMipmap) {
            var texture = gl.createTexture();
            gl.activeTexture(gl['TEXTURE' + screenTextureCount]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, needMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.canvas.offsetWidth, this.canvas.offsetHeight, 0, gl.RGBA, gl.FLOAT, null);
            texture.index = screenTextureCount;
            screenTextureCount++;
            return texture;
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

            var renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.offsetWidth, this.canvas.offsetHeight);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

            return true;
        }
    }, {
        key: 'redraw',
        value: function redraw(type, coordsStart, coordsMove) {
            if (type === 'zoom') {
                this.zoom = coordsStart;
                this._camera.setProjection(this.buildCamera(this._camera.props).elements);
            }
            if (type === 'rotate') {
                var deltaX = coordsMove[0] - coordsStart[0];
                var newRotationMatrix = new _matrix.Matrix4();
                newRotationMatrix.rotate((0, _utils.degToRad)(-deltaX / 5), [0, -1, 0]);

                var deltaY = coordsMove[1] - coordsStart[1];
                newRotationMatrix.rotate((0, _utils.degToRad)(-deltaY / 5), [-1, 0, 0]);

                this.scene.matrixWorld.multiply(newRotationMatrix);
                this.envMatrix.multiply(newRotationMatrix);
            }
            if (type === 'pan') {
                var p0 = new _matrix.Vector3(this.canvasToWorld.apply(this, _toConsumableArray(coordsStart)).elements);
                var p1 = new _matrix.Vector3(this.canvasToWorld.apply(this, _toConsumableArray(coordsMove)).elements);
                var pan = this._camera.modelSize * 100;
                var delta = p1.subtract(p0).scale(pan);

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
            this._camera.setProjection(this.buildCamera(this._camera.props).elements);
        }
    }, {
        key: 'canvasToWorld',
        value: function canvasToWorld(x, y) {
            var newM = new _matrix.Matrix4();
            newM.setTranslate.apply(newM, _toConsumableArray(this.cameraPosition.elements));
            var m = new _matrix.Matrix4(this._camera.projection);
            m.multiply(newM);

            var mp = m.multiplyVector4(new _matrix.Vector4([0, 0, 0, 1]));
            mp.elements[0] = (2 * x / this.canvas.offsetWidth - 1) * mp.elements[3];
            mp.elements[1] = (-2 * y / this.canvas.offsetHeight + 1) * mp.elements[3];

            return m.invert().multiplyVector4(mp);
        }
    }, {
        key: 'walk',
        value: function walk(node, callback) {
            function _walk(node) {
                callback(node);
                if (node.children) {
                    node.children.forEach(_walk);
                }
            }
            _walk(node);
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
            var _this2 = this;

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
                return _this2.glEnum[s] === 'BLEND';
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
        key: 'calculateFov',
        value: function calculateFov() {
            var biggestMesh = void 0;
            this.walk(this.scene, function (node) {
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
                var z = this._camera.modelSize / (this.canvas.offsetWidth / 100) * 30;
                this._camera.setZ(z);
                this._camera.props.perspective.yfov = 0.6;
            }
            this.resize();
        }
    }, {
        key: 'buildCamera',
        value: function buildCamera(cam) {
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
        key: 'walkByMesh',
        value: function walkByMesh(parent, name) {
            var _this3 = this;

            var el = this.json.nodes[name];
            var child = void 0;

            if (el.camera) {
                var proj = this.buildCamera(this.json.cameras[el.camera]);
                child = new _objects.Camera(name, parent);
                child.props = this.json.cameras[el.camera];
                child.setProjection(proj.elements);
                child.setMatrix(el.matrix);
                child.setMatrixWorld(el.matrix);
                this._camera = child;

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

                    (_parent$children = parent.children).push.apply(_parent$children, _toConsumableArray(_this3.json.meshes[m].primitives.map(_this3.buildPrim.bind(_this3, parent, el, m))));
                });
            }
        }
    }, {
        key: 'buildMesh',
        value: function buildMesh() {
            var _this4 = this;

            this.json.scenes.defaultScene.nodes.forEach(function (n) {
                if (_this4.json.nodes[n].children.length) {
                    _this4.walkByMesh(_this4.scene, n);
                }
                if (_this4.json.nodes[n].meshes && _this4.json.nodes[n].meshes.length) {
                    _this4.json.nodes[n].meshes.forEach(function (m) {
                        var _scene$children;

                        (_scene$children = _this4.scene.children).push.apply(_scene$children, _toConsumableArray(_this4.json.meshes[m].primitives.map(_this4.buildPrim.bind(_this4, _this4.scene, _this4.json.nodes[n], m))));
                    });
                }
                if (_this4.json.nodes[n].camera) {
                    var proj = _this4.buildCamera(_this4.json.cameras[_this4.json.nodes[n].camera]);
                    _this4._camera = new _objects.Camera();
                    _this4._camera.props = _this4.json.cameras[_this4.json.nodes[n].camera];
                    _this4._camera.setProjection(proj.elements);
                    _this4._camera.setMatrix(_this4.json.nodes[n].matrix);
                    _this4._camera.setMatrixWorld(_this4.json.nodes[n].matrix);
                }
            });

            this.calculateFov();

            return true;
        }
    }, {
        key: 'buildAnimation',
        value: function buildAnimation() {
            var _this5 = this;

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

                            var inputAccessor = _this5.json.accessors[input];
                            var outputAccessor = _this5.json.accessors[output];
                            var inputBuffer = _this5.json.bufferViews[inputAccessor.bufferView];
                            var outputBuffer = _this5.json.bufferViews[outputAccessor.bufferView];

                            var inputArray = (0, _utils.buildArray)(_this5.arrayBuffer, inputAccessor.componentType, inputBuffer.byteOffset + inputAccessor.byteOffset, (0, _utils.getDataType)(inputAccessor.type) * inputAccessor.count);
                            var outputArray = (0, _utils.buildArray)(_this5.arrayBuffer, outputAccessor.componentType, outputBuffer.byteOffset + outputAccessor.byteOffset, (0, _utils.getDataType)(outputAccessor.type) * outputAccessor.count);

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

                            var node = _this5.json.nodes[name];
                            var mesh = void 0;
                            var exist = void 0;
                            walk(_this5.scene);

                            if (node) {
                                _this5.tracks.push({
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

                        this.walk(this.scene, this.buildBones.bind(this, join, v));
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
            var _this6 = this;

            return fetch(this.url).then(function (res) {
                return res.json();
            }).then(function (j) {
                for (var k in j.programs) {
                    j.programs[k].shaders = [];
                    j.programs[k].name = k;
                    _this6.scene.program.push(j.programs[k]);
                }
                for (var key in j.buffers) {
                    _this6.scene.bin.push(j.buffers[key].uri);
                }
                _this6.json = j;

                return true;
            });
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
            var _this7 = this;

            gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            this.gl = gl;

            for (var k in gl) {
                var v = gl[k];
                if (typeof v === 'number') {
                    this.glEnum[v] = k;
                }
            }
            (0, _utils.setGl)(this.glEnum);

            var shaderArr = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.scene.program[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var p = _step4.value;

                    shaderArr.push(fetch('' + this.host + p.fragmentShader + '.glsl').then(function (res) {
                        return res.text();
                    }));
                    shaderArr.push(fetch('' + this.host + p.vertexShader + '.glsl').then(function (res) {
                        return res.text();
                    }));
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

            return Promise.all(shaderArr).then(function (res) {
                var program = void 0;
                var i = 0;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = res[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var sh = _step5.value;

                        if (!program) {
                            program = gl.createProgram();
                        }

                        var type = void 0;
                        if (/gl_Position/.test(sh)) {
                            type = gl.VERTEX_SHADER;
                        } else {
                            type = gl.FRAGMENT_SHADER;
                        }

                        var shader = gl.createShader(type);
                        gl.shaderSource(shader, sh);
                        gl.compileShader(shader);
                        gl.attachShader(program, shader);

                        var index = _this7.scene.program[i].shaders.push(shader);
                        if (index === 2) {
                            _this7.scene.program[i].program = program;
                            gl.linkProgram(program);
                            program = null;
                            i++;
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

                return true;
            });
        }
    }, {
        key: 'animate',
        value: function animate(sec) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.tracks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var v = _step6.value;

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
                node.bones = this.skins[node.skin].bones;
                node.boneInverses = this.skins[node.skin].boneInverses;
                node.bindShapeMatrix = this.skins[node.skin].bindShapeMatrix;
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
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

                this.createEnvironment();

                var blends = [];
                var nonBlends = [];
                this.walk(this.scene, this.setMesh.bind(this, blends, nonBlends));

                var planes = (0, _matrix.Frustum)(this._camera.getViewProjMatrix());

                if (nonBlends.length) {
                    for (var e in this.unblendEnable) {
                        gl.enable(e);
                    }
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = nonBlends[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var mesh = _step7.value;

                            if (mesh.isVisible(planes)) {
                                this.buildBuffer.apply(this, [mesh.geometry.indicesBuffer].concat(_toConsumableArray(Object.values(mesh.geometry.attributes))));
                                this._draw(mesh);
                            }
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

                    for (var _e2 in this.unblendEnable) {
                        gl.disable(_e2);
                    }
                }

                if (blends.length) {
                    var blendsSorted = [];
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = blends[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var _mesh2 = _step8.value;

                            if (_mesh2.isVisible(planes)) {
                                blendsSorted.push(_mesh2);
                            }
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }

                    if (blendsSorted.length) {
                        blendsSorted.sort(function (a, b) {
                            return a.distance - b.distance;
                        });

                        for (var _e3 in this.blendEnable) {
                            gl.enable(_e3);
                        }
                        for (var f in this.blendTechnique) {
                            var _gl2;

                            (_gl2 = gl)[f].apply(_gl2, _toConsumableArray(this.blendTechnique[f]));
                        }
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = blendsSorted[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var _mesh = _step9.value;

                                this.buildBuffer.apply(this, [_mesh.geometry.indicesBuffer].concat(_toConsumableArray(Object.values(_mesh.geometry.attributes))));
                                this._draw(_mesh);
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }

                        for (var _e4 in this.blendEnable) {
                            gl.disable(_e4);
                        }
                        for (var _f in this.blendTechnique) {
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

                this.postProcessing();
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

            for (var _k5 in mesh.material.uniforms) {
                var _v = mesh.material.uniforms[_k5];
                var matricies = void 0,
                    value = void 0;

                if (_v.type === gl.SAMPLER_2D) {
                    value = [this.textures[_v.value[0]].count];
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
                if (_v[_k5] !== undefined) {
                    u = _v[_k5];
                } else {
                    u = gl.getUniformLocation(mesh.program, _k5);
                    if (u !== 0 && !u) {
                        console.warn('dont get ' + _k5 + ' from shader');
                        delete mesh.material.uniforms[_k5];
                        continue;
                    }
                    _v[_k5] = u;
                }

                if (_v.type !== gl.SAMPLER_2D) {
                    value = _v.value || _v.node;
                }

                if (value.elements) {
                    gl[(0, _utils.getMethod)(_v.type)](u, false, value.elements);
                } else if (matricies) {
                    var concatArr = new Float32Array(matricies.length * 16);
                    var i = 0;
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = matricies[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var m = _step10.value;

                            concatArr.set(m.elements, i * 16);
                            i++;
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
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
    }, {
        key: 'walkTexture',
        value: function walkTexture(node) {
            var _this8 = this;

            if (node.material && node.material.texture) {
                node.material.texture.forEach(function (t) {
                    if (!_this8.textures[t.name]) {
                        _this8.textures[t.name] = t;
                    }
                });
            }
        }
    }, {
        key: 'initTextures',
        value: function initTextures() {
            var _this9 = this;

            this.walk(this.scene, this.walkTexture.bind(this));

            var promiseArr = Object.values(this.textures).map(function (t) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.onload = function () {
                        _this9.handleTextureLoaded(t, image);
                        resolve();
                    };
                    image.onerror = function (err) {
                        reject(err);
                    };
                    image.crossOrigin = 'anonymous';
                    image.src = '' + _this9.host + t.uri;
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
    }]);

    return RedCube;
}();

exports.RedCube = RedCube;

/***/ })
/******/ ]);
});