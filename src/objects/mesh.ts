import { Matrix4, Vector3, Vector4 } from '../matrix';
import { Object3D } from './object3d';
import { Geometry } from './geometry';
import { Material } from './material';
import { ArrayBufferMap, GLTexture } from '../utils';
import { UniformBuffer } from './uniform';
import { Light } from './light';
import { Camera } from './camera';
import type { Scene } from './scene';
import type { Define, Skin } from '../parse';
import type { State, RenderPassState } from '../renderer';

export class Mesh extends Object3D {
    geometry!: Geometry;
    material!: Material;
    program: WebGLProgram | null;
    defines: Array<Define> | null;
    mode: number;
    frontFace?: boolean;
    distance!: number;
    variants: { m: Material; variants: number[] }[];
    order!: number;

    uniformBindGroup1!: GPUBindGroup;
    pipeline!: GPURenderPipeline;
    pipeline2?: GPURenderPipeline;

    constructor(name?: string | number, parent?: Object3D | Scene) {
        super(name, parent);

        this.program = null;
        this.defines = null;
        this.mode = 4;
        this.variants = [];
    }

    setDefines(defines: Array<Define>) {
        this.defines = defines;
    }

    setBlend(value: string) {
        this.material.blend = value;
    }

    setMaterial(material: Material) {
        this.material = material;
    }

    drawWebGPU(
        WebGPU: WEBGPU,
        passEncoder: GPURenderPassEncoder,
        i: number,
        { renderState, materialStorage, transformsStorage }: { renderState: RenderPassState; materialStorage: UniformBuffer; transformsStorage: UniformBuffer }
    ) {
        const { isprerefraction } = renderState;
        if (this.defines!.find(i => i.name === 'TRANSMISSION') && isprerefraction) {
            return;
        }
        if (this.reflow) {
            // matrixWorld changed
            transformsStorage.store!.set(this.matrixWorld.elements, i * this.geometry.uniformBuffer!.store!.length);
            WebGPU.device.queue.writeBuffer(transformsStorage.bufferWebGPU!, 0, transformsStorage.store!.buffer, transformsStorage.store!.byteOffset, transformsStorage.store!.byteLength);
        }
        if (this.repaint) {
            // matrixWorld changed
            materialStorage.store!.set(this.material.materialUniformBuffer.store!, i * this.material.materialUniformBuffer.store!.length);
            WebGPU.device.queue.writeBuffer(materialStorage.bufferWebGPU!, 0, materialStorage.store!.buffer, materialStorage.store!.byteOffset, materialStorage.store!.byteLength);
        }
        if (this instanceof SkinnedMesh) {
            if (this.bones.some(bone => bone.reflow)) {
                const jointMatrix = this.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                WebGPU.device.queue.writeBuffer(
                    this.skinBuffer,
                    0 * Float32Array.BYTES_PER_ELEMENT,
                    matrices.buffer,
                    matrices.byteOffset,
                    matrices.byteLength
                );
            }
        }

        passEncoder.setBindGroup(0, this.uniformBindGroup1);
        passEncoder.setVertexBuffer(0, this.geometry.verticesWebGPUBuffer!);
        if (this.geometry.indicesBuffer) {
            // const type = this.geometry.indexType < 5124 ? 'uint16' : 'uint32';
            passEncoder.setIndexBuffer(this.geometry.indicesWebGPUBuffer!, 'uint32');
            passEncoder.drawIndexed(this.geometry.indicesBuffer.length, this.instances, 0, 0, i);
        } else {
            passEncoder.draw(this.geometry.attributes.POSITION!.length / 3, this.instances, 0, i);
        }
    }

