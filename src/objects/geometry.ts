import { Vector3 } from '../matrix';
import { UniformBuffer } from './uniform';
import {
    buildArray,
    buildArrayWithStride,
    getDataType,
    calculateOffset,
    calculateBinormals,
    getGlEnum,
    calculateNormals,
    calculateNormals2,
    calculateUVs,
    fanToTriListIndices,
    convertLineLoopToLineList
} from '../utils';
import { decodeDracoData, getArray } from '../decoder';

interface Attributes {
    POSITION: Float32Array;
    NORMAL: Float32Array;
    TEXCOORD_0: Float32Array;
    JOINTS_0: Float32Array;
    WEIGHTS_0: Float32Array;
    TANGENT: Float32Array;
    COLOR_0: Float32Array;
}
interface BoundingSphere {
    min: Vector3;
    max: Vector3;
    center: Vector3;
    radius: number;
}
interface Attr {
    componentType: string;
}

const GeometryEnum = {
    POSITION: [0, 3],
    TEXCOORD_0: [2, 2],
    NORMAL: [1, 3],
    TANGENT: [3, 4],
    JOINTS_0: [4, 4],
    WEIGHTS_0: [5, 4],
    COLOR_0: [6, 4],
    TEXCOORD_1: [7, 2],
    TEXCOORD_2: [8, 2]
};

export class Geometry {
    UBO: WebGLBuffer;
    VAO: WebGLBuffer;
    uniformBuffer: UniformBuffer;
    indicesBuffer: Uint32Array;
    attributes: Attributes;
    targets: Array<Attributes>;
    blend: string;
    uniforms: object;
    SKIN: WebGLBuffer;
    boundingSphere: BoundingSphere;
    vertexAccessor: Map<string, Attr>;
    indexType: number;
    cubeVertexSize: number;
    VBO: WebGLBuffer;

    indicesWebGPUBuffer: GPUBuffer;
    verticesWebGPUBuffer: GPUBuffer;
    uniformBindGroup1: GPUBindGroupEntry[];
    g: Float32Array;

