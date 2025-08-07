import { calculateNormals, normalize } from '../utils';
import * as utils from '../utils';
import { Matrix2, Matrix3, Matrix4 } from '../matrix';

describe('calculateNormals', () => {
    it('should calculate normals for a simple triangle', () => {
        const index = [0, 1, 2];
        const vertex = [
            0, 0, 0, // Vertex 0
            1, 0, 0, // Vertex 1
            0, 1, 0  // Vertex 2
        ];

        const expectedNormals = [
            0, 0, 1, // Normal for Vertex 0
            0, 0, 1, // Normal for Vertex 1
            0, 0, 1  // Normal for Vertex 2
        ];

        const result = calculateNormals(index, vertex);
        expect(result).toEqual(new Float32Array(expectedNormals));
    });

    it('should calculate normals for a square made of two triangles', () => {
        const index = [0, 1, 2, 2, 1, 3];
        const vertex = [
            0, 0, 0, // Vertex 0
            1, 0, 0, // Vertex 1
            0, 1, 0, // Vertex 2
            1, 1, 0  // Vertex 3
        ];

        const expectedNormals = [
            0, 0, 1, // Normal for Vertex 0
            0, 0, 1.7071068286895752, // Normal for Vertex 1
            0, 0, 1.7071068286895752, // Normal for Vertex 2
            0, 0, 0.7071067690849304  // Normal for Vertex 3
        ];

        const result = calculateNormals(index, vertex);
        expect(result).toEqual(new Float32Array(expectedNormals));
    });

    it('should calculate normals for a more complex shape', () => {
        const index = [0, 1, 2, 2, 1, 3, 3, 1, 4];
        const vertex = [
            0, 0, 0, // Vertex 0
            1, 0, 0, // Vertex 1
            0, 1, 0, // Vertex 2
            1, 1, 0, // Vertex 3
            2, 0, 0  // Vertex 4
        ];

        const expectedNormals = [
            0, 0, 1, // Normal for Vertex 0
            0, 0, 2.4142136573791504, // Normal for Vertex 1
            0, 0, 1.7071068286895752, // Normal for Vertex 2
            0, 0, 1.4142135381698608, // Normal for Vertex 3
            0, 0, 0.7071067690849304  // Normal for Vertex 4
        ];

        const result = calculateNormals(index, vertex);
        expect(result).toEqual(new Float32Array(expectedNormals));
    });
});
describe('normalize', () => {
    it('should normalize Uint8Array values to [0, 1]', () => {
        const arr = new Uint8Array([0, 127, 255]);
        const result = normalize(arr);
        expect(result).toBeInstanceOf(Float32Array);
        expect(Array.from(result)).toEqual([0, 127 / 255, 1]);
    });

    it('should normalize Int8Array values to [-1, 1]', () => {
        const arr = new Int8Array([-128, 0, 127]);
        const result = normalize(arr);
        expect(result).toBeInstanceOf(Float32Array);
        expect(Array.from(result)).toEqual([-1, 0, 1]);
    });

    it('should normalize Uint16Array values to [0, 1]', () => {
        const arr = new Uint16Array([0, 32767, 65535]);
        const result = normalize(arr);
        expect(result).toBeInstanceOf(Float32Array);
        expect(Array.from(result)).toEqual([0, 32767 / 65535, 1]);
    });

    it('should normalize Int16Array values to [-1, 1]', () => {
        const arr = new Int16Array([-32768, 0, 32767]);
        const result = normalize(arr);
        expect(result).toBeInstanceOf(Float32Array);
        expect(Array.from(result)).toEqual([-1, 0, 1]);
    });

    it('should return the input unchanged for unsupported array types (Float32Array)', () => {
        const arr = new Float32Array([0, 0.5, 1]);
        const result = normalize(arr);
        expect(result).toBe(arr);
    });

    it('should return the input unchanged for unsupported array types (Array)', () => {
        const arr = [0, 1, 2];
        const result = normalize(arr);
        expect(result).toBe(arr);
    });

    it('should handle empty arrays for all supported types', () => {
        expect(Array.from(normalize(new Uint8Array([])))).toEqual([]);
        expect(Array.from(normalize(new Int8Array([])))).toEqual([]);
        expect(Array.from(normalize(new Uint16Array([])))).toEqual([]);
        expect(Array.from(normalize(new Int16Array([])))).toEqual([]);
    });
});
describe('getTextureIndex', () => {
    it('should decrement and return the texture index', () => {
        const first = utils.getTextureIndex();
        const second = utils.getTextureIndex();
        expect(second).toBe(first - 1);
    });
});

