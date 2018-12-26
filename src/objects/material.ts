import { Matrix3 } from '../matrix';
import { UniformBuffer } from './uniform';
import { Material as M } from '../../GLTF';

const defaultMaterial = {
    pbrMetallicRoughness: {
        baseColorFactor: [1, 0, 0, 1]
    }
} as M;

interface Uniforms {
    baseColorTexture: WebGLUniformLocation;
    metallicRoughnessTexture: WebGLUniformLocation;
    normalTexture: WebGLUniformLocation;
    occlusionTexture: WebGLUniformLocation;
    emissiveTexture: WebGLUniformLocation;
    prefilterMap: WebGLUniformLocation;
    brdfLUT: WebGLUniformLocation;
    irradianceMap: WebGLUniformLocation;
    depthTexture: WebGLUniformLocation;
}

export class Material extends M {
    blend: string;
    uniforms: Uniforms;
    alphaMode: string;
    UBO: WebGLBuffer;
    doubleSided: boolean;

    constructor(m = defaultMaterial, textures, defines) {
        super();

        const material = Object.assign({}, m);
        this.defines = defines;

        if (
            !material.pbrMetallicRoughness &&
            material.extensions &&
            material.extensions.KHR_materials_pbrSpecularGlossiness
        ) {
            material.pbrMetallicRoughness = {};
            const SG = material.extensions.KHR_materials_pbrSpecularGlossiness;
            material.pbrMetallicRoughness.baseColorTexture = SG.diffuseTexture;
            material.pbrMetallicRoughness.metallicRoughnessTexture =
                SG.specularGlossinessTexture;
            material.pbrMetallicRoughness.baseColorFactor = SG.diffuseFactor;
            material.pbrMetallicRoughness.specularFactor = SG.specularFactor;
            material.pbrMetallicRoughness.glossinessFactor =
                SG.glossinessFactor;
            defines.push({ name: 'SPECULARGLOSSINESSMAP' });
        }

        this.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            emissiveTexture: null,
            prefilterMap: null,
            brdfLUT: null,
            irradianceMap: null,
            depthTexture: null
        };
        this.pbrMetallicRoughness = {
            baseColorFactor: material.pbrMetallicRoughness.baseColorFactor,
            roughnessFactor: material.pbrMetallicRoughness.roughnessFactor,
            metallicFactor: material.pbrMetallicRoughness.metallicFactor,
            emissiveFactor: material.pbrMetallicRoughness.emissiveFactor,
            specularFactor: material.pbrMetallicRoughness.specularFactor,
            glossinessFactor: material.pbrMetallicRoughness.glossinessFactor
        };
        this.alphaMode = material.alphaMode;
        this.blend = material.blend;
        this.doubleSided = material.doubleSided;

        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            this.pbrMetallicRoughness.metallicRoughnessTexture =
                textures[
                    material.pbrMetallicRoughness.metallicRoughnessTexture.index
                ];
            defines.push({ name: 'METALROUGHNESSMAP' });
        }
        if (material.normalTexture) {
            this.normalTexture = textures[material.normalTexture.index];
            defines.push({ name: 'NORMALMAP' });
        }
        if (material.occlusionTexture) {
            this.occlusionTexture = textures[material.occlusionTexture.index];
            defines.push({ name: 'OCCLUSIONMAP' });
        }
        if (material.pbrMetallicRoughness.baseColorTexture) {
            const {
                extensions
            } = material.pbrMetallicRoughness.baseColorTexture;
            this.pbrMetallicRoughness.baseColorTexture =
                textures[material.pbrMetallicRoughness.baseColorTexture.index];
            defines.push({ name: 'BASECOLORTEXTURE' });

            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    const translation =
                        ex.offset &&
                        new Matrix3().set([
                            1,
                            0,
                            0,
                            0,
                            1,
                            0,
                            ex.offset[0],
                            ex.offset[1],
                            1
                        ]);
                    const rotation =
                        ex.rotation &&
                        new Matrix3().set([
                            -Math.sin(ex.rotation),
                            Math.cos(ex.rotation),
                            0,
                            Math.cos(ex.rotation),
                            Math.sin(ex.rotation),
                            0,
                            0,
                            0,
                            1
                        ]);
                    const scale =
                        ex.scale &&
                        new Matrix3().set([
                            ex.scale[0],
                            0,
                            0,
                            0,
                            ex.scale[1],
                            0,
                            0,
                            0,
                            1
                        ]);

                    const matrix = new Matrix3();
                    if (scale) {
                        matrix.multiply(scale);
                    }
                    if (rotation) {
                        matrix.multiply(rotation);
                    }
                    if (translation) {
                        matrix.multiply(translation);
                    }
                    this.matrix = matrix;
                    defines.push({ name: 'TEXTURE_TRANSFORM' });
                }
            }
        }
        if (material.emissiveTexture) {
            const { texCoord } = material.emissiveTexture;
            this.emissiveTexture = textures[material.emissiveTexture.index];
            defines.push({ name: 'EMISSIVEMAP', value: texCoord ? 2 : 1 });
        }

        if (material.alphaMode === 'MASK') {
            defines.push({
                name: 'ALPHATEST',
                value: material.alphaCutoff || 0.5
            });
        } else if (material.alphaMode === 'BLEND') {
            defines.push({ name: 'ALPHATEST', value: 0.01 });
        }

        if (this.doubleSided) {
            defines.push({ name: 'DOUBLESIDED' });
        }
    }

    createUniforms(gl, program) {
        gl.useProgram(program);

        if (this.pbrMetallicRoughness.baseColorTexture) {
            this.uniforms.baseColorTexture = gl.getUniformLocation(
                program,
                'baseColorTexture'
            );
            gl.uniform1i(this.uniforms.baseColorTexture, 0);
        }
        if (this.pbrMetallicRoughness.metallicRoughnessTexture) {
            this.uniforms.metallicRoughnessTexture = gl.getUniformLocation(
                program,
                'metallicRoughnessTexture'
            );
            gl.uniform1i(this.uniforms.metallicRoughnessTexture, 1);
        }
        if (this.normalTexture) {
            this.uniforms.normalTexture = gl.getUniformLocation(
                program,
                'normalTexture'
            );
            gl.uniform1i(this.uniforms.normalTexture, 2);
        }
        if (this.occlusionTexture) {
            this.uniforms.occlusionTexture = gl.getUniformLocation(
                program,
                'occlusionTexture'
            );
            gl.uniform1i(this.uniforms.occlusionTexture, 3);
        }
        if (this.emissiveTexture) {
            this.uniforms.emissiveTexture = gl.getUniformLocation(
                program,
                'emissiveTexture'
            );
            gl.uniform1i(this.uniforms.emissiveTexture, 4);
        }

        this.uniforms.prefilterMap = gl.getUniformLocation(program, 'prefilterMap');
        this.uniforms.brdfLUT = gl.getUniformLocation(program, 'brdfLUT');
        this.uniforms.irradianceMap = gl.getUniformLocation(program, 'irradianceMap');
        this.uniforms.depthTexture = gl.getUniformLocation(program, 'depthTexture');

        gl.uniform1i(
            this.uniforms.prefilterMap,
            8
        );
        gl.uniform1i(
            this.uniforms.brdfLUT,
            9
        );
        gl.uniform1i(
            this.uniforms.irradianceMap,
            6
        );
    }

    updateUniforms(gl, program, camera, light) {
        const materialUniformBuffer = new UniformBuffer();
        materialUniformBuffer.add(
            'baseColorFactor',
            this.pbrMetallicRoughness.baseColorFactor || [0.8, 0.8, 0.8, 1.0]
        );
        materialUniformBuffer.add('lightPos', light.getPosition());
        materialUniformBuffer.add('viewPos', camera.getPosition());
        materialUniformBuffer.add(
            'textureMatrix',
            (this.matrix && this.matrix.elements) || new Matrix3().elements
        );
        materialUniformBuffer.add(
            'specularFactor',
            this.pbrMetallicRoughness.specularFactor || [0, 0, 0]
        );
        materialUniformBuffer.add(
            'emissiveFactor',
            this.emissiveFactor || [0, 0, 0]
        );
        materialUniformBuffer.add(
            'glossinessFactor',
            this.pbrMetallicRoughness.glossinessFactor || 0.5
        );
        materialUniformBuffer.add(
            'metallicFactor',
            this.pbrMetallicRoughness.metallicFactor || 0.5
        );
        materialUniformBuffer.add(
            'roughnessFactor',
            this.pbrMetallicRoughness.roughnessFactor || 0.5
        );
        materialUniformBuffer.done();

        const mIndex = gl.getUniformBlockIndex(program, 'Material');
        gl.uniformBlockBinding(program, mIndex, 1);
        const mUBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
        gl.bufferData(
            gl.UNIFORM_BUFFER,
            materialUniformBuffer.store,
            gl.STATIC_DRAW
        );
        this.UBO = mUBO;
        this.uniformBuffer = materialUniformBuffer;
    }

    hasNormal() {
        return Boolean(this.normalTexture);
    }
}
