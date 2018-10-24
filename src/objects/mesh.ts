import { Matrix4, Vector3 } from '../matrix';
import { Material } from '../GLTF';
import { Object3D } from './object3d';
import { Geometry } from './geometry';

interface MeshMaterial extends Material {
    blend: string;
    uniforms: Uniforms;
    alphaMode: string;
    UBO: WebGLBuffer;
}
interface Uniforms {
    baseColorTexture: WebGLUniformLocation;
    metallicRoughnessTexture: WebGLUniformLocation;
    normalTexture: WebGLUniformLocation;
    occlusionTexture: WebGLUniformLocation;
    emissiveTexture: WebGLUniformLocation;
}

export class Mesh extends Object3D {
    geometry: Geometry;
    material: MeshMaterial;
    program: WebGLProgram;
    defines: Array<string>;
    mode: number;
    distance: number;
    visible: boolean;

    constructor(name, parent) {
        super(name, parent);

        this.material = {
            blend: null,
            uniforms: null,
            alphaMode: null,
            UBO: null,
            pbrMetallicRoughness: null
        };
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
        this.material.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            emissiveTexture: null
        };
    }

    draw(gl, {camera, light, preDepthTexture, fakeDepth, needUpdateView, needUpdateProjection, irradiancemap, prefilterMap, brdfLUT}, isShadow, isLight) {
        gl.useProgram(this.program);

        gl.bindVertexArray(this.geometry.VAO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.geometry.UBO);
        if (this.reflow) { // matrixWorld changed
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
        this.geometry.uniformBuffer.update(gl, 'isShadow', new Float32Array([isLight ? 1 : 0]));

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
                this.material.uniformBuffer.update(gl, 'lightPos', light.getPosition());
                this.material.uniformBuffer.update(gl, 'viewPos', camera.getPosition());
            }
        }

        gl.uniform1i( gl.getUniformLocation(this.program, 'prefilterMap'), prefilterMap.index);
        gl.uniform1i( gl.getUniformLocation(this.program, 'brdfLUT'), brdfLUT.index);
        gl.uniform1i( gl.getUniformLocation(this.program, 'irradianceMap'), irradiancemap.index);
        gl.uniform1i( gl.getUniformLocation(this.program, 'depthTexture'), isShadow ? fakeDepth.index : preDepthTexture.index);
        let index = 31;
        if (this.material.pbrMetallicRoughness.baseColorTexture) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.pbrMetallicRoughness.baseColorTexture);
            gl.bindSampler(index, this.material.pbrMetallicRoughness.baseColorTexture.sampler);
            gl.uniform1i(this.material.uniforms.baseColorTexture, index);
            index--;
        }
        if (this.material.pbrMetallicRoughness.metallicRoughnessTexture) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.pbrMetallicRoughness.metallicRoughnessTexture);
            gl.bindSampler(index, this.material.pbrMetallicRoughness.metallicRoughnessTexture.sampler);
            gl.uniform1i(this.material.uniforms.metallicRoughnessTexture, index);
            index--;
        }
        if (this.material.normalTexture) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.normalTexture);
            gl.bindSampler(index, this.material.normalTexture.sampler);
            gl.uniform1i(this.material.uniforms.normalTexture, index);
            index--;
        }
        if (this.material.occlusionTexture) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.occlusionTexture);
            gl.bindSampler(index, this.material.occlusionTexture.sampler);
            gl.uniform1i(this.material.uniforms.occlusionTexture, index);
            index--;
        }
        if (this.material.emissiveTexture) {
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.material.emissiveTexture);
            gl.bindSampler(index, this.material.emissiveTexture.sampler);
            gl.uniform1i(this.material.uniforms.emissiveTexture, index);
            index--;
        }
        if (this.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }

        if (this.geometry.indicesBuffer) {
            // @ts-ignore
            gl.drawElements(this.mode, this.geometry.indicesBuffer.length, gl[this.geometry.indicesBuffer.type], 0);
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
        for ( const p of planes ) {
            dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
            if ( dist < -r ) {
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
    skin: string;
    boneInverses: Array<Matrix4>;

    constructor(name, parent) {
        super(name, parent);
    }

    setSkin(value) {
        this.skin = value;
        return this;
    }

    getJointMatrix() {
        const m = new Matrix4(this.matrixWorld).invert();
        const resArray = [];

        for ( let mi = 0; mi < this.boneInverses.length; mi++ ) {
            const res = new Matrix4()
                .multiply( m )
                .multiply( this.bones[ mi ].matrixWorld )
                .multiply( this.boneInverses[ mi ] );
            resArray.push(res);
        }

        return resArray;
    }
}

export class Bone extends Object3D {
    
}