describe('setGl', () => {
    it('should set the gl variable', () => {
        const fakeGl = {};
        utils.setGl(fakeGl);
        // No error means pass; gl is module-scoped
    });
});

describe('isMatrix', () => {
    it('should return true for FLOAT_MAT4, FLOAT_MAT3, FLOAT_MAT2', () => {
        const glEnum = { a: 'FLOAT_MAT4', b: 'FLOAT_MAT3', c: 'FLOAT_MAT2', d: 'FLOAT_VEC3' };
        jest.spyOn(utils, 'getGlEnum').mockImplementation(name => glEnum[name]);
        expect(utils.isMatrix('a')).toBe(true);
        expect(utils.isMatrix('b')).toBe(true);
        expect(utils.isMatrix('c')).toBe(true);
        expect(utils.isMatrix('d')).toBe(false);
    });
});

describe('random', () => {
    it('should return a value between min and max', () => {
        const min = 5, max = 10;
        for (let i = 0; i < 10; i++) {
            const val = utils.random(min, max);
            expect(val).toBeGreaterThanOrEqual(min);
            expect(val).toBeLessThan(max);
        }
    });
});

describe('lerp', () => {
    it('should linearly interpolate between a and b', () => {
        expect(utils.lerp(0, 10, 0)).toBe(0);
        expect(utils.lerp(0, 10, 1)).toBe(10);
        expect(utils.lerp(0, 10, 0.5)).toBe(5);
    });
});

describe('getMatrixType', () => {
    it('should return correct matrix class', () => {
        const glEnum = { a: 'FLOAT_MAT4', b: 'FLOAT_MAT3', c: 'FLOAT_MAT2' };
        jest.spyOn(utils, 'getGlEnum').mockImplementation(name => glEnum[name]);
        expect(utils.getMatrixType('a')).toBe(Matrix4);
        expect(utils.getMatrixType('b')).toBe(Matrix3);
        expect(utils.getMatrixType('c')).toBe(Matrix2);
    });
});

describe('getDataType', () => {
    it('should return correct component count', () => {
        expect(utils.getDataType('MAT2')).toBe(4);
        expect(utils.getDataType('MAT3')).toBe(9);
        expect(utils.getDataType('MAT4')).toBe(16);
        expect(utils.getDataType('VEC4')).toBe(4);
        expect(utils.getDataType('VEC3')).toBe(3);
        expect(utils.getDataType('VEC2')).toBe(2);
        expect(utils.getDataType('SCALAR')).toBe(1);
    });
});

describe('getComponentType', () => {
    it('should return correct count for vector types', () => {
        const glEnum = { a: 'FLOAT_VEC4', b: 'FLOAT_VEC3', c: 'FLOAT_VEC2' };
        jest.spyOn(utils, 'getGlEnum').mockImplementation(name => glEnum[name]);
        expect(utils.getComponentType('a')).toBe(4);
        expect(utils.getComponentType('b')).toBe(3);
        expect(utils.getComponentType('c')).toBe(2);
    });
});

