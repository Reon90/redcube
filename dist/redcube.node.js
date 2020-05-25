(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("redcube.node", [], factory);
	else if(typeof exports === 'object')
		exports["redcube.node"] = factory();
	else
		root["redcube.node"] = factory();
})(global, function() {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/redcube.node.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./GLTF.ts":
/*!*****************!*\
  !*** ./GLTF.ts ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The material appearance of a primitive.
 */
class Material {
}
exports.Material = Material;


/***/ }),

/***/ "./src/decoder.ts":
/*!************************!*\
  !*** ./src/decoder.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import draco3d from 'draco3d';
const draco3d = __webpack_require__(/*! draco3d */ "draco3d");
exports.DecoderModule = new Promise(resolve => {
    const dracoDecoderType = {
        onModuleLoaded() {
            resolve();
        }
    };
    exports.decoderModule = draco3d.createDecoderModule(dracoDecoderType);
});
function decodeDracoData(rawBuffer, decoder, offset, length) {
    const buffer = new exports.decoderModule.DecoderBuffer();
    buffer.Init(new Int8Array(rawBuffer, offset, length), rawBuffer.byteLength);
    const dracoGeometry = new exports.decoderModule.Mesh();
    decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    exports.decoderModule.destroy(buffer);
    return dracoGeometry;
}
exports.decodeDracoData = decodeDracoData;
function getArray(type, length, decodedGeometry, attribute, decoder) {
    let arr;
    let dracoArr;
    switch (type) {
        case 'BYTE':
            arr = new Int8Array(length);
            arr.type = 'BYTE';
            dracoArr = new exports.decoderModule.DracoInt8Array();
            if (decodedGeometry) {
                decoder.GetAttributeInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_BYTE':
            arr = new Uint8Array(length);
            arr.type = 'UNSIGNED_BYTE';
            dracoArr = new exports.decoderModule.DracoUInt8Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'SHORT':
            arr = new Int16Array(length);
            arr.type = 'SHORT';
            dracoArr = new exports.decoderModule.DracoInt16Array();
            if (decodedGeometry) {
                decoder.GetAttributeInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_SHORT':
            arr = new Uint16Array(length);
            arr.type = 'UNSIGNED_SHORT';
            dracoArr = new exports.decoderModule.DracoUInt16Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'UNSIGNED_INT':
            arr = new Uint32Array(length);
            arr.type = 'UNSIGNED_INT';
            dracoArr = new exports.decoderModule.DracoUInt32Array();
            if (decodedGeometry) {
                decoder.GetAttributeUInt32ForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
        case 'FLOAT':
            arr = new Float32Array(length);
            arr.type = 'FLOAT';
            dracoArr = new exports.decoderModule.DracoFloat32Array();
            if (decodedGeometry) {
                decoder.GetAttributeFloatForAllPoints(decodedGeometry, attribute, dracoArr);
            }
            break;
    }
    return [dracoArr, arr];
}
exports.getArray = getArray;


/***/ }),

/***/ "./src/fetch.ts":
/*!**********************!*\
  !*** ./src/fetch.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
function fetch(url) {
    if (typeof window !== "undefined") {
        return window.fetch(url).then(r => r.json());
    }
    else {
        return new Promise((resolve) => {
            fs.readFile(url, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
}
exports.fetch = fetch;
function fetchBinary(url) {
    if (typeof window !== "undefined") {
        return window.fetch(url).then(r => r.arrayBuffer());
    }
    else {
        return new Promise((resolve) => {
            fs.readFile(url, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    resolve(new Uint8Array(data).buffer);
                }
            });
        });
    }
}
exports.fetchBinary = fetchBinary;
function fetchImage({ url, name }) {
    if (typeof window !== "undefined") {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve({
                    name,
                    image
                });
            };
            image.onerror = err => {
                reject(err);
            };
            image.crossOrigin = 'anonymous';
            // if (source.bufferView !== undefined) {
            //     const bufferView = this.json.bufferViews[source.bufferView];
            //     const buffer = new Uint8Array(this.arrayBuffer[bufferView.buffer], bufferView.byteOffset, bufferView.byteLength);
            //     const blob = new Blob([buffer], { type: source.mimeType });
            //     image.src = URL.createObjectURL(blob);
            // } else if (/base64/.test(source.uri)) {
            //     image.src = url.uri;
            // } else {
            image.src = url;
            // }
        });
    }
    else {
        return new Promise((resolve) => {
            fs.readFile(url, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    resolve({
                        url,
                        name,
                        image: new Uint8Array(data).buffer,
                    });
                }
            });
        });
    }
}
exports.fetchImage = fetchImage;


/***/ }),

