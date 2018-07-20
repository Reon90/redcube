(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("redcube", [], factory);
	else if(typeof exports === 'object')
		exports["redcube"] = factory();
	else
		root["redcube"] = factory();
})(window, function() {
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/redcube.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/env.ts":
/*!********************!*\
  !*** ./src/env.ts ***!
  \********************/
/*! exports provided: Env */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Env", function() { return Env; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");
/* harmony import */ var _images_env_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/env.jpg */ "./src/images/env.jpg");
/* harmony import */ var _images_env_jpg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_images_env_jpg__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shaders_env_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shaders/env.glsl */ "./src/shaders/env.glsl");
/* harmony import */ var _shaders_env_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_env_glsl__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shaders_env_frag_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shaders/env-frag.glsl */ "./src/shaders/env-frag.glsl");
/* harmony import */ var _shaders_env_frag_glsl__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_shaders_env_frag_glsl__WEBPACK_IMPORTED_MODULE_4__);





let gl;
class Env {
    constructor() {
        this.envMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Matrix4"];
    }
    setCamera(camera) {
        this._camera = camera;
    }
    setGl(g) {
        gl = g;
    }
    createEnvironment() {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO);
        const m = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Matrix4"];
        const cam = Object.assign({}, this._camera.props, {
            perspective: {
                yfov: 0.6,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateProjection"])(cam));
        m.multiply(this._camera.matrixWorldInvert);
        m.multiply(this.envMatrix);
        gl.uniform1f(this.level, 3);
        gl.uniform1i(this.diffuse, this.texture.count);
        gl.uniformMatrix4fv(this.MVPMatrix, false, m.elements);
        gl.drawElements(gl.TRIANGLES, this.IndexBufferLength, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
    createEnvironmentBuffer() {
        const latitudeBands = 10;
        const longitudeBands = 10;
        const radius = this._camera.modelSize * 10;
        const vertexPositionData = [];
        const normalData = [];
        const textureCoordData = [];
        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            const theta = latNumber * Math.PI / latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                const phi = longNumber * 2 * Math.PI / longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;
                const u = 1 - (longNumber / longitudeBands);
                const v = 1 - (latNumber / latitudeBands);
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
        const indexData = [];
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const first = (latNumber * (longitudeBands + 1)) + longNumber;
                const second = first + longitudeBands + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);
                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        }
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        }
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            this.IndexBufferLength = indexData.length;
        }
        gl.bindVertexArray(null);
        this.program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.VERTEX_SHADER, _shaders_env_glsl__WEBPACK_IMPORTED_MODULE_3___default.a, this.program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_env_frag_glsl__WEBPACK_IMPORTED_MODULE_4___default.a, this.program);
        gl.linkProgram(this.program);
        this.level = gl.getUniformLocation(this.program, 'level');
        this.diffuse = gl.getUniformLocation(this.program, 'diffuse');
        this.MVPMatrix = gl.getUniformLocation(this.program, 'MVPMatrix');
        return new Promise((resolve, reject) => {
            const index = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getTextureIndex"])();
            this.texture = {
                data: gl.createTexture(),
                count: index
            };
            const img = new Image;
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                gl.activeTexture(gl[`TEXTURE${this.texture.count}`]);
                gl.bindTexture(gl.TEXTURE_2D, this.texture.data);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                resolve();
            };
            img.onerror = err => {
                reject(err);
            };
            img.src = _images_env_jpg__WEBPACK_IMPORTED_MODULE_2___default.a;
        });
    }
}


/***/ }),

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/*! exports provided: Events */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Events", function() { return Events; });
class Events {
    constructor(redraw) {
        const canvas = document.querySelector('#canvas');
        this.redraw = redraw;
        this.zoomValue = 0;
        document.addEventListener('wheel', this);
        canvas.addEventListener('mousedown', this);
        canvas.addEventListener('mousemove', this);
        canvas.addEventListener('mouseup', this);
        document.addEventListener('keyup', this);
        document.addEventListener('keydown', this);
        addEventListener('resize', this);
    }
    handleEvent(e) {
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
                this.onEnd();
                break;
            case 'keyup':
                this.onKeyUp();
                break;
            case 'keydown':
                this.onKeyDown(e);
                break;
            case 'resize':
                this.onResize();
                break;
        }
    }
    onResize() {
        this.redraw('resize');
    }
    onKeyDown(e) {
        if (e.shiftKey || e.ctrlKey) {
            this.isPan = true;
        }
    }
    onKeyUp() {
        this.isPan = false;
    }
    onStart(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.isDrag = true;
    }
    onMove(e) {
        if (this.isDrag) {
            if (this.isPan) {
                this.redraw('pan', [this.x, this.y], [e.clientX, e.clientY]);
            }
            else {
                this.redraw('rotate', [this.x, this.y], [e.clientX, e.clientY]);
            }
            this.x = e.clientX;
            this.y = e.clientY;
        }
    }
    onEnd() {
        this.isDrag = false;
    }
    zoom(e) {
        this.zoomValue = Math.min(this.zoomValue + e.deltaY, 1250);
        this.redraw('zoom', Math.pow(1.001, this.zoomValue));
    }
}



/***/ }),

/***/ "./src/fps.ts":
/*!********************!*\
  !*** ./src/fps.ts ***!
  \********************/
/*! exports provided: FPS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FPS", function() { return FPS; });
class FPS {
    constructor() {
        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;
    }
    tick(time) {
        this.fps++;
        this.elapsedTime += (time - this.lastTime);
        this.lastTime = time;
        if (this.elapsedTime >= 1000) {
            this.counterEl.innerHTML = String(this.fps);
            this.fps = 0;
            this.elapsedTime -= 1000;
        }
    }
}


/***/ }),

/***/ "./src/images/env.jpg":
/*!****************************!*\
  !*** ./src/images/env.jpg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ "./src/matrix.ts":
/*!***********************!*\
  !*** ./src/matrix.ts ***!
  \***********************/
/*! exports provided: Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4, Frustum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix2", function() { return Matrix2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix3", function() { return Matrix3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix4", function() { return Matrix4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vector2", function() { return Vector2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vector3", function() { return Vector3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vector4", function() { return Vector4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Frustum", function() { return Frustum; });
/* eslint-disable */
/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */
class Matrix2 {
    constructor(opt_src) {
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
        }
        else {
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
    constructor(opt_src) {
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
        }
        else {
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
}
/**
 * Constructor of Matrix4
 * If opt_src is specified, new matrix is initialized by opt_src.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param opt_src source matrix(option)
 */
class Matrix4 {
    constructor(opt_src) {
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
        }
        else {
            this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
    }
    getScaleZ() {
        const te = this.elements;
        const x = te[8];
        const y = te[9];
        const z = te[10];
        return Math.sqrt(x * x + y * y + z * z);
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
        inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
            + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
        inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
            - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
        inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
            + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
        inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
            - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
        inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
            - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
        inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
            + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
        inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
            - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
        inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
            + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
        inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
            + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
        inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
            - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
        inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
            + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
        inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
            - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
        inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
            - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
        inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
            + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
        inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
            - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
        inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
            + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
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
    scale(vec3) {
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
    setTranslate(vec3) {
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
    makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        const te = this.elements;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
        const tx = t * x, ty = t * y;
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
/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
class Vector3 {
    constructor(opt_src) {
        const v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
            v[2] = opt_src[2];
        }
        this.elements = v;
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
        }
        else {
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
        }
        else {
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
    constructor(opt_src) {
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
        }
        else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this.elements[3] = (m32 - m23) / s;
            this.elements[0] = 0.25 * s;
            this.elements[1] = (m12 + m21) / s;
            this.elements[2] = (m13 + m31) / s;
        }
        else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this.elements[3] = (m13 - m31) / s;
            this.elements[0] = (m12 + m21) / s;
            this.elements[1] = 0.25 * s;
            this.elements[2] = (m23 + m32) / s;
        }
        else {
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
        const ax = a[0];
        const ay = a[1];
        const az = a[2];
        const aw = a[3];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        out[2] = az + t * (b[2] - az);
        out[3] = aw + t * (b[3] - aw);
        return this;
    }
}
class Vector2 {
    constructor(opt_src) {
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
    const planes = [new Vector4, new Vector4, new Vector4, new Vector4, new Vector4, new Vector4];
    const me = m.elements;
    let me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
    let me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
    let me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
    let me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];
    planes[0].set([me3 - me0, me7 - me4, me11 - me8, me15 - me12]).normalize();
    planes[1].set([me3 + me0, me7 + me4, me11 + me8, me15 + me12]).normalize();
    planes[2].set([me3 + me1, me7 + me5, me11 + me9, me15 + me13]).normalize();
    planes[3].set([me3 - me1, me7 - me5, me11 - me9, me15 - me13]).normalize();
    planes[4].set([me3 - me2, me7 - me6, me11 - me10, me15 - me14]).normalize();
    planes[5].set([me3 + me2, me7 + me6, me11 + me10, me15 + me14]).normalize();
    return planes;
}



/***/ }),

/***/ "./src/objects.ts":
/*!************************!*\
  !*** ./src/objects.ts ***!
  \************************/
/*! exports provided: Scene, Object3D, Mesh, SkinnedMesh, Bone, Camera, Light */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scene", function() { return Scene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Object3D", function() { return Object3D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mesh", function() { return Mesh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkinnedMesh", function() { return SkinnedMesh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bone", function() { return Bone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Camera", function() { return Camera; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Light", function() { return Light; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");

class Object3D {
    constructor(name, parent) {
        this.uuid = Math.floor(Date.now() * Math.random());
        this.name = name;
        this.children = [];
        this.matrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        this.matrixWorld = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        this.parent = parent;
    }
    setPosition(translation, rotation, scale) {
        if (rotation) {
            this.matrix.makeRotationFromQuaternion(rotation);
        }
        if (scale) {
            this.matrix.scale(new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"](scale));
        }
        if (translation) {
            this.matrix.setTranslate(new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"](translation));
        }
    }
    setMatrix(matrix) {
        this.matrix.set(matrix);
    }
    setMatrixWorld(matrix) {
        this.matrixWorld.set(matrix);
    }
    updateMatrix() {
        const m = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        m.multiply(this.parent.matrixWorld);
        m.multiply(this.matrix);
        this.setMatrixWorld(m.elements);
    }
}
class Mesh extends Object3D {
    constructor(name, parent) {
        super(name, parent);
        this.geometry = {
            boundingSphere: {
                center: new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"],
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
    draw(gl, { camera, light, preDepthTexture, fakeDepth, needUpdateView, needUpdateProjection }, isShadow, isLight) {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.geometry.VAO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.geometry.UBO);
        if (this.reflow) { // matrixWorld changed
            const normalMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"](this.matrixWorld);
            normalMatrix.invert().transpose();
            const matrices = new Float32Array(32);
            matrices.set(this.matrixWorld.elements);
            matrices.set(normalMatrix.elements, 16);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
        }
        if (needUpdateView) {
            gl.bufferSubData(gl.UNIFORM_BUFFER, 32 * Float32Array.BYTES_PER_ELEMENT, camera.matrixWorldInvert.elements);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 64 * Float32Array.BYTES_PER_ELEMENT, light.matrixWorldInvert.elements);
        }
        if (needUpdateProjection) {
            gl.bufferSubData(gl.UNIFORM_BUFFER, 48 * Float32Array.BYTES_PER_ELEMENT, camera.projection.elements);
        }
        gl.bufferSubData(gl.UNIFORM_BUFFER, 80 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([isLight ? 1 : 0]));
        if (this instanceof SkinnedMesh) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, this.geometry.SKIN);
            if (this.bones.some(bone => bone.reflow)) {
                const jointMatrix = this.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
            }
        }
        if (this.material.UBO) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.material.UBO);
            if (needUpdateView) {
                gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([light.matrixWorld.elements[12], light.matrixWorld.elements[13], light.matrixWorld.elements[14]]));
                gl.bufferSubData(gl.UNIFORM_BUFFER, 8 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([camera.matrixWorld.elements[12], camera.matrixWorld.elements[13], camera.matrixWorld.elements[14]]));
            }
        }
        gl.uniform1i(gl.getUniformLocation(this.program, 'depthTexture'), isShadow ? fakeDepth.index : preDepthTexture.index);
        if (this.material.pbrMetallicRoughness.baseColorTexture) {
            gl.uniform1i(this.material.uniforms.baseColorTexture, this.material.pbrMetallicRoughness.baseColorTexture.count);
        }
        if (this.material.pbrMetallicRoughness.metallicRoughnessTexture) {
            gl.uniform1i(this.material.uniforms.metallicRoughnessTexture, this.material.pbrMetallicRoughness.metallicRoughnessTexture.count);
        }
        if (this.material.normalTexture) {
            gl.uniform1i(this.material.uniforms.normalTexture, this.material.normalTexture.count);
        }
        if (this.material.occlusionTexture) {
            gl.uniform1i(this.material.uniforms.occlusionTexture, this.material.occlusionTexture.count);
        }
        if (this.material.emissiveTexture) {
            gl.uniform1i(this.material.uniforms.emissiveTexture, this.material.emissiveTexture.count);
        }
        if (this.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }
        if (this.geometry.indicesBuffer) {
            gl.drawElements(this.mode || gl.TRIANGLES, this.geometry.indicesBuffer.length, this.geometry.indicesBuffer.BYTES_PER_ELEMENT === 4 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
        }
        else {
            gl.drawArrays(this.mode || gl.TRIANGLES, 0, this.geometry.attributes.POSITION.length / 3);
        }
        if (this.material.doubleSided) {
            gl.enable(gl.CULL_FACE);
        }
    }
    calculateBounding() {
        const vertices = this.geometry.attributes.POSITION;
        let maxRadiusSq = 0;
        this.geometry.boundingSphere.center
            .add(this.geometry.boundingSphere.min)
            .add(this.geometry.boundingSphere.max)
            .scale(0.5);
        for (let i = 0; i < vertices.length; i = i + 3) {
            maxRadiusSq = Math.max(maxRadiusSq, this.geometry.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2]));
        }
        this.geometry.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    }
    setBoundingBox({ min, max }) {
        this.geometry.boundingSphere.min = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"](min);
        this.geometry.boundingSphere.max = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"](max);
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
        const c = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
        const r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
        let dist;
        let visible = true;
        for (const p of planes) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if (dist < -r) {
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
        return this;
    }
    getJointMatrix() {
        const m = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"](this.matrixWorld).invert();
        const resArray = [];
        for (let mi = 0; mi < this.boneInverses.length; mi++) {
            const res = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]()
                .multiply(m)
                .multiply(this.bones[mi].matrixWorld)
                .multiply(this.boneInverses[mi]);
            resArray.push(res);
        }
        return resArray;
    }
}
class Bone extends Object3D {
}
class Camera extends Object3D {
    constructor(name, parent) {
        super(name, parent);
        this.matrixWorldInvert = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        this.projection = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
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
        const m = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        m.multiply(this.projection);
        m.multiply(this.matrixWorldInvert);
        return m;
    }
}
class Scene {
    constructor() {
        this.opaqueChildren = [];
        this.transparentChildren = [];
        this.meshes = [];
        this.children = [];
        this.bin = [];
        this.matrixWorld = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
    }
}
class Light extends Object3D {
    constructor(name, parent) {
        super(name, parent);
        this.matrixWorldInvert = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
    }
    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    }
    setZ(z) {
        this.matrix.elements[14] = z;
        this.setMatrixWorld(this.matrix.elements);
    }
    update(v) {
        const camMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
        camMatrix.makeRotationAxis(new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([0, 1, 0]), v);
        camMatrix.multiply(this.matrix);
        this.setMatrixWorld(camMatrix.elements);
    }
}



