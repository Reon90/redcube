import { calculateNormals } from '../utils';

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