/***/ "./src/glEnum.ts":
/*!***********************!*\
  !*** ./src/glEnum.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { "0": "NONE", "1": "ONE", "2": "LINE_LOOP", "3": "LINE_STRIP", "4": "TRIANGLES", "5": "TRIANGLE_STRIP", "6": "TRIANGLE_FAN", "256": "DEPTH_BUFFER_BIT", "512": "NEVER", "513": "LESS", "514": "EQUAL", "515": "LEQUAL", "516": "GREATER", "517": "NOTEQUAL", "518": "GEQUAL", "519": "ALWAYS", "768": "SRC_COLOR", "769": "ONE_MINUS_SRC_COLOR", "770": "SRC_ALPHA", "771": "ONE_MINUS_SRC_ALPHA", "772": "DST_ALPHA", "773": "ONE_MINUS_DST_ALPHA", "774": "DST_COLOR", "775": "ONE_MINUS_DST_COLOR", "776": "SRC_ALPHA_SATURATE", "1024": "STENCIL_BUFFER_BIT", "1028": "FRONT", "1029": "BACK", "1032": "FRONT_AND_BACK", "1280": "INVALID_ENUM", "1281": "INVALID_VALUE", "1282": "INVALID_OPERATION", "1285": "OUT_OF_MEMORY", "1286": "INVALID_FRAMEBUFFER_OPERATION", "1798": "drawingBufferHeight", "2304": "CW", "2305": "CCW", "2712": "drawingBufferWidth", "2849": "LINE_WIDTH", "2884": "CULL_FACE", "2885": "CULL_FACE_MODE", "2886": "FRONT_FACE", "2928": "DEPTH_RANGE", "2929": "DEPTH_TEST", "2930": "DEPTH_WRITEMASK", "2931": "DEPTH_CLEAR_VALUE", "2932": "DEPTH_FUNC", "2960": "STENCIL_TEST", "2961": "STENCIL_CLEAR_VALUE", "2962": "STENCIL_FUNC", "2963": "STENCIL_VALUE_MASK", "2964": "STENCIL_FAIL", "2965": "STENCIL_PASS_DEPTH_FAIL", "2966": "STENCIL_PASS_DEPTH_PASS", "2967": "STENCIL_REF", "2968": "STENCIL_WRITEMASK", "2978": "VIEWPORT", "3024": "DITHER", "3042": "BLEND", "3074": "READ_BUFFER", "3088": "SCISSOR_BOX", "3089": "SCISSOR_TEST", "3106": "COLOR_CLEAR_VALUE", "3107": "COLOR_WRITEMASK", "3314": "UNPACK_ROW_LENGTH", "3315": "UNPACK_SKIP_ROWS", "3316": "UNPACK_SKIP_PIXELS", "3317": "UNPACK_ALIGNMENT", "3330": "PACK_ROW_LENGTH", "3331": "PACK_SKIP_ROWS", "3332": "PACK_SKIP_PIXELS", "3333": "PACK_ALIGNMENT", "3379": "MAX_TEXTURE_SIZE", "3386": "MAX_VIEWPORT_DIMS", "3408": "SUBPIXEL_BITS", "3410": "RED_BITS", "3411": "GREEN_BITS", "3412": "BLUE_BITS", "3413": "ALPHA_BITS", "3414": "DEPTH_BITS", "3415": "STENCIL_BITS", "3553": "TEXTURE_2D", "4352": "DONT_CARE", "4353": "FASTEST", "4354": "NICEST", "5120": "BYTE", "5121": "UNSIGNED_BYTE", "5122": "SHORT", "5123": "UNSIGNED_SHORT", "5124": "INT", "5125": "UNSIGNED_INT", "5126": "FLOAT", "5131": "HALF_FLOAT", "5386": "INVERT", "5890": "TEXTURE", "6144": "COLOR", "6145": "DEPTH", "6146": "STENCIL", "6402": "DEPTH_COMPONENT", "6403": "RED", "6406": "ALPHA", "6407": "RGB", "6408": "RGBA", "6409": "LUMINANCE", "6410": "LUMINANCE_ALPHA", "7680": "KEEP", "7681": "REPLACE", "7682": "INCR", "7683": "DECR", "7936": "VENDOR", "7937": "RENDERER", "7938": "VERSION", "9728": "NEAREST", "9729": "LINEAR", "9984": "NEAREST_MIPMAP_NEAREST", "9985": "LINEAR_MIPMAP_NEAREST", "9986": "NEAREST_MIPMAP_LINEAR", "9987": "LINEAR_MIPMAP_LINEAR", "10240": "TEXTURE_MAG_FILTER", "10241": "TEXTURE_MIN_FILTER", "10242": "TEXTURE_WRAP_S", "10243": "TEXTURE_WRAP_T", "10497": "REPEAT", "10752": "POLYGON_OFFSET_UNITS", "16384": "COLOR_BUFFER_BIT", "32769": "CONSTANT_COLOR", "32770": "ONE_MINUS_CONSTANT_COLOR", "32771": "CONSTANT_ALPHA", "32772": "ONE_MINUS_CONSTANT_ALPHA", "32773": "BLEND_COLOR", "32774": "FUNC_ADD", "32775": "MIN", "32776": "MAX", "32777": "BLEND_EQUATION_RGB", "32778": "FUNC_SUBTRACT", "32779": "FUNC_REVERSE_SUBTRACT", "32819": "UNSIGNED_SHORT_4_4_4_4", "32820": "UNSIGNED_SHORT_5_5_5_1", "32823": "POLYGON_OFFSET_FILL", "32824": "POLYGON_OFFSET_FACTOR", "32849": "RGB8", "32854": "RGBA4", "32855": "RGB5_A1", "32856": "RGBA8", "32857": "RGB10_A2", "32873": "TEXTURE_BINDING_2D", "32874": "TEXTURE_BINDING_3D", "32877": "UNPACK_SKIP_IMAGES", "32878": "UNPACK_IMAGE_HEIGHT", "32879": "TEXTURE_3D", "32882": "TEXTURE_WRAP_R", "32883": "MAX_3D_TEXTURE_SIZE", "32926": "SAMPLE_ALPHA_TO_COVERAGE", "32928": "SAMPLE_COVERAGE", "32936": "SAMPLE_BUFFERS", "32937": "SAMPLES", "32938": "SAMPLE_COVERAGE_VALUE", "32939": "SAMPLE_COVERAGE_INVERT", "32968": "BLEND_DST_RGB", "32969": "BLEND_SRC_RGB", "32970": "BLEND_DST_ALPHA", "32971": "BLEND_SRC_ALPHA", "33000": "MAX_ELEMENTS_VERTICES", "33001": "MAX_ELEMENTS_INDICES", "33071": "CLAMP_TO_EDGE", "33082": "TEXTURE_MIN_LOD", "33083": "TEXTURE_MAX_LOD", "33084": "TEXTURE_BASE_LEVEL", "33085": "TEXTURE_MAX_LEVEL", "33170": "GENERATE_MIPMAP_HINT", "33189": "DEPTH_COMPONENT16", "33190": "DEPTH_COMPONENT24", "33296": "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING", "33297": "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE", "33298": "FRAMEBUFFER_ATTACHMENT_RED_SIZE", "33299": "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE", "33300": "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE", "33301": "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE", "33302": "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE", "33303": "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE", "33304": "FRAMEBUFFER_DEFAULT", "33306": "DEPTH_STENCIL_ATTACHMENT", "33319": "RG", "33320": "RG_INTEGER", "33321": "R8", "33323": "RG8", "33325": "R16F", "33326": "R32F", "33327": "RG16F", "33328": "RG32F", "33329": "R8I", "33330": "R8UI", "33331": "R16I", "33332": "R16UI", "33333": "R32I", "33334": "R32UI", "33335": "RG8I", "33336": "RG8UI", "33337": "RG16I", "33338": "RG16UI", "33339": "RG32I", "33340": "RG32UI", "33503": "TEXTURE_IMMUTABLE_LEVELS", "33635": "UNSIGNED_SHORT_5_6_5", "33640": "UNSIGNED_INT_2_10_10_10_REV", "33648": "MIRRORED_REPEAT", "33901": "ALIASED_POINT_SIZE_RANGE", "33902": "ALIASED_LINE_WIDTH_RANGE", "33984": "TEXTURE0", "33985": "TEXTURE1", "33986": "TEXTURE2", "33987": "TEXTURE3", "33988": "TEXTURE4", "33989": "TEXTURE5", "33990": "TEXTURE6", "33991": "TEXTURE7", "33992": "TEXTURE8", "33993": "TEXTURE9", "33994": "TEXTURE10", "33995": "TEXTURE11", "33996": "TEXTURE12", "33997": "TEXTURE13", "33998": "TEXTURE14", "33999": "TEXTURE15", "34000": "TEXTURE16", "34001": "TEXTURE17", "34002": "TEXTURE18", "34003": "TEXTURE19", "34004": "TEXTURE20", "34005": "TEXTURE21", "34006": "TEXTURE22", "34007": "TEXTURE23", "34008": "TEXTURE24", "34009": "TEXTURE25", "34010": "TEXTURE26", "34011": "TEXTURE27", "34012": "TEXTURE28", "34013": "TEXTURE29", "34014": "TEXTURE30", "34015": "TEXTURE31", "34016": "ACTIVE_TEXTURE", "34024": "MAX_RENDERBUFFER_SIZE", "34041": "DEPTH_STENCIL", "34042": "UNSIGNED_INT_24_8", "34045": "MAX_TEXTURE_LOD_BIAS", "34055": "INCR_WRAP", "34056": "DECR_WRAP", "34067": "TEXTURE_CUBE_MAP", "34068": "TEXTURE_BINDING_CUBE_MAP", "34069": "TEXTURE_CUBE_MAP_POSITIVE_X", "34070": "TEXTURE_CUBE_MAP_NEGATIVE_X", "34071": "TEXTURE_CUBE_MAP_POSITIVE_Y", "34072": "TEXTURE_CUBE_MAP_NEGATIVE_Y", "34073": "TEXTURE_CUBE_MAP_POSITIVE_Z", "34074": "TEXTURE_CUBE_MAP_NEGATIVE_Z", "34076": "MAX_CUBE_MAP_TEXTURE_SIZE", "34229": "VERTEX_ARRAY_BINDING", "34338": "VERTEX_ATTRIB_ARRAY_ENABLED", "34339": "VERTEX_ATTRIB_ARRAY_SIZE", "34340": "VERTEX_ATTRIB_ARRAY_STRIDE", "34341": "VERTEX_ATTRIB_ARRAY_TYPE", "34342": "CURRENT_VERTEX_ATTRIB", "34373": "VERTEX_ATTRIB_ARRAY_POINTER", "34467": "COMPRESSED_TEXTURE_FORMATS", "34660": "BUFFER_SIZE", "34661": "BUFFER_USAGE", "34816": "STENCIL_BACK_FUNC", "34817": "STENCIL_BACK_FAIL", "34818": "STENCIL_BACK_PASS_DEPTH_FAIL", "34819": "STENCIL_BACK_PASS_DEPTH_PASS", "34836": "RGBA32F", "34837": "RGB32F", "34842": "RGBA16F", "34843": "RGB16F", "34852": "MAX_DRAW_BUFFERS", "34853": "DRAW_BUFFER0", "34854": "DRAW_BUFFER1", "34855": "DRAW_BUFFER2", "34856": "DRAW_BUFFER3", "34857": "DRAW_BUFFER4", "34858": "DRAW_BUFFER5", "34859": "DRAW_BUFFER6", "34860": "DRAW_BUFFER7", "34861": "DRAW_BUFFER8", "34862": "DRAW_BUFFER9", "34863": "DRAW_BUFFER10", "34864": "DRAW_BUFFER11", "34865": "DRAW_BUFFER12", "34866": "DRAW_BUFFER13", "34867": "DRAW_BUFFER14", "34868": "DRAW_BUFFER15", "34877": "BLEND_EQUATION_ALPHA", "34892": "TEXTURE_COMPARE_MODE", "34893": "TEXTURE_COMPARE_FUNC", "34894": "COMPARE_REF_TO_TEXTURE", "34917": "CURRENT_QUERY", "34918": "QUERY_RESULT", "34919": "QUERY_RESULT_AVAILABLE", "34921": "MAX_VERTEX_ATTRIBS", "34922": "VERTEX_ATTRIB_ARRAY_NORMALIZED", "34930": "MAX_TEXTURE_IMAGE_UNITS", "34962": "ARRAY_BUFFER", "34963": "ELEMENT_ARRAY_BUFFER", "34964": "ARRAY_BUFFER_BINDING", "34965": "ELEMENT_ARRAY_BUFFER_BINDING", "34975": "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", "35040": "STREAM_DRAW", "35041": "STREAM_READ", "35042": "STREAM_COPY", "35044": "STATIC_DRAW", "35045": "STATIC_READ", "35046": "STATIC_COPY", "35048": "DYNAMIC_DRAW", "35049": "DYNAMIC_READ", "35050": "DYNAMIC_COPY", "35051": "PIXEL_PACK_BUFFER", "35052": "PIXEL_UNPACK_BUFFER", "35053": "PIXEL_PACK_BUFFER_BINDING", "35055": "PIXEL_UNPACK_BUFFER_BINDING", "35056": "DEPTH24_STENCIL8", "35069": "VERTEX_ATTRIB_ARRAY_INTEGER", "35070": "VERTEX_ATTRIB_ARRAY_DIVISOR", "35071": "MAX_ARRAY_TEXTURE_LAYERS", "35076": "MIN_PROGRAM_TEXEL_OFFSET", "35077": "MAX_PROGRAM_TEXEL_OFFSET", "35097": "SAMPLER_BINDING", "35345": "UNIFORM_BUFFER", "35368": "UNIFORM_BUFFER_BINDING", "35369": "UNIFORM_BUFFER_START", "35370": "UNIFORM_BUFFER_SIZE", "35371": "MAX_VERTEX_UNIFORM_BLOCKS", "35373": "MAX_FRAGMENT_UNIFORM_BLOCKS", "35374": "MAX_COMBINED_UNIFORM_BLOCKS", "35375": "MAX_UNIFORM_BUFFER_BINDINGS", "35376": "MAX_UNIFORM_BLOCK_SIZE", "35377": "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS", "35379": "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS", "35380": "UNIFORM_BUFFER_OFFSET_ALIGNMENT", "35382": "ACTIVE_UNIFORM_BLOCKS", "35383": "UNIFORM_TYPE", "35384": "UNIFORM_SIZE", "35386": "UNIFORM_BLOCK_INDEX", "35387": "UNIFORM_OFFSET", "35388": "UNIFORM_ARRAY_STRIDE", "35389": "UNIFORM_MATRIX_STRIDE", "35390": "UNIFORM_IS_ROW_MAJOR", "35391": "UNIFORM_BLOCK_BINDING", "35392": "UNIFORM_BLOCK_DATA_SIZE", "35394": "UNIFORM_BLOCK_ACTIVE_UNIFORMS", "35395": "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES", "35396": "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER", "35398": "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER", "35632": "FRAGMENT_SHADER", "35633": "VERTEX_SHADER", "35657": "MAX_FRAGMENT_UNIFORM_COMPONENTS", "35658": "MAX_VERTEX_UNIFORM_COMPONENTS", "35659": "MAX_VARYING_COMPONENTS", "35660": "MAX_VERTEX_TEXTURE_IMAGE_UNITS", "35661": "MAX_COMBINED_TEXTURE_IMAGE_UNITS", "35663": "SHADER_TYPE", "35664": "FLOAT_VEC2", "35665": "FLOAT_VEC3", "35666": "FLOAT_VEC4", "35667": "INT_VEC2", "35668": "INT_VEC3", "35669": "INT_VEC4", "35670": "BOOL", "35671": "BOOL_VEC2", "35672": "BOOL_VEC3", "35673": "BOOL_VEC4", "35674": "FLOAT_MAT2", "35675": "FLOAT_MAT3", "35676": "FLOAT_MAT4", "35678": "SAMPLER_2D", "35679": "SAMPLER_3D", "35680": "SAMPLER_CUBE", "35682": "SAMPLER_2D_SHADOW", "35685": "FLOAT_MAT2x3", "35686": "FLOAT_MAT2x4", "35687": "FLOAT_MAT3x2", "35688": "FLOAT_MAT3x4", "35689": "FLOAT_MAT4x2", "35690": "FLOAT_MAT4x3", "35712": "DELETE_STATUS", "35713": "COMPILE_STATUS", "35714": "LINK_STATUS", "35715": "VALIDATE_STATUS", "35717": "ATTACHED_SHADERS", "35718": "ACTIVE_UNIFORMS", "35721": "ACTIVE_ATTRIBUTES", "35723": "FRAGMENT_SHADER_DERIVATIVE_HINT", "35724": "SHADING_LANGUAGE_VERSION", "35725": "CURRENT_PROGRAM", "35738": "IMPLEMENTATION_COLOR_READ_TYPE", "35739": "IMPLEMENTATION_COLOR_READ_FORMAT", "35863": "UNSIGNED_NORMALIZED", "35866": "TEXTURE_2D_ARRAY", "35869": "TEXTURE_BINDING_2D_ARRAY", "35887": "ANY_SAMPLES_PASSED", "35898": "R11F_G11F_B10F", "35899": "UNSIGNED_INT_10F_11F_11F_REV", "35901": "RGB9_E5", "35902": "UNSIGNED_INT_5_9_9_9_REV", "35904": "SRGB", "35905": "SRGB8", "35907": "SRGB8_ALPHA8", "35967": "TRANSFORM_FEEDBACK_BUFFER_MODE", "35968": "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS", "35971": "TRANSFORM_FEEDBACK_VARYINGS", "35972": "TRANSFORM_FEEDBACK_BUFFER_START", "35973": "TRANSFORM_FEEDBACK_BUFFER_SIZE", "35976": "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN", "35977": "RASTERIZER_DISCARD", "35978": "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS", "35979": "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS", "35980": "INTERLEAVED_ATTRIBS", "35981": "SEPARATE_ATTRIBS", "35982": "TRANSFORM_FEEDBACK_BUFFER", "35983": "TRANSFORM_FEEDBACK_BUFFER_BINDING", "36003": "STENCIL_BACK_REF", "36004": "STENCIL_BACK_VALUE_MASK", "36005": "STENCIL_BACK_WRITEMASK", "36006": "FRAMEBUFFER_BINDING", "36007": "RENDERBUFFER_BINDING", "36008": "READ_FRAMEBUFFER", "36009": "DRAW_FRAMEBUFFER", "36010": "READ_FRAMEBUFFER_BINDING", "36011": "RENDERBUFFER_SAMPLES", "36012": "DEPTH_COMPONENT32F", "36013": "DEPTH32F_STENCIL8", "36048": "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", "36049": "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", "36050": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", "36051": "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", "36052": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER", "36053": "FRAMEBUFFER_COMPLETE", "36054": "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", "36055": "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", "36057": "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", "36061": "FRAMEBUFFER_UNSUPPORTED", "36063": "MAX_COLOR_ATTACHMENTS", "36064": "COLOR_ATTACHMENT0", "36065": "COLOR_ATTACHMENT1", "36066": "COLOR_ATTACHMENT2", "36067": "COLOR_ATTACHMENT3", "36068": "COLOR_ATTACHMENT4", "36069": "COLOR_ATTACHMENT5", "36070": "COLOR_ATTACHMENT6", "36071": "COLOR_ATTACHMENT7", "36072": "COLOR_ATTACHMENT8", "36073": "COLOR_ATTACHMENT9", "36074": "COLOR_ATTACHMENT10", "36075": "COLOR_ATTACHMENT11", "36076": "COLOR_ATTACHMENT12", "36077": "COLOR_ATTACHMENT13", "36078": "COLOR_ATTACHMENT14", "36079": "COLOR_ATTACHMENT15", "36096": "DEPTH_ATTACHMENT", "36128": "STENCIL_ATTACHMENT", "36160": "FRAMEBUFFER", "36161": "RENDERBUFFER", "36162": "RENDERBUFFER_WIDTH", "36163": "RENDERBUFFER_HEIGHT", "36164": "RENDERBUFFER_INTERNAL_FORMAT", "36168": "STENCIL_INDEX8", "36176": "RENDERBUFFER_RED_SIZE", "36177": "RENDERBUFFER_GREEN_SIZE", "36178": "RENDERBUFFER_BLUE_SIZE", "36179": "RENDERBUFFER_ALPHA_SIZE", "36180": "RENDERBUFFER_DEPTH_SIZE", "36181": "RENDERBUFFER_STENCIL_SIZE", "36182": "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE", "36183": "MAX_SAMPLES", "36194": "RGB565", "36202": "ANY_SAMPLES_PASSED_CONSERVATIVE", "36203": "MAX_ELEMENT_INDEX", "36208": "RGBA32UI", "36209": "RGB32UI", "36214": "RGBA16UI", "36215": "RGB16UI", "36220": "RGBA8UI", "36221": "RGB8UI", "36226": "RGBA32I", "36227": "RGB32I", "36232": "RGBA16I", "36233": "RGB16I", "36238": "RGBA8I", "36239": "RGB8I", "36244": "RED_INTEGER", "36248": "RGB_INTEGER", "36249": "RGBA_INTEGER", "36255": "INT_2_10_10_10_REV", "36269": "FLOAT_32_UNSIGNED_INT_24_8_REV", "36289": "SAMPLER_2D_ARRAY", "36292": "SAMPLER_2D_ARRAY_SHADOW", "36293": "SAMPLER_CUBE_SHADOW", "36294": "UNSIGNED_INT_VEC2", "36295": "UNSIGNED_INT_VEC3", "36296": "UNSIGNED_INT_VEC4", "36298": "INT_SAMPLER_2D", "36299": "INT_SAMPLER_3D", "36300": "INT_SAMPLER_CUBE", "36303": "INT_SAMPLER_2D_ARRAY", "36306": "UNSIGNED_INT_SAMPLER_2D", "36307": "UNSIGNED_INT_SAMPLER_3D", "36308": "UNSIGNED_INT_SAMPLER_CUBE", "36311": "UNSIGNED_INT_SAMPLER_2D_ARRAY", "36336": "LOW_FLOAT", "36337": "MEDIUM_FLOAT", "36338": "HIGH_FLOAT", "36339": "LOW_INT", "36340": "MEDIUM_INT", "36341": "HIGH_INT", "36347": "MAX_VERTEX_UNIFORM_VECTORS", "36348": "MAX_VARYING_VECTORS", "36349": "MAX_FRAGMENT_UNIFORM_VECTORS", "36386": "TRANSFORM_FEEDBACK", "36387": "TRANSFORM_FEEDBACK_PAUSED", "36388": "TRANSFORM_FEEDBACK_ACTIVE", "36389": "TRANSFORM_FEEDBACK_BINDING", "36662": "COPY_READ_BUFFER_BINDING", "36663": "COPY_WRITE_BUFFER_BINDING", "36756": "R8_SNORM", "36757": "RG8_SNORM", "36758": "RGB8_SNORM", "36759": "RGBA8_SNORM", "36764": "SIGNED_NORMALIZED", "36975": "RGB10_A2UI", "37137": "MAX_SERVER_WAIT_TIMEOUT", "37138": "OBJECT_TYPE", "37139": "SYNC_CONDITION", "37140": "SYNC_STATUS", "37141": "SYNC_FLAGS", "37142": "SYNC_FENCE", "37143": "SYNC_GPU_COMMANDS_COMPLETE", "37144": "UNSIGNALED", "37145": "SIGNALED", "37146": "ALREADY_SIGNALED", "37147": "TIMEOUT_EXPIRED", "37148": "CONDITION_SATISFIED", "37149": "WAIT_FAILED", "37154": "MAX_VERTEX_OUTPUT_COMPONENTS", "37157": "MAX_FRAGMENT_INPUT_COMPONENTS", "37167": "TEXTURE_IMMUTABLE_FORMAT", "37440": "UNPACK_FLIP_Y_WEBGL", "37441": "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "37442": "CONTEXT_LOST_WEBGL", "37443": "UNPACK_COLORSPACE_CONVERSION_WEBGL", "37444": "BROWSER_DEFAULT_WEBGL", "37447": "MAX_CLIENT_WAIT_TIMEOUT_WEBGL", "4294967295": "INVALID_INDEX", "-1": "TIMEOUT_IGNORED" };


/***/ }),

