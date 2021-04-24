import { Matrix4, Vector3 } from '../matrix';
import { Object3D } from './object3d';
import { Geometry } from './geometry';
import { Material } from './material';
import { ArrayBufferMap } from '../utils';

export class Mesh extends Object3D {
    geometry: Geometry;
    material: Material;
    program: WebGLProgram;
    defines: Array<string>;
    mode: number;
    distance: number;
    visible: boolean;
    variants: {m: Material, variants: number[]}[];

    uniformBindGroup1: GPUBindGroup;
    pipeline: GPURenderPipeline;

    constructor(name, parent) {
        super(name, parent);

        this.program = null;
        this.defines = null;
        this.mode = 4;
        this.variants = [];
    }

    setDefines(defines) {
        this.defines = defines;
    }

    setBlend(value) {
        this.material.blend = value;
    }

    setMaterial(material) {
        this.material = material;
    }

    drawWebGPU(WebGPU, passEncoder, { needUpdateView, needUpdateProjection, camera, light }) {
        if (this.reflow) {
            // matrixWorld changed
            const normalMatrix = new Matrix4(this.matrixWorld);
            normalMatrix.invert().transpose();

            this.geometry.uniformBuffer.updateWebGPU(WebGPU, 'model', this.matrixWorld.elements);
            this.geometry.uniformBuffer.updateWebGPU(WebGPU, 'normalMatrix', normalMatrix.elements);
        }
        if (needUpdateView) {
            this.geometry.uniformBuffer.updateWebGPU(WebGPU, 'view', camera.matrixWorldInvert.elements);
            this.geometry.uniformBuffer.updateWebGPU(WebGPU, 'light', light.matrixWorldInvert.elements);
        }
        if (needUpdateProjection) {
            this.geometry.uniformBuffer.updateWebGPU(WebGPU, 'projection', camera.projection.elements);
        }

        passEncoder.setBindGroup(0, this.uniformBindGroup1);
        passEncoder.setVertexBuffer(0, this.geometry.verticesWebGPUBuffer );
        if (this.geometry.indicesBuffer) {
            passEncoder.setIndexBuffer(this.geometry.indicesWebGPUBuffer, 'uint32');
            passEncoder.drawIndexed(this.geometry.indicesBuffer.length);
        } else {
            passEncoder.draw(this.geometry.attributes.POSITION.length / 3, 1, 0, 0);
        }   
    }

    draw(gl, { lights, camera, light, needUpdateView, needUpdateProjection, preDepthTexture, colorTexture, renderState, fakeDepth, isIBL, isDefaultLight }) {
        const {isprepender, isprerefraction} = renderState;
        if (this.material.transmissionFactor && isprerefraction) {
            return;
        }
        gl.useProgram(this.program);

        gl.bindVertexArray(this.geometry.VAO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.geometry.UBO);
        if (this.reflow) {
            // matrixWorld changed
            const normalMatrix = new Matrix4(this.matrixWorld);
            normalMatrix.invert().transpose();

            this.geometry.uniformBuffer.update(gl, 'model', this.matrixWorld.elements);
            this.geometry.uniformBuffer.update(gl, 'normalMatrix', normalMatrix.elements);
        }

        if (needUpdateView) {
            this.geometry.uniformBuffer.update(gl, 'view', camera.matrixWorldInvert.elements);
            this.geometry.uniformBuffer.update(gl, 'light', light.matrixWorldInvert.elements);
        }
        if (needUpdateProjection) {
            this.geometry.uniformBuffer.update(gl, 'projection', camera.projection.elements);
        }
        this.geometry.uniformBuffer.update(gl, 'isShadow', isprepender ? 1 : 0);

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
        if (this.material.UBO) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.material.UBO);

