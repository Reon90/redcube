import { Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from './matrix';
import glEnum from './glEnum';

//const glEnum = {};
let gl;
let screenTextureCount = 31;
export const clearColor = [0, 0, 0, 1];

export function getTextureIndex() {
    screenTextureCount--;
    return screenTextureCount;
}

export const textureEnum = {
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
    sheenColorTexture: 11,
    sheenRoughnessTexture: 12,
    Sheen_E: 13,
    transmissionTexture: 14,
    specularTexture: 15,
    thicknessTexture: 16
};

export function setGl(_gl) {
    gl = _gl;
    // for (const k in gl) {
    //     const v = gl[k];
    //     if (typeof v === 'number') {
    //         glEnum[v] = k;
    //     }
    // }
}

export function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
}

export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function lerp(a, b, f) {
    return a + f * (b - a);
}

export function getMatrixType(type) {
    if (glEnum[type] === 'FLOAT_MAT4') {
        return Matrix4;
    }
    if (glEnum[type] === 'FLOAT_MAT3') {
        return Matrix3;
    }
    if (glEnum[type] === 'FLOAT_MAT2') {
        return Matrix2;
    }
}

export function getDataType(type) {
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

export function getComponentType(type) {
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

export function getMethod(type) {
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

export function getAnimationComponent(type) {
    if (type === 'rotation') {
        return 4;
    } else if (type === 'translation' || type === 'scale') {
        return 3;
    }
}

export function range(min, max, value) {
    return (value - min) / (max - min);
}

export function interpolation(time, frames) {
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
    } else {
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

export const ArrayBufferMap = new Map();
ArrayBufferMap.set(Int8Array, 'BYTE');
ArrayBufferMap.set(Uint8Array, 'UNSIGNED_BYTE');
ArrayBufferMap.set(Int16Array, 'SHORT');
ArrayBufferMap.set(Uint16Array, 'UNSIGNED_SHORT');
ArrayBufferMap.set(Uint32Array, 'UNSIGNED_INT');
ArrayBufferMap.set(Float32Array, 'FLOAT');

export function buildArrayWithStride(arrayBuffer, accessor, bufferView) {
    const sizeofComponent = getCount(accessor.componentType);
    const typeofComponent = getDataType(accessor.type);
    const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
    const stride = bufferView.byteStride;
    const lengthByStride = (stride * accessor.count) / sizeofComponent;
    const requiredLength = accessor.count * typeofComponent;
    let length = lengthByStride || requiredLength;
    if (arrayBuffer.byteLength < length * sizeofComponent + offset) {
        length -= accessor.byteOffset;
    }

    let arr;
    switch (glEnum[accessor.componentType]) {
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
    if (length !== requiredLength) {
        // buffer is too big need to stride it
        const stridedArr = new arr.constructor(requiredLength);
        let j = 0;
        for (let i = 0; i < stridedArr.length; i += typeofComponent) {
            for (let k = 0; k < typeofComponent; k++) {
                stridedArr[i + k] = arr[j + k];
            }
            j += stride / sizeofComponent;
        }
        return stridedArr;
    } else {
        return arr;
    }
}

export function buildArray(arrayBuffer, type, offset, length) {
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
    return arr;
}

export function compileShader(type, shaderSource, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    const log = gl.getShaderInfoLog(shader);
    if (log) {
        throw new Error(log);
    }
}

export function createProgram(vertex, fragment) {
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

export function createTexture(type = gl.TEXTURE_2D, index = getTextureIndex()) {
    const texture = gl.createTexture();
    gl.activeTexture(gl[`TEXTURE${index}`]);
    gl.bindTexture(type, texture);
    texture.index = index;

    return texture;
}

export function walk(node, callback) {
    function _walk(node) {
        callback(node);
        if (node.children) {
            node.children.forEach(_walk);
        }
    }
    _walk(node);
}

export function sceneToArcBall(pos) {
    let len = pos[0] * pos[0] + pos[1] * pos[1];
    const sz = 0.04 * 0.04 - len;
    if (sz > 0) {
        return [pos[0], pos[1], Math.sqrt(sz)];
    } else {
        len = Math.sqrt(len);
        return [(0.04 * pos[0]) / len, (0.04 * pos[1]) / len, 0];
    }
}

export function canvasToWorld(vec2, projection, width, height) {
    const [x, y] = vec2;
    const newM = new Matrix4();
    newM.setTranslate(new Vector3([0, 0, 0.05]));
    const m = new Matrix4(projection);
    m.multiply(newM);

    const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
    mp.elements[0] = ((2 * x) / width - 1) * mp.elements[3];
    mp.elements[1] = ((-2 * y) / height + 1) * mp.elements[3];

    const v = m.invert().multiplyVector4(mp);
    return [v.elements[0], v.elements[1]];
}

export function calculateProjection(cam) {
    const { aspect, zoom } = cam;
    let proj;
    if (cam.type === 'perspective' && cam.perspective) {
        const { yfov } = cam.perspective;

        proj = new Matrix4().setPerspective(yfov, aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
    } else if (cam.type === 'orthographic' && cam.orthographic) {
        proj = new Matrix4().setOrtho(
            cam.orthographic.xmag * zoom,
            cam.orthographic.ymag * zoom,
            cam.orthographic.znear,
            cam.orthographic.zfar
        );
    }

    return proj;
}

export function calculateOffset(a = 0, b = 0) {
    return a + b;
}

export function calculateUVs(vertex, normal) {
    const UVS = new Float32Array((vertex.length / 3) * 2);

    const Min = new Vector2([Infinity, Infinity]);
    const Max = new Vector2([-Infinity, -Infinity]);

    for (let i = 0; i < vertex.length / 3; ++i) {
        const coords = [];
        const norm = [];
        for (let c = 0; c < 3; ++c) {
            coords.push(vertex[3 * i + c]);
            norm.push(normal[3 * i + c]);
        }

        const N = new Vector3(norm);
        const components = ['x', 'y', 'z'].sort((a, b) => {
            return Math.abs(N[a]) - Math.abs(N[b]);
        });

        const pos = new Vector3(coords);
        const u = pos[components[0]];
        const v = pos[components[1]];
        UVS[i * 2] = u;
        UVS[i * 2 + 1] = v;
        Max.x = Math.max(Max.x, u);
        Max.y = Math.max(Max.y, v);
        Min.x = Math.min(Min.x, u);
        Min.y = Math.min(Min.y, v);
    }

    const diff = new Vector2(Max.elements).subtract(Min);
    for (let i = 0; i < vertex.length / 3; ++i) {
        const ix = i * 2;
        UVS[ix] = (UVS[ix] - Min.x) / diff.x;
        UVS[ix + 1] = (UVS[ix + 1] - Min.y) / diff.y;
    }

    return UVS;
}

export function calculateNormals2(vertex) {
    const ns = new Float32Array(vertex.length);

    for (let i = 0; i < vertex.length; i += 9) {
        const faceVertices = [
            new Vector3([vertex[i], vertex[i + 1], vertex[i + 2]]),
            new Vector3([vertex[i + 3], vertex[i + 4], vertex[i + 5]]),
            new Vector3([vertex[i + 6], vertex[i + 7], vertex[i + 8]])
        ];
        const dv1 = faceVertices[1].subtract(faceVertices[0]);
        const dv2 = faceVertices[2].subtract(faceVertices[0]);

        const n = Vector3.cross(dv1.normalize(), dv2.normalize());
        const [x, y, z] = n.elements;
        ns[i] = x;
        ns[i + 1] = y;
        ns[i + 2] = z;

        ns[i + 3] = x;
        ns[i + 4] = y;
        ns[i + 5] = z;

        ns[i + 6] = x;
        ns[i + 7] = y;
        ns[i + 8] = z;
    }

    return ns;
}

export function calculateNormals(index, vertex) {
    const ns = new Float32Array((vertex.length / 3) * 3);
    for (let i = 0; i < index.length; i += 3) {
        const faceIndexes = [index[i], index[i + 1], index[i + 2]];
        const faceVertices = faceIndexes.map(ix => vectorFromArray(vertex, ix));

        const dv1 = faceVertices[1].subtract(faceVertices[0]);
        const dv2 = faceVertices[2].subtract(faceVertices[0]);

        const n = Vector3.cross(dv1.normalize(), dv2.normalize());
        const [x, y, z] = n.elements;

        for (let j = 0; j < 3; j++) {
            ns[3 * index[i + j] + 0] = ns[3 * index[i + j] + 0] + x;
            ns[3 * index[i + j] + 1] = ns[3 * index[i + j] + 1] + y;
            ns[3 * index[i + j] + 2] = ns[3 * index[i + j] + 2] + z;
        }
    }

    return ns;

    function vectorFromArray(array, index, elements = 3) {
        index = index * elements;
        return new Vector3([array[index], array[index + 1], array[index + 2]]);
    }
}

export function calculateBinormals(index, vertex, normal, uv) {
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
        const sign = r > 0 ? 1 : -1;
        r = r !== 0 ? 1.0 / r : 1.0;
        const udir = new Vector3([
            (duv2.elements[1] * dv1.elements[0] - duv1.elements[1] * dv2.elements[0]) * r,
            (duv2.elements[1] * dv1.elements[1] - duv1.elements[1] * dv2.elements[1]) * r,
            (duv2.elements[1] * dv1.elements[2] - duv1.elements[1] * dv2.elements[2]) * r
        ]);
        udir.normalize();

        faceIndexes.forEach(ix => {
            accumulateVectorInArray(tangent, ix, udir, sign);
        });
    }

    return tangent;

    function vectorFromArray(array, index, elements = 3) {
        index = index * elements;
        if (elements === 3) {
            return new Vector3([array[index], array[index + 1], array[index + 2]]);
        }
        if (elements === 2) {
            return new Vector2([array[index], array[index + 1]]);
        }
    }

    function accumulateVectorInArray(array, index, vector, sign, elements = 4, accumulator = (acc, x) => acc + x) {
        index = index * elements;
        for (let i = 0; i < elements; ++i) {
            if (i === 3) {
                array[index + i] = sign;
            } else {
                array[index + i] = accumulator(array[index + i], vector.elements[i]);
            }
        }
    }
}

export function measureGPU() {
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

export function getGlEnum(name) {
    return glEnum[name];
}

export function normalize(array) {
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
    } else {
        return array;
    }
}