/***/ "./src/matrix.ts":
/*!***********************!*\
  !*** ./src/matrix.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Matrix2 = Matrix2;
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
    multiply(matrix) {
        const ae = this.elements;
        const be = matrix.elements;
        const te = this.elements;
        const a11 = ae[0], a12 = ae[3], a13 = ae[6];
        const a21 = ae[1], a22 = ae[4], a23 = ae[7];
        const a31 = ae[2], a32 = ae[5], a33 = ae[8];
        const b11 = be[0], b12 = be[3], b13 = be[6];
        const b21 = be[1], b22 = be[4], b23 = be[7];
        const b31 = be[2], b32 = be[5], b33 = be[8];
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
exports.Matrix3 = Matrix3;
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
    restoreScale(vec3) {
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
    rotate(axis, rad) {
        let x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
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
exports.Matrix4 = Matrix4;
class Vector {
    constructor(src) {
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
exports.Vector = Vector;
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
    static FromArrayToRef(array, offset, result) {
        result.x = array[offset];
        result.y = array[offset + 1];
        result.z = array[offset + 2];
    }
    projectOnVector(vector) {
        const scalar = Vector3.dot(vector, this) / vector.lengthSq();
        return new Vector3(vector).scale(scalar);
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
    scale2(scale) {
        return new Vector3([this.x * scale, this.y * scale, this.z * scale]);
    }
    subtract2(otherVector) {
        return new Vector3([this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z]);
    }
    add2(otherVector) {
        return new Vector3([this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z]);
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
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
}
exports.Vector3 = Vector3;
class Box {
    constructor() {
        this.min = new Vector3([Infinity, Infinity, Infinity]);
        this.max = new Vector3([-Infinity, -Infinity, -Infinity]);
    }
    expand(box) {
        this.min.min(box.min);
        this.max.max(box.max);
    }
    getSize() {
        const size = new Vector3;
        size.subVectors(this.max, this.min);
        return size.length();
    }
}
exports.Box = Box;
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
        if (t === 0)
            return this;
        if (t === 1) {
            out[0] = b[0];
            out[1] = b[1];
            out[2] = b[2];
            out[3] = b[3];
            return this;
        }
        const x = a[0], y = a[1], z = a[2], w = a[3];
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];
        if (cosHalfTheta < 0) {
            out[3] = -b[3];
            out[0] = -b[0];
            out[1] = -b[1];
            out[2] = -b[2];
            cosHalfTheta = -cosHalfTheta;
        }
        else {
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
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        out[3] = w * ratioA + out[3] * ratioB;
        out[0] = x * ratioA + out[0] * ratioB;
        out[1] = y * ratioA + out[1] * ratioB;
        out[2] = z * ratioA + out[2] * ratioB;
        return this;
    }
    inverse() {
        this.elements[0] = -this.elements[0];
        this.elements[1] = -this.elements[1];
        this.elements[2] = -this.elements[2];
        return this;
    }
}
exports.Vector4 = Vector4;
class Vector2 {
    constructor(opt_src) {
        const v = new Float32Array(2);
        if (opt_src && typeof opt_src === 'object') {
            v[0] = opt_src[0];
            v[1] = opt_src[1];
        }
        this.elements = v;
    }
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
exports.Vector2 = Vector2;
// { 0: right, 1: left, 2: bottom. 3: top, 4: far, 5: near }
function Frustum(m) {
    const planes = [new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4(), new Vector4()];
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
exports.Frustum = Frustum;


/***/ }),

/***/ "./src/objects/camera.ts":
/*!*******************************!*\
  !*** ./src/objects/camera.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const object3d_1 = __webpack_require__(/*! ./object3d */ "./src/objects/object3d.ts");
function clamp(a, b, c) {
    return a < b ? b : a > c ? c : a;
}
var x;
class Camera extends object3d_1.Object3D {
    constructor(props, name, parent) {
        super(name, parent);
        this.matrixWorldInvert = new matrix_1.Matrix4();
        this.projection = new matrix_1.Matrix4();
        this.props = props;
        this.yaw = 0;
        this.pitch = -Math.PI;
        this.z = 1;
    }
    setProjection(matrix) {
        this.projection.set(matrix.elements);
    }
    setMatrixWorld(matrix) {
        super.setMatrixWorld(matrix);
        this.matrixWorldInvert.setInverseOf(this.matrixWorld);
        if (!this.matrixInitial) {
            this.matrixInitial = new matrix_1.Matrix4(this.matrixWorld);
        }
    }
    setZ(z) {
        this.matrix.elements[14] = z;
        this.matrixInitial = new matrix_1.Matrix4(this.matrix);
        this.setMatrixWorld(this.matrix.elements);
    }
    getViewProjMatrix() {
        const m = new matrix_1.Matrix4();
        m.multiply(this.projection);
        m.multiply(this.matrixWorldInvert);
        return m;
    }
    pan(coordsStart, coordsMove, width, height) {
        const coordsStartWorld = utils_1.canvasToWorld(coordsStart, this.projection, width, height);
        const coordsMoveWorld = utils_1.canvasToWorld(coordsMove, this.projection, width, height);
        const p0 = new matrix_1.Vector3([...coordsStartWorld, 0]);
        const p1 = new matrix_1.Vector3([...coordsMoveWorld, 0]);
        if (this.props.type === 'orthographic') {
            const pan = this.modelSize * 2;
            const delta = p0.subtract(p1).scale(pan);
            this.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
        }
        else {
            const pan = this.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);
            this.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
        }
        this.setMatrixWorld(this.matrixWorld.elements);
    }
    rotate(coordsStart, coordsMove) {
        this.yaw += (coordsStart[0] - coordsMove[0]) / 100.0;
        this.pitch += (coordsStart[1] - coordsMove[1]) / 100.0;
        this.pitch = clamp(this.pitch, -1.5 * Math.PI, -0.5 * Math.PI);
        const m = new matrix_1.Matrix4();
        m.rotate(new matrix_1.Vector3([1, 0, 0]), this.pitch);
        m.rotate(new matrix_1.Vector3([0, 1, 0]), -this.yaw);
        m.rotate(new matrix_1.Vector3([1, 0, 0]), 3.14159);
        m.multiply(this.matrixInitial);
        this.setMatrixWorld(m.elements);
    }
    zoom(value) {
        const v = value > this.z ? -value : value;
        this.setZ(this.matrixWorld.elements[14] + v * this.modelSize / 100);
        this.setMatrixWorld(this.matrixWorld.elements);
        this.z = value;
        this.updateNF();
    }
    updateNF() {
        if (this.props.isInitial) {
            const scale = Math.min(...this.matrixWorld.getScaling().elements);
            const modelSize = this.modelSize / scale;
            const cameraZ = Math.abs(this.matrixWorldInvert.elements[14]);
            const cameraProps = this.props.perspective || this.props.orthographic;
            cameraProps.znear = Math.max(cameraZ - modelSize, modelSize * 0.5);
            cameraProps.zfar = cameraZ + modelSize;
        }
        this.setProjection(utils_1.calculateProjection(this.props));
    }
}
exports.Camera = Camera;


/***/ }),

/***/ "./src/objects/geometry.ts":
/*!*********************************!*\
  !*** ./src/objects/geometry.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
const uniform_1 = __webpack_require__(/*! ./uniform */ "./src/objects/uniform.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const GeometryEnum = {
    POSITION: [0, 3],
    NORMAL: [1, 3],
    TEXCOORD_0: [2, 2],
    JOINTS_0: [3, 4],
    WEIGHTS_0: [4, 4],
    TANGENT: [5, 4],
    COLOR_0: [6, 4],
    TEXCOORD_1: [7, 2]
};
class Geometry {
    constructor(json, arrayBuffer, weights, draco, primitive) {
        this.boundingSphere = {
            center: new matrix_1.Vector3(),
            radius: null,
            min: null,
            max: null
        };
        this.uniformBuffer = null;
        this.UBO = null;
        this.VAO = null;
        this.indicesBuffer = null;
        this.attributes = null;
        this.targets = null;
        this.blend = null;
        this.uniforms = null;
        this.SKIN = null;
        this.targets = [];
        let indicesBuffer;
        const vertexBuffers = {};
        const indicesAccessor = json.accessors[primitive.indices];
        const vertexAccessor = new Map();
        for (const a in primitive.attributes) {
            vertexAccessor.set(a, json.accessors[primitive.attributes[a]]);
        }
        const boundingBox = {
            min: vertexAccessor.get('POSITION').min,
            max: vertexAccessor.get('POSITION').max
        };
        const compresedMesh = primitive.extensions && primitive.extensions.KHR_draco_mesh_compression;
        if (compresedMesh) {
            const { decoderModule, decodeDracoData, getArray } = draco;
            const bufferView = json.bufferViews[compresedMesh.bufferView];
            const decoder = new decoderModule.Decoder();
            const decodedGeometry = decodeDracoData(arrayBuffer[bufferView.buffer], decoder, bufferView.byteOffset, bufferView.byteLength);
            const numFaces = decodedGeometry.num_faces();
            const numPoints = decodedGeometry.num_points();
            for (const k of vertexAccessor.keys()) {
                const attribute = decoder.GetAttributeByUniqueId(decodedGeometry, compresedMesh.attributes[k]);
                const size = utils_1.getDataType(vertexAccessor.get(k).type);
                const [dracoArr, arr] = getArray(utils_1.getGlEnum(vertexAccessor.get(k).componentType), numPoints * size, decodedGeometry, attribute, decoder);
                for (let i = 0; i < numPoints * size; i += size) {
                    arr[i] = dracoArr.GetValue(i);
                    arr[i + 1] = dracoArr.GetValue(i + 1);
                    if (size > 2) {
                        arr[i + 2] = dracoArr.GetValue(i + 2);
                    }
                    if (size > 3) {
                        arr[i + 3] = dracoArr.GetValue(i + 3);
                    }
                }
                decoderModule.destroy(dracoArr);
                vertexBuffers[k] = arr;
            }
            {
                indicesBuffer = new Uint32Array(numFaces * 3);
                indicesBuffer.type = 'UNSIGNED_INT';
                const ia = new decoderModule.DracoUInt32Array();
                for (let i = 0; i < numFaces; ++i) {
                    decoder.GetFaceFromMesh(decodedGeometry, i, ia);
                    const index = i * 3;
                    indicesBuffer[index] = ia.GetValue(0);
                    indicesBuffer[index + 1] = ia.GetValue(1);
                    indicesBuffer[index + 2] = ia.GetValue(2);
                }
                decoderModule.destroy(ia);
            }
            decoderModule.destroy(decoder);
            decoderModule.destroy(decodedGeometry);
        }
        else {
            if (indicesAccessor) {
                const bufferView = json.bufferViews[indicesAccessor.bufferView];
                indicesBuffer = utils_1.buildArray(arrayBuffer[bufferView.buffer], indicesAccessor.componentType, utils_1.calculateOffset(bufferView.byteOffset, indicesAccessor.byteOffset), utils_1.getDataType(indicesAccessor.type) * indicesAccessor.count);
            }
            for (const k of vertexAccessor.keys()) {
                const accessor = vertexAccessor.get(k);
                const bufferView = json.bufferViews[accessor.bufferView];
                vertexBuffers[k] = utils_1.buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
            }
        }
        if (primitive.targets) {
            for (const target of primitive.targets) {
                const vertexAcc = {};
                for (const a in target) {
                    vertexAcc[a] = json.accessors[target[a]];
                    const accessor = vertexAcc[a];
                    const bufferView = json.bufferViews[accessor.bufferView];
                    vertexAcc[a] = utils_1.buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
                }
                this.targets.push(vertexAcc);
            }
            for (const k of vertexAccessor.keys()) {
                if (this.targets[0][k]) {
                    let offset = 0;
                    const geometry = vertexBuffers[k];
                    vertexBuffers[k] = new geometry.constructor(geometry.length);
                    for (let i = 0; i < vertexBuffers[k].length; i++) {
                        if (k === 'TANGENT' && (i + 1) % 4 === 0) {
                            offset++;
                            continue;
                        }
                        vertexBuffers[k][i] =
                            geometry[i] +
                                weights.reduce((a, b, index) => {
                                    return a + weights[index] * this.targets[index][k][i - offset];
                                }, 0);
                    }
                }
            }
        }
        for (const k of vertexAccessor.keys()) {
            const accessor = vertexAccessor.get(k);
            if (k === 'COLOR_0' && accessor.type === 'VEC3') {
                const temp = new vertexBuffers[k].constructor(accessor.count * 4);
                let j = 0;
                for (let i = 0; i < temp.length; i++) {
                    if ((i + 1) % 4 === 0) {
                        temp[i] = 1;
                    }
                    else {
                        temp[i] = vertexBuffers[k][j];
                        j++;
                    }
                }
                vertexBuffers[k] = temp;
            }
            if (accessor.sparse !== undefined) {
                const itemSize = utils_1.getDataType(accessor.type);
                const indicesBufferView = json.bufferViews[accessor.sparse.indices.bufferView];
                const valuesBufferView = json.bufferViews[accessor.sparse.values.bufferView];
                const sparseIndices = utils_1.buildArray(arrayBuffer[indicesBufferView.buffer], accessor.sparse.indices.componentType, utils_1.calculateOffset(indicesBufferView.byteOffset, accessor.sparse.indices.byteOffset), accessor.sparse.count);
                const sparseValues = utils_1.buildArray(arrayBuffer[valuesBufferView.buffer], accessor.componentType, utils_1.calculateOffset(valuesBufferView.byteOffset, accessor.byteOffset), utils_1.getDataType(accessor.type) * accessor.sparse.count);
                for (let i = 0, il = sparseIndices.length; i < il; i++) {
                    const index = sparseIndices[i];
                    vertexBuffers[k][index * itemSize] = sparseValues[i * itemSize];
                    if (itemSize >= 2) {
                        vertexBuffers[k][index * itemSize + 1] = sparseValues[i * itemSize + 1];
                    }
                    if (itemSize >= 3) {
                        vertexBuffers[k][index * itemSize + 2] = sparseValues[i * itemSize + 2];
                    }
                    if (itemSize >= 4) {
                        vertexBuffers[k][index * itemSize + 3] = sparseValues[i * itemSize + 3];
                    }
                }
            }
        }
        if (vertexBuffers.NORMAL === undefined && indicesBuffer) {
            vertexBuffers.NORMAL = utils_1.calculateNormals(indicesBuffer, vertexBuffers.POSITION);
            vertexAccessor.set('NORMAL', { componentType: 5126 });
        }
        if (vertexBuffers.TEXCOORD_0 === undefined && indicesBuffer) {
            vertexBuffers.TEXCOORD_0 = utils_1.calculateUVs(vertexBuffers.POSITION, vertexBuffers.NORMAL);
            vertexAccessor.set('TEXCOORD_0', { componentType: 5126 });
        }
        if (primitive.attributes.TANGENT === undefined && indicesBuffer) {
            vertexBuffers.TANGENT = utils_1.calculateBinormals(indicesBuffer, vertexBuffers.POSITION, vertexBuffers.NORMAL, vertexBuffers.TEXCOORD_0);
            vertexAccessor.set('TANGENT', { componentType: 5126 });
        }
        this.vertexAccessor = vertexAccessor;
        this.attributes = vertexBuffers;
        this.indicesBuffer = indicesBuffer;
        const { min, max } = boundingBox;
        this.boundingSphere.min = new matrix_1.Vector3(min);
        this.boundingSphere.max = new matrix_1.Vector3(max);
    }
    createGeometryForWebGl(gl) {
        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);
        for (const k in this.attributes) {
            const accessor = this.vertexAccessor.get(k);
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, this.attributes[k], gl.STATIC_DRAW);
            const index = GeometryEnum[k];
            gl.enableVertexAttribArray(index[0]);
            gl.vertexAttribPointer(index[0], index[1], accessor.componentType, false, 0, 0);
        }
        if (this.indicesBuffer) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer, gl.STATIC_DRAW);
        }
        this.VAO = VAO;
        gl.bindVertexArray(null);
    }
    calculateBounding(matrix) {
        this.boundingSphere.min.applyMatrix4(matrix);
        this.boundingSphere.max.applyMatrix4(matrix);
        const vertices = this.attributes.POSITION;
        let maxRadiusSq = 0;
        this.boundingSphere.center
            .add(this.boundingSphere.min)
            .add(this.boundingSphere.max)
            .scale(0.5);
        for (let i = 0; i < vertices.length; i = i + 3) {
            maxRadiusSq = Math.max(maxRadiusSq, this.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2]));
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    }
    updateUniforms(gl, program, matrixWorld, camera, light) {
        const normalMatrix = new matrix_1.Matrix4(matrixWorld);
        normalMatrix.invert().transpose();
        const uniformBuffer = new uniform_1.UniformBuffer();
        uniformBuffer.add('model', matrixWorld.elements);
        uniformBuffer.add('normalMatrix', normalMatrix.elements);
        uniformBuffer.add('view', camera.matrixWorldInvert.elements);
        uniformBuffer.add('projection', camera.projection.elements);
        uniformBuffer.add('light', light.matrixWorldInvert.elements);
        uniformBuffer.add('isShadow', 0);
        uniformBuffer.done();
        const uIndex = gl.getUniformBlockIndex(program, 'Matrices');
        gl.uniformBlockBinding(program, uIndex, 0);
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, uniformBuffer.store, gl.DYNAMIC_DRAW);
        this.UBO = UBO;
        this.uniformBuffer = uniformBuffer;
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    update(gl, geometry) {
        gl.bindVertexArray(this.VAO);
        for (const k in geometry) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, geometry[k], gl.STATIC_DRAW);
            const index = GeometryEnum[k];
            gl.enableVertexAttribArray(index[0]);
            gl.vertexAttribPointer(index[0], index[1], gl[utils_1.ArrayBufferMap.get(this.attributes[k].constructor)], false, 0, 0);
        }
        gl.bindVertexArray(null);
    }
}
exports.Geometry = Geometry;


