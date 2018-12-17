import { Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from './matrix';

const glEnum = {};
let gl;
let screenTextureCount = -1;
export const clearColor = [0, 0, 0, 1];

export function getTextureIndex() {
    screenTextureCount++;
    return screenTextureCount;
}

export function setGl(_gl) {
    gl = _gl;
    for (const k in gl) {
        const v = gl[k];
        if (typeof v === 'number') {
            glEnum[v] = k;
        }
    }
}

export function isMatrix(type) {
    return (
        glEnum[type] === 'FLOAT_MAT4' ||
        glEnum[type] === 'FLOAT_MAT3' ||
        glEnum[type] === 'FLOAT_MAT2'
    );
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

export function buildArray(arrayBuffer, type, offset, length, stride?, count?) {
    const l = length;
    const c = length / count;
    if (stride && stride !== getCount(type) * c) {
        length = (stride * count) / getCount(type) - offset / getCount(type);
    }

    let arr;
    switch (glEnum[type]) {
        case 'BYTE':
            arr = new Int8Array(arrayBuffer, offset, length);
            arr.type = 'BYTE';
            break;
        case 'UNSIGNED_BYTE':
            arr = new Uint8Array(arrayBuffer, offset, length);
            arr.type = 'UNSIGNED_BYTE';
            break;
        case 'SHORT':
            arr = new Int16Array(arrayBuffer, offset, length);
            arr.type = 'SHORT';
            break;
        case 'UNSIGNED_SHORT':
            arr = new Uint16Array(arrayBuffer, offset, length);
            arr.type = 'UNSIGNED_SHORT';
            break;
        case 'UNSIGNED_INT':
            arr = new Uint32Array(arrayBuffer, offset, length);
            arr.type = 'UNSIGNED_INT';
            break;
        case 'FLOAT':
            arr = new Float32Array(arrayBuffer, offset, length);
            arr.type = 'FLOAT';
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
        // @ts-ignore
        stridedArr.type = arr.type;
        return stridedArr;
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

export function createTexture(type = gl.TEXTURE_2D) {
    const index = getTextureIndex();
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
        const xfov = yfov * aspect;

        proj = new Matrix4().setPerspective(
            xfov * zoom,
            aspect,
            cam.perspective.znear || 1,
            cam.perspective.zfar || 2e6
        );
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

export function getAttributeIndex(name) {
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
        case 'TEXCOORD_1':
            index = [7, 2, gl.FLOAT];
            break;
    }
    return index;
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

        let r =
            duv1.elements[0] * duv2.elements[1] -
            duv1.elements[1] * duv2.elements[0];
        r = r !== 0 ? 1.0 / r : 1.0;
        const udir = new Vector3([
            (duv2.elements[1] * dv1.elements[0] -
                duv1.elements[1] * dv2.elements[0]) *
                r,
            (duv2.elements[1] * dv1.elements[1] -
                duv1.elements[1] * dv2.elements[1]) *
                r,
            (duv2.elements[1] * dv1.elements[2] -
                duv1.elements[1] * dv2.elements[2]) *
                r
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
            return new Vector3([
                array[index],
                array[index + 1],
                array[index + 2]
            ]);
        }
        if (elements === 2) {
            return new Vector2([array[index], array[index + 1]]);
        }
    }

    function accumulateVectorInArray(
        array,
        index,
        vector,
        elements = 4,
        accumulator = (acc, x) => acc + x
    ) {
        index = index * elements;
        for (let i = 0; i < elements; ++i) {
            if (i === 3) {
                array[index + i] = -1;
            } else {
                array[index + i] = accumulator(
                    array[index + i],
                    vector.elements[i]
                );
            }
        }
    }
}

export function measureGPU() {
    const ext = gl.getExtension('EXT_disjoint_timer_query');
    const query = ext.createQueryEXT();

    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT);

    const available = ext.getQueryObjectEXT(
        query,
        ext.QUERY_RESULT_AVAILABLE_EXT
    );
    const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
    if (available && !disjoint) {
        const timeElapsed = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
        console.log(timeElapsed / 1000000);
    }
}
