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

    constructor(name, parent) {
        super(name, parent);

        this.program = null;
        this.defines = null;
        this.mode = 4;
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

    draw(gl, { lights, camera, light, needUpdateView, needUpdateProjection, preDepthTexture, isprepender, fakeDepth }) {
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

                this.material.uniformBuffer.update(gl, 'viewPos', camera.getPosition());

                gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
                this.material.lightUniformBuffer2.update(gl, 'lightPos', lightPos);
            }
        }
        if (this.material.lightUBO1) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, this.material.lightUBO1);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, this.material.lightUBO2);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 5, this.material.lightUBO3);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 6, this.material.lightUBO4);
        }

        gl.uniform1i(
            this.material.uniforms.depthTexture,
            (preDepthTexture && !isprepender) ? preDepthTexture.index : fakeDepth.index
        );

        if (this.material.pbrMetallicRoughness.baseColorTexture) {
            gl.activeTexture(gl[`TEXTURE${0}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.pbrMetallicRoughness.baseColorTexture);
            gl.bindSampler(0, this.material.pbrMetallicRoughness.baseColorTexture.sampler);
        }
        if (this.material.pbrMetallicRoughness.metallicRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${1}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.pbrMetallicRoughness.metallicRoughnessTexture);
            gl.bindSampler(1, this.material.pbrMetallicRoughness.metallicRoughnessTexture.sampler);
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
            gl.bindSampler(8, this.material.clearcoatRoughnessTexture.sampler);
        }
        if (this.material.clearcoatNormalTexture) {
            gl.activeTexture(gl[`TEXTURE${10}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatNormalTexture);
            gl.bindSampler(8, this.material.clearcoatNormalTexture.sampler);
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