/***/ }),

/***/ "./src/objects/index.ts":
/*!******************************!*\
  !*** ./src/objects/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const scene_1 = __webpack_require__(/*! ./scene */ "./src/objects/scene.ts");
exports.Scene = scene_1.Scene;
const mesh_1 = __webpack_require__(/*! ./mesh */ "./src/objects/mesh.ts");
exports.Mesh = mesh_1.Mesh;
exports.SkinnedMesh = mesh_1.SkinnedMesh;
exports.Bone = mesh_1.Bone;
const object3d_1 = __webpack_require__(/*! ./object3d */ "./src/objects/object3d.ts");
exports.Object3D = object3d_1.Object3D;
const camera_1 = __webpack_require__(/*! ./camera */ "./src/objects/camera.ts");
exports.Camera = camera_1.Camera;
const light_1 = __webpack_require__(/*! ./light */ "./src/objects/light.ts");
exports.Light = light_1.Light;
const uniform_1 = __webpack_require__(/*! ./uniform */ "./src/objects/uniform.ts");
exports.UniformBuffer = uniform_1.UniformBuffer;
const material_1 = __webpack_require__(/*! ./material */ "./src/objects/material.ts");
exports.Material = material_1.Material;


/***/ }),

/***/ "./src/objects/light.ts":
/*!******************************!*\
  !*** ./src/objects/light.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
const object3d_1 = __webpack_require__(/*! ./object3d */ "./src/objects/object3d.ts");
class Light extends object3d_1.Object3D {
    constructor(props, name, parent) {
        super(name, parent);
        const { type, color, intensity, isInitial, spot = {} } = props;
        this.type = type;
        this.color = new matrix_1.Vector3(color);
        this.intensity = intensity;
        this.isInitial = isInitial;
        this.spot = spot;
        this.matrixWorldInvert = new matrix_1.Matrix4();
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
        if (this.isInitial || this.type === 'directional') {
            const camMatrix = new matrix_1.Matrix4();
            camMatrix.makeRotationAxis(new matrix_1.Vector3([0, 1, 0]), v);
            camMatrix.multiply(this.matrix);
            this.setMatrixWorld(camMatrix.elements);
        }
    }
}
exports.Light = Light;


/***/ }),

/***/ "./src/objects/material.ts":
/*!*********************************!*\
  !*** ./src/objects/material.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
const uniform_1 = __webpack_require__(/*! ./uniform */ "./src/objects/uniform.ts");
const GLTF_1 = __webpack_require__(/*! ../../GLTF */ "./GLTF.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const defaultMaterial = {
    baseColorFactor: [1, 0, 0, 1]
};
const lightEnum = {
    directional: 0,
    point: 1,
    spot: 2
};
class Material extends GLTF_1.Material {
    constructor(m = defaultMaterial, textures, defines, lights) {
        super();
        const material = Object.assign({}, m);
        this.defines = defines;
        if (!material.pbrMetallicRoughness && material.extensions && material.extensions.KHR_materials_pbrSpecularGlossiness) {
            material.pbrMetallicRoughness = {};
            const SG = material.extensions.KHR_materials_pbrSpecularGlossiness;
            material.pbrMetallicRoughness.baseColorTexture = SG.diffuseTexture;
            material.pbrMetallicRoughness.metallicRoughnessTexture = SG.specularGlossinessTexture;
            material.pbrMetallicRoughness.baseColorFactor = SG.diffuseFactor;
            material.pbrMetallicRoughness.specularFactor = SG.specularFactor;
            material.pbrMetallicRoughness.glossinessFactor = SG.glossinessFactor;
            defines.push({ name: 'SPECULARGLOSSINESSMAP' });
        }
        if (material.extensions && material.extensions.KHR_materials_clearcoat) {
            const cl = material.extensions.KHR_materials_clearcoat;
            this.clearcoatFactor = cl.clearcoatFactor;
            this.clearcoatRoughnessFactor = cl.clearcoatRoughnessFactor;
            if (cl.clearcoatTexture) {
                this.clearcoatTexture = textures[cl.clearcoatTexture.index];
                defines.push({ name: 'CLEARCOATMAP' });
            }
            if (cl.clearcoatNormalTexture) {
                this.clearcoatNormalTexture = textures[cl.clearcoatNormalTexture.index];
                defines.push({ name: 'CLEARCOATNORMALMAP' });
            }
            if (cl.clearcoatRoughnessTexture) {
                this.clearcoatRoughnessTexture = textures[cl.clearcoatRoughnessTexture.index];
                defines.push({ name: 'CLEARCOATROUGHMAP' });
            }
        }
        if (material.extensions && material.extensions.KHR_materials_sheen) {
            const { intensityFactor, colorFactor, sheenRoughnessFactor, colorIntensityTexture } = material.extensions.KHR_materials_sheen;
            this.sheenFactor = intensityFactor;
            this.sheenColorFactor = colorFactor;
            this.sheenRoughnessFactor = sheenRoughnessFactor;
            if (colorIntensityTexture) {
                this.sheenTexture = textures[colorIntensityTexture.index];
                defines.push({ name: 'SHEENMAP' });
            }
        }
        this.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            clearcoatTexture: null,
            clearcoatRoughnessTexture: null,
            sheenTexture: null,
            clearcoatNormalTexture: null,
            emissiveTexture: null,
            prefilterMap: null,
            brdfLUT: null,
            irradianceMap: null,
            depthTexture: null
        };
        const pbrMetallicRoughness = material.pbrMetallicRoughness;
        if (pbrMetallicRoughness) {
            this.baseColorFactor = pbrMetallicRoughness.baseColorFactor;
            this.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
            this.metallicFactor = pbrMetallicRoughness.metallicFactor;
            this.specularFactor = pbrMetallicRoughness.specularFactor;
            this.glossinessFactor = pbrMetallicRoughness.glossinessFactor;
        }
        this.alpha = material.alphaMode === 'BLEND';
        this.blend = material.blend;
        this.doubleSided = material.doubleSided;
        this.emissiveFactor = material.emissiveFactor;
        this.extras = material.extras;
        if (pbrMetallicRoughness && pbrMetallicRoughness.metallicRoughnessTexture) {
            this.metallicRoughnessTexture = textures[pbrMetallicRoughness.metallicRoughnessTexture.index];
            defines.push({ name: 'METALROUGHNESSMAP' });
        }
        if (material.normalTexture) {
            this.normalTexture = textures[material.normalTexture.index];
            defines.push({ name: 'NORMALMAP' });
        }
        if (material.occlusionTexture) {
            this.occlusionTexture = textures[material.occlusionTexture.index];
            defines.push({ name: 'OCCLUSIONMAP' });
        }
        if (pbrMetallicRoughness && pbrMetallicRoughness.baseColorTexture) {
            const { extensions } = pbrMetallicRoughness.baseColorTexture;
            this.baseColorTexture = textures[pbrMetallicRoughness.baseColorTexture.index];
            defines.push({ name: 'BASECOLORTEXTURE' });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    const translation = ex.offset && new matrix_1.Matrix3().set([1, 0, 0, 0, 1, 0, ex.offset[0], ex.offset[1], 1]);
                    const rotation = ex.rotation &&
                        new matrix_1.Matrix3().set([
                            -Math.sin(ex.rotation),
                            Math.cos(ex.rotation),
                            0,
                            Math.cos(ex.rotation),
                            Math.sin(ex.rotation),
                            0,
                            0,
                            0,
                            1
                        ]);
                    const scale = ex.scale && new matrix_1.Matrix3().set([ex.scale[0], 0, 0, 0, ex.scale[1], 0, 0, 0, 1]);
                    const matrix = new matrix_1.Matrix3();
                    if (scale) {
                        matrix.multiply(scale);
                    }
                    if (rotation) {
                        matrix.multiply(rotation);
                    }
                    if (translation) {
                        matrix.multiply(translation);
                    }
                    this.matrix = matrix;
                    defines.push({ name: 'TEXTURE_TRANSFORM' });
                }
            }
        }
        if (material.emissiveTexture) {
            const { texCoord } = material.emissiveTexture;
            this.emissiveTexture = textures[material.emissiveTexture.index];
            defines.push({ name: 'EMISSIVEMAP', value: texCoord ? 2 : 1 });
        }
        if (material.alphaMode === 'MASK') {
            defines.push({
                name: 'ALPHATEST',
                value: material.alphaCutoff || 0.5
            });
        }
        else if (material.alphaMode === 'BLEND') {
            defines.push({ name: 'ALPHATEST', value: 0.01 });
        }
        if (this.doubleSided) {
            defines.push({ name: 'DOUBLESIDED' });
        }
        defines.push({ name: 'LIGHTNUMBER', value: lights.length });
        if (material.extensions && material.extensions.KHR_materials_unlit) {
            defines.push({ name: 'NOLIGHT' });
        }
    }
    setHarmonics(sphericalHarmonics) {
        this.sphericalHarmonics = sphericalHarmonics;
    }
    createUniforms(gl, program) {
        gl.useProgram(program);
        if (this.baseColorTexture) {
            this.uniforms.baseColorTexture = gl.getUniformLocation(program, 'baseColorTexture');
            gl.uniform1i(this.uniforms.baseColorTexture, utils_1.textureEnum.baseColorTexture);
        }
        if (this.metallicRoughnessTexture) {
            this.uniforms.metallicRoughnessTexture = gl.getUniformLocation(program, 'metallicRoughnessTexture');
            gl.uniform1i(this.uniforms.metallicRoughnessTexture, utils_1.textureEnum.metallicRoughnessTexture);
        }
        if (this.normalTexture) {
            this.uniforms.normalTexture = gl.getUniformLocation(program, 'normalTexture');
            gl.uniform1i(this.uniforms.normalTexture, utils_1.textureEnum.normalTexture);
        }
        if (this.occlusionTexture) {
            this.uniforms.occlusionTexture = gl.getUniformLocation(program, 'occlusionTexture');
            gl.uniform1i(this.uniforms.occlusionTexture, utils_1.textureEnum.occlusionTexture);
        }
        if (this.emissiveTexture) {
            this.uniforms.emissiveTexture = gl.getUniformLocation(program, 'emissiveTexture');
            gl.uniform1i(this.uniforms.emissiveTexture, utils_1.textureEnum.emissiveTexture);
        }
        if (this.clearcoatTexture) {
            this.uniforms.clearcoatTexture = gl.getUniformLocation(program, 'clearcoatTexture');
            gl.uniform1i(this.uniforms.clearcoatTexture, utils_1.textureEnum.clearcoatTexture);
        }
        if (this.clearcoatRoughnessTexture) {
            this.uniforms.clearcoatRoughnessTexture = gl.getUniformLocation(program, 'clearcoatRoughnessTexture');
            gl.uniform1i(this.uniforms.clearcoatRoughnessTexture, utils_1.textureEnum.clearcoatRoughnessTexture);
        }
        if (this.clearcoatNormalTexture) {
            this.uniforms.clearcoatNormalTexture = gl.getUniformLocation(program, 'clearcoatNormalTexture');
            gl.uniform1i(this.uniforms.clearcoatNormalTexture, utils_1.textureEnum.clearcoatNormalTexture);
        }
        if (this.sheenTexture) {
            this.uniforms.sheenTexture = gl.getUniformLocation(program, 'sheenTexture');
            gl.uniform1i(this.uniforms.sheenTexture, utils_1.textureEnum.sheenTexture);
        }
        this.uniforms.prefilterMap = gl.getUniformLocation(program, 'prefilterMap');
        this.uniforms.brdfLUT = gl.getUniformLocation(program, 'brdfLUT');
        this.uniforms.irradianceMap = gl.getUniformLocation(program, 'irradianceMap');
        this.uniforms.depthTexture = gl.getUniformLocation(program, 'depthTexture');
        gl.uniform1i(this.uniforms.prefilterMap, utils_1.textureEnum.prefilterTexture);
        gl.uniform1i(this.uniforms.brdfLUT, utils_1.textureEnum.brdfLUTTexture);
        gl.uniform1i(this.uniforms.irradianceMap, utils_1.textureEnum.irradianceTexture);
    }
    updateUniforms(gl, program, camera, lights) {
        const spotDirs = new Float32Array(lights.length * 3);
        const lightPos = new Float32Array(lights.length * 3);
        const lightColor = new Float32Array(lights.length * 3);
        const lightProps = new Float32Array(lights.length * 4);
        lights.forEach((light, i) => {
            spotDirs.set(new matrix_1.Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize()
                .elements, i * 3);
            lightPos.set(light.getPosition(), i * 3);
            lightColor.set(light.color.elements, i * 3);
            lightProps.set([light.intensity, light.spot.innerConeAngle || 0, light.spot.outerConeAngle || 0, lightEnum[light.type]], i * 4);
        });
        {
            const materialUniformBuffer = new uniform_1.UniformBuffer();
            materialUniformBuffer.add('baseColorFactor', this.baseColorFactor || [0.8, 0.8, 0.8, 1.0]);
            materialUniformBuffer.add('viewPos', camera.getPosition());
            materialUniformBuffer.add('textureMatrix', (this.matrix && this.matrix.elements) || new matrix_1.Matrix3().elements);
            materialUniformBuffer.add('specularFactor', this.specularFactor || [0, 0, 0]);
            materialUniformBuffer.add('emissiveFactor', this.emissiveFactor || [0, 0, 0]);
            materialUniformBuffer.add('glossinessFactor', this.glossinessFactor || 0.5);
            materialUniformBuffer.add('metallicFactor', this.metallicFactor || 1);
            materialUniformBuffer.add('roughnessFactor', this.roughnessFactor || 1);
            materialUniformBuffer.add('clearcoatFactor', this.clearcoatFactor || 0);
            materialUniformBuffer.add('clearcoatRoughnessFactor', this.clearcoatRoughnessFactor || 0);
            materialUniformBuffer.add('sheenColorFactor', this.sheenColorFactor || 0);
            materialUniformBuffer.add('sheenFactor', this.sheenFactor || 0);
            materialUniformBuffer.add('sheenRoughnessFactor', this.sheenRoughnessFactor || 0);
            materialUniformBuffer.done();
            const mIndex = gl.getUniformBlockIndex(program, 'Material');
            gl.uniformBlockBinding(program, mIndex, 1);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.UBO = mUBO;
            this.uniformBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new uniform_1.UniformBuffer();
            materialUniformBuffer.add('lightColor', lightColor);
            materialUniformBuffer.done();
            const mIndex = gl.getUniformBlockIndex(program, 'LightColor');
            gl.uniformBlockBinding(program, mIndex, 3);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO1 = mUBO;
            this.lightUniformBuffer1 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new uniform_1.UniformBuffer();
            materialUniformBuffer.add('lightPos', lightPos);
            materialUniformBuffer.done();
            const mIndex = gl.getUniformBlockIndex(program, 'LightPos');
            gl.uniformBlockBinding(program, mIndex, 4);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO2 = mUBO;
            this.lightUniformBuffer2 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new uniform_1.UniformBuffer();
            materialUniformBuffer.add('spotdir', spotDirs);
            materialUniformBuffer.done();
            const mIndex = gl.getUniformBlockIndex(program, 'Spotdir');
            gl.uniformBlockBinding(program, mIndex, 5);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO3 = mUBO;
            this.lightUniformBuffer3 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new uniform_1.UniformBuffer();
            materialUniformBuffer.add('lightIntensity', lightProps);
            materialUniformBuffer.done();
            const mIndex = gl.getUniformBlockIndex(program, 'LightIntensity');
            gl.uniformBlockBinding(program, mIndex, 6);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO4 = mUBO;
            this.lightUniformBuffer4 = materialUniformBuffer;
        }
    }
    hasNormal() {
        return Boolean(this.normalTexture) || Boolean(this.clearcoatNormalTexture);
    }
}
exports.Material = Material;


