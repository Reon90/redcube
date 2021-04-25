import { Vector3, Matrix4 } from '../matrix';
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
    ArrayBufferMap
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
    NORMAL: [1, 3],
    TEXCOORD_0: [2, 2],
    JOINTS_0: [3, 4],
    WEIGHTS_0: [4, 4],
    TANGENT: [5, 4],
    COLOR_0: [6, 4],
    TEXCOORD_1: [7, 2]
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

    createGeometryForWebGPU(WebGPU: WEBGPU) {
        const { device } = WebGPU;

        let total = 12;
        const count = this.attributes['POSITION'].length / 3;
        const g = new Float32Array(
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
            g[i] = this.attributes['POSITION'][k];
            g[i + 1] = this.attributes['POSITION'][k + 1];
            g[i + 2] = this.attributes['POSITION'][k + 2];
            if (this.attributes['TEXCOORD_0']) {
                g[i + 3] = this.attributes['TEXCOORD_0'][l];
                g[i + 4] = this.attributes['TEXCOORD_0'][l + 1];
            }
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
            }
            if (this.attributes['COLOR_0']) {
                g[i + 12] = this.attributes['COLOR_0'][m];
                g[i + 13] = this.attributes['COLOR_0'][m + 1];
                g[i + 14] = this.attributes['COLOR_0'][m + 2];
                g[i + 15] = this.attributes['COLOR_0'][m + 3];
            }
            if (this.attributes['TEXCOORD_1']) {
                g[i + 12] = this.attributes['TEXCOORD_1'][l];
                g[i + 13] = this.attributes['TEXCOORD_1'][l + 1];
            }
            k += 3;
            l += 2;
            m += 4;
        }
        this.g = g;

        const verticesBuffer = device.createBuffer({
            size: g.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Float32Array(verticesBuffer.getMappedRange()).set(g);
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
            maxRadiusSq = Math.max(
                maxRadiusSq,
                this.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2])
            );
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    }

    createUniforms(matrixWorld, camera, light) {
        const normalMatrix = new Matrix4(matrixWorld);
        normalMatrix.invert().transpose();

        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('model', matrixWorld.elements);
        uniformBuffer.add('normalMatrix', normalMatrix.elements);
        uniformBuffer.add('view', camera.matrixWorldInvert.elements);
        uniformBuffer.add('projection', camera.projection.elements);
        uniformBuffer.add('light', light.matrixWorldInvert.elements);
        uniformBuffer.add('isShadow', 0);
        uniformBuffer.done();

        this.uniformBuffer = uniformBuffer;
    }

    updateUniformsWebGPU(WebGPU: WEBGPU) {
        const matrixSize = this.uniformBuffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;

        const { device } = WebGPU;
        const uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.uniformBuffer.bufferWebGPU = uniformBuffer;

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
            this.uniformBuffer.store.buffer,
            this.uniformBuffer.store.byteOffset,
            this.uniformBuffer.store.byteLength
        );

        this.uniformBindGroup1 = uniformBindGroup1;
    }

    updateUniformsWebGl(gl, program) {
        const uIndex = gl.getUniformBlockIndex(program, 'Matrices');
        gl.uniformBlockBinding(program, uIndex, 0);
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, this.uniformBuffer.store, gl.DYNAMIC_DRAW);
        this.UBO = UBO;
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    async updateWebGPU(WebGPU: WEBGPU, geometry) {
        const { device, commandEncoder } = WebGPU;
        const total = 12;
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
        const verticesBuffer = device.createBuffer({
            size: g.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true
        });
        new Float32Array(verticesBuffer.getMappedRange()).set(g);
        verticesBuffer.unmap();
        commandEncoder.copyBufferToBuffer(verticesBuffer, 0, this.verticesWebGPUBuffer, 0, g.byteLength);
    }

    update(gl, geometry) {
        gl.bindVertexArray(this.VAO);

        for (const k in geometry) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, geometry[k], gl.STATIC_DRAW);
            const index = GeometryEnum[k];
            gl.enableVertexAttribArray(index[0]);
            gl.vertexAttribPointer(index[0], index[1], gl[ArrayBufferMap.get(this.attributes[k].constructor)], false, 0, 0);
        }

        gl.bindVertexArray(null);
    }
}