    draw(
        gl: WebGL2RenderingContext,
        {
            lights,
            camera,
            needUpdateProjection,
            preDepthTexture,
            colorTexture,
            renderState,
            fakeDepth,
            isIBL,
            isDefaultLight,
        }: State
    ) {
        const texUnit = (n: number) => (gl as unknown as Record<string, number>)[`TEXTURE${n}`];
        const glTypeEnum = (ctor: unknown) => (gl as unknown as Record<string, number>)[ArrayBufferMap.get(ctor)];
        const { isprepender, isprerefraction } = renderState;
        if (this.defines!.find(i => i.name === 'TRANSMISSION') && isprerefraction) {
            return;
        }
        gl.useProgram(this.program);

        gl.bindVertexArray(this.geometry.VAO);

        if (needUpdateProjection) {
            this.geometry.uniformBuffer!.update(gl, 'projection', camera.projection.elements);
        }
        this.geometry.uniformBuffer!.update(gl, 'isShadow', isprepender ? 1 : 0);

        if (this instanceof SkinnedMesh) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, this.geometry.SKIN);
            if (this.bones.some(bone => bone.reflow)) {
                const jointMatrix = this.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
            }
        }

        if (this.material.matrices.length) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 8, this.material.textureMatricesUniform!);
        }

        if (this.material.sphericalHarmonics) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 7, this.material.sphericalHarmonics);
        }

        gl.uniform1i(this.material.uniforms.depthTexture, preDepthTexture && !isprepender ? preDepthTexture.index : fakeDepth.index);
        gl.uniform1i(this.material.uniforms.colorTexture, !isprerefraction ? colorTexture.index : fakeDepth.index);
        gl.uniform1f(this.material.uniforms.isTone, isprerefraction ? 0 : 1);
        gl.uniform1f(this.material.uniforms.isIBL, isIBL ? 1 : 0);
        gl.uniform1f(this.material.uniforms.isDefaultLight, isDefaultLight || lights.some(l => !l.isInitial) ? 1 : 0);

        if (this.material.baseColorTexture) {
            gl.activeTexture(texUnit(0));
            gl.bindTexture(gl.TEXTURE_2D, this.material.baseColorTexture);
            gl.bindSampler(0, this.material.baseColorTexture.sampler);
        }
        if (this.material.metallicRoughnessTexture) {
            gl.activeTexture(texUnit(1));
            gl.bindTexture(gl.TEXTURE_2D, this.material.metallicRoughnessTexture);
            gl.bindSampler(1, this.material.metallicRoughnessTexture.sampler);
        }
        if (this.material.normalTexture) {
            gl.activeTexture(texUnit(2));
            gl.bindTexture(gl.TEXTURE_2D, this.material.normalTexture);
            gl.bindSampler(2, this.material.normalTexture.sampler as WebGLSampler);
        }
        if (this.material.occlusionTexture) {
            gl.activeTexture(texUnit(3));
            gl.bindTexture(gl.TEXTURE_2D, this.material.occlusionTexture);
            gl.bindSampler(3, this.material.occlusionTexture.sampler as WebGLSampler);
        }
        if (this.material.emissiveTexture) {
            gl.activeTexture(texUnit(4));
            gl.bindTexture(gl.TEXTURE_2D, this.material.emissiveTexture);
            gl.bindSampler(4, this.material.emissiveTexture.sampler as WebGLSampler);
        }
        if (this.material.clearcoatTexture) {
            gl.activeTexture(texUnit(8));
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatTexture);
            gl.bindSampler(8, this.material.clearcoatTexture.sampler);
        }
        if (this.material.clearcoatRoughnessTexture) {
            gl.activeTexture(texUnit(9));
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatRoughnessTexture);
            gl.bindSampler(9, this.material.clearcoatRoughnessTexture.sampler);
        }
        if (this.material.sheenColorTexture) {
            gl.activeTexture(texUnit(11));
            gl.bindTexture(gl.TEXTURE_2D, this.material.sheenColorTexture);
            gl.bindSampler(11, this.material.sheenColorTexture.sampler);
        }
        if (this.material.sheenRoughnessTexture) {
            gl.activeTexture(texUnit(12));
            gl.bindTexture(gl.TEXTURE_2D, this.material.sheenRoughnessTexture);
            gl.bindSampler(12, this.material.sheenRoughnessTexture.sampler);
        }
        if (this.material.iridescenceThicknessTexture) {
            gl.activeTexture(texUnit(17));
            gl.bindTexture(gl.TEXTURE_2D, this.material.iridescenceThicknessTexture);
            gl.bindSampler(17, this.material.iridescenceThicknessTexture.sampler);
        }
        if (this.material.iridescenceTexture) {
            gl.activeTexture(texUnit(23));
            gl.bindTexture(gl.TEXTURE_2D, this.material.iridescenceTexture);
            gl.bindSampler(23, this.material.iridescenceTexture.sampler);
        }
        if (this.material.diffuseTransmissionTexture) {
            gl.activeTexture(texUnit(20));
            gl.bindTexture(gl.TEXTURE_2D, this.material.diffuseTransmissionTexture);
            gl.bindSampler(20, this.material.diffuseTransmissionTexture.sampler);
        }
        if (this.material.diffuseTransmissionColorTexture) {
            gl.activeTexture(texUnit(21));
            gl.bindTexture(gl.TEXTURE_2D, this.material.diffuseTransmissionColorTexture);
            gl.bindSampler(21, this.material.diffuseTransmissionColorTexture.sampler);
        }
        if (this.material.anisotropyTexture) {
            gl.activeTexture(texUnit(22));
            gl.bindTexture(gl.TEXTURE_2D, this.material.anisotropyTexture);
            gl.bindSampler(22, this.material.anisotropyTexture.sampler);
        }
        if (this.material.clearcoatNormalTexture) {
            gl.activeTexture(texUnit(10));
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatNormalTexture);
            gl.bindSampler(10, this.material.clearcoatNormalTexture.sampler);
        }
        if (this.material.transmissionTexture) {
            gl.activeTexture(texUnit(14));
            gl.bindTexture(gl.TEXTURE_2D, this.material.transmissionTexture);
            gl.bindSampler(14, this.material.transmissionTexture.sampler);
        }
        if (this.material.specularTexture) {
            gl.activeTexture(texUnit(15));
            gl.bindTexture(gl.TEXTURE_2D, this.material.specularTexture);
            gl.bindSampler(15, this.material.specularTexture.sampler);
        }
        if (this.material.specularColorTexture) {
            gl.activeTexture(texUnit(19));
            gl.bindTexture(gl.TEXTURE_2D, this.material.specularColorTexture);
            gl.bindSampler(19, this.material.specularColorTexture.sampler);
        }
        if (this.material.thicknessTexture) {
            gl.activeTexture(texUnit(16));
            gl.bindTexture(gl.TEXTURE_2D, this.material.thicknessTexture);
            gl.bindSampler(16, this.material.thicknessTexture.sampler);
        }
        if (this.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }
        if (this.frontFace) {
            gl.frontFace(gl.CW);
        }

        if (this.instances > 1) {
            gl.drawElementsInstanced(
                this.mode,
                this.geometry.indicesBuffer!.length, glTypeEnum(this.geometry.indicesBuffer!.constructor), 0, this.instances
            );
        } else {
            if (this.geometry.indicesBuffer) {
                gl.drawElements(
                    this.mode === 2 ? gl.LINES : this.mode,
                    this.geometry.indicesBuffer.length,
                    glTypeEnum(this.geometry.indicesBuffer.constructor),
                    0
                );
            } else {
                gl.drawArrays(this.mode, 0, this.geometry.attributes.POSITION!.length / 3);
            }
        }

        if (this.material.doubleSided) {
            gl.enable(gl.CULL_FACE);
        }
        if (this.frontFace) {
            gl.frontFace(gl.CCW);
        }
    }

    setGeometry(geometry: Geometry) {
        this.geometry = geometry;
    }

    setProgram(value: WebGLProgram) {
        this.program = value;
    }

    setMode(value = 4) {
        this.mode = value;
    }

    setVariants(variants: { m: Material; variants: number[] }[]) {
        this.variants = variants;
    }

    setFrontFace() {
        this.frontFace = true;
        this.material.defines.push({ name: 'FRONTFACE' });
    }

    isVisible(planes: Vector4[]) {
        const c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
        const r = this.geometry.boundingSphere.radius! * this.matrixWorld.getMaxScaleOnAxis();
        let dist;
        let visible = true;
        for (const p of planes) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if (dist < -r) {
                visible = false;
                break;
            }
        }
        this.distance = dist! + r;

        return visible;
    }

    calculateBounding() {
        this.geometry.calculateBounding(this.matrixWorld);
        if (this.matrices.length) {
            for (const m of this.matrices) {
                this.geometry.calculateBounding(m);
            }
        }
    }
}