    constructor(json, arrayBuffer, weights, draco, primitive) {
        this.boundingSphere = {
            center: new Vector3(),
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
        const vertexBuffers = <Attributes>{};
        const indicesAccessor = json.accessors[primitive.indices];
        this.indexType = indicesAccessor?.componentType;
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
            const bufferView = json.bufferViews[compresedMesh.bufferView];
            const decoder = new draco.Decoder();
            const decodedGeometry = decodeDracoData(arrayBuffer[bufferView.buffer], decoder, bufferView.byteOffset, bufferView.byteLength);
            const numFaces = decodedGeometry.num_faces();
            const numPoints = decodedGeometry.num_points();

            for (const k of vertexAccessor.keys()) {
                const attribute = decoder.GetAttributeByUniqueId(decodedGeometry, compresedMesh.attributes[k]);
                const size = getDataType(vertexAccessor.get(k).type);
                const [dracoArr, arr] = getArray(
                    getGlEnum(vertexAccessor.get(k).componentType),
                    numPoints * size,
                    decodedGeometry,
                    attribute,
                    decoder
                );

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
                draco.destroy(dracoArr);
                vertexBuffers[k] = arr;
            }

            {
                indicesBuffer = new Uint32Array(numFaces * 3);
                indicesBuffer.type = 'UNSIGNED_INT';
                const ia = new draco.DracoUInt32Array();
                for (let i = 0; i < numFaces; ++i) {
                    decoder.GetFaceFromMesh(decodedGeometry, i, ia);
                    const index = i * 3;
                    indicesBuffer[index] = ia.GetValue(0);
                    indicesBuffer[index + 1] = ia.GetValue(1);
                    indicesBuffer[index + 2] = ia.GetValue(2);
                }
                draco.destroy(ia);
            }

            draco.destroy(decoder);
            draco.destroy(decodedGeometry);
        } else {
            if (indicesAccessor) {
                const bufferView = json.bufferViews[indicesAccessor.bufferView];
                indicesBuffer = buildArray(
                    arrayBuffer[bufferView.buffer],
                    indicesAccessor.componentType,
                    calculateOffset(bufferView.byteOffset, indicesAccessor.byteOffset),
                    getDataType(indicesAccessor.type) * indicesAccessor.count
                );
                if (primitive.mode === 6) {
                    indicesBuffer = fanToTriListIndices(indicesBuffer);
                }
                if (primitive.mode === 2) {
                    indicesBuffer = convertLineLoopToLineList(indicesBuffer);
                }
            }
            for (const k of vertexAccessor.keys()) {
                const accessor = vertexAccessor.get(k);
                const bufferView = json.bufferViews[accessor.bufferView];
                vertexBuffers[k] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
            }
        }

        if (primitive.targets) {
            for (const target of primitive.targets) {
                const vertexAcc = <Attributes>{};
                for (const a in target) {
                    vertexAcc[a] = json.accessors[target[a]];
                    const accessor = vertexAcc[a];
                    const bufferView = json.bufferViews[accessor.bufferView];
                    vertexAcc[a] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
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
                    } else {
                        temp[i] = vertexBuffers[k][j];
                        j++;
                    }
                }
                vertexBuffers[k] = temp;
            }

            if (accessor.sparse !== undefined) {
                const itemSize = getDataType(accessor.type);
                const indicesBufferView = json.bufferViews[accessor.sparse.indices.bufferView];
                const valuesBufferView = json.bufferViews[accessor.sparse.values.bufferView];

                const sparseIndices = buildArray(
                    arrayBuffer[indicesBufferView.buffer],
                    accessor.sparse.indices.componentType,
                    calculateOffset(indicesBufferView.byteOffset, accessor.sparse.indices.byteOffset),
                    accessor.sparse.count
                );
                const sparseValues = buildArray(
                    arrayBuffer[valuesBufferView.buffer],
                    accessor.componentType,
                    calculateOffset(valuesBufferView.byteOffset, accessor.byteOffset),
                    getDataType(accessor.type) * accessor.sparse.count
                );

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
            vertexBuffers.NORMAL = calculateNormals(indicesBuffer, vertexBuffers.POSITION);
            vertexAccessor.set('NORMAL', { componentType: 5126 });
        }

        if (vertexBuffers.NORMAL === undefined && indicesBuffer === undefined) {
            vertexBuffers.NORMAL = calculateNormals2(vertexBuffers.POSITION);
            vertexAccessor.set('NORMAL', { componentType: 5126 });
        }

        if (vertexBuffers.TEXCOORD_0 === undefined && indicesBuffer) {
            vertexBuffers.TEXCOORD_0 = calculateUVs(vertexBuffers.POSITION, vertexBuffers.NORMAL);
            vertexAccessor.set('TEXCOORD_0', { componentType: 5126 });
        }

        if (primitive.attributes.TANGENT === undefined && indicesBuffer) {
            vertexBuffers.TANGENT = calculateBinormals(
                indicesBuffer,
                vertexBuffers.POSITION,
                vertexBuffers.NORMAL,
                vertexBuffers.TEXCOORD_0
            );
            vertexAccessor.set('TANGENT', { componentType: 5126 });
        }

        this.vertexAccessor = vertexAccessor;
        this.attributes = vertexBuffers;
        this.indicesBuffer = indicesBuffer;
        const { min, max } = boundingBox;
        this.boundingSphere.min = new Vector3(min);
        this.boundingSphere.max = new Vector3(max);
    }