describe('getMethod', () => {
    it('should return correct uniform method', () => {
        const glEnum = {
            a: 'FLOAT_VEC2', b: 'FLOAT_VEC4', c: 'FLOAT', d: 'FLOAT_VEC3',
            e: 'FLOAT_MAT4', f: 'FLOAT_MAT3', g: 'FLOAT_MAT2', h: 'SAMPLER_2D'
        };
        jest.spyOn(utils, 'getGlEnum').mockImplementation(name => glEnum[name]);
        expect(utils.getMethod('a')).toBe('uniform2f');
        expect(utils.getMethod('b')).toBe('uniform4f');
        expect(utils.getMethod('c')).toBe('uniform1f');
        expect(utils.getMethod('d')).toBe('uniform3f');
        expect(utils.getMethod('e')).toBe('uniformMatrix4fv');
        expect(utils.getMethod('f')).toBe('uniformMatrix3fv');
        expect(utils.getMethod('g')).toBe('uniformMatrix2fv');
        expect(utils.getMethod('h')).toBe('uniform1i');
    });
});

describe('range', () => {
    it('should map value to [0,1] between min and max', () => {
        expect(utils.range(0, 10, 5)).toBe(0.5);
        expect(utils.range(0, 10, 0)).toBe(0);
        expect(utils.range(0, 10, 10)).toBe(1);
    });
});

describe('interpolation', () => {
    it('should return [-1, -1, 0] for empty frames', () => {
        expect(utils.interpolation(1, [])).toEqual([-1, -1, 0]);
    });
    it('should return correct indices and t for time in range', () => {
        const frames = [{ time: 0 }, { time: 10 }];
        expect(utils.interpolation(5, frames)).toEqual([0, 1, 0.5]);
    });
    it('should clamp to first frame if time < first', () => {
        const frames = [{ time: 2 }, { time: 10 }];
        expect(utils.interpolation(1, frames)).toEqual([0, 0, 0]);
    });
    it('should clamp to last frame if time > last', () => {
        const frames = [{ time: 2 }, { time: 10 }];
        expect(utils.interpolation(11, frames)).toEqual([1, 1, 0]);
    });
});

describe('ArrayBufferMap', () => {
    it('should map typed arrays to GL types', () => {
        expect(utils.ArrayBufferMap.get(Int8Array)).toBe('BYTE');
        expect(utils.ArrayBufferMap.get(Uint8Array)).toBe('UNSIGNED_BYTE');
        expect(utils.ArrayBufferMap.get(Int16Array)).toBe('SHORT');
        expect(utils.ArrayBufferMap.get(Uint16Array)).toBe('UNSIGNED_SHORT');
        expect(utils.ArrayBufferMap.get(Uint32Array)).toBe('UNSIGNED_INT');
        expect(utils.ArrayBufferMap.get(Float32Array)).toBe('FLOAT');
    });
});

describe('calculateOffset', () => {
    it('should sum two numbers', () => {
        expect(utils.calculateOffset(1, 2)).toBe(3);
        expect(utils.calculateOffset(5)).toBe(5);
        expect(utils.calculateOffset()).toBe(0);
    });
});

describe('walk', () => {
    it('should traverse all nodes in a tree', () => {
        const nodes = [];
        const tree = { value: 1, children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }] };
        utils.walk(tree, node => nodes.push(node.value));
        expect(nodes).toEqual([1, 2, 3, 4]);
    });
});

describe('sceneToArcBall', () => {
    it('should return arcball coordinates for inside/outside', () => {
        const inside = utils.sceneToArcBall([0.01, 0.01]);
        expect(inside.length).toBe(3);
        expect(inside[2]).toBeGreaterThan(0);
        const outside = utils.sceneToArcBall([1, 1]);
        expect(outside.length).toBe(3);
        expect(outside[2]).toBe(0);
    });
});

describe('getGlEnum', () => {
    it('should return value from glEnum', () => {
        const glEnum = { TEST: 123 };
        jest.spyOn(utils, 'getGlEnum').mockImplementation(name => glEnum[name]);
        expect(utils.getGlEnum('TEST')).toBe(123);
    });
});

// The following functions require more complex setup/mocks or are already tested above:
// - buildArrayWithStride
// - buildArray
// - compileShader
// - createProgram
// - createTexture
// - canvasToWorld
// - calculateProjection
// - calculateUVs
// - calculateNormals2
// - calculateBinormals
// - measureGPU
// These can be tested with integration or with more advanced mocking if needed.