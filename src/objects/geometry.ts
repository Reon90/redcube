import { Vector3 } from '../matrix';
import { UniformBuffer } from './uniform';
import {
    buildArray,
    getDataType,
    calculateOffset,
    getAttributeIndex,
    calculateBinormals
} from '../utils';

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

        const indicesAccessor = json.accessors[primitive.indices];
        const vertexAccessor = new Map();
        for (const a in primitive.attributes) {
            vertexAccessor.set(a, json.accessors[primitive.attributes[a]]);
        }

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
                        calculateOffset(
                            bufferView.byteOffset,
                            accessor.byteOffset
                        ),
                        getDataType(accessor.type) * accessor.count
                    );
                }
                this.targets.push(vertexAcc);
            }
        }

        let indicesBuffer;
        if (indicesAccessor) {
            const bufferView = json.bufferViews[indicesAccessor.bufferView];
            indicesBuffer = buildArray(
                arrayBuffer[bufferView.buffer],
                indicesAccessor.componentType,
                calculateOffset(
                    bufferView.byteOffset,
                    indicesAccessor.byteOffset
                ),
                getDataType(indicesAccessor.type) * indicesAccessor.count
            );
        }
        const boundingBox = {
            min: vertexAccessor.get('POSITION').min,
            max: vertexAccessor.get('POSITION').max
        };
        const vertexBuffers = <Attributes>{};
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
                            return (
                                a +
                                weights[index] *
                                    this.targets[index][k][i - offset]
                            );
                        }, 0);
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
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                indicesBuffer,
                gl.STATIC_DRAW
            );
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
                this.boundingSphere.center.distanceToSquared(
                    vertices[i],
                    vertices[i + 1],
                    vertices[i + 2]
                )
            );
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    }
}
