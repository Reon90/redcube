import { Matrix2, Matrix3, Matrix4 } from './matrix';

let glEnum;

export function setGl(gl) {
    glEnum = gl;
}

export function isMatrix(type) {
    return glEnum[type] === 'FLOAT_MAT4' || glEnum[type] === 'FLOAT_MAT3' || glEnum[type] === 'FLOAT_MAT2';
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