export class SkinnedMesh extends Mesh {
    bones!: Array<Bone>;
    boneInverses!: Array<Matrix4>;
    skin!: number;

    skinBuffer!: GPUBuffer;

    constructor(name?: string | number, parent?: Object3D | Scene) {
        super(name, parent);
    }

    setSkinWebGPU(WebGPU: WEBGPU, skin: Skin) {
        this.bones = skin.bones;
        this.boneInverses = skin.boneInverses;

        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
            matrices.set(j.elements, 0 + 16 * i);
            i++;
        }

        const matrixSize = matrices.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;

        const { device } = WebGPU;
        const uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.skinBuffer = uniformBuffer;

        const uniformBindGroup1 = {
            binding: 22,
            resource: uniformBuffer
        };

        device.queue.writeBuffer(uniformBuffer, 0, matrices.buffer, matrices.byteOffset, matrices.byteLength);

        return uniformBindGroup1;
    }

    setSkin(gl: WebGL2RenderingContext, skin: Skin) {
        this.bones = skin.bones;
        this.boneInverses = skin.boneInverses;

        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
            matrices.set(j.elements, 0 + 16 * i);
            i++;
        }
        const uIndex = gl.getUniformBlockIndex(this.program!, 'Skin');
        gl.uniformBlockBinding(this.program!, uIndex, 2);
        const UBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
        gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
        this.geometry.SKIN = UBO;
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);

        return this;
    }

    getJointMatrix() {
        const m = new Matrix4(this.matrixWorld).invert();
        const resArray = [];

        for (let mi = 0; mi < this.boneInverses.length; mi++) {
            const res = new Matrix4()
                .multiply(m)
                .multiply(this.bones[mi].matrixWorld)
                .multiply(this.boneInverses[mi]);
            resArray.push(res);
        }

        return resArray;
    }
}

export class Bone extends Object3D {}