/***/ }),

/***/ "./src/parse.ts":
/*!**********************!*\
  !*** ./src/parse.ts ***!
  \**********************/
/*! exports provided: Parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parse", function() { return Parse; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects */ "./src/objects.ts");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");
/* harmony import */ var _shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shaders/vertex.glsl */ "./src/shaders/vertex.glsl");
/* harmony import */ var _shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shaders/fragment.glsl */ "./src/shaders/fragment.glsl");
/* harmony import */ var _shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_4__);





let gl;
class Parse {
    constructor(url) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.tracks = [];
        this.skins = [];
        this.textures = null;
        this.samplers = null;
        this.arrayBuffer = null;
        this.cameras = [];
        this.programs = {};
    }
    setScene(scene) {
        this.scene = scene;
    }
    setGl(g) {
        gl = g;
    }
    setCamera(camera) {
        this._camera = camera;
    }
    setLight(light) {
        this.light = light;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    setResize(resize) {
        this.resize = resize;
    }
    setUpdateCamera(updateCamera) {
        this.updateCamera = updateCamera;
    }
    getBuffer() {
        return Promise.all(this.scene.bin.map(url => fetch(`${this.host}${url}`).then(res => res.arrayBuffer())))
            .then(buffers => {
            this.arrayBuffer = buffers;
        });
    }
    compileShader(vertexShader, fragmentShader) {
        const program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.VERTEX_SHADER, vertexShader, program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.FRAGMENT_SHADER, fragmentShader, program);
        gl.linkProgram(program);
        return program;
    }
    buildPrim(parent, name, skin, weights, p) {
        const indicesAccessor = this.json.accessors[p.indices];
        const vertexAccessor = new Map;
        for (const a in p.attributes) {
            vertexAccessor.set(a, this.json.accessors[p.attributes[a]]);
        }
        const targets = [];
        if (p.targets) {
            for (const target of p.targets) {
                const vertexAcc = {};
                for (const a in target) {
                    vertexAcc[a] = this.json.accessors[target[a]];
                    const accessor = vertexAcc[a];
                    const bufferView = this.json.bufferViews[accessor.bufferView];
                    vertexAcc[a] = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[bufferView.buffer], accessor.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(bufferView.byteOffset, accessor.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(accessor.type) * accessor.count);
                }
                targets.push(vertexAcc);
            }
        }
        const material = p.material !== undefined ? JSON.parse(JSON.stringify(this.json.materials[p.material])) : { pbrMetallicRoughness: { baseColorFactor: [0.8, 0.8, 0.8, 1.0] } };
        const defines = [];
        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            material.pbrMetallicRoughness.metallicRoughnessTexture = Object.assign({}, this.textures[material.pbrMetallicRoughness.metallicRoughnessTexture.index]);
            defines.push({ name: 'USE_PBR' });
            defines.push({ name: 'METALROUGHNESSMAP' });
        }
        if (material.normalTexture) {
            material.normalTexture = Object.assign({}, this.textures[material.normalTexture.index]);
            defines.push({ name: 'NORMALMAP' });
        }
        if (material.occlusionTexture) {
            material.occlusionTexture = Object.assign({}, this.textures[material.occlusionTexture.index]);
            defines.push({ name: 'OCCLUSIONMAP' });
        }
        if (material.pbrMetallicRoughness.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture = Object.assign({}, this.textures[material.pbrMetallicRoughness.baseColorTexture.index]);
            defines.push({ name: 'BASECOLORTEXTURE' });
        }
        if (material.emissiveTexture) {
            material.emissiveTexture = Object.assign({}, this.textures[material.emissiveTexture.index]);
            defines.push({ name: 'EMISSIVEMAP' });
        }
        if (skin !== undefined) {
            defines.push({ name: 'JOINTNUMBER', value: this.skins[skin].jointNames.length });
        }
        if (p.attributes.TANGENT || material.normalTexture) {
            defines.push({ name: 'TANGENT' });
        }
        let program;
        if (this.programs[defines.map(define => define.name).join('')]) {
            program = this.programs[defines.map(define => define.name).join('')];
        }
        else {
            const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
            program = this.compileShader(_shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_3___default.a.replace(/\n/, `\n${defineStr}`), _shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_4___default.a.replace(/\n/, `\n${defineStr}`));
            this.programs[defines.map(define => define.name).join('')] = program;
        }
        let indicesBuffer;
        if (indicesAccessor) {
            const bufferView = this.json.bufferViews[indicesAccessor.bufferView];
            indicesBuffer = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[bufferView.buffer], indicesAccessor.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(bufferView.byteOffset, indicesAccessor.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(indicesAccessor.type) * indicesAccessor.count);
        }
        const boundingBox = {
            min: vertexAccessor.get('POSITION').min,
            max: vertexAccessor.get('POSITION').max
        };
        const vertexBuffers = {};
        for (const k of vertexAccessor.keys()) {
            const accessor = vertexAccessor.get(k);
            const bufferView = this.json.bufferViews[accessor.bufferView];
            vertexBuffers[k] = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[bufferView.buffer], accessor.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(bufferView.byteOffset, accessor.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(accessor.type) * accessor.count, bufferView.byteStride, accessor.count);
            if (p.targets && k in p.targets[0]) {
                let offset = 0;
                const geometry = vertexBuffers[k];
                vertexBuffers[k] = new Float32Array(geometry.length);
                for (let i = 0; i < vertexBuffers[k].length; i++) {
                    if (k === 'TANGENT' && (i + 1) % 4 === 0) {
                        offset++;
                        continue;
                    }
                    vertexBuffers[k][i] = geometry[i] + weights[0] * targets[0][k][i - offset] + weights[1] * targets[1][k][i - offset];
                }
            }
        }
        if (material.normalTexture && p.attributes.TANGENT === undefined) {
            vertexBuffers.TANGENT = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateBinormals"])(indicesBuffer, vertexBuffers.POSITION, vertexBuffers.NORMAL, vertexBuffers.TEXCOORD_0);
        }
        const mesh = skin !== undefined ? new _objects__WEBPACK_IMPORTED_MODULE_1__["SkinnedMesh"](name, parent).setSkin(skin) : new _objects__WEBPACK_IMPORTED_MODULE_1__["Mesh"](name, parent);
        mesh.setProgram(program);
        mesh.setMode(p.mode);
        mesh.setMaterial(material);
        mesh.setAttributes(vertexBuffers);
        mesh.setIndicesBuffer(indicesBuffer);
        mesh.setBoundingBox(boundingBox);
        mesh.setTargets(targets);
        mesh.updateMatrix();
        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);
        for (const k in vertexBuffers) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, vertexBuffers[k], gl.STATIC_DRAW);
            const index = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getAttributeIndex"])(k);
            gl.enableVertexAttribArray(index[0]);
            gl.vertexAttribPointer(index[0], index[1], index[2], false, 0, 0);
        }
        if (indicesBuffer) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer, gl.STATIC_DRAW);
        }
        mesh.geometry.VAO = VAO;
        gl.bindVertexArray(null);
        if (material.pbrMetallicRoughness.baseColorTexture) {
            mesh.material.uniforms.baseColorTexture = gl.getUniformLocation(mesh.program, 'baseColorTexture');
        }
        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            mesh.material.uniforms.metallicRoughnessTexture = gl.getUniformLocation(mesh.program, 'metallicRoughnessTexture');
        }
        if (material.normalTexture) {
            mesh.material.uniforms.normalTexture = gl.getUniformLocation(mesh.program, 'normalTexture');
        }
        if (material.occlusionTexture) {
            mesh.material.uniforms.occlusionTexture = gl.getUniformLocation(mesh.program, 'occlusionTexture');
        }
        if (material.emissiveTexture) {
            mesh.material.uniforms.emissiveTexture = gl.getUniformLocation(mesh.program, 'emissiveTexture');
        }
        return mesh;
    }
    walkByMesh(parent, name) {
        const el = this.json.nodes[name];
        let child;
        if (el.camera !== undefined) {
            child = new _objects__WEBPACK_IMPORTED_MODULE_1__["Camera"](name, parent);
            child.setProps(Object.assign({
                zoom: 1,
                aspect: this.canvas.offsetWidth / this.canvas.offsetHeight
            }, this.json.cameras[el.camera]));
            const proj = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateProjection"])(child.props);
            child.setProjection(proj);
            this._camera = child;
            this.updateCamera(this._camera);
            this.cameras.push(child);
        }
        else {
            if (el.isBone !== undefined) {
                child = new _objects__WEBPACK_IMPORTED_MODULE_1__["Bone"](name, parent);
            }
            else {
                child = new _objects__WEBPACK_IMPORTED_MODULE_1__["Object3D"](name, parent);
            }
        }
        if (el.translation || el.rotation || el.scale) {
            child.setPosition(el.translation, el.rotation, el.scale);
        }
        else if (el.matrix) {
            child.setMatrix(el.matrix);
        }
        child.updateMatrix();
        parent.children.push(child);
        parent = child;
        if (el.mesh !== undefined) {
            if (el.skin !== undefined) {
                for (const join of this.skins[el.skin].jointNames) {
                    Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.scene, this.buildBones.bind(this, join, this.skins[el.skin]));
                }
            }
            parent.children.push(...this.json.meshes[el.mesh].primitives.map(this.buildPrim.bind(this, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights)));
        }
        if (el.children && el.children.length) {
            el.children.forEach(this.walkByMesh.bind(this, parent));
        }
    }
    calculateFov() {
        let biggestMesh;
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.scene, node => {
            if (node instanceof _objects__WEBPACK_IMPORTED_MODULE_1__["Mesh"]) {
                if (!biggestMesh) {
                    biggestMesh = node;
                }
                if (node.geometry.boundingSphere.radius > biggestMesh.geometry.boundingSphere.radius) {
                    biggestMesh = node;
                }
            }
        });
        const z = Math.max(biggestMesh.matrixWorld.getScaleZ(), 1);
        const pos = Math.hypot(biggestMesh.matrixWorld.elements[12], biggestMesh.matrixWorld.elements[13], biggestMesh.matrixWorld.elements[14]);
        this._camera.modelSize = biggestMesh.geometry.boundingSphere.radius * z + pos + Math.hypot(...biggestMesh.geometry.boundingSphere.center.elements);
        this.resize();
    }
    buildMesh() {
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].children && this.json.nodes[n].children.length) {
                this.walkByMesh(this.scene, n);
            }
            if (this.json.nodes[n].mesh !== undefined) {
                this.walkByMesh(this.scene, n);
            }
            if (this.json.nodes[n].camera !== undefined) {
                this.walkByMesh(this.scene, n);
            }
        });
        this.calculateFov();
        const planes = Object(_matrix__WEBPACK_IMPORTED_MODULE_2__["Frustum"])(this._camera.getViewProjMatrix());
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.scene, mesh => {
            if (mesh instanceof _objects__WEBPACK_IMPORTED_MODULE_1__["SkinnedMesh"]) {
                mesh.bones = this.skins[mesh.skin].bones;
                mesh.boneInverses = this.skins[mesh.skin].boneInverses;
                const jointMatrix = mesh.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                const uIndex = gl.getUniformBlockIndex(mesh.program, 'Skin');
                gl.uniformBlockBinding(mesh.program, uIndex, 2);
                const UBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
                gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
                mesh.geometry.SKIN = UBO;
                gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            }
            if (mesh instanceof _objects__WEBPACK_IMPORTED_MODULE_1__["Mesh"]) {
                const materials = new Float32Array(12);
                materials.set(mesh.material.pbrMetallicRoughness.baseColorFactor || [0.8, 0.8, 0.8, 1.0]);
                materials.set([this.light.matrixWorld.elements[12], this.light.matrixWorld.elements[13], this.light.matrixWorld.elements[14]], 4);
                materials.set([this._camera.matrixWorld.elements[12], this._camera.matrixWorld.elements[13], this._camera.matrixWorld.elements[14]], 8);
                const mIndex = gl.getUniformBlockIndex(mesh.program, 'Material');
                gl.uniformBlockBinding(mesh.program, mIndex, 1);
                const mUBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
                gl.bufferData(gl.UNIFORM_BUFFER, materials, gl.STATIC_DRAW);
                mesh.material.UBO = mUBO;
                const normalMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_2__["Matrix4"](mesh.matrixWorld);
                normalMatrix.invert().transpose();
                const matrices = new Float32Array(81);
                matrices.set(mesh.matrixWorld.elements, 0);
                matrices.set(normalMatrix.elements, 16);
                matrices.set(this._camera.matrixWorldInvert.elements, 32);
                matrices.set(this._camera.projection.elements, 48);
                matrices.set(this.light.matrixWorldInvert.elements, 64);
                matrices.set(new Float32Array([0]), 80);
                const uIndex = gl.getUniformBlockIndex(mesh.program, 'Matrices');
                gl.uniformBlockBinding(mesh.program, uIndex, 0);
                const UBO = gl.createBuffer();
                gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
                gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
                mesh.geometry.UBO = UBO;
                gl.bindBuffer(gl.UNIFORM_BUFFER, null);
                if (mesh.material.alphaMode) {
                    this.scene.transparentChildren.push(mesh);
                }
                else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
                mesh.visible = mesh.isVisible(planes);
            }
        });
        this.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
        this.scene.transparentChildren.sort((a, b) => b.distance - a.distance);
        return true;
    }
    buildAnimation() {
        if (!this.json.animations) {
            return true;
        }
        for (const animation of this.json.animations) {
            for (const channel of animation.channels) {
                const sampler = animation.samplers[channel.sampler];
                if (sampler) {
                    const { target } = channel;
                    const name = target.node;
                    const input = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
                    const output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;
                    const inputAccessor = this.json.accessors[input];
                    const outputAccessor = this.json.accessors[output];
                    const inputBuffer = this.json.bufferViews[inputAccessor.bufferView];
                    const outputBuffer = this.json.bufferViews[outputAccessor.bufferView];
                    const inputArray = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[inputBuffer.buffer], inputAccessor.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(inputBuffer.byteOffset, inputAccessor.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(inputAccessor.type) * inputAccessor.count);
                    const outputArray = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[outputBuffer.buffer], outputAccessor.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(outputBuffer.byteOffset, outputAccessor.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(outputAccessor.type) * outputAccessor.count);
                    const component = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getAnimationComponent"])(target.path);
                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);
                        keys.push({
                            time: firstT,
                            value: firstV
                        });
                    }
                    const meshes = [];
                    Object(_utils__WEBPACK_IMPORTED_MODULE_0__["walk"])(this.scene, node => {
                        if (node.name === name) {
                            if (target.path === 'weights' && node instanceof _objects__WEBPACK_IMPORTED_MODULE_1__["Object3D"]) {
                                // eslint-disable-next-line
                                node = node.children[0];
                            }
                            meshes.push(node);
                        }
                    });
                    if (meshes.length) {
                        this.tracks.push({
                            stoped: false,
                            meshes: meshes,
                            type: target.path,
                            name: `${meshes[0].name}.${target.path}`,
                            keys: keys,
                            interpolation: sampler.interpolation
                        });
                    }
                }
            }
        }
        return true;
    }
    buildSkin() {
        if (!this.json.skins) {
            return true;
        }
        for (const skin of this.json.skins) {
            const acc = this.json.accessors[skin.inverseBindMatrices];
            const buffer = this.json.bufferViews[acc.bufferView];
            const array = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["buildArray"])(this.arrayBuffer[buffer.buffer], acc.componentType, Object(_utils__WEBPACK_IMPORTED_MODULE_0__["calculateOffset"])(buffer.byteOffset, acc.byteOffset), Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getDataType"])(acc.type) * acc.count);
            const v = {
                jointNames: skin.joints,
                inverseBindMatrices: array,
                bones: [],
                boneInverses: []
            };
            let i = 0;
            for (const join of v.jointNames) {
                //walk(this.scene, this.buildBones.bind(this, join, v));
                this.json.nodes[join].isBone = true;
                const m = v.inverseBindMatrices;
                const mat = new _matrix__WEBPACK_IMPORTED_MODULE_2__["Matrix4"]().set(m.slice(i * 16, (i + 1) * 16));
                v.boneInverses.push(mat);
                i++;
            }
            this.skins.push(v);
        }
        return true;
    }
    buildBones(join, v, node) {
        if (node.name === join) {
            v.bones.push(node);
        }
    }
    getJson() {
        return fetch(this.url)
            .then(res => res.json())
            .then(j => {
            for (const key in j.buffers) {
                this.scene.bin.push(j.buffers[key].uri);
            }
            this.json = j;
            return true;
        });
    }
    initTextures() {
        if (!this.json.textures) {
            return true;
        }
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map(s => {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, s.minFilter || 9986);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, s.magFilter || 9729);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, s.wrapS || 10497);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, s.wrapT || 10497);
            return sampler;
        });
        const texturesMap = {};
        this.json.textures.forEach(t => {
            const name = String(t.sampler) + String(t.source);
            texturesMap[name] = t;
            texturesMap[name].name = name;
            t.name = name;
        });
        const promiseArr = Object.values(texturesMap).map(t => {
            return new Promise((resolve, reject) => {
                const sampler = this.samplers[t.sampler !== undefined ? t.sampler : 0];
                const source = this.json.images[t.source];
                const image = new Image();
                image.onload = () => {
                    resolve(this.handleTextureLoaded(sampler, image, t.name));
                };
                image.onerror = err => {
                    reject(err);
                };
                image.crossOrigin = 'anonymous';
                image.src = `${this.host}${source.uri}`;
            });
        });
        return Promise.all(promiseArr)
            .then((textures) => {
            this.textures = this.json.textures.map(t => {
                return textures.find(j => j.name === t.name);
            });
            return true;
        });
    }
    handleTextureLoaded(sampler, image, name) {
        const index = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getTextureIndex"])();
        const t = {
            image: image.src.substr(image.src.lastIndexOf('/')),
            data: gl.createTexture(),
            count: index,
            name
        };
        gl.activeTexture(gl[`TEXTURE${index}`]);
        gl.bindTexture(gl.TEXTURE_2D, t.data);
        gl.bindSampler(index, sampler);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        return t;
    }
}