    compose(order?) {
        let total = 12;
        if (order !== undefined) {
            total = 13;
        }
        const count = this.attributes['POSITION'].length / 3;
        const g = new Float32Array(
            (order !== undefined ? count : 0) + 
            count * 3 +
                count * 2 +
                count * 3 +
                count * 4 +
                (this.attributes['JOINTS_0']?.length ?? 0) +
                (this.attributes['WEIGHTS_0']?.length ?? 0) +
                (this.attributes['COLOR_0']?.length ?? 0) +
                (this.attributes['TEXCOORD_1']?.length ?? 0)
        );
        if (this.attributes['WEIGHTS_0']) {
            total += 8;
        }
        if (this.attributes['COLOR_0']) {
            total += 4;
        }
        if (this.attributes['TEXCOORD_1']) {
            total += 2;
        }
        let k = 0;
        let l = 0;
        let m = 0;
        for (let i = 0; i < g.length; i += total) {
            let j = 12;
            g[i] = this.attributes['POSITION'][k];
            g[i + 1] = this.attributes['POSITION'][k + 1];
            g[i + 2] = this.attributes['POSITION'][k + 2];

            g[i + 3] = this.attributes['TEXCOORD_0'][l];
            g[i + 4] = this.attributes['TEXCOORD_0'][l + 1];
            
            g[i + 5] = this.attributes['NORMAL'][k];
            g[i + 6] = this.attributes['NORMAL'][k + 1];
            g[i + 7] = this.attributes['NORMAL'][k + 2];
            if (this.attributes['TANGENT']) {
                g[i + 8] = this.attributes['TANGENT'][m];
                g[i + 9] = this.attributes['TANGENT'][m + 1];
                g[i + 10] = this.attributes['TANGENT'][m + 2];
                g[i + 11] = this.attributes['TANGENT'][m + 3];
            }

            if (this.attributes['WEIGHTS_0']) {
                g[i + 12] = this.attributes['JOINTS_0'][m];
                g[i + 13] = this.attributes['JOINTS_0'][m + 1];
                g[i + 14] = this.attributes['JOINTS_0'][m + 2];
                g[i + 15] = this.attributes['JOINTS_0'][m + 3];
                g[i + 16] = this.attributes['WEIGHTS_0'][m];
                g[i + 17] = this.attributes['WEIGHTS_0'][m + 1];
                g[i + 18] = this.attributes['WEIGHTS_0'][m + 2];
                g[i + 19] = this.attributes['WEIGHTS_0'][m + 3];
                j += 8;
            }
            if (this.attributes['COLOR_0']) {
                g[i + 12] = this.attributes['COLOR_0'][m];
                g[i + 13] = this.attributes['COLOR_0'][m + 1];
                g[i + 14] = this.attributes['COLOR_0'][m + 2];
                g[i + 15] = this.attributes['COLOR_0'][m + 3];
                j += 4;
            }
            if (this.attributes['TEXCOORD_1']) {
                g[i + 12] = this.attributes['TEXCOORD_1'][l];
                g[i + 13] = this.attributes['TEXCOORD_1'][l + 1];
                j += 2;
            }
            if (order !== undefined) {
                g[i + j] = order;
            }
            k += 3;
            l += 2;
            m += 4;
        }
        this.g = g;
    }

    createGeometryForWebGPU(WebGPU: WEBGPU) {
        const { device } = WebGPU;

        this.compose();

        const verticesBuffer = device.createBuffer({
            size: this.g.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(verticesBuffer.getMappedRange()).set(this.g);
        verticesBuffer.unmap();
        this.verticesWebGPUBuffer = verticesBuffer;

        if (this.indicesBuffer) {
            this.indicesBuffer = new Uint32Array(this.indicesBuffer); // HACK webgpu needs int32 indices
            const indicesBuffer = device.createBuffer({
                size: this.indicesBuffer.byteLength,
                usage: GPUBufferUsage.INDEX,
                mappedAtCreation: true
            });
            new Uint32Array(indicesBuffer.getMappedRange()).set(this.indicesBuffer);
            indicesBuffer.unmap();
            this.indicesWebGPUBuffer = indicesBuffer;
        }
    }

    createGeometryForWebGl(gl, defines, order) {
        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);

        this.compose(order);

        const VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, this.g, gl.STATIC_DRAW);
        this.VBO = VBO;

        const vertexLayout = [3, 2, 3, 4];
        if (defines.find(d => d.name === 'JOINTNUMBER')) {
            vertexLayout.push(4, 4);
        }
        if (defines.find(d => d.name === 'COLOR')) {
            vertexLayout.push(4);
        }
        if (defines.find(d => d.name === 'MULTIUV')) {
            vertexLayout.push(2);
        }
        vertexLayout.push(1);
        const cubeVertexSize = Float32Array.BYTES_PER_ELEMENT * vertexLayout.reduce((a, b) => a + b, 0);
        this.cubeVertexSize = cubeVertexSize;

        let offset = 0;
        for (const k in GeometryEnum) {
            if (k in this.attributes) {
                const index = GeometryEnum[k];
                gl.enableVertexAttribArray(index[0]);
                gl.vertexAttribPointer(index[0], index[1], gl.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
                offset += index[1];
            }
        }
        gl.enableVertexAttribArray(9);
        gl.vertexAttribPointer(9, 1, gl.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
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
            maxRadiusSq = Math.max(
                maxRadiusSq,
                this.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2])
            );
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    }

