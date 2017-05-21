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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

/** 
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

var Matrix2 = function Matrix2(opt_src) {
  var i, s, d;
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
  var i, s, d;

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
  var i, s, d;
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
  var i, s, d;

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
  var i, s, d;
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
  var i, s, d;

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
  var i, e, a, b, ai0, ai1, ai2, ai3;

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
  var i, s, d, inv, det;

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
  var e, rw, rh, rd;

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
  var e, rd, s, ct;

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

/**
 * Set the viewing matrix.
 * @param eyeX, eyeY, eyeZ The position of the eye point.
 * @param centerX, centerY, centerZ The position of the reference point.
 * @param upX, upY, upZ The direction of the up vector.
 * @return this
 */
Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

  fx = centerX - eyeX;
  fy = centerY - eyeY;
  fz = centerZ - eyeZ;

  // Normalize f.
  rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;

  // Calculate cross product of f and up.
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // Normalize s.
  rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;

  // Calculate cross product of s and f.
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;

  // Set to this.
  e = this.elements;
  e[0] = sx;
  e[1] = ux;
  e[2] = -fx;
  e[3] = 0;

  e[4] = sy;
  e[5] = uy;
  e[6] = -fy;
  e[7] = 0;

  e[8] = sz;
  e[9] = uz;
  e[10] = -fz;
  e[11] = 0;

  e[12] = 0;
  e[13] = 0;
  e[14] = 0;
  e[15] = 1;

  // Translate.
  return this.translate(-eyeX, -eyeY, -eyeZ);
};

/**
 * Multiply the viewing matrix from the right.
 * @param eyeX, eyeY, eyeZ The position of the eye point.
 * @param centerX, centerY, centerZ The position of the reference point.
 * @param upX, upY, upZ The direction of the up vector.
 * @return this
 */
Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
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
    if (g == 1) return this;
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
  return out;
};