/***/ }),

/***/ "./src/objects/mesh.ts":
/*!*****************************!*\
  !*** ./src/objects/mesh.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
const object3d_1 = __webpack_require__(/*! ./object3d */ "./src/objects/object3d.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
class Mesh extends object3d_1.Object3D {
    constructor(name, parent) {
        super(name, parent);
        this.program = null;
        this.defines = null;
        this.mode = 4;
    }
    setDefines(defines) {
        this.defines = defines;
    }
    setBlend(value) {
        this.material.blend = value;
    }
    setMaterial(material) {
        this.material = material;
    }
    draw(gl, { lights, camera, light, needUpdateView, needUpdateProjection, preDepthTexture, isprepender, fakeDepth }) {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.geometry.VAO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.geometry.UBO);
        if (this.reflow) {
            // matrixWorld changed
            const normalMatrix = new matrix_1.Matrix4(this.matrixWorld);
            normalMatrix.invert().transpose();
            this.geometry.uniformBuffer.update(gl, 'model', this.matrixWorld.elements);
            this.geometry.uniformBuffer.update(gl, 'normalMatrix', normalMatrix.elements);
        }
        if (needUpdateView) {
            this.geometry.uniformBuffer.update(gl, 'view', camera.matrixWorldInvert.elements);
            this.geometry.uniformBuffer.update(gl, 'light', light.matrixWorldInvert.elements);
        }
        if (needUpdateProjection) {
            this.geometry.uniformBuffer.update(gl, 'projection', camera.projection.elements);
        }
        this.geometry.uniformBuffer.update(gl, 'isShadow', isprepender ? 1 : 0);
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
                const lightPos = new Float32Array(lights.length * 3);
                lights.forEach((light, i) => {
                    lightPos.set(light.getPosition(), i * 3);
                });
                this.material.uniformBuffer.update(gl, 'viewPos', camera.getPosition());
                gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
                this.material.lightUniformBuffer2.update(gl, 'lightPos', lightPos);
            }
        }
        if (this.material.lightUBO1) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, this.material.lightUBO1);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 5, this.material.lightUBO3);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 6, this.material.lightUBO4);
        }
        if (this.material.sphericalHarmonics) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 7, this.material.sphericalHarmonics);
        }
        gl.uniform1i(this.material.uniforms.depthTexture, (preDepthTexture && !isprepender) ? preDepthTexture.index : fakeDepth.index);
        if (this.material.baseColorTexture) {
            gl.activeTexture(gl[`TEXTURE${0}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.baseColorTexture);
            gl.bindSampler(0, this.material.baseColorTexture.sampler);
        }
        if (this.material.metallicRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${1}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.metallicRoughnessTexture);
            gl.bindSampler(1, this.material.metallicRoughnessTexture.sampler);
        }
        if (this.material.normalTexture) {
            gl.activeTexture(gl[`TEXTURE${2}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.normalTexture);
            gl.bindSampler(2, this.material.normalTexture.sampler);
        }
        if (this.material.occlusionTexture) {
            gl.activeTexture(gl[`TEXTURE${3}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.occlusionTexture);
            gl.bindSampler(3, this.material.occlusionTexture.sampler);
        }
        if (this.material.emissiveTexture) {
            gl.activeTexture(gl[`TEXTURE${4}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.emissiveTexture);
            gl.bindSampler(4, this.material.emissiveTexture.sampler);
        }
        if (this.material.clearcoatTexture) {
            gl.activeTexture(gl[`TEXTURE${8}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatTexture);
            gl.bindSampler(8, this.material.clearcoatTexture.sampler);
        }
        if (this.material.clearcoatRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${9}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatRoughnessTexture);
            gl.bindSampler(8, this.material.clearcoatRoughnessTexture.sampler);
        }
        if (this.material.sheenTexture) {
            gl.activeTexture(gl[`TEXTURE${11}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.sheenTexture);
            gl.bindSampler(8, this.material.sheenTexture.sampler);
        }
        if (this.material.clearcoatNormalTexture) {
            gl.activeTexture(gl[`TEXTURE${10}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatNormalTexture);
            gl.bindSampler(8, this.material.clearcoatNormalTexture.sampler);
        }
        if (this.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }
        if (this.geometry.indicesBuffer) {
            gl.drawElements(this.mode, this.geometry.indicesBuffer.length, gl[utils_1.ArrayBufferMap.get(this.geometry.indicesBuffer.constructor)], 0);
        }
        else {
            gl.drawArrays(this.mode, 0, this.geometry.attributes.POSITION.length / 3);
        }
        if (this.material.doubleSided) {
            gl.enable(gl.CULL_FACE);
        }
    }
    setGeometry(geometry) {
        this.geometry = geometry;
    }
    setProgram(value) {
        this.program = value;
    }
    setMode(value = 4) {
        this.mode = value;
    }
    isVisible(planes) {
        const c = new matrix_1.Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
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
    calculateBounding() {
        this.geometry.calculateBounding(this.matrixWorld);
    }
}
exports.Mesh = Mesh;
class SkinnedMesh extends Mesh {
    constructor(name, parent) {
        super(name, parent);
    }
    setSkin(gl, skin) {
        this.bones = skin.bones;
        this.boneInverses = skin.boneInverses;
        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
            matrices.set(j.elements, 0 + 16 * i);
            i++;
        }
        const uIndex = gl.getUniformBlockIndex(this.program, 'Skin');
        gl.uniformBlockBinding(this.program, uIndex, 2);
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
        this.geometry.SKIN = UBO;
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        return this;
    }
    getJointMatrix() {
        const m = new matrix_1.Matrix4(this.matrixWorld).invert();
        const resArray = [];
        for (let mi = 0; mi < this.boneInverses.length; mi++) {
            const res = new matrix_1.Matrix4()
                .multiply(m)
                .multiply(this.bones[mi].matrixWorld)
                .multiply(this.boneInverses[mi]);
            resArray.push(res);
        }
        return resArray;
    }
}
exports.SkinnedMesh = SkinnedMesh;
class Bone extends object3d_1.Object3D {
}
exports.Bone = Bone;


/***/ }),

/***/ "./src/objects/object3d.ts":
/*!*********************************!*\
  !*** ./src/objects/object3d.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
class Object3D {
    constructor(name, parent) {
        this.uuid = Math.floor(Date.now() * Math.random());
        this.name = name;
        this.children = [];
        this.matrix = new matrix_1.Matrix4();
        this.matrixWorld = new matrix_1.Matrix4();
        this.parent = parent;
    }
    getPosition() {
        return new Float32Array([this.matrixWorld.elements[12], this.matrixWorld.elements[13], this.matrixWorld.elements[14]]);
    }
    setPosition(translation, rotation, scale) {
        if (rotation) {
            this.matrix.makeRotationFromQuaternion(rotation);
        }
        if (scale) {
            this.matrix.scale(new matrix_1.Vector3(scale));
        }
        if (translation) {
            this.matrix.setTranslate(new matrix_1.Vector3(translation));
        }
    }
    setMatrix(matrix) {
        this.matrix.set(matrix);
    }
    setMatrixWorld(matrix) {
        this.matrixWorld.set(matrix);
    }
    updateMatrix() {
        const m = new matrix_1.Matrix4();
        m.multiply(this.parent.matrixWorld);
        m.multiply(this.matrix);
        this.setMatrixWorld(m.elements);
    }
}
exports.Object3D = Object3D;


/***/ }),

/***/ "./src/objects/scene.ts":
/*!******************************!*\
  !*** ./src/objects/scene.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ../matrix */ "./src/matrix.ts");
class Scene {
    constructor() {
        this.opaqueChildren = [];
        this.transparentChildren = [];
        this.meshes = [];
        this.children = [];
        this.bin = [];
        this.matrixWorld = new matrix_1.Matrix4();
        this.matrix = new matrix_1.Matrix4();
    }
}
exports.Scene = Scene;


/***/ }),

/***/ "./src/objects/uniform.ts":
/*!********************************!*\
  !*** ./src/objects/uniform.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UniformBuffer {
    constructor() {
        this.map = new Map();
        this.tempStore = {};
        this.offset = 0;
    }
    getBuffer(v) {
        const { length } = v;
        if (length === 3) {
            return new Float32Array([v[0], v[1], v[2], 0]);
        }
        if (length === 9) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0]);
        }
        if (length === 12) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0, v[9], v[10], v[11], 0]);
        }
        if (length === 6) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0]);
        }
        return v;
    }
    add(name, value) {
        if (value.length === undefined) {
            value = [value];
        }
        this.map.set(name, this.offset);
        const buffer = this.getBuffer(value);
        this.tempStore[name] = buffer;
        this.offset += Math.max(buffer.length, 4);
    }
    update(gl, name, value) {
        if (value.length === undefined) {
            value = new Float32Array([value]);
        }
        const offset = this.map.get(name);
        const buffer = this.getBuffer(value);
        this.store.set(buffer, offset);
        gl.bufferSubData(gl.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, buffer);
    }
    done() {
        this.store = new Float32Array(this.offset);
        for (const [name, offset] of this.map) {
            this.store.set(this.tempStore[name], offset);
        }
        this.tempStore = null;
    }
}
exports.UniformBuffer = UniformBuffer;


/***/ }),

/***/ "./src/parse.ts":
/*!**********************!*\
  !*** ./src/parse.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
const index_1 = __webpack_require__(/*! ./objects/index */ "./src/objects/index.ts");
const matrix_1 = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");
const fetch_1 = __webpack_require__(/*! ./fetch */ "./src/fetch.ts");
const vertex_glsl_1 = __webpack_require__(/*! ./shaders/vertex.glsl */ "./src/shaders/vertex.glsl");
const fragment_glsl_1 = __webpack_require__(/*! ./shaders/fragment.glsl */ "./src/shaders/fragment.glsl");
const geometry_1 = __webpack_require__(/*! ./objects/geometry */ "./src/objects/geometry.ts");
let gl;
const BASE64_MARKER = ';base64,';
class Parse {
    constructor(url, defines, resize) {
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.tracks = [];
        this.duration = 0;
        this.skins = [];
        this.textures = null;
        this.samplers = null;
        this.arrayBuffer = null;
        this.cameras = [];
        this.lights = [];
        this.programs = {};
        this.defines = defines;
        this.resize = resize;
    }
    setScene(scene) {
        this.scene = scene;
    }
    setGl(g) {
        gl = g;
    }
    setCamera(camera) {
        this.camera = camera;
    }
    setLight(light) {
        this.light = light;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    getBuffer() {
        return Promise.all(this.scene.bin.map(url => {
            if (typeof url === 'string') {
                if (/base64/.test(url)) {
                    const base64Index = url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                    const base64 = url.substring(base64Index);
                    const raw = window.atob(base64);
                    const buffer = new ArrayBuffer(raw.length);
                    const array = new Uint8Array(buffer);
                    for (let i = 0; i < raw.length; i++) {
                        array[i] = raw.charCodeAt(i);
                    }
                    return buffer;
                }
                else {
                    return fetch_1.fetchBinary(`${this.host}${url}`) /*.then(res => res.arrayBuffer())*/;
                }
            }
            else {
                return Promise.resolve(url);
            }
        })).then(buffers => {
            this.arrayBuffer = buffers;
        });
    }
    createProgram(defines) {
        let program;
        const programHash = defines.map(define => `${define.name}${define.value || 1}`).join('');
        if (this.programs[programHash]) {
            program = this.programs[programHash];
        }
        else {
            const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
            program = utils_1.createProgram(vertex_glsl_1.default.replace(/\n/, `\n${defineStr}`), fragment_glsl_1.default.replace(/\n/, `\n${defineStr}`));
            this.programs[programHash] = program;
        }
        return program;
    }
    buildPrim(parent, name, skin, weights, primitive) {
        const m = this.json.materials && this.json.materials[primitive.material];
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            this.defines.push({ name: 'SPHERICAL_HARMONICS' });
        }
        const defines = [...this.defines];
        const material = new index_1.Material(m, this.textures, defines, this.lights);
        if (skin !== undefined) {
            defines.push({
                name: 'JOINTNUMBER',
                value: this.skins[skin].jointNames.length
            });
        }
        if (primitive.attributes.TANGENT || material.hasNormal()) {
            defines.push({ name: 'TANGENT' });
        }
        const mesh = skin !== undefined ? new index_1.SkinnedMesh(name, parent) : new index_1.Mesh(name, parent);
        const geometry = new geometry_1.Geometry(this.json, this.arrayBuffer, weights, this.draco, primitive);
        if (geometry.attributes.COLOR_0 && geometry.attributes.COLOR_0.constructor !== Float32Array) {
            defines.push({ name: 'COLOR_255' });
        }
        mesh.setMode(primitive.mode);
        mesh.setMaterial(material);
        mesh.setGeometry(geometry);
        mesh.setDefines(material.defines);
        if (mesh instanceof index_1.SkinnedMesh) {
            mesh.skin = skin;
        }
        mesh.updateMatrix();
        mesh.calculateBounding();
        return mesh;
    }
    buildNode(parent, name) {
        const el = this.json.nodes[name];
        let child;
        if (el.camera !== undefined) {
            const camera = Object.assign({
                zoom: 1,
                aspect: this.canvas ? (this.canvas.offsetWidth / this.canvas.offsetHeight) : 1
            }, this.json.cameras[el.camera]);
            // @ts-ignore
            if (Parse.__update) {
                // @ts-ignore
                Parse.__update('camera', camera, name, parent);
            }
            else {
                this.camera = new index_1.Camera(camera, name, parent);
            }
            child = this.camera;
            const proj = utils_1.calculateProjection(child.props);
            child.setProjection(proj);
            this.cameras.push(child);
        }
        else if (el.extensions && el.extensions.KHR_lights_punctual) {
            const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
            light.isInitial = false;
            // @ts-ignore
            if (Parse.__update) {
                // @ts-ignore
                Parse.__update('light', light, name, parent);
            }
            else {
                this.light = new index_1.Light(light, name, parent);
            }
            child = this.light;
            this.lights.push(child);
        }
        else {
            if (el.isBone !== undefined) {
                child = new index_1.Bone(name, parent);
            }
            else {
                child = new index_1.Object3D(name, parent);
            }
        }
        if (el.translation || el.rotation || el.scale) {
            child.setPosition(el.translation, el.rotation, el.scale);
        }
        else if (el.matrix) {
            child.setMatrix(el.matrix);
        }
        child.updateMatrix();
        child.id = el.name;
        parent.children.push(child);
        parent = child;
        if (el.mesh !== undefined) {
            parent.children.push(...this.json.meshes[el.mesh].primitives.map(this.buildPrim.bind(this, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights)));
        }
        if (el.children && el.children.length) {
            el.children.forEach(this.buildNode.bind(this, parent));
        }
    }
    calculateFov(isInitial) {
        const box = new matrix_1.Box();
        utils_1.walk(this.scene, node => {
            if (node instanceof index_1.Mesh) {
                box.expand(node.geometry.boundingSphere);
            }
        });
        const size = box.getSize();
        if (isInitial) {
            const center = new matrix_1.Vector3()
                .add(box.min)
                .add(box.max)
                .scale(0.5);
            const matrix = new matrix_1.Matrix4;
            matrix.translate(center.x, center.y, center.z);
            matrix.invert();
            this.scene.matrixWorld.multiply(matrix);
            utils_1.walk(this.scene, node => {
                if (node instanceof index_1.Object3D) {
                    node.updateMatrix();
                }
            });
        }
        this.cameras.forEach(c => {
            c.modelSize = size;
        });
        this.resize();
    }
    async buildMesh() {
        if (this.json.extensionsUsed && this.json.extensionsUsed.includes('KHR_draco_mesh_compression')) {
            this.draco = await Promise.resolve().then(() => __webpack_require__(/*! ./decoder */ "./src/decoder.ts"));
            await this.draco.DecoderModule;
        }
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
        });
        if (this.lights.length === 0 && this.light) {
            this.lights.push(this.light);
        }
        this.json.scenes[this.json.scene !== undefined ? this.json.scene : 0].nodes.forEach(n => {
            if (this.json.nodes[n].children && this.json.nodes[n].children.length && !this.json.nodes[n].extensions) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes[n].mesh !== undefined) {
                this.buildNode(this.scene, n);
            }
            if (this.json.nodes[n].camera !== undefined) {
                this.buildNode(this.scene, n);
            }
        });
        utils_1.walk(this.scene, mesh => {
            if (mesh instanceof index_1.Mesh) {
                if (mesh.material.alpha) {
                    this.scene.transparentChildren.push(mesh);
                }
                else {
                    this.scene.opaqueChildren.push(mesh);
                }
                this.scene.meshes.push(mesh);
            }
        });
        this.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
        this.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
    }
    buildAnimation() {
        if (!this.json.animations) {
            return true;
        }
        for (const animation of this.json.animations) {
            const tracks = [];
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
                    const inputArray = utils_1.buildArray(this.arrayBuffer[inputBuffer.buffer], inputAccessor.componentType, utils_1.calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset), utils_1.getDataType(inputAccessor.type) * inputAccessor.count);
                    const outputArray = utils_1.buildArray(this.arrayBuffer[outputBuffer.buffer], outputAccessor.componentType, utils_1.calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset), utils_1.getDataType(outputAccessor.type) * outputAccessor.count);
                    const meshes = [];
                    utils_1.walk(this.scene, node => {
                        if (node.name === name) {
                            if (target.path === 'weights' && node instanceof index_1.Object3D) {
                                // eslint-disable-next-line
                                node = node.children[0];
                            }
                            meshes.push(node);
                        }
                    });
                    let component = utils_1.getAnimationComponent(target.path) || meshes[0].geometry.targets.length;
                    if (sampler.interpolation === 'CUBICSPLINE') {
                        component = component * 3;
                    }
                    const keys = [];
                    for (let i = 0; i < inputArray.length; i++) {
                        const firstT = inputArray[i];
                        const firstV = outputArray.slice(i * component, (i + 1) * component);
                        keys.push({
                            time: firstT,
                            value: utils_1.normalize(firstV)
                        });
                    }
                    if (keys.length >= 2) {
                        this.duration = Math.max(keys[keys.length - 1].time, this.duration);
                        if (meshes.length) {
                            tracks.push({
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
            this.tracks.push(tracks);
        }
    }
    buildSkin() {
        if (!this.json.skins) {
            return true;
        }
        for (const skin of this.json.skins) {
            const acc = this.json.accessors[skin.inverseBindMatrices];
            const buffer = this.json.bufferViews[acc.bufferView];
            const array = utils_1.buildArray(this.arrayBuffer[buffer.buffer], acc.componentType, utils_1.calculateOffset(buffer.byteOffset, acc.byteOffset), utils_1.getDataType(acc.type) * acc.count);
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
                const mat = new matrix_1.Matrix4().set(m.slice(i * 16, (i + 1) * 16));
                v.boneInverses.push(mat);
                i++;
            }
            this.skins.push(v);
        }
    }
    getJson() {
        if (/glb/.test(this.url)) {
            return fetch_1.fetchBinary(this.url)
                .then((b) => {
                const decoder = new TextDecoder('utf-8');
                const [jsonLength] = new Uint32Array(b, 12, 1);
                const jsonBuffer = new Uint8Array(b, 20, jsonLength);
                const json = JSON.parse(decoder.decode(jsonBuffer));
                const [bufferLength] = new Uint32Array(b, 20 + jsonLength, 1);
                const buffer = b.slice(28 + jsonLength, 28 + jsonLength + bufferLength);
                this.json = json;
                this.scene.bin.push(buffer);
            });
        }
        else {
            return fetch_1.fetch(this.url)
                // .then(res => res.json())
                .then((json) => {
                for (const key in json.buffers) {
                    this.scene.bin.push(json.buffers[key].uri);
                }
                this.json = json;
                return true;
            });
        }
    }
    createTextures() {
        const samplers = this.json.samplers || [{}];
        this.samplers = samplers.map(s => {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, s.minFilter || 9986);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, s.magFilter || 9729);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, s.wrapS || 10497);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, s.wrapT || 10497);
            return sampler;
        });
        this.scene.meshes.forEach((mesh) => {
            const textureTypes = ['baseColorTexture', 'metallicRoughnessTexture', 'emissiveTexture', 'normalTexture', 'occlusionTexture', 'clearcoatTexture', 'clearcoatRoughnessTexture', 'clearcoatNormalTexture', 'sheenTexture'];
            for (let i = 0; i < textureTypes.length; i++) {
                const textureType = textureTypes[i];
                const t = mesh.material[textureType];
                if (!t) {
                    continue;
                }
                const sampler = this.samplers[t.sampler !== undefined ? t.sampler : 0];
                mesh.material[textureType] = this.handleTextureLoaded(sampler, t.image, t.name);
            }
        });
    }
    initTextures() {
        if (!this.json.textures) {
            return true;
        }
        const texturesMap = {};
        this.json.textures.forEach(t => {
            const name = String(t.sampler) + String(t.source);
            texturesMap[name] = t;
            texturesMap[name].name = name;
            t.name = name;
        });
        const promiseArr = Object.values(texturesMap).map(t => {
            const source = this.json.images[t.source];
            return fetch_1.fetchImage({
                url: `${this.host}${source.uri}`,
                name: t.name,
            });
        });
        return Promise.all(promiseArr).then((textures) => {
            this.textures = this.json.textures.map(t => {
                return textures.find(j => j.name === t.name);
            });
            return true;
        });
    }
    handleTextureLoaded(sampler, image, name) {
        const t = gl.createTexture();
        t.name = name;
        t.image = image.src.substr(image.src.lastIndexOf('/'));
        t.sampler = sampler;
        gl.activeTexture(gl[`TEXTURE${31}`]);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        return t;
    }
    async getEnv() {
        if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
            const env = this.json.extensions.EXT_lights_image_based.lights[0];
            env.specularImages = env.specularImages.map(cube => {
                return cube.map(img => {
                    const accessor = this.json.images[img];
                    const bufferView = this.json.bufferViews[accessor.bufferView];
                    const { buffer, byteLength, byteOffset } = bufferView;
                    const view = new Uint8Array(this.arrayBuffer[buffer], byteOffset, byteLength);
                    const blob = new Blob([view], { type: accessor.mimeType });
                    const imageUrl = window.URL.createObjectURL(blob);
                    const imageEl = new Image;
                    imageEl.src = imageUrl;
                    return imageEl;
                });
            });
            await new Promise(r => setTimeout(r, 200));
            return env;
        }
    }
}
exports.Parse = Parse;


/***/ }),

/***/ "./src/redcube.node.ts":
/*!*****************************!*\
  !*** ./src/redcube.node.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path='../index.d.ts'/>
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ./objects/index */ "./src/objects/index.ts");
const parse_1 = __webpack_require__(/*! ./parse */ "./src/parse.ts");
const FOV = 45; // degrees
class RedCube {
    constructor(url) {
        if (!url) {
            throw new Error('Url not found');
        }
        this.url = url;
    }
    async init(cb) {
        const scene = new index_1.Scene();
        try {
            this.parse = new parse_1.Parse(this.url, [], () => { });
            this.parse.setScene(scene);
            await this.parse.getJson();
            await this.parse.getBuffer();
            await this.parse.initTextures();
            this.parse.buildSkin();
            await this.parse.buildMesh();
            this.parse.buildAnimation();
            if (this.parse.cameras.length === 0) {
                this.camera = new index_1.Camera({
                    type: 'perspective',
                    isInitial: true,
                    zoom: 1,
                    aspect: 1,
                    perspective: {
                        yfov: (FOV * Math.PI) / 180
                    }
                }, 'perspective');
                this.parse.cameras.push(this.camera);
            }
            this.camera = this.parse.cameras[0];
            this.parse.calculateFov(this.camera.props.isInitial);
            this.resize();
        }
        catch (e) {
            console.log(e);
        }
        scene.tracks = this.parse.tracks;
        scene.cameras = this.parse.cameras;
        scene.lights = this.parse.lights;
        cb(scene);
    }
    resize() {
        const z = this.camera.modelSize;
        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        this.camera.updateNF();
    }
}
exports.RedCube = RedCube;


/***/ }),

/***/ "./src/shaders/fragment.glsl":
/*!***********************************!*\
  !*** ./src/shaders/fragment.glsl ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\n#define IBL 1\r\n\r\nin vec4 vColor;\r\nin vec2 outUV;\r\nin vec2 outUV2;\r\nin vec3 outPosition;\r\nin vec4 outPositionView;\r\n#ifdef TANGENT\r\n    in mat3 outTBN;\r\n#else\r\n    in vec3 outNormal;\r\n#endif\r\n\r\nlayout (location = 0) out vec4 color;\r\nlayout (location = 1) out vec3 normalColor;\r\n\r\nuniform Material {\r\n    vec4 baseColorFactor;\r\n    vec3 viewPos;\r\n    mat3 textureMatrix;\r\n    vec3 specularFactor;\r\n    vec3 emissiveFactor;\r\n    vec4 glossinessFactor;\r\n    vec4 metallicFactor;\r\n    vec4 roughnessFactor;\r\n    vec4 clearcoatFactor;\r\n    vec4 clearcoatRoughnessFactor;\r\n    vec4 sheenColorFactor;\r\n    vec4 sheenFactor;\r\n    vec4 sheenRoughnessFactor;\r\n};\r\nuniform LightColor {\r\n    vec3 lightColor[LIGHTNUMBER];\r\n};\r\nuniform Spotdir {\r\n    vec3 spotdir[LIGHTNUMBER];\r\n};\r\nuniform LightIntensity {\r\n    vec4 lightIntensity[LIGHTNUMBER];\r\n};\r\nuniform LightPos {\r\n    vec3 lightPos[LIGHTNUMBER];\r\n};\r\nuniform SphericalHarmonics {\r\n    mat4 rotationMatrix;\r\n    vec3 vSphericalL00;\r\n    vec3 vSphericalL1_1;\r\n    vec3 vSphericalL10;\r\n    vec3 vSphericalL11;\r\n    vec3 vSphericalL2_2;\r\n    vec3 vSphericalL2_1;\r\n    vec3 vSphericalL20;\r\n    vec3 vSphericalL21;\r\n    vec3 vSphericalL22;\r\n};\r\n\r\nuniform sampler2D baseColorTexture;\r\nuniform sampler2D metallicRoughnessTexture;\r\nuniform sampler2D normalTexture;\r\nuniform sampler2D emissiveTexture;\r\nuniform sampler2D occlusionTexture;\r\nuniform sampler2D clearcoatTexture;\r\nuniform sampler2D clearcoatRoughnessTexture;\r\nuniform sampler2D sheenTexture;\r\nuniform sampler2D clearcoatNormalTexture;\r\n\r\nuniform samplerCube prefilterMap;\r\nuniform sampler2D brdfLUT;  \r\nuniform samplerCube irradianceMap;\r\nuniform sampler2D depthTexture;\r\n\r\nconst float RECIPROCAL_PI = 0.31830988618;\r\nconst float PI = 3.14159265359;\r\nconst float EPSILON = 1e-6;\r\nconst float ambientStrength = 0.1;\r\nconst float specularStrength = 2.5;\r\nconst float specularPower = 32.0;\r\nconst float gamma = 2.2;\r\n\r\nvec2 getUV(int index) {\r\n    if (index == 1) {\r\n        return outUV;\r\n    } else {\r\n        return outUV2;\r\n    }\r\n}\r\n\r\nfloat ShadowCalculation(vec4 fragPosLightSpace, float bias) {\r\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\r\n    projCoords = projCoords * 0.5 + 0.5;\r\n    float currentDepth = projCoords.z;\r\n\r\n    float shadow = 0.0;\r\n    vec2 texelSize = 1.0 / vec2(textureSize(depthTexture, 0));\r\n    for (int x = -2; x <= 2; ++x) {\r\n        for (int y = -2; y <= 2; ++y) {\r\n            float pcfDepth = texture(depthTexture, projCoords.xy + vec2(x, y) * texelSize).r;\r\n            shadow += currentDepth - bias > pcfDepth ? 0.5 : 0.0;\r\n        }\r\n    }\r\n    shadow /= 25.0;\r\n\r\n    return shadow;\r\n}\r\n\r\nvec3 srgbToLinear(vec4 srgbIn) {\r\n    return pow(srgbIn.rgb, vec3(2.2));\r\n}\r\n\r\nfloat DistributionGGX(vec3 N, vec3 H, float roughness) {\r\n    float a = roughness*roughness;\r\n    float a2 = max(a*a, 0.0001);\r\n    float NdotH = max(dot(N, H), 0.0);\r\n    float NdotH2 = NdotH*NdotH;\r\n\r\n    float nom   = a2;\r\n    float denom = (NdotH2 * (a2 - 1.0) + 1.0);\r\n    denom = PI * denom * denom;\r\n\r\n    return nom / max(denom, 0.0001);\r\n}\r\n\r\nfloat GeometrySchlickGGX(float cosTheta, float roughness) {\r\n    float r = (roughness + 1.0);\r\n    float k = (r * r) / 8.0;\r\n\r\n    float nom   = cosTheta;\r\n    float denom = cosTheta * (1.0 - k) + k;\r\n\r\n    return nom / denom;\r\n}\r\n\r\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\r\n    float NdotV = max(dot(N, V), 0.0);\r\n    float NdotL = max(dot(N, L), 0.0);\r\n    float ggx2 = GeometrySchlickGGX(NdotV, roughness);\r\n    float ggx1 = GeometrySchlickGGX(NdotL, roughness);\r\n\r\n    return ggx1 * ggx2;\r\n}\r\n\r\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\r\n    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\r\n}\r\nvec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {\r\n    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);\r\n}\r\n\r\nvec3 computeEnvironmentIrradiance(vec3 normal) {\r\n    return vSphericalL00\r\n        + vSphericalL1_1 * (normal.y)\r\n        + vSphericalL10 * (normal.z)\r\n        + vSphericalL11 * (normal.x)\r\n        + vSphericalL2_2 * (normal.y * normal.x)\r\n        + vSphericalL2_1 * (normal.y * normal.z)\r\n        + vSphericalL20 * ((3.0 * normal.z * normal.z) - 1.0)\r\n        + vSphericalL21 * (normal.z * normal.x)\r\n        + vSphericalL22 * (normal.x * normal.x - (normal.y * normal.y));\r\n}\r\nvec3 IBLAmbient(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, float roughness, vec3 viewDir, float ao) {\r\n    vec3 F0 = vec3(0.04);\r\n    F0 = mix(F0, baseColor, metallic);\r\n\r\n    #ifdef SPECULARGLOSSINESSMAP\r\n        F0 = specularMap;\r\n    #endif\r\n\r\n    vec3 F = fresnelSchlickRoughness(max(dot(n, viewDir), 0.0), F0, roughness);\r\n\r\n    vec3 kD = vec3(1.0) - F;\r\n    kD *= 1.0 - metallic;\r\n\r\n    const float MAX_REFLECTION_LOD = 4.0;\r\n    #ifdef SPHERICAL_HARMONICS\r\n    vec3 R = reflect(viewDir, n);\r\n    vec4 rotatedR = rotationMatrix * vec4(R, 0.0);\r\n    vec3 prefilteredColor = srgbToLinear(textureLod(prefilterMap, rotatedR.xyz, roughness * MAX_REFLECTION_LOD));\r\n    vec3 irradianceVector = vec3(rotationMatrix * vec4(n, 0)).xyz;\r\n    vec3 irradiance = computeEnvironmentIrradiance(irradianceVector).rgb;\r\n    #else\r\n    vec3 R = reflect(-viewDir, n);\r\n    vec3 prefilteredColor = textureLod(prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;\r\n    vec3 irradiance = texture(irradianceMap, n).rgb;\r\n    #endif\r\n    vec2 envBRDF  = texture(brdfLUT, vec2(max(dot(n, viewDir), 0.0), roughness)).rg;\r\n    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);\r\n    vec3 diffuse = baseColor * irradiance;\r\n\r\n    return (kD * diffuse + specular) * ao;\r\n}\r\n\r\nvec3 CookTorranceSpecular(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir) {\r\n    vec3 F0 = vec3(0.04); \r\n    F0 = mix(F0, baseColor, metallic);\r\n\r\n    #ifdef SPECULARGLOSSINESSMAP\r\n        F0 = specularMap;\r\n    #endif\r\n\r\n    float D = DistributionGGX(n, H, roughness);\r\n    float G = GeometrySmith(n, viewDir, lightDir, roughness);      \r\n    vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0); \r\n\r\n    vec3 nominator = D * G * F;\r\n    float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);\r\n    return nominator / max(denominator, 0.001);\r\n}\r\n\r\nvec3 LambertDiffuse(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir) {\r\n    float NdotL = max(dot(n, lightDir), 0.0);\r\n    vec3 F0 = vec3(0.04);\r\n    F0 = mix(F0, baseColor, metallic);\r\n\r\n    vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);    \r\n\r\n    vec3 kD = vec3(1.0) - F;\r\n    kD *= 1.0 - metallic;\r\n    return baseColor * kD / PI;\r\n}\r\n\r\nfloat saturate(float a) {\r\n\tif (a > 1.0) return 1.0;\r\n\tif (a < 0.0) return 0.0;\r\n\treturn a;\r\n}\r\nvec3 ImprovedOrenNayarDiffuse(vec3 baseColor, float metallic, vec3 N, vec3 H, float a, vec3 V, vec3 L) {\r\n    vec3 F0 = vec3(0.04);\r\n    F0 = mix(F0, baseColor, metallic);\r\n    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);\r\n    vec3 kD = vec3(1.0) - F;\r\n    kD *= 1.0 - metallic;\r\n    vec3 diffuseColor = baseColor * kD;\r\n\t// calculate intermediary values\r\n\tfloat dotNL = saturate(dot(N, L));\r\n\tfloat dotNV = saturate(dot(N, V));\r\n\tfloat dotLV = saturate(dot(L, V));\r\n\tfloat dotLH = saturate(dot(L, H));\r\n\r\n\tfloat s = dotLV - dotNL * dotNV;\r\n\tfloat t = mix(1.0, max(dotNL, dotNV), step(0.0, s));\r\n\tfloat st = s * (1.0 / (t + EPSILON));\r\n\r\n\tfloat sigma2 = a;\r\n\tvec3 A = diffuseColor * (0.17 * sigma2 / (sigma2 + 0.13)) + vec3(1.0 - 0.5 * sigma2 / (sigma2 + 0.33));\r\n\tfloat B = 0.45 * sigma2 / (sigma2 + 0.09);\r\n\treturn (diffuseColor * max(0.0, dotNL)) * (A + vec3(B * s / t) / PI);\r\n}\r\n\r\nfloat sheenDistribution(float sheenRoughness, vec3 N, vec3 H) {\r\n    float NdotH = max(dot(N, H), 0.0);\r\n    float alphaG = max(sheenRoughness * sheenRoughness, 0.01);\r\n    float invR = 1.0 / alphaG;\r\n    float cos2h = NdotH * NdotH;\r\n    float sin2h = 1.0 - cos2h;\r\n    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);\r\n}\r\n\r\nfloat sheenVisibility(vec3 N, vec3 V, vec3 L) {\r\n    float NdotL = max(dot(N, L), 0.0);\r\n    float NdotV = max(dot(N, V), 0.0);\r\n    return 1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV));\r\n}\r\n\r\nvoid main() {\r\n    #ifdef BASECOLORTEXTURE\r\n        vec2 uv = outUV;\r\n        #ifdef TEXTURE_TRANSFORM\r\n            uv = ( textureMatrix * vec3(uv.xy, 1.0) ).xy;\r\n        #endif\r\n        vec3 baseColor = srgbToLinear(texture(baseColorTexture, uv)) * baseColorFactor.rgb;\r\n        float alpha = min(texture(baseColorTexture, uv).a, baseColorFactor.a);\r\n    #else\r\n        vec3 baseColor = baseColorFactor.rgb;\r\n        float alpha = baseColorFactor.a;\r\n    #endif\r\n\r\n    #ifdef ALPHATEST\r\n    if ( alpha < ALPHATEST ) {\r\n        discard;\r\n    }\r\n    #else\r\n        alpha = 1.0;\r\n    #endif\r\n\r\n    if ( length(vColor.rgb) != 0.0 ) {\r\n        baseColor.rgb *= vColor.rgb;\r\n    }\r\n\r\n    #ifdef NOLIGHT\r\n        color = vec4(baseColor, alpha);\r\n        return;\r\n    #endif\r\n\r\n    #ifdef OCCLUSIONMAP\r\n        float ao = texture(occlusionTexture, outUV).r;\r\n    #else\r\n        float ao = 0.2;\r\n    #endif\r\n\r\n    float roughness = roughnessFactor.x;\r\n    float metallic = metallicFactor.x;\r\n    float clearcoatRoughness = clearcoatRoughnessFactor.x;\r\n    float clearcoat = clearcoatFactor.x;\r\n    float clearcoatBlendFactor = clearcoat;\r\n    float sheen = sheenFactor.x;\r\n    vec3 sheenColor = sheenColorFactor.xyz;\r\n    float sheenRoughness = sheenRoughnessFactor.x;\r\n    #ifdef CLEARCOATMAP\r\n        clearcoatBlendFactor = texture(clearcoatTexture, outUV).r * clearcoat;\r\n    #endif\r\n    #ifdef CLEARCOATROUGHMAP\r\n        clearcoatRoughness = texture(clearcoatRoughnessTexture, outUV).g * clearcoatRoughness;\r\n    #endif\r\n    #ifdef SHEENMAP\r\n        vec4 sheenTextureV = texture(sheenTexture, outUV);\r\n        sheenColor = sheenTextureV.rgb * sheenColor;\r\n        sheen = sheenTextureV.a * sheen;\r\n    #endif\r\n    vec3 specularMap = vec3(0);\r\n    #ifdef SPECULARGLOSSINESSMAP\r\n        #ifdef METALROUGHNESSMAP\r\n            roughness = 1.0 - texture(metallicRoughnessTexture, outUV).a;\r\n            specularMap = srgbToLinear(texture(metallicRoughnessTexture, outUV));\r\n        #else\r\n            roughness = glossinessFactor.x;\r\n            specularMap = specularFactor;\r\n        #endif\r\n    #else\r\n        #ifdef METALROUGHNESSMAP\r\n            vec4 metallicRoughness = texture(metallicRoughnessTexture, outUV);\r\n            roughness *= metallicRoughness.g;\r\n            metallic *= metallicRoughness.b;\r\n        #endif\r\n    #endif\r\n\r\n    #ifdef TANGENT\r\n        #ifdef NORMALMAP\r\n            vec3 n = texture(normalTexture, outUV).rgb;\r\n            n = normalize(outTBN * (2.0 * n - 1.0));\r\n        #else\r\n            vec3 n = outTBN[2].xyz;\r\n        #endif\r\n    #else\r\n        vec3 n = outNormal;\r\n    #endif\r\n\r\n    #ifdef TANGENT\r\n    #ifdef CLEARCOATNORMALMAP\r\n        vec3 clearcoatNormal = texture(clearcoatNormalTexture, outUV).rgb;\r\n        clearcoatNormal = normalize(outTBN * (2.0 * clearcoatNormal - 1.0));\r\n    #else\r\n        vec3 clearcoatNormal = outTBN[2].xyz;\r\n    #endif\r\n    #else\r\n        vec3 clearcoatNormal = outNormal;\r\n    #endif\r\n\r\n    vec3 viewDir = normalize(viewPos - outPosition);\r\n\r\n    #ifdef DOUBLESIDED\r\n    if (dot(n, viewDir) < 0.0) {\r\n        n = -n;\r\n        clearcoatNormal = -clearcoatNormal;\r\n    }\r\n    #endif\r\n\r\n    float shadow = 1.0;\r\n    #ifdef SHADOWMAP\r\n        vec3 l = normalize(lightPos[0] - outPosition);\r\n        float shadowBias = max(0.05 * (1.0 - dot(n, l)), 0.005);\r\n        shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);\r\n    #endif\r\n\r\n    #ifdef USE_PBR\r\n        vec3 Lo = vec3(0.0);\r\n        for (int i = 0; i < LIGHTNUMBER; ++i) {\r\n            vec3 lightDir = normalize(lightPos[i] - outPosition);\r\n            float NdotL = max(dot(n, lightDir), 0.0);\r\n            vec3 H = normalize(viewDir + lightDir);\r\n\r\n            vec3 radiance = lightColor[i] * lightIntensity[i].x;\r\n            float distance = length(lightPos[i] - outPosition);\r\n            float attenuation = 1.0 / (distance * distance);\r\n            if (lightIntensity[i].w == 1.0) { // point\r\n                radiance = radiance * attenuation;\r\n            }\r\n            if (lightIntensity[i].w == 2.0) { // spot\r\n                float lightAngleScale = 1.0 / max(0.001, cos(lightIntensity[i].y) - cos(lightIntensity[i].z));\r\n                float lightAngleOffset = -cos(lightIntensity[i].z) * lightAngleScale;\r\n\r\n                float cd = dot(spotdir[i], lightDir);\r\n                float attenuationSpot = saturate(cd * lightAngleScale + lightAngleOffset);\r\n                attenuationSpot *= attenuationSpot;\r\n\r\n                radiance = radiance * attenuationSpot * attenuation;\r\n            }\r\n\r\n            vec3 specular = CookTorranceSpecular(specularMap, baseColor, metallic, n, H, roughness, viewDir, lightDir);\r\n            vec3 f_clearcoat = CookTorranceSpecular(specularMap, vec3(0.0), 0.0, clearcoatNormal, H, clearcoatRoughness, viewDir, lightDir);\r\n            float NdotV = saturate(dot(clearcoatNormal, viewDir));\r\n            vec3 clearcoatFresnel = 1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04));\r\n            vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir);\r\n            #ifdef SPECULARGLOSSINESSMAP\r\n                diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));\r\n            #endif\r\n            vec3 f_sheen = sheenColor * sheen * sheenDistribution(sheenRoughness, n, H) * sheenVisibility(n, viewDir, lightDir);\r\n\r\n            Lo += (diffuse + specular * NdotL) * radiance * clearcoatFresnel + f_clearcoat * clearcoatBlendFactor + f_sheen;\r\n        }\r\n\r\n        vec3 ambient = vec3(0.0);\r\n        vec3 ambientClearcoat = vec3(0.0);\r\n        vec3 clearcoatFresnel = vec3(1.0);\r\n        #ifdef IBL\r\n            ambient = max(vec3(0.03) * baseColor, IBLAmbient(specularMap, baseColor, metallic, n, roughness, viewDir, ao));\r\n            ambientClearcoat = IBLAmbient(specularMap, vec3(0.0), 0.0, clearcoatNormal, clearcoatRoughness, viewDir, ao) * clearcoatBlendFactor;\r\n            float NdotV = saturate(dot(clearcoatNormal, viewDir));\r\n            clearcoatFresnel = (1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04)));\r\n        #else\r\n            ambient = vec3(0.03) * baseColor * ao;\r\n        #endif\r\n\r\n        vec3 emissive = emissiveFactor;\r\n        #ifdef EMISSIVEMAP\r\n            emissive = srgbToLinear(texture(emissiveTexture, getUV(EMISSIVEMAP)));\r\n        #endif\r\n\r\n        color = vec4(shadow * ((emissive + ambient + Lo) * clearcoatFresnel + ambientClearcoat), alpha);\r\n    #else\r\n        vec3 lightDir = normalize(lightPos[0] - outPosition);\r\n        vec3 ambient = ambientStrength * lightColor[0];\r\n\r\n        float diff = max(dot(n, lightDir), 0.0);\r\n        vec3 diffuse = diff * lightColor[0];\r\n\r\n        vec3 reflectDir = reflect(-lightDir, n);\r\n        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);\r\n        vec3 specular = specularStrength * spec * lightColor[0];\r\n\r\n        color = vec4(baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);\r\n    #endif\r\n\r\n    #ifdef TONE\r\n        color.rgb = color.rgb / (color.rgb + vec3(1.0));\r\n        color.rgb = pow(color.rgb, vec3(1.0 / gamma));\r\n    #endif\r\n\r\n    normalColor = n;\r\n}\r\n"

/***/ }),

/***/ "./src/shaders/vertex.glsl":
/*!*********************************!*\
  !*** ./src/shaders/vertex.glsl ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 inPosition;\r\nlayout (location = 1) in vec3 inNormal;\r\nlayout (location = 2) in vec2 inUV;\r\nlayout (location = 3) in vec4 inJoint;\r\nlayout (location = 4) in vec4 inWeight;\r\nlayout (location = 5) in vec4 inTangent;\r\nlayout (location = 6) in vec4 inColor;\r\nlayout (location = 7) in vec2 inUV2;\r\n\r\nout vec4 vColor;\r\nout vec2 outUV;\r\nout vec2 outUV2;\r\nout vec3 outPosition;\r\nout vec4 outPositionView;\r\n#ifdef TANGENT\r\n    out mat3 outTBN;\r\n#else\r\n    out vec3 outNormal;\r\n#endif\r\n\r\nuniform Matrices {\r\n    mat4 model;\r\n    mat4 normalMatrix;\r\n    mat4 view;\r\n    mat4 projection;\r\n    mat4 light;\r\n    vec4 isShadow;\r\n};\r\n\r\n#ifdef JOINTNUMBER\r\nuniform Skin {\r\n    mat4 joint[JOINTNUMBER];\r\n};\r\n#endif\r\n\r\nvoid main() {\r\n    #ifdef JOINTNUMBER\r\n        mat4 skin = inWeight.x * joint[int(inJoint.x)];\r\n        skin += inWeight.y * joint[int(inJoint.y)];\r\n        skin += inWeight.z * joint[int(inJoint.z)];\r\n        skin += inWeight.w * joint[int(inJoint.w)];\r\n    #else\r\n        mat4 skin = mat4(1.0);\r\n    #endif\r\n\r\n    #ifdef COLOR_255\r\n        vColor = inColor / 255.0;\r\n    #else\r\n        vColor = inColor;\r\n    #endif\r\n    outUV = inUV;\r\n    outUV2 = inUV2;\r\n    #ifdef TANGENT\r\n        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));\r\n        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));\r\n        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;\r\n        outTBN = mat3(tangentW, bitangentW, normalW);\r\n    #else\r\n        outNormal = normalize(mat3(normalMatrix) * mat3(skin) * inNormal);\r\n    #endif\r\n    outPosition = vec3(model * skin * vec4(inPosition, 1.0));\r\n    outPositionView = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    if (isShadow.x == 1.0) {\r\n        gl_Position = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    } else {\r\n        gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);\r\n    }\r\n}\r\n"

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = __webpack_require__(/*! ./matrix */ "./src/matrix.ts");
const glEnum_1 = __webpack_require__(/*! ./glEnum */ "./src/glEnum.ts");
// @ts-ignore
exports.currentPath = './'; //document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/'));
//const glEnum = {};
let gl;
let screenTextureCount = 31;
exports.clearColor = [0, 0, 0, 1];
function getTextureIndex() {
    screenTextureCount--;
    return screenTextureCount;
}
exports.getTextureIndex = getTextureIndex;
exports.textureEnum = {
    baseColorTexture: 0,
    metallicRoughnessTexture: 1,
    normalTexture: 2,
    occlusionTexture: 3,
    emissiveTexture: 4,
    irradianceTexture: 5,
    prefilterTexture: 6,
    brdfLUTTexture: 7,
    clearcoatTexture: 8,
    clearcoatRoughnessTexture: 9,
    clearcoatNormalTexture: 10,
    sheenTexture: 11
};
function setGl(_gl) {
    gl = _gl;
    // for (const k in gl) {
    //     const v = gl[k];
    //     if (typeof v === 'number') {
    //         glEnum[v] = k;
    //     }
    // }
}
exports.setGl = setGl;
function isMatrix(type) {
    return glEnum_1.default[type] === 'FLOAT_MAT4' || glEnum_1.default[type] === 'FLOAT_MAT3' || glEnum_1.default[type] === 'FLOAT_MAT2';
}
exports.isMatrix = isMatrix;
function random(min, max) {
    return Math.random() * (max - min) + min;
}
exports.random = random;
function lerp(a, b, f) {
    return a + f * (b - a);
}
exports.lerp = lerp;
function getMatrixType(type) {
    if (glEnum_1.default[type] === 'FLOAT_MAT4') {
        return matrix_1.Matrix4;
    }
    if (glEnum_1.default[type] === 'FLOAT_MAT3') {
        return matrix_1.Matrix3;
    }
    if (glEnum_1.default[type] === 'FLOAT_MAT2') {
        return matrix_1.Matrix2;
    }
}
exports.getMatrixType = getMatrixType;
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
exports.getDataType = getDataType;
function getComponentType(type) {
    let count;
    switch (glEnum_1.default[type]) {
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
exports.getComponentType = getComponentType;
function getMethod(type) {
    let method;
    switch (glEnum_1.default[type]) {
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
exports.getMethod = getMethod;
function getAnimationComponent(type) {
    if (type === 'rotation') {
        return 4;
    }
    else if (type === 'translation' || type === 'scale') {
        return 3;
    }
}
exports.getAnimationComponent = getAnimationComponent;
function range(min, max, value) {
    return (value - min) / (max - min);
}
exports.range = range;
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
exports.interpolation = interpolation;
function getCount(type) {
    let arr;
    switch (glEnum_1.default[type]) {
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
exports.ArrayBufferMap = new Map();
exports.ArrayBufferMap.set(Int8Array, 'BYTE');
exports.ArrayBufferMap.set(Uint8Array, 'UNSIGNED_BYTE');
exports.ArrayBufferMap.set(Int16Array, 'SHORT');
exports.ArrayBufferMap.set(Uint16Array, 'UNSIGNED_SHORT');
exports.ArrayBufferMap.set(Uint32Array, 'UNSIGNED_INT');
exports.ArrayBufferMap.set(Float32Array, 'FLOAT');
function buildArrayWithStride(arrayBuffer, accessor, bufferView) {
    const sizeofComponent = getCount(accessor.componentType);
    const typeofComponent = getDataType(accessor.type);
    const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
    const stride = bufferView.byteStride;
    const lengthByStride = (stride * accessor.count) / sizeofComponent;
    const requiredLength = accessor.count * typeofComponent;
    const length = lengthByStride || requiredLength;
    let arr;
    switch (glEnum_1.default[accessor.componentType]) {
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
    if (length !== requiredLength) { // buffer is too big need to stride it
        const stridedArr = new arr.constructor(requiredLength);
        let j = 0;
        for (let i = 0; i < stridedArr.length; i += typeofComponent) {
            for (let k = 0; k < typeofComponent; k++) {
                stridedArr[i + k] = arr[j + k];
            }
            j += stride / sizeofComponent;
        }
        return stridedArr;
    }
    else {
        return arr;
    }
}
exports.buildArrayWithStride = buildArrayWithStride;
function buildArray(arrayBuffer, type, offset, length) {
    let arr;
    switch (glEnum_1.default[type]) {
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
    return arr;
}
exports.buildArray = buildArray;
function compileShader(type, shaderSource, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    const log = gl.getShaderInfoLog(shader);
    if (log) {
        throw new Error(log);
    }
}
exports.compileShader = compileShader;
function createProgram(vertex, fragment) {
    const program = gl.createProgram();
    compileShader(gl.VERTEX_SHADER, vertex, program);
    compileShader(gl.FRAGMENT_SHADER, fragment, program);
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw new Error(`Could not compile WebGL program. ${info}`);
    }
    return program;
}
exports.createProgram = createProgram;
function createTexture(type = gl.TEXTURE_2D, index = getTextureIndex()) {
    const texture = gl.createTexture();
    gl.activeTexture(gl[`TEXTURE${index}`]);
    gl.bindTexture(type, texture);
    texture.index = index;
    return texture;
}
exports.createTexture = createTexture;
function walk(node, callback) {
    function _walk(node) {
        callback(node);
        if (node.children) {
            node.children.forEach(_walk);
        }
    }
    _walk(node);
}
exports.walk = walk;
function sceneToArcBall(pos) {
    let len = pos[0] * pos[0] + pos[1] * pos[1];
    const sz = 0.04 * 0.04 - len;
    if (sz > 0) {
        return [pos[0], pos[1], Math.sqrt(sz)];
    }
    else {
        len = Math.sqrt(len);
        return [(0.04 * pos[0]) / len, (0.04 * pos[1]) / len, 0];
    }
}
exports.sceneToArcBall = sceneToArcBall;
function canvasToWorld(vec2, projection, width, height) {
    const [x, y] = vec2;
    const newM = new matrix_1.Matrix4();
    newM.setTranslate(new matrix_1.Vector3([0, 0, 0.05]));
    const m = new matrix_1.Matrix4(projection);
    m.multiply(newM);
    const mp = m.multiplyVector4(new matrix_1.Vector4([0, 0, 0, 1]));
    mp.elements[0] = ((2 * x) / width - 1) * mp.elements[3];
    mp.elements[1] = ((-2 * y) / height + 1) * mp.elements[3];
    const v = m.invert().multiplyVector4(mp);
    return [v.elements[0], v.elements[1]];
}
exports.canvasToWorld = canvasToWorld;
function calculateProjection(cam) {
    const { aspect, zoom } = cam;
    let proj;
    if (cam.type === 'perspective' && cam.perspective) {
        const { yfov } = cam.perspective;
        proj = new matrix_1.Matrix4().setPerspective(yfov, aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
    }
    else if (cam.type === 'orthographic' && cam.orthographic) {
        proj = new matrix_1.Matrix4().setOrtho(cam.orthographic.xmag * zoom, cam.orthographic.ymag * zoom, cam.orthographic.znear, cam.orthographic.zfar);
    }
    return proj;
}
exports.calculateProjection = calculateProjection;
function calculateOffset(a = 0, b = 0) {
    return a + b;
}
exports.calculateOffset = calculateOffset;
function calculateUVs(vertex, normal) {
    const UVS = new Float32Array(vertex.length / 3 * 2);
    const Min = new matrix_1.Vector2([Infinity, Infinity]);
    const Max = new matrix_1.Vector2([-Infinity, -Infinity]);
    for (let i = 0; i < vertex.length / 3; ++i) {
        const coords = [];
        const norm = [];
        for (let c = 0; c < 3; ++c) {
            coords.push(vertex[3 * i + c]);
            norm.push(normal[3 * i + c]);
        }
        const N = new matrix_1.Vector3(norm);
        const components = ['x', 'y', 'z'].sort((a, b) => {
            return Math.abs(N[a]) - Math.abs(N[b]);
        });
        const pos = new matrix_1.Vector3(coords);
        const u = pos[components[0]];
        const v = pos[components[1]];
        UVS[i * 2] = u;
        UVS[i * 2 + 1] = v;
        Max.x = Math.max(Max.x, u);
        Max.y = Math.max(Max.y, v);
        Min.x = Math.min(Min.x, u);
        Min.y = Math.min(Min.y, v);
    }
    const diff = new matrix_1.Vector2(Max.elements).subtract(Min);
    for (let i = 0; i < vertex.length / 3; ++i) {
        const ix = i * 2;
        UVS[ix] = (UVS[ix] - Min.x) / diff.x;
        UVS[ix + 1] = (UVS[ix + 1] - Min.y) / diff.y;
    }
    return UVS;
}
exports.calculateUVs = calculateUVs;
function calculateNormals(index, vertex) {
    const ns = new Float32Array((vertex.length / 3) * 3);
    for (let i = 0; i < index.length; i += 3) {
        const faceIndexes = [index[i], index[i + 1], index[i + 2]];
        const faceVertices = faceIndexes.map(ix => vectorFromArray(vertex, ix));
        const dv1 = faceVertices[1].subtract(faceVertices[0]);
        const dv2 = faceVertices[2].subtract(faceVertices[0]);
        const n = matrix_1.Vector3.cross(dv1.normalize(), dv2.normalize());
        const [x, y, z] = n.elements;
        for (var j = 0; j < 3; j++) {
            ns[3 * index[i + j] + 0] = ns[3 * index[i + j] + 0] + x;
            ns[3 * index[i + j] + 1] = ns[3 * index[i + j] + 1] + y;
            ns[3 * index[i + j] + 2] = ns[3 * index[i + j] + 2] + z;
        }
    }
    return ns;
    function vectorFromArray(array, index, elements = 3) {
        index = index * elements;
        return new matrix_1.Vector3([array[index], array[index + 1], array[index + 2]]);
    }
}
exports.calculateNormals = calculateNormals;
function calculateBinormals(index, vertex, normal, uv) {
    const tangent = new Float32Array((normal.length / 3) * 4);
    for (let i = 0; i < index.length; i += 3) {
        const faceIndexes = [index[i], index[i + 1], index[i + 2]];
        const faceVertices = faceIndexes.map(ix => vectorFromArray(vertex, ix));
        const faceUVs = faceIndexes.map(ix => vectorFromArray(uv, ix, 2));
        const dv1 = faceVertices[1].subtract(faceVertices[0]);
        const dv2 = faceVertices[2].subtract(faceVertices[0]);
        const duv1 = faceUVs[1].subtract(faceUVs[0]);
        const duv2 = faceUVs[2].subtract(faceUVs[0]);
        let r = duv1.elements[0] * duv2.elements[1] - duv1.elements[1] * duv2.elements[0];
        r = r !== 0 ? 1.0 / r : 1.0;
        const udir = new matrix_1.Vector3([
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
            return new matrix_1.Vector3([array[index], array[index + 1], array[index + 2]]);
        }
        if (elements === 2) {
            return new matrix_1.Vector2([array[index], array[index + 1]]);
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
exports.calculateBinormals = calculateBinormals;
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
exports.measureGPU = measureGPU;
function getGlEnum(name) {
    return glEnum_1.default[name];
}
exports.getGlEnum = getGlEnum;
function normalize(array) {
    let fn;
    switch (true) {
        case array instanceof Uint8Array:
            fn = c => c / 255;
            break;
        case array instanceof Int8Array:
            fn = c => Math.max(c / 127.0, -1.0);
            break;
        case array instanceof Uint16Array:
            fn = c => c / 65535;
            break;
        case array instanceof Int16Array:
            fn = c => Math.max(c / 32767.0, -1.0);
            break;
    }
    if (fn) {
        const normalizedArray = new Float32Array(array.length);
        for (let i = 0; i < array.length; i++) {
            normalizedArray[i] = fn(array[i]);
        }
        return normalizedArray;
    }
    else {
        return array;
    }
}
exports.normalize = normalize;


/***/ }),

/***/ "draco3d":
/*!**************************!*\
  !*** external "draco3d" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("draco3d");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })

/******/ });
});