    createUniforms(matrixWorld) {
        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('model', matrixWorld.elements);
        uniformBuffer.done();

        this.uniformBuffer = uniformBuffer;
    }

    updateUniformsWebGPU(WebGPU: WEBGPU, buffer, usage = GPUBufferUsage.UNIFORM) {
        const matrixSize = buffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;

        const { device } = WebGPU;
        const uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: usage | GPUBufferUsage.COPY_DST
        });
        buffer.bufferWebGPU = uniformBuffer;

        const uniformBindGroup1 = [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                    offset: 0,
                    size: matrixSize
                }
            }
        ];

        device.queue.writeBuffer(
            uniformBuffer,
            0,
            buffer.store.buffer,
            buffer.store.byteOffset,
            buffer.store.byteLength
        );

        return uniformBindGroup1;
    }

    updateUniformsWebGl(gl, program) {
        const uIndex2 = gl.getUniformBlockIndex(program, 'Matrices2');
        gl.uniformBlockBinding(program, uIndex2, 1);
    }

    async updateWebGPU(WebGPU: WEBGPU, geometry) {
        const { device } = WebGPU;
        let total = 12;
        if (this.attributes['COLOR_0']) {
            total += 4;
        }
        if (this.attributes['TEXCOORD_1']) {
            total += 2;
        }
        let k = 0;
        let l = 0;
        let m = 0;
        const { g } = this;
        for (let i = 0; i < g.length; i += total) {
            if (geometry['POSITION']) {
                g[i] = geometry['POSITION'][k];
                g[i + 1] = geometry['POSITION'][k + 1];
                g[i + 2] = geometry['POSITION'][k + 2];
            }
            if (geometry['TEXCOORD_0']) {
                g[i + 3] = geometry['TEXCOORD_0'][l];
                g[i + 4] = geometry['TEXCOORD_0'][l + 1];
            }
            if (geometry['NORMAL']) {
                g[i + 5] = geometry['NORMAL'][k];
                g[i + 6] = geometry['NORMAL'][k + 1];
                g[i + 7] = geometry['NORMAL'][k + 2];
            }
            if (geometry['TANGENT']) {
                g[i + 8] = geometry['TANGENT'][m];
                g[i + 9] = geometry['TANGENT'][m + 1];
                g[i + 10] = geometry['TANGENT'][m + 2];
                g[i + 11] = geometry['TANGENT'][m + 3];
            }
            k += 3;
            l += 2;
            m += 4;
        }

        device.queue.writeBuffer(this.verticesWebGPUBuffer, 0, g.buffer, g.byteOffset, g.byteLength);
    }

    update(gl, geometry) {
        gl.bindVertexArray(this.VAO);

        let total = 13;
        if (this.attributes['COLOR_0']) {
            total += 4;
        }
        if (this.attributes['TEXCOORD_1']) {
            total += 2;
        }
        let k = 0;
        let l = 0;
        let m = 0;
        const { g } = this;
        for (let i = 0; i < g.length; i += total) {
            if (geometry['POSITION']) {
                g[i] = geometry['POSITION'][k];
                g[i + 1] = geometry['POSITION'][k + 1];
                g[i + 2] = geometry['POSITION'][k + 2];
            }
            if (geometry['TEXCOORD_0']) {
                g[i + 3] = geometry['TEXCOORD_0'][l];
                g[i + 4] = geometry['TEXCOORD_0'][l + 1];
            }
            if (geometry['NORMAL']) {
                g[i + 5] = geometry['NORMAL'][k];
                g[i + 6] = geometry['NORMAL'][k + 1];
                g[i + 7] = geometry['NORMAL'][k + 2];
            }
            if (geometry['TANGENT']) {
                g[i + 8] = geometry['TANGENT'][m];
                g[i + 9] = geometry['TANGENT'][m + 1];
                g[i + 10] = geometry['TANGENT'][m + 2];
                g[i + 11] = geometry['TANGENT'][m + 3];
            }
            k += 3;
            l += 2;
            m += 4;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, g, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
    }
}
