import { Matrix2, Matrix3, Matrix4, Vector3, Vector4 } from './matrix';

let glEnum;
let gl;

export function setGlEnum(g) {
    glEnum = g;
}
export function setGl(g) {
    gl = g;
}

export function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
}

export function random(min, max) {
    return Math.random() * (max - min) + min;
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
    } else if (type === 'weights') {
        return 2;
    } else {
        return 3;
    }
}

export function getAnimationMethod(type) {
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
        console.error(log);
    }
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
    let len = pos.elements[0] * pos.elements[0] + pos.elements[1] * pos.elements[1];
    const sz = 0.04 * 0.04 - len;
    if (sz > 0) {
        return [pos.elements[0], pos.elements[1], Math.sqrt(sz)];
    } else {
        len = Math.sqrt(len);
        return [0.04 * pos.elements[0] / len, 0.04 * pos.elements[1] / len, 0];
    }
}

export function canvasToWorld(x, y, projection, width, height) {
    const newM = new Matrix4();
    newM.setTranslate(...(new Vector3([0, 0, 0.05]).elements));
    const m = new Matrix4(projection);
    m.multiply(newM);

    const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
    mp.elements[0] = (2 * x / width - 1) * mp.elements[3];
    mp.elements[1] = (-2 * y / height + 1) * mp.elements[3];

    return m.invert().multiplyVector4(mp);
}

export function calculateProjection(cam, aspect, zoom) {
    let proj;
    if ( cam.type === 'perspective' && cam.perspective ) {
        const {yfov} = cam.perspective;
        const aspectRatio = cam.perspective.aspectRatio || aspect;
        const xfov = yfov * aspect;

        if (aspect !== aspectRatio) {
            console.warn('this.canvas size and this.canvas size from scene dont equal');
        }

        proj = new Matrix4().setPerspective(xfov * zoom * (180 / Math.PI), aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
    } else if ( cam.type === 'orthographic' && cam.orthographic ) {
        proj = new Matrix4().setOrtho( cam.orthographic.xmag, cam.orthographic.ymag, cam.orthographic.znear, cam.orthographic.zfar);
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
    }
    return index;
}
