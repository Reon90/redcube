import { Vector3, Matrix4 } from '../matrix';
import { UniformBuffer } from './uniform';
import { buildArray, getDataType, calculateOffset, getAttributeIndex, calculateBinormals, getGlEnum, calculateNormals } from '../utils';
import { decoderModule, decodeDracoData, getArray } from '../decoder';

interface Attributes {
    POSITION: Float32Array;
    NORMAL: Float32Array;
    TEXCOORD_0: Float32Array;
    JOINTS_0: Float32Array;
    WEIGHTS_0: Float32Array;
    TANGENT: Float32Array;
}
interface BoundingSphere {
    min: Vector3;
    max: Vector3;
    center: Vector3;
    radius: number;
}

export class Geometry {
    UBO: WebGLBuffer;
    VAO: WebGLBuffer;
    uniformBuffer: UniformBuffer;
    indicesBuffer: Float32Array;
    attributes: Attributes;
    targets: Array<Attributes>;
    blend: string;
    uniforms: object;
    SKIN: WebGLBuffer;
    boundingSphere: BoundingSphere;

    constructor(gl, json, arrayBuffer, weights, primitive, hasNormal) {
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
            const decoder = new decoderModule.Decoder();
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
        } else {
            if (primitive.targets) {
                for (const target of primitive.targets) {
                    const vertexAcc = <Attributes>{};
                    for (const a in target) {
                        vertexAcc[a] = json.accessors[target[a]];
                        const accessor = vertexAcc[a];
                        const bufferView = json.bufferViews[accessor.bufferView];
                        vertexAcc[a] = buildArray(
                            arrayBuffer[bufferView.buffer],
                            accessor.componentType,
                            calculateOffset(bufferView.byteOffset, accessor.byteOffset),
                            getDataType(accessor.type) * accessor.count
                        );
                    }
                    this.targets.push(vertexAcc);
                }
            }

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
                vertexBuffers[k] = buildArray(
                    arrayBuffer[bufferView.buffer],
                    accessor.componentType,
                    calculateOffset(bufferView.byteOffset, accessor.byteOffset),
                    getDataType(accessor.type) * accessor.count,
                    bufferView.byteStride,
                    accessor.count
                );

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

                if (primitive.targets && k in primitive.targets[0]) {
                    let offset = 0;
                    const geometry = vertexBuffers[k];
                    vertexBuffers[k] = new Float32Array(geometry.length);
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

        if (hasNormal && primitive.attributes.TANGENT === undefined) {
            vertexBuffers.TANGENT = calculateBinormals(
                indicesBuffer,
                vertexBuffers.POSITION,
                vertexBuffers.NORMAL,
                vertexBuffers.TEXCOORD_0
            );
        }

        if (!vertexBuffers.NORMAL && indicesBuffer) {
            vertexBuffers.NORMAL = calculateNormals(indicesBuffer, vertexBuffers.POSITION);
        }

        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);

        for (const k in vertexBuffers) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, vertexBuffers[k], gl.STATIC_DRAW);
            const index = getAttributeIndex(k);
            gl.enableVertexAttribArray(index[0]);
            gl.vertexAttribPointer(index[0], index[1], index[2], false, 0, 0);
        }
        if (indicesBuffer) {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer, gl.STATIC_DRAW);
        }
        this.VAO = VAO;
        this.attributes = vertexBuffers;
        this.indicesBuffer = indicesBuffer;
        const { min, max } = boundingBox;
        this.boundingSphere.min = new Vector3(min);
        this.boundingSphere.max = new Vector3(max);

        this.calculateBounding();

        gl.bindVertexArray(null);
    }

    calculateBounding() {
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

    updateUniforms(gl, program, matrixWorld, camera, light) {
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

        const uIndex = gl.getUniformBlockIndex(program, 'Matrices');
        gl.uniformBlockBinding(program, uIndex, 0);
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, uniformBuffer.store, gl.DYNAMIC_DRAW);
        this.UBO = UBO;
        this.uniformBuffer = uniformBuffer;
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
}