Vector3.prototype.lerp = function (a, b, t) {
  var out = this.elements;
  var ax = a[0],
      ay = a[1],
      az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
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
                center: new _matrix3.Vector3()
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
            var verticesGrouped = [];
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

            this.geometry.boundingSphere.center.add(new _matrix3.Vector3(min)).add(new _matrix3.Vector3(max)).scale(0.5);

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
        key: 'setMatrixWorldInvert',
        value: function setMatrixWorldInvert(look) {
            var _matrixWorldInvert;

            (_matrixWorldInvert = this.matrixWorldInvert).lookAt.apply(_matrixWorldInvert, _toConsumableArray(look));
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RedCube = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = __webpack_require__(1);

var _matrix = __webpack_require__(0);

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
        this.cameras = [];
        this.aspect = this.canvas.width / this.canvas.height;
        this._camera = new _objects.Camera();
        this._camera.setProjection(new _matrix.Matrix4().setPerspective(30, this.aspect, 1, 1000).elements);
        this._camera.setMatrixWorldInvert([5, 5, 5, 0, 1, 0, 0, 1, 0]);

        this.unblendEnable = {};
        this.blendEnable = {};
        this.blendTechnique = {};
        this.tracks = [];
        this.skins = {};
        this.json = null;
        this.glEnum = {};
        this.textures = {};
    }

    _createClass(RedCube, [{
        key: 'init',
        value: function init() {
            return this.getJson().then(this.glInit.bind(this)).then(this.getBuffer.bind(this)).then(this.buildMesh.bind(this)).then(this.initTextures.bind(this)).then(this.buildAnimation.bind(this)).then(this.buildSkin.bind(this)).then(this.draw.bind(this)).catch(console.error);
        }
    }, {
        key: 'setColor',
        value: function setColor(color) {
            this.color = color;
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
        key: 'isMatrix',
        value: function isMatrix(type) {
            return this.glEnum[type] === 'FLOAT_MAT4' || this.glEnum[type] === 'FLOAT_MAT3' || this.glEnum[type] === 'FLOAT_MAT2';
        }
    }, {
        key: 'getMatrixType',
        value: function getMatrixType(type) {
            if (this.glEnum[type] === 'FLOAT_MAT4') {
                return _matrix.Matrix4;
            }
            if (this.glEnum[type] === 'FLOAT_MAT3') {
                return _matrix.Matrix3;
            }
            if (this.glEnum[type] === 'FLOAT_MAT2') {
                return _matrix.Matrix2;
            }
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
                    textures.push(t);
                }

                if (u.value !== undefined && !Array.isArray(u.value)) {
                    u.value = [u.value];
                }
                if (u.node !== undefined && !Array.isArray(u.node)) {
                    u.node = [u.node];
                }

                if (u.value && this.isMatrix(u.type)) {
                    var matrixConstr = this.getMatrixType(u.type);
                    u.value = new matrixConstr().set(u.value);
                }
                if (u.node && this.isMatrix(u.type)) {
                    var _matrixConstr = this.getMatrixType(u.type);
                    u.node = new _matrixConstr().set(u.node);
                }
                if (u.count && !u.value) {
                    (function () {
                        var constr = _this2.getMatrixType(u.type);
                        u.value = new Array(u.count).fill(1).map(function (it) {
                            return new constr();
                        });
                    })();
                }
            }

            var indicesBuffer = void 0;
            if (indicesAccessor) {
                indicesBuffer = {};
                var bufferView = this.json.bufferViews[indicesAccessor.bufferView];
                indicesBuffer.value = this.buildArray(indicesAccessor.componentType, bufferView.byteOffset + indicesAccessor.byteOffset, this.getDataType(indicesAccessor.type) * indicesAccessor.count);
            }
            for (var _k4 in vertexAccessor) {
                if (attributes['a_' + _k4]) {
                    var accessor = vertexAccessor[_k4];
                    var _bufferView = this.json.bufferViews[accessor.bufferView];
                    attributes['a_' + _k4].value = this.buildArray(accessor.componentType, _bufferView.byteOffset + accessor.byteOffset, this.getDataType(accessor.type) * accessor.count);
                }
            };

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
        key: 'buildCamera',
        value: function buildCamera(cam) {
            var proj = void 0;
            if (cam.type == "perspective" && cam.perspective) {
                var yfov = cam.perspective.yfov;
                var aspectRatio = cam.perspective.aspectRatio || this.aspect;
                var xfov = yfov * aspectRatio;

                if (this.aspect !== aspectRatio) {
                    console.error('this.canvas size and this.canvas size from scene dont equal');
                }

                proj = new _matrix.Matrix4().setPerspective(xfov * (180 / Math.PI), this.aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
            } else if (cam.type == "orthographic" && cam.orthographic) {
                proj = new _matrix.Matrix4().setOrtho(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, cam.orthographic.znear, cam.orthographic.zfar);
            }

            return proj;
        }
    }, {
        key: 'buildMesh',
        value: function buildMesh() {
            var _this3 = this;

            this.json.scenes.defaultScene.nodes.forEach(function (n) {
                if (_this3.json.nodes[n].children.length) {
                    var _walk2 = function _walk2(parent, name) {
                        var _this4 = this;

                        var el = this.json.nodes[name];
                        var child = void 0;

                        if (el.camera) {
                            var proj = this.buildCamera(this.json.cameras[el.camera]);
                            child = new _objects.Camera(name, parent);
                            child.setProjection(proj.elements);
                            child.setMatrix(el.matrix);
                            child.setMatrixWorld(el.matrix);

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
                            el.children.forEach(_walk2.bind(this, parent));
                        } else if (el.meshes && el.meshes.length) {
                            el.meshes.forEach(function (m) {
                                var _parent$children;

                                (_parent$children = parent.children).push.apply(_parent$children, _toConsumableArray(_this4.json.meshes[m].primitives.map(_this4.buildPrim.bind(_this4, parent, el, m))));
                            });
                        }
                    };

                    _walk2.call(_this3, _this3.scene, n);
                }
                if (_this3.json.nodes[n].meshes && _this3.json.nodes[n].meshes.length) {
                    _this3.json.nodes[n].meshes.forEach(function (m) {
                        var _scene$children;

                        (_scene$children = _this3.scene.children).push.apply(_scene$children, _toConsumableArray(_this3.json.meshes[m].primitives.map(_this3.buildPrim.bind(_this3, _this3.scene, _this3.json.nodes[n], m))));
                    });
                }
                if (_this3.json.nodes[n].camera) {
                    var proj = _this3.buildCamera(_this3.json.cameras[_this3.json.nodes[n].camera]);
                    _this3._camera = new _objects.Camera();
                    _this3._camera.setProjection(proj.elements);
                    _this3._camera.setMatrix(_this3.json.nodes[n].matrix);
                    _this3._camera.setMatrixWorld(_this3.json.nodes[n].matrix);
                }
            });

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
                            var walk = function walk(node) {
                                if (exist) return;
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

                            var inputArray = _this5.buildArray(inputAccessor.componentType, inputBuffer.byteOffset + inputAccessor.byteOffset, _this5.getDataType(inputAccessor.type) * inputAccessor.count);
                            var outputArray = _this5.buildArray(outputAccessor.componentType, outputBuffer.byteOffset + outputAccessor.byteOffset, _this5.getDataType(outputAccessor.type) * outputAccessor.count);

                            var component = _this5.getAnimationComponent(target.path);

                            var keys = [];
                            for (var i = 0; i < inputArray.length; i++) {
                                var firstV = void 0,
                                    firstT = void 0;

                                firstT = inputArray[i];
                                firstV = outputArray.slice(i * component, (i + 1) * component);

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

                if (skin.bindShapeMatrix !== undefined) bindShapeMatrix.set(skin.bindShapeMatrix);

                var acc = this.json.accessors[skin.inverseBindMatrices];
                var buffer = this.json.bufferViews[acc.bufferView];
                var array = this.buildArray(acc.componentType, buffer.byteOffset + acc.byteOffset, this.getDataType(acc.type) * acc.count);

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
        key: 'buildArray',
        value: function buildArray(type, offset, length) {
            var arr = void 0;
            switch (this.glEnum[type]) {
                case 'BYTE':
                    arr = new Int8Array(this.arrayBuffer, offset, length);
                    break;
                case 'UNSIGNED_BYTE':
                    arr = new Uint8Array(this.arrayBuffer, offset, length);
                    break;
                case 'SHORT':
                    arr = new Int16Array(this.arrayBuffer, offset, length);
                    break;
                case 'UNSIGNED_SHORT':
                    arr = new Uint16Array(this.arrayBuffer, offset, length);
                    break;
                case 'FLOAT':
                    arr = new Float32Array(this.arrayBuffer, offset, length);
                    break;
            }
            return arr;
        }
    }, {
        key: 'getDataType',
        value: function getDataType(type) {
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
    }, {
        key: 'getComponentType',
        value: function getComponentType(type) {
            var count = void 0;
            switch (this.glEnum[type]) {
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

            gl = this.canvas.getContext('webgl');

            for (var k in gl) {
                var v = gl[k];
                if (typeof v === 'number') {
                    this.glEnum[v] = k;
                }
            }

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
        key: 'getMethod',
        value: function getMethod(type) {
            var method = void 0;
            switch (this.glEnum[type]) {
                case "FLOAT_VEC2":
                    method = 'uniform2f';
                    break;
                case "FLOAT_VEC4":
                    method = 'uniform4f';
                    break;
                case 'FLOAT':
                    method = 'uniform1f';
                    break;
                case "FLOAT_VEC3":
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
                case "SAMPLER_2D":
                    method = 'uniform1i';
                    break;
            }
            return method;
        }
    }, {
        key: 'getAnimationComponent',
        value: function getAnimationComponent(type) {
            if (type === 'rotation') {
                return 4;
            } else {
                return 3;
            }
        }
    }, {
        key: 'getAnimationMethod',
        value: function getAnimationMethod(type) {
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
    }, {
        key: 'range',
        value: function range(min, max, value) {
            return (value - min) / (max - min);
        }
    }, {
        key: 'interpolation',
        value: function interpolation(time, frames) {
            if (frames.length === 0) return [-1, -1, 0];

            var prev = -1;
            for (var i = frames.length - 1; i >= 0; i--) {
                if (time >= frames[i].time) {
                    prev = i;
                    break;
                }
            }

            if (prev === -1 || prev === frames.length - 1) {
                if (prev < 0) prev = 0;
                return [prev, prev, 0];
            } else {
                var startFrame = frames[prev];
                var endFrame = frames[prev + 1];

                time = Math.max(startFrame.time, Math.min(time, endFrame.time));
                var t = this.range(startFrame.time, endFrame.time, time);

                return [prev, prev + 1, t];
            }
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

                    var val = this.interpolation(sec, v.keys);

                    if (val[0] === -1 || val[1] === -1 || v.stoped) continue;
                    if (val[0] === v.keys.length - 1) {
                        v.stoped = true;
                    }

                    var startFrame = v.keys[val[0]];
                    var endFrame = v.keys[val[1]];
                    var t = val[2];

                    var component = this.getAnimationComponent(v.type);
                    var vector = void 0,
                        vector2 = void 0,
                        vectorC = component === 3 ? _matrix.Vector3 : _matrix.Vector4;

                    vector = new vectorC(startFrame.value);
                    vector2 = new vectorC(endFrame.value);

                    if (v.type === 'rotation') {
                        var out = new _matrix.Vector4();
                        out.lerp(vector.elements, vector2.elements, t);

                        v.mesh.matrixAnimation[this.getAnimationMethod(v.type)](out);
                    } else {
                        var _v$mesh$matrixAnimati;

                        var _out = new _matrix.Vector3();
                        _out.lerp(vector.elements, vector2.elements, t);

                        (_v$mesh$matrixAnimati = v.mesh.matrixAnimation)[this.getAnimationMethod(v.type)].apply(_v$mesh$matrixAnimati, _toConsumableArray(_out));
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
        value: function render(time) {
            var sec = time / 1000;

            this.animate(sec);

            if (this.reflow) {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

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

                gl.vertexAttribPointer(a, this.getComponentType(v.type), gl.FLOAT, false, 0, 0);
            }

            var texCount = 0;
            for (var _k5 in mesh.material.uniforms) {
                var _v = mesh.material.uniforms[_k5],
                    matricies = void 0;

                if (_v.type === gl.SAMPLER_2D) {
                    gl.activeTexture(gl['TEXTURE' + texCount]);
                    gl.bindTexture(mesh.material.texture[texCount].target, this.textures[mesh.material.texture[texCount].name].data);
                    _v.value = [texCount];
                    texCount++;
                }

                switch (_v.semantic) {
                    case "MODELVIEWPROJECTION":
                        _v.value = mesh.getModelViewProjMatrix(_camera);
                        break;
                    case "MODELVIEWPROJECTIONINVERSE":
                        _v.value = mesh.getModelViewProjMatrix(_camera).invert();
                        break;
                    case "VIEW":
                        _v.value = mesh.getViewMatrix(_camera);
                        break;
                    case "VIEWINVERSE":
                        _v.value = mesh.getViewMatrix(_camera).invert();
                        break;
                    case "MODEL":
                        _v.value = mesh.matrixWorld;
                        break;
                    case "MODELINVERSETRANSPOSE":
                        var normalMatrix = new _matrix.Matrix3();
                        normalMatrix.normalFromMat4(mesh.matrixWorld);
                        _v.value = normalMatrix;
                        break;
                    case "MODELINVERSE":
                        _v.value = new _matrix.Matrix4(mesh.matrixWorld).invert();
                        break;
                    case "MODELVIEW":
                        _v.value = mesh.getModelViewMatrix(_v.node, _camera);
                        break;
                    case "MODELVIEWINVERSE":
                        _v.value = mesh.getModelViewMatrix(_v.node, _camera).invert();
                        break;
                    case "PROJECTION":
                        _v.value = mesh.getProjectionMatrix(_camera);
                        break;
                    case "PROJECTIONINVERSE":
                        _v.value = new _matrix.Matrix4(mesh.getProjectionMatrix(_camera)).invert();
                        break;
                    case "MODELVIEWINVERSETRANSPOSE":
                        _v.value = mesh.getNormalMatrix();
                        break;
                    case "VIEWPORT":
                        _v.value = new Float32Array([0, 0, this.canvas.width, this.canvas.height]);
                        break;
                    case "JOINTMATRIX":
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

                var value = void 0;
                if (_v.value !== undefined) {
                    value = _v.value;
                } else if (_v.node !== undefined) {
                    value = _v.node;
                }

                if (value.elements) {
                    gl[this.getMethod(_v.type)](u, false, value.elements);
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

                    gl[this.getMethod(_v.type)](u, false, concatArr);
                } else {
                    var _gl3;

                    (_gl3 = gl)[this.getMethod(_v.type)].apply(_gl3, [u].concat(_toConsumableArray(value)));
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
                    image.src = '' + _this9.host + t.uri;
                });
            });

            return Promise.all(promiseArr);
        }
    }, {
        key: 'handleTextureLoaded',
        value: function handleTextureLoaded(t, image) {
            t.data = gl.createTexture();
            gl.bindTexture(t.target, t.data);
            gl.texImage2D(t.target, 0, t.format, t.internalFormat, t.type, image);
            gl.texParameteri(t.target, gl.TEXTURE_WRAP_S, t.wrapS);
            gl.texParameteri(t.target, gl.TEXTURE_WRAP_T, t.wrapT);
            gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, t.magFilter);
            gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, t.minFilter);
            gl.generateMipmap(t.target);
        }
    }]);

    return RedCube;
}();

exports.RedCube = RedCube;

/***/ })
/******/ ]);
});