            if (needUpdateView) {
                const lightPos = new Float32Array(lights.length * 3);
                lights.forEach((light, i) => {
                    lightPos.set(light.getPosition(), i * 3);
                });

                this.material.materialUniformBuffer.update(gl, 'viewPos', camera.getPosition());

                gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
                this.material.lightPosBuffer.update(gl, 'lightPos', lightPos);
            }
        }
        if (this.material.lightUBO1) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, this.material.lightUBO1);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 5, this.material.lightUBO3);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 6, this.material.lightUBO4);
        }

        if (this.material.sphericalHarmonics) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 7, this.material.sphericalHarmonics);
        }

        gl.uniform1i(
            this.material.uniforms.depthTexture,
            (preDepthTexture && !isprepender) ? preDepthTexture.index : fakeDepth.index
        );
        gl.uniform1i(
            this.material.uniforms.colorTexture,
            (!isprerefraction) ? colorTexture.index : fakeDepth.index
        );
        gl.uniform1i(gl.getUniformLocation(this.program, 'isTone'), isprerefraction ? 0 : 1);
        gl.uniform1i(gl.getUniformLocation(this.program, 'isIBL'), isIBL ? 1 : 0);
        gl.uniform1i(gl.getUniformLocation(this.program, 'isDefaultLight'), isDefaultLight || lights.some(l => !l.isInitial) ? 1 : 0);

        if (this.material.baseColorTexture) {
            gl.activeTexture(gl[`TEXTURE${0}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.baseColorTexture);
            gl.bindSampler(0, this.material.baseColorTexture.sampler);
        }
        if (this.material.metallicRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${1}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.metallicRoughnessTexture);
            gl.bindSampler(1, this.material.metallicRoughnessTexture.sampler);
        }
        if (this.material.normalTexture) {
            gl.activeTexture(gl[`TEXTURE${2}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.normalTexture);
            gl.bindSampler(2, this.material.normalTexture.sampler);
        }
        if (this.material.occlusionTexture) {
            gl.activeTexture(gl[`TEXTURE${3}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.occlusionTexture);
            gl.bindSampler(3, this.material.occlusionTexture.sampler);
        }
        if (this.material.emissiveTexture) {
            gl.activeTexture(gl[`TEXTURE${4}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.emissiveTexture);
            gl.bindSampler(4, this.material.emissiveTexture.sampler);
        }
        if (this.material.clearcoatTexture) {
            gl.activeTexture(gl[`TEXTURE${8}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatTexture);
            gl.bindSampler(8, this.material.clearcoatTexture.sampler);
        }
        if (this.material.clearcoatRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${9}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatRoughnessTexture);
            gl.bindSampler(9, this.material.clearcoatRoughnessTexture.sampler);
        }
        if (this.material.sheenColorTexture) {
            gl.activeTexture(gl[`TEXTURE${11}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.sheenColorTexture);
            gl.bindSampler(8, this.material.sheenColorTexture.sampler);
        }
        if (this.material.sheenRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${12}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.sheenRoughnessTexture);
            gl.bindSampler(8, this.material.sheenRoughnessTexture.sampler);
        }
        if (this.material.clearcoatNormalTexture) {
            gl.activeTexture(gl[`TEXTURE${10}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatNormalTexture);
            gl.bindSampler(10, this.material.clearcoatNormalTexture.sampler);
        }
        if (this.material.transmissionTexture) {
            gl.activeTexture(gl[`TEXTURE${14}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.transmissionTexture);
            gl.bindSampler(12, this.material.transmissionTexture.sampler);
        }
        if (this.material.specularTexture) {
            gl.activeTexture(gl[`TEXTURE${15}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.specularTexture);
            gl.bindSampler(12, this.material.specularTexture.sampler);
        }
        if (this.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }

        if (this.geometry.indicesBuffer) {
            gl.drawElements(
                this.mode,
                this.geometry.indicesBuffer.length,
                gl[ArrayBufferMap.get(this.geometry.indicesBuffer.constructor)],
                0
            );
        } else {
            gl.drawArrays(this.mode, 0, this.geometry.attributes.POSITION.length / 3);
        }

        if (this.material.doubleSided) {
            gl.enable(gl.CULL_FACE);
        }
    }

    setGeometry(geometry) {
        this.geometry = geometry;
    }

    setProgram(value) {
        this.program = value;
    }

    setMode(value = 4) {
        this.mode = value;
    }

    setVariants(variants) {
        this.variants = variants;
    }

    isVisible(planes) {
        const c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
        const r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
        let dist;
        let visible = true;
        for (const p of planes) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if (dist < -r) {
                visible = false;
                break;
            }
        }
        this.distance = dist + r;

        return visible;
    }

    calculateBounding() {
        this.geometry.calculateBounding(this.matrixWorld);
    }
}

export class SkinnedMesh extends Mesh {
    bones: Array<Bone>;
    boneInverses: Array<Matrix4>;
    skin: string;

    constructor(name, parent) {
        super(name, parent);
    }

    setSkin(gl, skin) {
        this.bones = skin.bones;
        this.boneInverses = skin.boneInverses;

        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
            matrices.set(j.elements, 0 + 16 * i);
            i++;
        }
        const uIndex = gl.getUniformBlockIndex(this.program, 'Skin');
        gl.uniformBlockBinding(this.program, uIndex, 2);
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