/***/ }),

/***/ "./src/postprocessing.ts":
/*!*******************************!*\
  !*** ./src/postprocessing.ts ***!
  \*******************************/
/*! exports provided: PostProcessing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostProcessing", function() { return PostProcessing; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _postprocessors_ssao__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./postprocessors/ssao */ "./src/postprocessors/ssao.ts");
/* harmony import */ var _postprocessors_bloom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./postprocessors/bloom */ "./src/postprocessors/bloom.ts");
/* harmony import */ var _postprocessors_shadow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./postprocessors/shadow */ "./src/postprocessors/shadow.ts");
/* harmony import */ var _postprocessors_light__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./postprocessors/light */ "./src/postprocessors/light.ts");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shaders/quad.glsl */ "./src/shaders/quad.glsl");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _shaders_composer_glsl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shaders/composer.glsl */ "./src/shaders/composer.glsl");
/* harmony import */ var _shaders_composer_glsl__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_shaders_composer_glsl__WEBPACK_IMPORTED_MODULE_6__);







let gl;
const processorsMap = {
    bloom: _postprocessors_bloom__WEBPACK_IMPORTED_MODULE_2__["Bloom"],
    ssao: _postprocessors_ssao__WEBPACK_IMPORTED_MODULE_1__["SSAO"],
    shadow: _postprocessors_shadow__WEBPACK_IMPORTED_MODULE_3__["Shadow"],
    light: _postprocessors_light__WEBPACK_IMPORTED_MODULE_4__["Light"]
};
class PostProcessing {
    constructor(processors) {
        this.postprocessors = processors.map(name => new processorsMap[name]);
        this.MSAA = 4;
    }
    setRender(renderScene) {
        this.renderScene = renderScene;
    }
    setCamera(camera) {
        this.camera = camera;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCamera(camera);
            postProcessor.light = this.light;
        });
    }
    setGl(g) {
        gl = g;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setGL(gl);
        });
        this.fakeDepth = this.createNoiceTexture(1, new Float32Array([1, 1, 0]));
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCanvas(canvas);
        });
    }
    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }
    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }
    bindPrePass() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.preframebuffer);
    }
    bindPostPass() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderframebuffer);
    }
    preProcessing() {
        this.postprocessors.forEach(postProcessor => postProcessor.preProcessing(this));
    }
    postProcessing() {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.renderframebuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer);
        gl.readBuffer(gl.COLOR_ATTACHMENT0);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.readBuffer(gl.COLOR_ATTACHMENT1);
        gl.drawBuffers([gl.NONE, gl.COLOR_ATTACHMENT1]);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.DEPTH_BUFFER_BIT, gl.NEAREST);
        gl.bindVertexArray(this.VAO);
        this.postprocessors.forEach(postProcessor => postProcessor.postProcessing(this));
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(this.program);
        this.postprocessors.forEach(postProcessor => {
            postProcessor.attachUniform(this.program);
        });
        gl.uniform1i(gl.getUniformLocation(this.program, 'original'), this.screenTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'normal'), this.normalTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'depth'), this.depthTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'preDepth'), this.preDepthTexture.index);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    createTexture() {
        const index = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getTextureIndex"])();
        const texture = gl.createTexture();
        gl.activeTexture(gl[`TEXTURE${index}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        texture.index = index;
        return texture;
    }
    createByteTexture() {
        const texture = this.createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        return texture;
    }
    createDefaultTexture(scale = 1) {
        const texture = this.createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width / scale, this.height / scale, 0, gl.RGBA, gl.FLOAT, null);
        return texture;
    }
    createOneChannelTexture(scale = 1) {
        const texture = this.createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.width / scale, this.height / scale, 0, gl.RED, gl.UNSIGNED_BYTE, null);
        return texture;
    }
    createDepthTexture() {
        const texture = this.createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        return texture;
    }
    createNoiceTexture(size, data) {
        const texture = this.createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, size, size, 0, gl.RGB, gl.FLOAT, data);
        return texture;
    }
    buildScreenBuffer() {
        gl.getExtension('EXT_color_buffer_float');
        gl.getExtension('OES_texture_float_linear');
        const defines = this.postprocessors.map(postProcessor => postProcessor.buildScreenBuffer(this));
        const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
        const verts = [
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ];
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        const VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        const colorRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, colorRB);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.MSAA, gl.RGBA8, this.width, this.height);
        const normalRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, normalRB);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.MSAA, gl.RGBA16F, this.width, this.height);
        const depthRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRB);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.MSAA, gl.DEPTH_COMPONENT24, this.width, this.height);
        this.renderframebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderframebuffer);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRB);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.RENDERBUFFER, normalRB);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRB);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.screenTexture = this.createByteTexture();
        this.normalTexture = this.createDefaultTexture();
        this.depthTexture = this.createDepthTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.preframebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.preframebuffer);
        this.preDepthTexture = this.createDepthTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.preDepthTexture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.VERTEX_SHADER, _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_5___default.a.replace(/\n/, `\n${defineStr}`), this.program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_composer_glsl__WEBPACK_IMPORTED_MODULE_6___default.a.replace(/\n/, `\n${defineStr}`), this.program);
        gl.linkProgram(this.program);
        return true;
    }
    clear() {
        console.error('implement');
    }
}


/***/ }),

/***/ "./src/postprocessors/base.ts":
/*!************************************!*\
  !*** ./src/postprocessors/base.ts ***!
  \************************************/
/*! exports provided: PostProcessor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostProcessor", function() { return PostProcessor; });
class PostProcessor {
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }
    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }
}


/***/ }),

/***/ "./src/postprocessors/bloom.ts":
/*!*************************************!*\
  !*** ./src/postprocessors/bloom.ts ***!
  \*************************************/
/*! exports provided: Bloom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bloom", function() { return Bloom; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/postprocessors/base.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/quad.glsl */ "./src/shaders/quad.glsl");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/blur.glsl */ "./src/shaders/blur.glsl");
/* harmony import */ var _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shaders_bloom_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shaders/bloom.glsl */ "./src/shaders/bloom.glsl");
/* harmony import */ var _shaders_bloom_glsl__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_shaders_bloom_glsl__WEBPACK_IMPORTED_MODULE_4__);





let gl;
class Bloom extends _base__WEBPACK_IMPORTED_MODULE_0__["PostProcessor"] {
    setGL(g) {
        gl = g;
    }
    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'bloom'), this.blurTexture.index);
    }
    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.useProgram(this.bloorProgram);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.hdrTexture, 0);
        gl.uniform1i(gl.getUniformLocation(this.bloorProgram, 'diff'), PP.screenTexture.index);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.useProgram(this.program);
        gl.viewport(0, 0, this.width / 2, this.height / 2);
        this.renderBlur(this.hdrTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        this.renderBlur(this.blurTexture, this.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
    }
    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.tempBlurTexture = pp.createDefaultTexture(2);
        this.blurTexture = pp.createDefaultTexture(2);
        this.hdrTexture = pp.createByteTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.VERTEX_SHADER, _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_2___default.a, this.program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_3___default.a, this.program);
        gl.linkProgram(this.program);
        this.bloorProgram = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.VERTEX_SHADER, _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_2___default.a, this.bloorProgram);
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_bloom_glsl__WEBPACK_IMPORTED_MODULE_4___default.a, this.bloorProgram);
        gl.linkProgram(this.bloorProgram);
        return { name: 'BLOOM' };
    }
    renderBlur(inTexture, program) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempBlurTexture, 0);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), inTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 1, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.blurTexture, 0);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), this.tempBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(program, 'denom'), 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    preProcessing() { }
}


/***/ }),

/***/ "./src/postprocessors/light.ts":
/*!*************************************!*\
  !*** ./src/postprocessors/light.ts ***!
  \*************************************/
/*! exports provided: Light */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Light", function() { return Light; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/postprocessors/base.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var _shaders_light_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/light.glsl */ "./src/shaders/light.glsl");
/* harmony import */ var _shaders_light_glsl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shaders_light_glsl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shaders_light_vert_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/light-vert.glsl */ "./src/shaders/light-vert.glsl");
/* harmony import */ var _shaders_light_vert_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_light_vert_glsl__WEBPACK_IMPORTED_MODULE_3__);




let gl;
class Light extends _base__WEBPACK_IMPORTED_MODULE_0__["PostProcessor"] {
    constructor() {
        super();
        this.scale = 1;
    }
    setGL(g) {
        gl = g;
    }
    preProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        // gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // PP.renderScene(false, false);
        gl.useProgram(this.program);
        //gl.viewport( 0, 0, this.width / 2, this.height / 2);
        gl.bindVertexArray(this.quadVAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'proj'), false, this.camera.projection.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'light'), false, this.light.matrixWorldInvert.elements);
        gl.uniform1i(gl.getUniformLocation(this.program, 'lightTexture'), PP.preDepthTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.program, 'cameraTexture'), PP.preDepthTexture.index);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        //gl.viewport( 0, 0, this.width, this.height);
    }
    buildScreenBuffer(PP) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.texture = PP.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        this.program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.VERTEX_SHADER, _shaders_light_vert_glsl__WEBPACK_IMPORTED_MODULE_3___default.a, this.program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_1__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_light_glsl__WEBPACK_IMPORTED_MODULE_2___default.a, this.program);
        gl.linkProgram(this.program);
        const verts = [
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ];
        this.quadVAO = gl.createVertexArray();
        gl.bindVertexArray(this.quadVAO);
        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'LIGHT' };
    }
    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'light'), this.texture.index);
    }
    postProcessing() { }
}


/***/ }),

/***/ "./src/postprocessors/shadow.ts":
/*!**************************************!*\
  !*** ./src/postprocessors/shadow.ts ***!
  \**************************************/
/*! exports provided: Shadow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shadow", function() { return Shadow; });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/postprocessors/base.ts");

let gl;
class Shadow extends _base__WEBPACK_IMPORTED_MODULE_0__["PostProcessor"] {
    setGL(g) {
        gl = g;
    }
    preProcessing(PP) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.enable(gl.RASTERIZER_DISCARD);
        PP.renderScene(true, true);
        //gl.disable(gl.RASTERIZER_DISCARD);
    }
    buildScreenBuffer() {
        return { name: 'SHADOW' };
    }
    attachUniform() { }
    postProcessing() { }
}


/***/ }),

/***/ "./src/postprocessors/ssao.ts":
/*!************************************!*\
  !*** ./src/postprocessors/ssao.ts ***!
  \************************************/
/*! exports provided: SSAO */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SSAO", function() { return SSAO; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/postprocessors/base.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/quad.glsl */ "./src/shaders/quad.glsl");
/* harmony import */ var _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shaders_ssao_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shaders/ssao.glsl */ "./src/shaders/ssao.glsl");
/* harmony import */ var _shaders_ssao_glsl__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_shaders_ssao_glsl__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shaders/blur.glsl */ "./src/shaders/blur.glsl");
/* harmony import */ var _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_5__);






let gl;
const noiceSize = 4;
const kernelSize = 32;
class SSAO extends _base__WEBPACK_IMPORTED_MODULE_1__["PostProcessor"] {
    constructor() {
        super();
        this.scale = 2;
    }
    setGL(g) {
        gl = g;
    }
    attachUniform(program) {
        gl.uniform1i(gl.getUniformLocation(program, 'ssao'), this.ssaoTexture.index);
    }
    postProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.ssaoProgram);
        const cameraProps = this.camera.props.perspective || this.camera.props.orthographic;
        gl.uniform1i(gl.getUniformLocation(this.ssaoProgram, 'normBuff'), PP.normalTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.ssaoProgram, 'depthBuff'), PP.depthTexture.index);
        gl.uniform1i(gl.getUniformLocation(this.ssaoProgram, 'noice'), this.noice.index);
        gl.uniform2f(gl.getUniformLocation(this.ssaoProgram, 'noiseScale'), this.width / noiceSize, this.height / noiceSize);
        gl.uniform1f(gl.getUniformLocation(this.ssaoProgram, 'zFar'), cameraProps.zfar);
        gl.uniform1f(gl.getUniformLocation(this.ssaoProgram, 'zNear'), cameraProps.znear);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'proj'), false, this.camera.projection.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.ssaoProgram, 'projI'), false, new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().setInverseOf(this.camera.projection).elements);
        gl.uniform3fv(gl.getUniformLocation(this.ssaoProgram, 'kernels'), this.kernels);
        gl.viewport(0, 0, this.width / this.scale, this.height / this.scale);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoBlurTexture, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.ssaoBlurProgram);
        gl.uniform1i(gl.getUniformLocation(this.ssaoBlurProgram, 'uTexture'), this.ssaoTexture.index);
        gl.uniform2f(gl.getUniformLocation(this.ssaoBlurProgram, 'denom'), 1, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);
        gl.uniform1i(gl.getUniformLocation(this.ssaoBlurProgram, 'uTexture'), this.ssaoBlurTexture.index);
        gl.uniform2f(gl.getUniformLocation(this.ssaoBlurProgram, 'denom'), 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
    }
    buildScreenBuffer(pp) {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.ssaoTexture = pp.createOneChannelTexture(this.scale);
        this.ssaoBlurTexture = pp.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTexture, 0);
        this.ssaoProgram = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_2__["compileShader"])(gl.VERTEX_SHADER, _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_3___default.a, this.ssaoProgram);
        Object(_utils__WEBPACK_IMPORTED_MODULE_2__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_ssao_glsl__WEBPACK_IMPORTED_MODULE_4___default.a, this.ssaoProgram);
        gl.linkProgram(this.ssaoProgram);
        this.ssaoBlurProgram = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_2__["compileShader"])(gl.VERTEX_SHADER, _shaders_quad_glsl__WEBPACK_IMPORTED_MODULE_3___default.a, this.ssaoBlurProgram);
        Object(_utils__WEBPACK_IMPORTED_MODULE_2__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_blur_glsl__WEBPACK_IMPORTED_MODULE_5___default.a, this.ssaoBlurProgram);
        gl.linkProgram(this.ssaoBlurProgram);
        this.buildNoice(pp);
        this.buildKernels();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { name: 'SSAO' };
    }
    buildNoice(pp) {
        const noice = new Float32Array(noiceSize * noiceSize * 3);
        for (let i = 0; i < noiceSize * noiceSize; i++) {
            const v = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1) * 2.0 - 1.0, Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1) * 2.0 - 1.0, 0.1]); // Z is 0.1 because surface is not flat
            /* eslint-disable */
            noice[i * 3] = v.elements[0];
            noice[i * 3 + 1] = v.elements[1];
            noice[i * 3 + 2] = v.elements[2];
            /* eslint-enable */
        }
        this.noice = pp.createNoiceTexture(noiceSize, noice);
    }
    buildKernels() {
        const kernels = new Array(kernelSize);
        for (let i = 0; i < kernels.length; i++) {
            kernels[i] = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1) * 2 - 1, Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1) * 2 - 1, Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1)]);
            kernels[i].normalize();
            kernels[i].scale(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["random"])(0, 1));
            let scale = i / kernels.length;
            scale = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["lerp"])(0.1, 1.0, scale * scale);
            kernels[i].scale(scale);
        }
        this.kernels = new Float32Array(kernels.length * 3);
        let j = 0;
        for (const m of kernels) {
            this.kernels.set(m.elements, j * 3);
            j++;
        }
    }
    preProcessing() { }
}


/***/ }),

/***/ "./src/redcube.ts":
/*!************************!*\
  !*** ./src/redcube.ts ***!
  \************************/
/*! exports provided: RedCube */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedCube", function() { return RedCube; });
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects */ "./src/objects.ts");
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./events */ "./src/events.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./env */ "./src/env.ts");
/* harmony import */ var _fps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fps */ "./src/fps.ts");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parse */ "./src/parse.ts");
/* harmony import */ var _postprocessing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./postprocessing */ "./src/postprocessing.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _shaders_instance_glsl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shaders/instance.glsl */ "./src/shaders/instance.glsl");
/* harmony import */ var _shaders_instance_glsl__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_shaders_instance_glsl__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _shaders_instance_frag_glsl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shaders/instance-frag.glsl */ "./src/shaders/instance-frag.glsl");
/* harmony import */ var _shaders_instance_frag_glsl__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_shaders_instance_frag_glsl__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _shaders_xxx_glsl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shaders/xxx.glsl */ "./src/shaders/xxx.glsl");
/* harmony import */ var _shaders_xxx_glsl__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_shaders_xxx_glsl__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _shaders_instance_trans_glsl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shaders/instance-trans.glsl */ "./src/shaders/instance-trans.glsl");
/* harmony import */ var _shaders_instance_trans_glsl__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_shaders_instance_trans_glsl__WEBPACK_IMPORTED_MODULE_11__);
/// <reference path='../index.d.ts'/>












let gl;
const amount = 1000;
class RedCube {
    constructor(url, canvas, processors) {
        this.reflow = true;
        this.scene = new _objects__WEBPACK_IMPORTED_MODULE_0__["Scene"];
        this.canvas = canvas;
        this.processors = processors;
        this.camera = new _objects__WEBPACK_IMPORTED_MODULE_0__["Camera"];
        this.camera.setProps({
            type: 'perspective',
            isInitial: true,
            zoom: 1,
            aspect: this.canvas.offsetWidth / this.canvas.offsetHeight,
            perspective: {
                yfov: 0.6
            }
        });
        this.light = new _objects__WEBPACK_IMPORTED_MODULE_0__["Light"];
        window.xxx = this.light;
        this.events = new _events__WEBPACK_IMPORTED_MODULE_2__["Events"](this.redraw.bind(this));
        this.fps = new _fps__WEBPACK_IMPORTED_MODULE_4__["FPS"];
        this.env = new _env__WEBPACK_IMPORTED_MODULE_3__["Env"];
        this.env.setCamera(this.camera);
        this.PP = new _postprocessing__WEBPACK_IMPORTED_MODULE_6__["PostProcessing"](processors);
        this.PP.light = this.light;
        this.PP.setCanvas(this.canvas);
        this.PP.setCamera(this.camera);
        this.PP.setRender(this.renderScene.bind(this));
        this.parse = new _parse__WEBPACK_IMPORTED_MODULE_5__["Parse"](url);
        this.parse.setScene(this.scene);
        this.parse.setCamera(this.camera);
        this.parse.setLight(this.light);
        this.parse.setUpdateCamera(this.updateCamera.bind(this));
        this.parse.setCanvas(this.canvas);
        this.parse.setResize(this.resize.bind(this));
    }
    init() {
        return this.parse.getJson()
            .then(this.glInit.bind(this))
            .then(this.buildInstancing.bind(this))
            .then(this.parse.initTextures.bind(this.parse))
            .then(this.PP.buildScreenBuffer.bind(this.PP))
            .then(this.parse.getBuffer.bind(this.parse))
            .then(this.parse.buildSkin.bind(this.parse))
            .then(this.parse.buildMesh.bind(this.parse))
            .then(this.parse.buildAnimation.bind(this.parse))
            .then(this.env.createEnvironmentBuffer.bind(this.env))
            .then(this.draw.bind(this))
            .catch(console.error);
    }
    updateCamera(camera) {
        this.camera = camera;
        this.env.setCamera(camera);
        this.PP.setCamera(camera);
    }
    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.camera.props.zoom = coordsStart;
            this.camera.setProjection(Object(_utils__WEBPACK_IMPORTED_MODULE_7__["calculateProjection"])(this.camera.props));
            this.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            const coordsStartWorld = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["canvasToWorld"])(coordsStart, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const coordsMoveWorld = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["canvasToWorld"])(coordsMove, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const p0 = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"](Object(_utils__WEBPACK_IMPORTED_MODULE_7__["sceneToArcBall"])(coordsStartWorld));
            const p1 = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"](Object(_utils__WEBPACK_IMPORTED_MODULE_7__["sceneToArcBall"])(coordsMoveWorld));
            const angle = _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"].angle(p1, p0) * 5;
            if (angle < 1e-6 || isNaN(angle)) {
                return;
            }
            const camStart = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"](p0.elements).applyMatrix4(this.camera.matrixWorld);
            const camEnd = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"](p1.elements).applyMatrix4(this.camera.matrixWorld);
            const camVector = _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"].cross(camEnd, camStart).normalize();
            const camMatrix = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Matrix4"];
            camMatrix.makeRotationAxis(camVector, angle);
            camMatrix.multiply(this.camera.matrixWorld);
            // const lightStart = new Vector3(p0.elements).applyMatrix4(this.light.matrixWorld);
            // const lightEnd = new Vector3(p1.elements).applyMatrix4(this.light.matrixWorld);
            // const lightVector = Vector3.cross(lightEnd, lightStart).normalize();
            // const lightMatrix = new Matrix4;
            // lightMatrix.makeRotationAxis(lightVector, angle);
            // lightMatrix.multiply(this.light.matrixWorld);
            this.camera.setMatrixWorld(camMatrix.elements);
            //this.light.setMatrixWorld(lightMatrix.elements);
            this.needUpdateView = true;
        }
        if (type === 'pan') {
            const coordsStartWorld = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["canvasToWorld"])(coordsStart, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const coordsMoveWorld = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["canvasToWorld"])(coordsMove, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const p0 = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"]([...coordsStartWorld, 0]);
            const p1 = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"]([...coordsMoveWorld, 0]);
            const pan = this.camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);
            this.camera.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
            this.camera.setMatrixWorld(this.camera.matrixWorld.elements);
            this.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize(type);
            this.needUpdateProjection = true;
        }
        this.reflow = true;
    }
    resize(e) {
        this.camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
        gl.viewport(0, 0, this.canvas.offsetWidth * devicePixelRatio, this.canvas.offsetHeight * devicePixelRatio);
        if (this.camera.props.isInitial) {
            const z = 1 / this.canvas.width * this.camera.modelSize * 3000 * devicePixelRatio;
            this.camera.setZ(z);
            this.light.setZ(z);
            this.light.update(Math.PI / 2);
            this.needUpdateView = true;
        }
        else {
            this.light.setZ(this.camera.matrixWorld.elements[14]);
            this.light.update(Math.PI / 2);
            this.needUpdateView = true;
        }
        const cameraZ = Math.abs(this.camera.matrixWorldInvert.elements[14]);
        const cameraProps = this.camera.props.perspective || this.camera.props.orthographic;
        if (cameraZ > this.camera.modelSize) {
            cameraProps.znear = cameraZ - this.camera.modelSize;
            cameraProps.zfar = cameraZ + this.camera.modelSize;
        }
        else {
            cameraProps.znear = 1;
            cameraProps.zfar = 10000;
        }
        this.camera.setProjection(Object(_utils__WEBPACK_IMPORTED_MODULE_7__["calculateProjection"])(this.camera.props));
        if (e) {
            this.PP.clear();
            this.PP.buildScreenBuffer();
        }
    }
    glInit() {
        gl = this.canvas.getContext('webgl2', { antialias: false });
        this.gl = gl;
        if (!gl) {
            throw new Error('Webgl 2 doesnt support');
        }
        Object(_utils__WEBPACK_IMPORTED_MODULE_7__["setGl"])(gl);
        this.env.setGl(gl);
        this.PP.setGl(gl);
        this.parse.setGl(gl);
        return true;
    }
    animate(sec) {
        for (const v of this.parse.tracks) {
            const val = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["interpolation"])(sec, v.keys);
            if (val[0] === -1 || val[1] === -1 || v.stoped) {
                continue;
            }
            if (val[0] === v.keys.length - 1) {
                v.stoped = true;
            }
            const startFrame = v.keys[val[0]];
            const endFrame = v.keys[val[1]];
            // eslint-disable-next-line
            const t = val[2];
            const component = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["getAnimationComponent"])(v.type);
            let vectorC;
            if (component === 3) {
                vectorC = _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"];
            }
            else if (component === 4) {
                vectorC = _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector4"];
            }
            else if (component === 2) {
                vectorC = _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector2"];
            }
            const vector = new vectorC(startFrame.value);
            const vector2 = new vectorC(endFrame.value);
            if (v.type === 'rotation') {
                const out = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector4"];
                out.lerp(vector.elements, vector2.elements, t);
                for (const mesh of v.meshes) {
                    mesh.matrix.makeRotationFromQuaternion(out.elements);
                }
            }
            else if (v.type === 'scale') {
                const out = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"];
                out.lerp(vector.elements, vector2.elements, t);
                for (const mesh of v.meshes) {
                    mesh.matrix.scale(out);
                }
            }
            else if (v.type === 'weights') {
                const out = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector2"];
                out.lerp(vector.elements, vector2.elements, t);
                for (const mesh of v.meshes) {
                    const geometry = {};
                    for (const k in mesh.geometry.targets[0]) {
                        let offset = 0;
                        geometry[k] = new Float32Array(mesh.geometry.attributes[k].length);
                        for (let i = 0; i < geometry[k].length; i++) {
                            if (k === 'TANGENT' && (i + 1) % 4 === 0) {
                                offset++;
                                continue;
                            }
                            geometry[k][i] = mesh.geometry.attributes[k][i] + out.elements[0] * mesh.geometry.targets[0][k][i - offset] + out.elements[1] * mesh.geometry.targets[1][k][i - offset];
                        }
                    }
                    gl.bindVertexArray(mesh.geometry.VAO);
                    for (const k in geometry) {
                        const VBO = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                        gl.bufferData(gl.ARRAY_BUFFER, geometry[k], gl.STATIC_DRAW);
                        const index = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["getAttributeIndex"])(k);
                        gl.enableVertexAttribArray(index[0]);
                        gl.vertexAttribPointer(index[0], index[1], index[2], false, 0, 0);
                    }
                    gl.bindVertexArray(null);
                }
            }
            else if (v.type === 'translation') {
                const out = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Vector3"];
                out.lerp(vector.elements, vector2.elements, t);
                for (const mesh of v.meshes) {
                    mesh.matrix.setTranslate(out);
                }
            }
            else {
                console.error('ERROR');
            }
            for (const mesh of v.meshes) {
                Object(_utils__WEBPACK_IMPORTED_MODULE_7__["walk"])(mesh, node => {
                    node.updateMatrix();
                    if (node instanceof _objects__WEBPACK_IMPORTED_MODULE_0__["Bone"]) {
                        node.reflow = true;
                    }
                    if (node instanceof _objects__WEBPACK_IMPORTED_MODULE_0__["Mesh"]) {
                        node.reflow = true;
                    }
                    if (node instanceof _objects__WEBPACK_IMPORTED_MODULE_0__["Camera"] && node === this.camera) {
                        this.needUpdateView = true;
                    }
                });
            }
            this.reflow = true;
        }
    }
    draw() {
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        this.render();
    }
    render(time = 0) {
        const sec = time / 1000;
        this.animate(sec);
        if (this.reflow) {
            this.reflow = false;
            this.PP.bindPrePass();
            this.PP.preProcessing();
            this.PP.bindPostPass();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //this.env.createEnvironment();
            this.renderScene(!this.processors.includes('shadow'), false);
            //this.instancing(time);
            Object(_utils__WEBPACK_IMPORTED_MODULE_7__["walk"])(this.scene, node => {
                node.reflow = false;
            });
            this.needUpdateView = false;
            this.needUpdateProjection = false;
            this.PP.postProcessing();
        }
        this.fps.tick(time);
        requestAnimationFrame(this.render.bind(this));
    }
    renderScene(isShadow, isLight) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        if (this.needUpdateView) {
            const planes = Object(_matrix__WEBPACK_IMPORTED_MODULE_1__["Frustum"])(this.camera.getViewProjMatrix());
            this.scene.meshes.forEach(mesh => {
                mesh.visible = mesh.isVisible(planes);
            });
        }
        this.scene.opaqueChildren.forEach(mesh => {
            if (mesh.visible) {
                mesh.draw(gl, this.getState(), isShadow, isLight);
            }
        });
        if (this.scene.transparentChildren.length) {
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            gl.blendFuncSeparate(gl.SRC_COLOR, gl.DST_COLOR, gl.ONE, gl.ZERO);
            // gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            this.scene.transparentChildren.forEach(mesh => {
                if (mesh.visible) {
                    mesh.draw(gl, this.getState(), isShadow, isLight);
                }
            });
            gl.disable(gl.BLEND);
            gl.depthMask(true);
            gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        }
    }
    getState() {
        return {
            camera: this.camera,
            light: this.light,
            preDepthTexture: this.PP.preDepthTexture,
            fakeDepth: this.PP.fakeDepth,
            needUpdateView: this.needUpdateView,
            needUpdateProjection: this.needUpdateProjection
        };
    }
    buildInstancing() {
        this.currentSourceIdx = 0;
        const program = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_7__["compileShader"])(gl.VERTEX_SHADER, _shaders_instance_trans_glsl__WEBPACK_IMPORTED_MODULE_11___default.a, program);
        Object(_utils__WEBPACK_IMPORTED_MODULE_7__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_xxx_glsl__WEBPACK_IMPORTED_MODULE_10___default.a, program);
        const varyings = ['v_position', 'v_velocity', 'v_spawntime', 'v_lifetime'];
        gl.transformFeedbackVaryings(program, varyings, gl.SEPARATE_ATTRIBS);
        gl.linkProgram(program);
        this.program = program;
        const program2 = gl.createProgram();
        Object(_utils__WEBPACK_IMPORTED_MODULE_7__["compileShader"])(gl.VERTEX_SHADER, _shaders_instance_glsl__WEBPACK_IMPORTED_MODULE_8___default.a, program2);
        Object(_utils__WEBPACK_IMPORTED_MODULE_7__["compileShader"])(gl.FRAGMENT_SHADER, _shaders_instance_frag_glsl__WEBPACK_IMPORTED_MODULE_9___default.a, program2);
        gl.linkProgram(program2);
        this.program2 = program2;
        const VAO = [gl.createVertexArray(), gl.createVertexArray()];
        const TFO = [gl.createTransformFeedback(), gl.createTransformFeedback()];
        this.VAO = VAO;
        this.TFO = TFO;
        for (const b of [0, 1]) {
            gl.bindVertexArray(VAO[b]);
            const VBOs = [];
            {
                const vertexPositionData = new Float32Array(amount * 3);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 3] = 0;
                    vertexPositionData[i * 3 + 1] = 0;
                    vertexPositionData[i * 3 + 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(0);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(0, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 3);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 3] = 0;
                    vertexPositionData[i * 3 + 1] = 0;
                    vertexPositionData[i * 3 + 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(1);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(1, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 1);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(2);
                gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(2, 1);
                VBOs.push(VBO);
            }
            {
                const vertexPositionData = new Float32Array(amount * 1);
                for (let i = 0; i < amount; i++) {
                    vertexPositionData[i * 2] = 0;
                }
                const VBO = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPositionData, gl.STREAM_COPY);
                gl.enableVertexAttribArray(3);
                gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);
                gl.vertexAttribDivisor(3, 1);
                VBOs.push(VBO);
            }
            this.VBOs = VBOs;
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, TFO[b]);
            let index = 0;
            for (const v of VBOs) {
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, index, v);
                index++;
            }
        }
        const SIZE = 128;
        const denom = SIZE / 16;
        const data = new Uint8Array(SIZE * SIZE * SIZE);
        for (var k = 0; k < SIZE; ++k) {
            for (var j = 0; j < SIZE; ++j) {
                for (var i = 0; i < SIZE; ++i) {
                    var value = noise.perlin3(i / denom, j / denom, k / denom);
                    value = (1 + value) * 128;
                    data[i + j * SIZE + k * SIZE * SIZE] = value;
                }
            }
        }
        const index = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["getTextureIndex"])();
        this.texture3d = {
            data: gl.createTexture(),
            count: index
        };
        gl.activeTexture(gl[`TEXTURE${this.texture3d.count}`]);
        gl.bindTexture(gl.TEXTURE_3D, this.texture3d.data);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(SIZE));
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage3D(gl.TEXTURE_3D, // target
        0, // level
        gl.R8, // internalformat
        SIZE, // width
        SIZE, // height
        SIZE, // depth
        0, // border
        gl.RED, // format
        gl.UNSIGNED_BYTE, // type
        data // pixel
        );
        gl.generateMipmap(gl.TEXTURE_3D);
        return true;
    }
    instancing(time) {
        // gl.enable(gl.BLEND);
        // gl.depthMask(false);
        // gl.blendFuncSeparate(gl.SRC_COLOR, gl.DST_COLOR, gl.ONE, gl.ZERO);
        const destinationIdx = (this.currentSourceIdx + 1) % 2;
        this.reflow = true;
        // const duration = 10;
        // if (time < duration) {
        //     this.reflow = true;
        // } else {
        //     time = 10;
        // }
        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO[this.currentSourceIdx]);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.TFO[destinationIdx]);
        // let index = 0;
        // for (const v of this.VBOs) {
        //     gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, index, v);
        //     index++;
        // }
        const m = new _matrix__WEBPACK_IMPORTED_MODULE_1__["Matrix4"];
        m.multiply(this.camera.projection);
        m.multiply(this.camera.matrixWorldInvert);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'MVPMatrix'), false, m.elements);
        gl.uniform1f(gl.getUniformLocation(this.program, 'u_time'), time);
        gl.uniform1f(gl.getUniformLocation(this.program, 'count'), amount);
        gl.uniform3f(gl.getUniformLocation(this.program, 'acceleration'), 0.0, 0.0, 0.0);
        gl.uniform1i(gl.getUniformLocation(this.program, 'noize'), this.texture3d.count);
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArraysInstanced(gl.POINTS, 0, 1, amount);
        gl.endTransformFeedback();
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
        this.sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.waitSync(this.sync, 0, gl.TIMEOUT_IGNORED);
        gl.deleteSync(this.sync);
        gl.useProgram(this.program2);
        gl.bindVertexArray(this.VAO[destinationIdx]);
        gl.uniform1i(gl.getUniformLocation(this.program2, 'noize'), this.texture3d.count);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, 'MVPMatrix'), false, m.elements);
        gl.drawArraysInstanced(gl.POINTS, 0, 1, amount);
        this.currentSourceIdx = (this.currentSourceIdx + 1) % 2;
        // gl.disable(gl.BLEND);
        // gl.depthMask(true);
        // gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
    }
}



/***/ }),

/***/ "./src/shaders/bloom.glsl":
/*!********************************!*\
  !*** ./src/shaders/bloom.glsl ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D diff;\r\n\r\nconst vec3 hdrColor = vec3(0.2126, 0.7152, 0.0722);\r\nconst float brightnessThreshold = 0.8;\r\n\r\nvoid main() {\r\n    vec3 c = texture(diff, uv).rgb;\r\n    float brightness = dot(c, hdrColor);\r\n    if (brightness > brightnessThreshold) {\r\n        color = vec4(c, 1.0);\r\n    } else {\r\n        color = vec4(0.0, 0.0, 0.0, 1.0);\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/blur.glsl":
/*!*******************************!*\
  !*** ./src/shaders/blur.glsl ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform vec2 denom;\r\nuniform sampler2D uTexture;\r\n\r\nconst float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);\r\n\r\nvoid main() {             \r\n    vec2 offset = 1.0 / vec2(textureSize(uTexture, 0));\r\n    vec3 result = texture(uTexture, uv).rgb * weight[0];\r\n\r\n    for (int i = 1; i < 5; ++i) {\r\n        result += texture(uTexture, uv + denom * (offset * float(i))).rgb * weight[i];\r\n        result += texture(uTexture, uv - denom * (offset * float(i))).rgb * weight[i];\r\n    }\r\n\r\n    color = vec4(result, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/composer.glsl":
/*!***********************************!*\
  !*** ./src/shaders/composer.glsl ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nout vec4 color;\r\n\r\nuniform sampler2D original;\r\nuniform sampler2D position;\r\nuniform sampler2D normal;\r\nuniform sampler2D ssao;\r\nuniform sampler2D bloom;\r\nuniform sampler2D depth;\r\nuniform sampler2D preDepth;\r\nuniform sampler2D light;\r\n\r\nconst float gamma = 2.2;\r\n\r\nvoid main() {\r\n    vec3 c = texture(original, uv).rgb;\r\n    #ifdef BLOOM\r\n        c += texture(bloom, uv).rgb;\r\n    #endif\r\n    #ifdef SSAO\r\n        c *= texture(ssao, uv).r;\r\n    #endif\r\n    #ifdef LIGHT\r\n        c *= texture(light, uv).r;\r\n    #endif\r\n\r\n    c.rgb = pow(c.rgb, vec3(1.0 / gamma));\r\n\r\n    color = vec4(vec3(texture(light, uv).r), 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/env-frag.glsl":
/*!***********************************!*\
  !*** ./src/shaders/env-frag.glsl ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 outUV;\r\nlayout (location = 0) out vec4 color;\r\n\r\nuniform sampler2D diffuse;\r\nuniform float level;\r\n\r\nvoid main() {\r\n    vec2 texelSize = 1.0 / vec2(textureSize(diffuse, 0));\r\n    vec3 result = vec3(0.0);\r\n    for (int x = -2; x < 2; ++x) {\r\n        for (int y = -2; y < 2; ++y) {\r\n            vec2 offset = vec2(float(x), float(y)) * texelSize;\r\n            result += textureLod(diffuse, outUV + offset, level).rgb;\r\n        }\r\n    }\r\n    color = vec4(0.0,0.0,0.0, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/env.glsl":
/*!******************************!*\
  !*** ./src/shaders/env.glsl ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 inPosition;\r\nlayout (location = 1) in vec2 inUV;\r\n\r\nuniform mat4 MVPMatrix;\r\n\r\nout vec2 outUV;\r\n\r\nvoid main() {\r\n\toutUV = inUV;\r\n    gl_Position = MVPMatrix * vec4(inPosition, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/fragment.glsl":
/*!***********************************!*\
  !*** ./src/shaders/fragment.glsl ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 outUV;\r\nin vec3 outPosition;\r\nin vec4 outPositionView;\r\n#ifdef TANGENT\r\n    in mat3 outTBN;\r\n#else\r\n    in vec3 outNormal;\r\n#endif\r\n\r\nlayout (location = 0) out vec4 color;\r\nlayout (location = 1) out vec3 normalColor;\r\n\r\nuniform Material {\r\n    vec4 baseColorFactor;\r\n    vec3 lightPos;\r\n    vec3 viewPos;\r\n};\r\nuniform sampler2D baseColorTexture;\r\nuniform sampler2D metallicRoughnessTexture;\r\nuniform sampler2D normalTexture;\r\nuniform sampler2D emissiveTexture;\r\nuniform sampler2D occlusionTexture;\r\n\r\nuniform sampler2D depthTexture;\r\n\r\nconst float PI = 3.14159265359;\r\nconst float ambientStrength = 0.1;\r\nconst float specularStrength = 2.5;\r\nconst float specularPower = 32.0;\r\nconst vec3 lightColor = vec3(1.0, 1.0, 1.0);\r\nconst vec3 emissiveFactor = vec3(1.0, 1.0, 1.0);\r\n\r\nfloat ShadowCalculation(vec4 fragPosLightSpace, float bias) {\r\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\r\n    projCoords = projCoords * 0.5 + 0.5;\r\n    float closestDepth = texture(depthTexture, projCoords.xy).r; \r\n    float currentDepth = projCoords.z;\r\n    float shadow = currentDepth - bias > closestDepth ? 0.5 : 0.0;\r\n\r\n    return shadow;\r\n}\r\n\r\nvec3 srgbToLinear(vec4 srgbIn) {\r\n    return pow(srgbIn.rgb, vec3(2.2));\r\n}\r\n\r\nfloat DistributionGGX(vec3 N, vec3 H, float roughness) {\r\n    float a = roughness*roughness;\r\n    float a2 = max(a*a, 0.0001);\r\n    float NdotH = max(dot(N, H), 0.0);\r\n    float NdotH2 = NdotH*NdotH;\r\n\r\n    float nom   = a2;\r\n    float denom = (NdotH2 * (a2 - 1.0) + 1.0);\r\n    denom = PI * denom * denom;\r\n\r\n    return nom / max(denom, 0.0001);\r\n}\r\n\r\nfloat GeometrySchlickGGX(float NdotV, float roughness) {\r\n    float r = (roughness + 1.0);\r\n    float k = (r*r) / 8.0;\r\n\r\n    float nom   = NdotV;\r\n    float denom = NdotV * (1.0 - k) + k;\r\n\r\n    return nom / denom;\r\n}\r\n\r\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\r\n    float NdotV = max(dot(N, V), 0.0);\r\n    float NdotL = max(dot(N, L), 0.0);\r\n    float ggx2 = GeometrySchlickGGX(NdotV, roughness);\r\n    float ggx1 = GeometrySchlickGGX(NdotL, roughness);\r\n\r\n    return ggx1 * ggx2;\r\n}\r\n\r\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\r\n    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\r\n}\r\n\r\nvoid main() {\r\n    #ifdef BASECOLORTEXTURE\r\n        vec3 baseColor = srgbToLinear(texture(baseColorTexture, outUV));\r\n        float alpha = texture(baseColorTexture, outUV).a;\r\n    #else\r\n        vec3 baseColor = baseColorFactor.rgb;\r\n        float alpha = baseColorFactor.a;\r\n    #endif\r\n\r\n    #ifdef OCCLUSIONMAP\r\n        float ao = texture(occlusionTexture, outUV).r;\r\n    #endif\r\n\r\n    #ifdef METALROUGHNESSMAP\r\n        float roughness = texture(metallicRoughnessTexture, outUV).g;\r\n        float metallic = texture(metallicRoughnessTexture, outUV).b;\r\n    #endif\r\n\r\n    #ifdef TANGENT\r\n        #ifdef NORMALMAP\r\n            vec3 n = texture(normalTexture, outUV).rgb;\r\n            n = normalize(outTBN * (2.0 * n - 1.0));\r\n        #else\r\n            vec3 n = outTBN[2].xyz;\r\n        #endif\r\n    #else\r\n        vec3 n = outNormal;\r\n    #endif\r\n\r\n    vec3 viewDir = normalize(viewPos - outPosition);\r\n    vec3 lightDir = normalize(lightPos - outPosition);\r\n    vec3 H = normalize(viewDir + lightDir);\r\n    float distance = length(lightPos - outPosition);\r\n    float attenuation = 1.0 / (distance * distance);\r\n    vec3 radiance = lightColor * 2.0;\r\n    float shadowBias = max(0.05 * (1.0 - dot(n, lightDir)), 0.005);\r\n    float shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);\r\n\r\n    #ifdef USE_PBR\r\n        vec3 F0 = vec3(0.04); \r\n        F0 = mix(F0, baseColor, metallic);\r\n\r\n        vec3 light = vec3(0.0);\r\n\r\n        float NDF = DistributionGGX(n, H, roughness);        \r\n        float G = GeometrySmith(n, viewDir, lightDir, roughness);      \r\n        vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);       \r\n        \r\n        vec3 kS = F;\r\n        vec3 kD = vec3(1.0) - kS;\r\n        kD *= 1.0 - metallic;     \r\n        \r\n        vec3 nominator = NDF * G * F;\r\n        float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);\r\n        vec3 specular = nominator / max(denominator, 0.001);  \r\n\r\n        float NdotL = max(dot(n, lightDir), 0.0);                \r\n        light += (kD * baseColor / PI + specular) * radiance * NdotL;\r\n\r\n        #ifdef OCCLUSIONMAP\r\n            vec3 ambient = vec3(0.03) * baseColor * ao;\r\n        #else\r\n            vec3 ambient = baseColor;\r\n        #endif\r\n        baseColor = ambient + light;\r\n\r\n        #ifdef EMISSIVEMAP\r\n            vec3 emissive = srgbToLinear(texture(emissiveTexture, outUV)) * emissiveFactor;\r\n            baseColor.rgb += emissive;\r\n        #endif\r\n\r\n        baseColor.rgb *= shadow;\r\n   \r\n        color = vec4(baseColor, 1.0);\r\n    #else\r\n        vec3 ambient = ambientStrength * lightColor;\r\n\r\n        float diff = max(dot(n, lightDir), 0.0);\r\n        vec3 diffuse = diff * lightColor;\r\n\r\n        vec3 reflectDir = reflect(-lightDir, n);\r\n        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);\r\n        vec3 specular = specularStrength * spec * lightColor;\r\n\r\n        color = vec4(baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);\r\n    #endif\r\n    normalColor = n;\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/instance-frag.glsl":
/*!****************************************!*\
  !*** ./src/shaders/instance-frag.glsl ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) out vec4 color;\r\n\r\nin float x;\r\n\r\nvoid main() {\r\n    //color = vec4(0.0, 0.0, 0.8, 1.0) * texture( image, gl_PointCoord );\r\n    color = vec4(1.0, 1.0, 1.0, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/instance-trans.glsl":
/*!*****************************************!*\
  !*** ./src/shaders/instance-trans.glsl ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\nprecision highp sampler3D;\r\n\r\nlayout(location = 0) in vec3 a_position;\r\nlayout(location = 1) in vec3 a_velocity;\r\nlayout(location = 2) in float a_spawntime;\r\nlayout(location = 3) in float a_lifetime;\r\n\r\nout vec3 v_position;\r\nout vec3 v_velocity;\r\nout float v_spawntime;\r\nout float v_lifetime;\r\n\r\nuniform float u_time;\r\nuniform vec3 acceleration;\r\nuniform mat4 MVPMatrix;\r\nuniform sampler3D noize;\r\nuniform float count;\r\n\r\nfloat rand(vec3 co) {\r\n    return texture(noize, co).r;\r\n}\r\n\r\nvoid main() {\r\n    if (a_spawntime == 0.0 || (u_time - a_spawntime > a_lifetime) || a_position.y < -0.5) {\r\n        // Generate a new particle\r\n        v_position = vec3(0.0, 0.0, 0.0);\r\n        float x = float(gl_InstanceID) / count;\r\n        float t = u_time/1000.0 * x;\r\n        v_velocity = vec3(\r\n            rand(vec3(x, x, t)) - 0.5,\r\n            rand(vec3(1.0 - x, 1.0 - x, t)) - 0.5,\r\n            rand(vec3(x, 0.5, t)) - 0.5\r\n        );\r\n        v_spawntime = u_time;\r\n        v_lifetime = (rand(vec3(x, x, t)) + 0.5) * 5000.0;\r\n    } else {\r\n        v_velocity = a_velocity + 0.01 * acceleration;\r\n        v_position = a_position + 0.01 * v_velocity;\r\n        v_spawntime = a_spawntime;\r\n        v_lifetime = a_lifetime;\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/instance.glsl":
/*!***********************************!*\
  !*** ./src/shaders/instance.glsl ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\nprecision highp sampler3D;\r\n\r\nlayout (location = 0) in vec3 inPosition;\r\nlayout(location = 1) in vec3 a_velocity;\r\n\r\nuniform mat4 MVPMatrix;\r\nuniform sampler3D noize;\r\n\r\nout float x;\r\n\r\nvoid main() {\r\n    x = float(gl_InstanceID) / 100.0;\r\n    gl_PointSize = 2.0;\r\n    gl_Position = MVPMatrix * vec4(inPosition, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/light-vert.glsl":
/*!*************************************!*\
  !*** ./src/shaders/light-vert.glsl ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec2 pos;\r\n\r\nout vec2 uv;\r\nout vec4 pos1;\r\nout vec4 pos2;\r\n\r\nuniform mat4 proj;\r\nuniform mat4 light;\r\n\r\nconst float N = -2.8311319764089067;\r\nconst float F = -5.778493839936308;\r\n\r\nvec4 lerp(vec4 a, vec4 b, float t) {\r\n    return a + t * (b - a);\r\n}\r\n\r\nvoid main() {\r\n    pos1 = proj * light * vec4(pos * 1.0, N, 1.0);\r\n    pos2 = proj * light * vec4(pos * 1.0, F, 1.0);\r\n\r\n    uv = pos * 0.5 + 0.5;\r\n    gl_Position = vec4(pos, 0.0, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/light.glsl":
/*!********************************!*\
  !*** ./src/shaders/light.glsl ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nin vec2 uv;\r\nin vec4 pos1;\r\nin vec4 pos2;\r\nout float color;\r\n\r\nuniform sampler2D lightTexture;\r\nuniform sampler2D cameraTexture;\r\n\r\nconst float N = 5.8;\r\nconst float F = 2.85;\r\n\r\nvoid main() {\r\n\r\n    float lightDepth = texture(lightTexture, uv).r;\r\n    float cameraDepth = texture(cameraTexture, uv).r;\r\n\r\n    float stp = 1.0/5.0;  //step of k - 80 samples\r\n\tfloat k = 0.0;\r\n    float d = 0.0;\r\n\r\n    // vec2 g_vZTrans = vec2(1.0/N,(N-F)/(F*N));\r\n\t// float v_d = -1.0/dot(vec2(1.0,cameraDepth),g_vZTrans);\r\n\r\n    for (int i = 0; i < 5; i++) {\r\n\t\t// interpolation\r\n\t\tvec4 tPos = mix(pos1,pos2,k += stp);\r\n        vec3 projCoords = tPos.xyz / tPos.w;\r\n        projCoords = projCoords * 0.5 + 0.5;\r\n        float closestDepth = texture(lightTexture, projCoords.xy).r; \r\n        float currentDepth = projCoords.z;\r\n        d += currentDepth > closestDepth ? stp : 0.0;\r\n \r\n\t\t// and depth-tests\r\n        // texture(lightTexture,uv).x\r\n\r\n\t\t// vec2 add = step(vec2(,v_d),tPos.zw); \r\n\t\t// d += add.x*add.y;\r\n\t}\r\n\r\n    //d = 1.0-d*stp*0.5;\r\n    color = 1.0 - d;\r\n    //color = vec4(vec3(1.0 - (cameraDepth > lightDepth ? 1.0 : 0.0)), 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/quad.glsl":
/*!*******************************!*\
  !*** ./src/shaders/quad.glsl ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nlayout (location = 0) in vec2 pos;\r\n\r\nout vec2 uv;\r\n\r\nvoid main() {\r\n    uv = pos * 0.5 + 0.5;\r\n    gl_Position = vec4(pos, 0.0, 1.0); \r\n}\r\n"

/***/ }),

/***/ "./src/shaders/ssao.glsl":
/*!*******************************!*\
  !*** ./src/shaders/ssao.glsl ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\nprecision highp float;\n\nin vec2 uv;\nout float color;\n\nconst int kernelSize = 32;\nconst float radius = 2.5;\nconst float bias = 1.0;\nconst float power = 2.0;\n\nuniform sampler2D normBuff;\nuniform sampler2D depthBuff;\nuniform sampler2D noice;\nuniform vec2 noiseScale;\nuniform vec3 kernels[kernelSize];\nuniform mat4 proj;\nuniform mat4 projI;\nuniform float zFar;\nuniform float zNear;\n\nvec3 getPositionFromDepth(float depth) {\n\tvec4 clipSpaceLocation = vec4(0.0);\n\tclipSpaceLocation.xy = uv * 2.0 - 1.0;\n\tclipSpaceLocation.z = depth * 2.0 - 1.0;;\n\tclipSpaceLocation.w = 1.0;\n\tvec4 homogenousLocation = projI * clipSpaceLocation;\n\thomogenousLocation.xyz = homogenousLocation.xyz / homogenousLocation.w;\n\treturn homogenousLocation.xyz;\n}\n\nvoid main() {\n\tfloat depth = texture(depthBuff, uv).x;\n\tif ((2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear)) > 0.99) {\n\t\tdiscard;\n\t}\n\n\tvec3 pos = getPositionFromDepth(depth);\n\tvec3 normal = normalize(texture(normBuff, uv).xyz);\n\tvec3 rvec = normalize(texture(noice, uv * noiseScale).xyz);\n\n\tvec3 tangent = normalize(rvec - normal * dot(rvec, normal));\n\tvec3 bitangent = cross(tangent, normal);\n\tmat3 rotate = mat3(tangent, bitangent, normal);\n\n\tfloat occlusion  = 0.0;\n\tfor (int i = 0; i < kernelSize; i++) {\n\t\tvec3 samplePos = rotate * kernels[i];\n\t\tsamplePos = pos + samplePos * radius;\n\n\t\tvec4 shift = proj * vec4(samplePos, 1.0);\n\t\tshift.xy /= shift.w;\n\t\tshift.xy = shift.xy * 0.5 + 0.5;\n\n\t\tfloat sampleDepth = getPositionFromDepth(texture(depthBuff, shift.xy).r).z;\n\n\t\tfloat distanceCheck = smoothstep(0.0, 1.0, radius / abs(pos.z - sampleDepth));\n\t\tocclusion  += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0) * distanceCheck;\n\t}\n\n\tocclusion = 1.0 - (occlusion / float(kernelSize));\n\tcolor = pow(occlusion, power);\n}\n"

/***/ }),

/***/ "./src/shaders/vertex.glsl":
/*!*********************************!*\
  !*** ./src/shaders/vertex.glsl ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 inPosition;\r\nlayout (location = 1) in vec3 inNormal;\r\nlayout (location = 2) in vec2 inUV;\r\nlayout (location = 3) in vec4 inJoint;\r\nlayout (location = 4) in vec4 inWeight;\r\nlayout (location = 5) in vec4 inTangent;\r\n\r\nout vec2 outUV;\r\nout vec3 outPosition;\r\nout vec4 outPositionView;\r\n#ifdef TANGENT\r\n    out mat3 outTBN;\r\n#else\r\n    out vec3 outNormal;\r\n#endif\r\n\r\nuniform Matrices {\r\n    mat4 model;\r\n    mat4 normalMatrix;\r\n    mat4 view;\r\n    mat4 projection;\r\n    mat4 light;\r\n    float isShadow;\r\n};\r\n\r\n#ifdef JOINTNUMBER\r\nuniform Skin {\r\n    mat4 joint[JOINTNUMBER];\r\n};\r\n#endif\r\n\r\nvoid main() {\r\n    #ifdef JOINTNUMBER\r\n        mat4 skin = inWeight.x * joint[int(inJoint.x)];\r\n        skin += inWeight.y * joint[int(inJoint.y)];\r\n        skin += inWeight.z * joint[int(inJoint.z)];\r\n        skin += inWeight.w * joint[int(inJoint.w)];\r\n    #else\r\n        mat4 skin = mat4(1.0);\r\n    #endif\r\n\r\n    outUV = inUV;\r\n    #ifdef TANGENT\r\n        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));\r\n        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));\r\n        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;\r\n        outTBN = mat3(tangentW, bitangentW, normalW);\r\n    #else\r\n        outNormal = normalize(mat3(normalMatrix) * mat3(skin) * inNormal);\r\n    #endif\r\n    outPosition = vec3(model * skin * vec4(inPosition, 1.0));\r\n    outPositionView = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    if (isShadow == 1.0) {\r\n        gl_Position = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    } else {\r\n        gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/xxx.glsl":
/*!******************************!*\
  !*** ./src/shaders/xxx.glsl ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) out vec4 color;\r\n\r\nvoid main() {\r\n    //color = vec4(0.0, 0.0, 0.8, 1.0) * texture( image, gl_PointCoord );\r\n    color = vec4(1.0, 1.0, 1.0, 1.0);\r\n}\r\n"

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: getTextureIndex, setGl, isMatrix, random, lerp, getMatrixType, getDataType, getComponentType, getMethod, getAnimationComponent, range, interpolation, buildArray, compileShader, walk, sceneToArcBall, canvasToWorld, calculateProjection, calculateOffset, getAttributeIndex, calculateBinormals, measureGPU */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTextureIndex", function() { return getTextureIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setGl", function() { return setGl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMatrix", function() { return isMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "random", function() { return random; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerp", function() { return lerp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMatrixType", function() { return getMatrixType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDataType", function() { return getDataType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getComponentType", function() { return getComponentType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMethod", function() { return getMethod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAnimationComponent", function() { return getAnimationComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolation", function() { return interpolation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildArray", function() { return buildArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compileShader", function() { return compileShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walk", function() { return walk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sceneToArcBall", function() { return sceneToArcBall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvasToWorld", function() { return canvasToWorld; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateProjection", function() { return calculateProjection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateOffset", function() { return calculateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAttributeIndex", function() { return getAttributeIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateBinormals", function() { return calculateBinormals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "measureGPU", function() { return measureGPU; });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");

const glEnum = {};
let gl;
let screenTextureCount = -1;
function getTextureIndex() {
    screenTextureCount++;
    return screenTextureCount;
}
function setGl(_gl) {
    gl = _gl;
    for (const k in gl) {
        const v = gl[k];
        if (typeof v === 'number') {
            glEnum[v] = k;
        }
    }
}
function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function lerp(a, b, f) {
    return a + f * (b - a);
}
function getMatrixType(type) {
    if (glEnum[type] === 'FLOAT_MAT4') {
        return _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
    }
    if (glEnum[type] === 'FLOAT_MAT3') {
        return _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix3"];
    }
    if (glEnum[type] === 'FLOAT_MAT2') {
        return _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix2"];
    }
}
function getDataType(type) {
    let count;
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
    let count;
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
    let method;
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
    }
    else if (type === 'weights') {
        return 2;
    }
    else {
        return 3;
    }
}
function range(min, max, value) {
    return (value - min) / (max - min);
}
function interpolation(time, frames) {
    if (frames.length === 0) {
        return [-1, -1, 0];
    }
    let prev = -1;
    for (let i = frames.length - 1; i >= 0; i--) {
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
    }
    else {
        const startFrame = frames[prev];
        const endFrame = frames[prev + 1];
        time = Math.max(startFrame.time, Math.min(time, endFrame.time));
        const t = range(startFrame.time, endFrame.time, time);
        return [prev, prev + 1, t];
    }
}
function getCount(type) {
    let arr;
    switch (glEnum[type]) {
        case 'BYTE':
        case 'UNSIGNED_BYTE':
            arr = 1;
            break;
        case 'SHORT':
        case 'UNSIGNED_SHORT':
            arr = 2;
            break;
        case 'UNSIGNED_INT':
        case 'FLOAT':
            arr = 4;
            break;
    }
    return arr;
}
function buildArray(arrayBuffer, type, offset, length, stride, count) {
    const l = length;
    const c = length / count;
    if (stride && stride !== getCount(type) * c) {
        length = stride * count / getCount(type) - offset / getCount(type);
    }
    let arr;
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
        case 'UNSIGNED_INT':
            arr = new Uint32Array(arrayBuffer, offset, length);
            break;
        case 'FLOAT':
            arr = new Float32Array(arrayBuffer, offset, length);
            break;
    }
    if (stride && stride !== getCount(type) * c) {
        const stridedArr = new Float32Array(l);
        let j = 0;
        for (let i = 0; i < stridedArr.length; i = i + c) {
            stridedArr[i] = arr[j];
            stridedArr[i + 1] = arr[j + 1];
            stridedArr[i + 2] = arr[j + 2];
            j = j + c * (stride / getCount(type) / c);
        }
        return stridedArr;
    }
    return arr;
}
function compileShader(type, shaderSource, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    const log = gl.getShaderInfoLog(shader);
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
function sceneToArcBall(pos) {
    let len = pos[0] * pos[0] + pos[1] * pos[1];
    const sz = 0.04 * 0.04 - len;
    if (sz > 0) {
        return [pos[0], pos[1], Math.sqrt(sz)];
    }
    else {
        len = Math.sqrt(len);
        return [0.04 * pos[0] / len, 0.04 * pos[1] / len, 0];
    }
}
function canvasToWorld(vec2, projection, width, height) {
    const [x, y] = vec2;
    const newM = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"];
    newM.setTranslate(new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([0, 0, 0.05]));
    const m = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"](projection);
    m.multiply(newM);
    const mp = m.multiplyVector4(new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector4"]([0, 0, 0, 1]));
    mp.elements[0] = (2 * x / width - 1) * mp.elements[3];
    mp.elements[1] = (-2 * y / height + 1) * mp.elements[3];
    const v = m.invert().multiplyVector4(mp);
    return [v.elements[0], v.elements[1]];
}
function calculateProjection(cam) {
    const { aspect, zoom } = cam;
    let proj;
    if (cam.type === 'perspective' && cam.perspective) {
        const { yfov } = cam.perspective;
        const xfov = yfov * aspect;
        proj = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().setPerspective(xfov * zoom * (180 / Math.PI), aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
    }
    else if (cam.type === 'orthographic' && cam.orthographic) {
        proj = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().setOrtho(cam.orthographic.xmag * zoom, cam.orthographic.ymag * zoom, cam.orthographic.znear, cam.orthographic.zfar);
    }
    return proj;
}
function calculateOffset(a = 0, b = 0) {
    return a + b;
}
function getAttributeIndex(name) {
    let index;
    switch (name) {
        case 'POSITION':
            index = [0, 3, gl.FLOAT];
            break;
        case 'NORMAL':
            index = [1, 3, gl.FLOAT];
            break;
        case 'TEXCOORD_0':
            index = [2, 2, gl.FLOAT];
            break;
        case 'JOINTS_0':
            index = [3, 4, gl.UNSIGNED_SHORT];
            break;
        case 'WEIGHTS_0':
            index = [4, 4, gl.FLOAT];
            break;
        case 'TANGENT':
            index = [5, 4, gl.FLOAT];
            break;
        case 'COLOR_0':
            index = [6, 4, gl.FLOAT];
            break;
    }
    return index;
}
function calculateBinormals(index, vertex, normal, uv) {
    const tangent = new Float32Array(normal.length / 3 * 4);
    for (let i = 0; i < index.length; i += 3) {
        const faceIndexes = [index[i], index[i + 1], index[i + 2]];
        const faceVertices = faceIndexes.map(ix => vectorFromArray(vertex, ix));
        const faceUVs = faceIndexes.map(ix => vectorFromArray(uv, ix, 2));
        const dv1 = faceVertices[1].subtract(faceVertices[0]);
        const dv2 = faceVertices[2].subtract(faceVertices[0]);
        const duv1 = faceUVs[1].subtract(faceUVs[0]);
        const duv2 = faceUVs[2].subtract(faceUVs[0]);
        let r = (duv1.elements[0] * duv2.elements[1] - duv1.elements[1] * duv2.elements[0]);
        r = (r !== 0) ? 1.0 / r : 1.0;
        const udir = new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([
            (duv2.elements[1] * dv1.elements[0] - duv1.elements[1] * dv2.elements[0]) * r,
            (duv2.elements[1] * dv1.elements[1] - duv1.elements[1] * dv2.elements[1]) * r,
            (duv2.elements[1] * dv1.elements[2] - duv1.elements[1] * dv2.elements[2]) * r
        ]);
        udir.normalize();
        faceIndexes.forEach(ix => {
            accumulateVectorInArray(tangent, ix, udir);
        });
    }
    return tangent;
    function vectorFromArray(array, index, elements = 3) {
        index = index * elements;
        if (elements === 3) {
            return new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector3"]([array[index], array[index + 1], array[index + 2]]);
        }
        if (elements === 2) {
            return new _matrix__WEBPACK_IMPORTED_MODULE_0__["Vector2"]([array[index], array[index + 1]]);
        }
    }
    function accumulateVectorInArray(array, index, vector, elements = 4, accumulator = (acc, x) => acc + x) {
        index = index * elements;
        for (let i = 0; i < elements; ++i) {
            if (i === 3) {
                array[index + i] = -1;
            }
            else {
                array[index + i] = accumulator(array[index + i], vector.elements[i]);
            }
        }
    }
}
function measureGPU() {
    const ext = gl.getExtension('EXT_disjoint_timer_query');
    const query = ext.createQueryEXT();
    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
    const available = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT);
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    if (available && !disjoint) {
        const timeElapsed = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
        console.log(timeElapsed / 1000000);
    }
}


/***/ })

/******/ });
});
//# sourceMappingURL=redcube.js.map