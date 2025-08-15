import { Vector3, Matrix4 } from '../matrix';
import { UniformBuffer } from './uniform';
import { Material as M } from '../../GLTF';
import { textureEnum } from '../utils';

const defaultMaterial = {
    baseColorFactor: [1, 0, 0, 1]
} as M;

interface Uniforms {
    baseColorTexture: WebGLUniformLocation;
    metallicRoughnessTexture: WebGLUniformLocation;
    normalTexture: WebGLUniformLocation;
    occlusionTexture: WebGLUniformLocation;
    clearcoatTexture: WebGLUniformLocation;
    clearcoatRoughnessTexture: WebGLUniformLocation;
    sheenRoughnessTexture: WebGLUniformLocation;
    sheenColorTexture: WebGLUniformLocation;
    clearcoatNormalTexture: WebGLUniformLocation;
    transmissionTexture: WebGLUniformLocation;
    specularTexture: WebGLUniformLocation;
    specularColorTexture: WebGLUniformLocation;
    thicknessTexture: WebGLUniformLocation;
    emissiveTexture: WebGLUniformLocation;
    prefilterMap: WebGLUniformLocation;
    charlieMap: WebGLUniformLocation;
    brdfLUT: WebGLUniformLocation;
    irradianceMap: WebGLUniformLocation;
    depthTexture: WebGLUniformLocation;
    colorTexture: WebGLUniformLocation;
    Sheen_E: WebGLUniformLocation;
    iridescenceThicknessTexture: WebGLUniformLocation;
    diffuseTransmissionTexture: WebGLUniformLocation;
    diffuseTransmissionColorTexture: WebGLUniformLocation;
    anisotropyTexture: WebGLUniformLocation;
    iridescenceTexture: WebGLUniformLocation;
}

const lightEnum = {
    directional: 0,
    point: 1,
    spot: 2
};

export class Material extends M {
    blend: string;
    uniforms: Uniforms;
    alpha: boolean;
    UBO: WebGLBuffer;
    defines: Array<{ name: string }>;
    matrices: Matrix4[];
    uniformBuffer: GPUBuffer;
    lightUBO1: WebGLBuffer;
    lightUniformBuffer1: UniformBuffer;
    lightUBO2: WebGLBuffer;
    lightUniformBuffer2: UniformBuffer;
    lightUBO3: WebGLBuffer;
    lightUniformBuffer3: UniformBuffer;
    lightUBO4: WebGLBuffer;
    lightUBO5: WebGLBuffer;
    lightUniformBuffer4: UniformBuffer;
    matricesMap = new Map<string, number>();

    uniformBindGroup1: GPUBindGroupEntry[];

    constructor(m = defaultMaterial, textures, defines) {
        super();

        const material = Object.assign({}, m);
        this.defines = defines;
        this.name = material.name;
        this.matrices = [];
        this.diffuseTransmissionColorFactor = [1, 1, 1];

        if (!material.pbrMetallicRoughness && material.extensions && material.extensions.KHR_materials_pbrSpecularGlossiness) {
            material.pbrMetallicRoughness = {};
            const SG = material.extensions.KHR_materials_pbrSpecularGlossiness;
            material.pbrMetallicRoughness.baseColorTexture = SG.diffuseTexture;
            material.pbrMetallicRoughness.metallicRoughnessTexture = SG.specularGlossinessTexture;
            material.pbrMetallicRoughness.baseColorFactor = SG.diffuseFactor;
            material.pbrMetallicRoughness.specularFactor = SG.specularFactor;
            material.pbrMetallicRoughness.glossinessFactor = SG.glossinessFactor;
            defines.push({ name: 'SPECULARGLOSSINESSMAP' });
        }
        if (material.extensions && material.extensions.KHR_materials_clearcoat) {
            const cl = material.extensions.KHR_materials_clearcoat;
            this.clearcoatFactor = cl.clearcoatFactor;
            this.clearcoatRoughnessFactor = cl.clearcoatRoughnessFactor;
            defines.push({ name: 'CLEARCOAT' });
            if (cl.clearcoatTexture) {
                const { extensions, texCoord } = cl.clearcoatTexture;
                this.clearcoatTexture = textures[cl.clearcoatTexture.index];
                defines.push({ name: 'CLEARCOATMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('clearcoatTexture', this.buildTrans(ex, defines, 'CLEARCOATMAP'));
                    }
                }
            }
            if (cl.clearcoatNormalTexture) {
                const { extensions, texCoord } = cl.clearcoatNormalTexture;
                this.clearcoatNormalTexture = textures[cl.clearcoatNormalTexture.index];
                defines.push({ name: 'CLEARCOATNORMALMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('clearcoatNormalTexture', this.buildTrans(ex, defines, 'CLEARCOATNORMALMAP'));
                    }
                }
            }
            if (cl.clearcoatRoughnessTexture) {
                const { extensions, texCoord } = cl.clearcoatRoughnessTexture;
                this.clearcoatRoughnessTexture = textures[cl.clearcoatRoughnessTexture.index];
                defines.push({ name: 'CLEARCOATROUGHMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('clearcoatRoughnessTexture', this.buildTrans(ex, defines, 'CLEARCOATROUGHMAP'));
                    }
                }
            }
        }

        if (material.extensions && material.extensions.KHR_materials_sheen) {
            const {
                sheenColorTexture,
                sheenColorFactor,
                sheenRoughnessFactor,
                sheenRoughnessTexture
            } = material.extensions.KHR_materials_sheen;
            this.sheenColorFactor = sheenColorFactor;
            this.sheenRoughnessFactor = sheenRoughnessFactor;
            if (sheenColorTexture) {
                const { extensions, texCoord } = sheenColorTexture;
                this.sheenColorTexture = textures[sheenColorTexture.index];
                defines.push({ name: 'SHEENMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('sheenColorTexture', this.buildTrans(ex, defines, 'SHEENMAP'));
                    }
                }
            }
            if (sheenRoughnessTexture) {
                const { extensions, texCoord } = sheenRoughnessTexture;
                this.sheenRoughnessTexture = textures[sheenRoughnessTexture.index];
                defines.push({ name: 'SHEENROUGHNESSMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('sheenRoughnessTexture', this.buildTrans(ex, defines, 'SHEENROUGHNESSMAP'));
                    }
                }
            }
            defines.push({ name: 'SHEEN' });
        }

        if (material.extensions && material.extensions.KHR_materials_transmission) {
            const { transmissionFactor, transmissionTexture } = material.extensions.KHR_materials_transmission;
            this.transmissionFactor = transmissionFactor;
            if (transmissionTexture) {
                const { extensions, texCoord } = transmissionTexture;
                this.transmissionTexture = textures[transmissionTexture.index];
                defines.push({ name: 'TRANSMISSIONMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('transmissionTexture', this.buildTrans(ex, defines, 'TRANSMISSIONMAP'));
                    }
                }
            }
            defines.push({ name: 'TRANSMISSION' });
        }

        if (material.extensions && material.extensions.KHR_materials_volume) {
            const { attenuationColor, attenuationDistance, thicknessFactor, thicknessTexture } = material.extensions.KHR_materials_volume;
            this.attenuationColor = attenuationColor;
            this.attenuationDistance = attenuationDistance;
            this.thicknessFactor = thicknessFactor;
            this.ior = 1.5;
            if (thicknessTexture) {
                const { extensions, texCoord } = thicknessTexture;
                this.thicknessTexture = textures[thicknessTexture.index];
                defines.push({ name: 'THICKNESSMAP', value: texCoord ?? 0 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('thicknessTexture', this.buildTrans(ex, defines, 'THICKNESSMAP'));
                    }
                }
            }
            defines.push({ name: 'VOLUME' });
        }

        if (material.extensions && material.extensions.KHR_materials_emissive_strength) {
            const { emissiveStrength } = material.extensions.KHR_materials_emissive_strength;
            this.emissiveStrength = emissiveStrength;
        }

        if (material.extensions && material.extensions.KHR_materials_anisotropy) {
            const { anisotropyStrength, anisotropyRotation, anisotropyTexture } = material.extensions.KHR_materials_anisotropy;
            this.anisotropyStrength = anisotropyStrength;
            this.anisotropyRotation = anisotropyRotation;
            if (anisotropyTexture) {
                this.anisotropyTexture = textures[anisotropyTexture.index];
                defines.push({ name: 'ANISOTROPYMAP', value: anisotropyTexture.texCoord ?? 0 });
                if (anisotropyTexture.extensions) {
                    const ex = anisotropyTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('anisotropyTexture', this.buildTrans(ex, defines, 'ANISOTROPYMAP'));
                    }
                }
            }
            defines.push({ name: 'ANISOTROPY' });
        }

        if (material.extensions && material.extensions.KHR_materials_dispersion) {
            const { dispersion } = material.extensions.KHR_materials_dispersion;
            this.dispersion = dispersion;
            defines.push({ name: 'DISPERSION' });
        }

        if (material.extensions && material.extensions.KHR_materials_iridescence) {
            const { iridescenceTexture, iridescenceThicknessTexture, iridescenceFactor, iridescenceIor, iridescenceThicknessMaximum, iridescenceThicknessMinimum } = material.extensions.KHR_materials_iridescence;
            this.iridescenceFactor = iridescenceFactor;
            this.iridescenceIOR = iridescenceIor;
            this.iridescenceThicknessMaximum = iridescenceThicknessMaximum;
            this.iridescenceThicknessMinimum = iridescenceThicknessMinimum;
            if (iridescenceTexture) {
                this.iridescenceTexture = textures[iridescenceTexture.index];
                defines.push({ name: 'IRIDESCENCE_COLOR', value: iridescenceTexture.texCoord ?? 0 });
                if (iridescenceTexture.extensions) {
                    const ex = iridescenceTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('iridescenceTexture', this.buildTrans(ex, defines, 'IRIDESCENCE_COLOR'));
                    }
                }
            }
            if (iridescenceThicknessTexture) {
                this.iridescenceThicknessTexture = textures[iridescenceThicknessTexture.index];
                defines.push({ name: 'IRIDESCENCEMAP', value: iridescenceThicknessTexture.texCoord ?? 0 });
                if (iridescenceThicknessTexture.extensions) {
                    const ex = iridescenceThicknessTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('iridescenceThicknessTexture', this.buildTrans(ex, defines, 'IRIDESCENCEMAP'));
                    }
                }
            }
            defines.push({ name: 'IRIDESCENCE' });
        }
        if (material.extensions && material.extensions.KHR_materials_diffuse_transmission) {
            const { diffuseTransmissionFactor, diffuseTransmissionTexture, diffuseTransmissionColorFactor, diffuseTransmissionColorTexture } = material.extensions.KHR_materials_diffuse_transmission;
            this.diffuseTransmissionFactor = diffuseTransmissionFactor;
            if (diffuseTransmissionTexture) {
                this.diffuseTransmissionTexture = textures[diffuseTransmissionTexture.index];
                defines.push({ name: 'DIFFUSE_TRANSMISSION_MAP', value: diffuseTransmissionTexture.texCoord ?? 0 });
                if (diffuseTransmissionTexture.extensions) {
                    const ex = diffuseTransmissionTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('diffuseTransmissionTexture', this.buildTrans(ex, defines, 'DIFFUSE_TRANSMISSION_MAP'));
                    }
                }
            }
            this.diffuseTransmissionColorFactor = diffuseTransmissionColorFactor ?? [1, 1, 1];
            if (diffuseTransmissionColorTexture) {
                this.diffuseTransmissionColorTexture = textures[diffuseTransmissionColorTexture.index];
                defines.push({ name: 'DIFFUSE_TRANSMISSION_COLOR_MAP', value: diffuseTransmissionColorTexture.texCoord ?? 0 });
                if (diffuseTransmissionColorTexture.extensions) {
                    const ex = diffuseTransmissionColorTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('diffuseTransmissionColorTexture', this.buildTrans(ex, defines, 'DIFFUSE_TRANSMISSION_COLOR_MAP'));
                    }
                }
            }
            defines.push({ name: 'DIFFUSE_TRANSMISSION' });
        }

        if (material.extensions && material.extensions.KHR_materials_ior) {
            this.ior = material.extensions.KHR_materials_ior.ior;
            defines.push({ name: 'IOR' });
        }

        if (material.extensions && material.extensions.KHR_materials_specular) {
            const { specularFactor, specularTexture, specularColorFactor, specularColorTexture } = material.extensions.KHR_materials_specular;
            this.specularFactor = specularFactor;
            this.specularColorFactor = specularColorFactor;
            if (specularTexture) {
                this.specularTexture = textures[specularTexture.index];
                defines.push({ name: 'SPECULARMAP' });
                if (specularTexture.extensions) {
                    const ex = specularTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('specularTexture', this.buildTrans(ex, defines, 'SPECULARMAP'));
                    }
                }
            }
            if (specularColorTexture) {
                this.specularColorTexture = textures[specularColorTexture.index];
                defines.push({ name: 'SPECULARCOLORMAP' });
                if (specularColorTexture.extensions) {
                    const ex = specularColorTexture.extensions.KHR_texture_transform;
                    if (ex) {
                        this.matricesMap.set('specularColorTexture', this.buildTrans(ex, defines, 'SPECULARCOLORMAP'));
                    }
                }
            }
            defines.push({ name: 'SPECULAR' });
        }

        this.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            clearcoatTexture: null,
            clearcoatRoughnessTexture: null,
            sheenRoughnessTexture: null,
            iridescenceThicknessTexture: null,
            iridescenceTexture: null,
            sheenColorTexture: null,
            clearcoatNormalTexture: null,
            emissiveTexture: null,
            prefilterMap: null,
            charlieMap: null,
            brdfLUT: null,
            irradianceMap: null,
            transmissionTexture: null,
            specularTexture: null,
            specularColorTexture: null,
            thicknessTexture: null,
            colorTexture: null,
            Sheen_E: null,
            depthTexture: null,
            diffuseTransmissionTexture: null,
            diffuseTransmissionColorTexture: null,
            anisotropyTexture: null
        };
        const { pbrMetallicRoughness } = material;
        if (pbrMetallicRoughness) {
            this.baseColorFactor = pbrMetallicRoughness.baseColorFactor;
            this.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
            this.metallicFactor = pbrMetallicRoughness.metallicFactor;
            if (pbrMetallicRoughness.specularFactor) {
                this.specularFactor = pbrMetallicRoughness.specularFactor;
            }
            if (pbrMetallicRoughness.glossinessFactor) {
                this.glossinessFactor = pbrMetallicRoughness.glossinessFactor;
            }
        }
        this.alpha = material.alphaMode === 'BLEND';
        this.doubleSided = material.doubleSided;
        this.emissiveFactor = material.emissiveFactor;
        this.extras = material.extras;

        if (pbrMetallicRoughness && pbrMetallicRoughness.metallicRoughnessTexture) {
            const { extensions, texCoord } = pbrMetallicRoughness.metallicRoughnessTexture;
            this.metallicRoughnessTexture = textures[pbrMetallicRoughness.metallicRoughnessTexture.index];
            defines.push({ name: 'METALROUGHNESSMAP', value: texCoord ?? 0 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.matricesMap.set('metallicRoughnessTexture', this.buildTrans(ex, defines, 'METALROUGHNESSMAP'));
                }
            }
        }
        if (material.normalTexture) {
            const { extensions, texCoord, scale } = material.normalTexture;
            this.normalTexture = textures[material.normalTexture.index];
            this.normalTextureScale = scale;
            defines.push({ name: 'NORMALMAP', value: texCoord ?? 0 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.normalTextureScale = undefined;
                    this.matricesMap.set('normalTexture', this.buildTrans(ex, defines, 'NORMALMAP'));
                }
            }
        }
        if (material.occlusionTexture) {
            const { extensions, texCoord } = material.occlusionTexture;
            this.occlusionTexture = textures[material.occlusionTexture.index];
            defines.push({ name: 'OCCLUSIONMAP', value: texCoord ?? 0 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.matricesMap.set('occlusionTexture', this.buildTrans(ex, defines, 'OCCLUSIONMAP'));
                }
            }
        }
        if (pbrMetallicRoughness && pbrMetallicRoughness.baseColorTexture) {
            const { extensions, texCoord } = pbrMetallicRoughness.baseColorTexture;
            this.baseColorTexture = textures[pbrMetallicRoughness.baseColorTexture.index];
            defines.push({ name: 'BASECOLORTEXTURE', value: texCoord ?? 0 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.matricesMap.set('baseColorTexture', this.buildTrans(ex, defines, 'BASECOLORTEXTURE'));
                }
            }
        }
        if (material.emissiveTexture) {
            const { extensions, texCoord } = material.emissiveTexture;
            this.emissiveTexture = textures[material.emissiveTexture.index];
            defines.push({ name: 'EMISSIVEMAP', value: texCoord ?? 0 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.matricesMap.set('emissiveTexture', this.buildTrans(ex, defines, 'EMISSIVEMAP'));
                }
            }
        }

        if (material.alphaMode === 'MASK') {
            defines.push({
                name: 'ALPHATEST',
                value: material.alphaCutoff ?? 0.5
            });
        } else if (material.alphaMode === 'BLEND') {
            defines.push({ name: 'ALPHATEST', value: 0.01 });
        }

        if (this.doubleSided) {
            defines.push({ name: 'DOUBLESIDED' });
        }

        if (material.extensions && material.extensions.KHR_materials_unlit) {
            defines.push({ name: 'NOLIGHT' });
        }
        if (this.matrices.length) {
            defines.push({ name: 'MATRICES', value: this.matrices.length });
        }
    }

    buildTrans(ex, defines, name = '') {
        if (ex.offset !== undefined || ex.scale !== undefined || ex.rotation !== undefined) {
            const offset = ex.offset || [0, 0];
            const scale = ex.scale || [1, 1];
            const rotation = ex.rotation || 0;
            const i = this.matrices.push(new Matrix4().set([...offset, 0, 0, ...scale, 0, 0, rotation, 0, 0, 0, 0, 0, 0, 0])) - 1;
            defines.push({ name: `${name}_TEXTURE_TRANSFORM`, value: i });
            return i;
        }
    }

    setHarmonics(sphericalHarmonics) {
        this.sphericalHarmonics = sphericalHarmonics;
    }

    updateUniformsWebgl(gl, program) {
        gl.useProgram(program);

        if (this.baseColorTexture) {
            this.uniforms.baseColorTexture = gl.getUniformLocation(program, 'baseColorTexture');
            gl.uniform1i(this.uniforms.baseColorTexture, textureEnum.baseColorTexture);
        }
        if (this.metallicRoughnessTexture) {
            this.uniforms.metallicRoughnessTexture = gl.getUniformLocation(program, 'metallicRoughnessTexture');
            gl.uniform1i(this.uniforms.metallicRoughnessTexture, textureEnum.metallicRoughnessTexture);
        }
        if (this.normalTexture) {
            this.uniforms.normalTexture = gl.getUniformLocation(program, 'normalTexture');
            gl.uniform1i(this.uniforms.normalTexture, textureEnum.normalTexture);
        }
        if (this.occlusionTexture) {
            this.uniforms.occlusionTexture = gl.getUniformLocation(program, 'occlusionTexture');
            gl.uniform1i(this.uniforms.occlusionTexture, textureEnum.occlusionTexture);
        }
        if (this.emissiveTexture) {
            this.uniforms.emissiveTexture = gl.getUniformLocation(program, 'emissiveTexture');
            gl.uniform1i(this.uniforms.emissiveTexture, textureEnum.emissiveTexture);
        }
        if (this.clearcoatTexture) {
            this.uniforms.clearcoatTexture = gl.getUniformLocation(program, 'clearcoatTexture');
            gl.uniform1i(this.uniforms.clearcoatTexture, textureEnum.clearcoatTexture);
        }
        if (this.clearcoatRoughnessTexture) {
            this.uniforms.clearcoatRoughnessTexture = gl.getUniformLocation(program, 'clearcoatRoughnessTexture');
            gl.uniform1i(this.uniforms.clearcoatRoughnessTexture, textureEnum.clearcoatRoughnessTexture);
        }
        if (this.clearcoatNormalTexture) {
            this.uniforms.clearcoatNormalTexture = gl.getUniformLocation(program, 'clearcoatNormalTexture');
            gl.uniform1i(this.uniforms.clearcoatNormalTexture, textureEnum.clearcoatNormalTexture);
        }
        if (this.sheenRoughnessTexture) {
            this.uniforms.sheenRoughnessTexture = gl.getUniformLocation(program, 'sheenRoughnessTexture');
            gl.uniform1i(this.uniforms.sheenRoughnessTexture, textureEnum.sheenRoughnessTexture);
        }
        if (this.iridescenceThicknessTexture) {
            this.uniforms.iridescenceThicknessTexture = gl.getUniformLocation(program, 'iridescenceThicknessTexture');
            gl.uniform1i(this.uniforms.iridescenceThicknessTexture, textureEnum.iridescenceThicknessTexture);
        }
        if (this.iridescenceTexture) {
            this.uniforms.iridescenceTexture = gl.getUniformLocation(program, 'iridescenceTexture');
            gl.uniform1i(this.uniforms.iridescenceTexture, textureEnum.iridescenceTexture);
        }
        if (this.anisotropyTexture) {
            this.uniforms.anisotropyTexture = gl.getUniformLocation(program, 'anisotropyTexture');
            gl.uniform1i(this.uniforms.anisotropyTexture, textureEnum.anisotropyTexture);
        }
        if (this.diffuseTransmissionColorTexture) {
            this.uniforms.diffuseTransmissionColorTexture = gl.getUniformLocation(program, 'diffuseTransmissionColorTexture');
            gl.uniform1i(this.uniforms.diffuseTransmissionColorTexture, textureEnum.diffuseTransmissionColorTexture);
        }
        if (this.diffuseTransmissionTexture) {
            this.uniforms.diffuseTransmissionTexture = gl.getUniformLocation(program, 'diffuseTransmissionTexture');
            gl.uniform1i(this.uniforms.diffuseTransmissionTexture, textureEnum.diffuseTransmissionTexture);
        }
        if (this.sheenColorTexture) {
            this.uniforms.sheenColorTexture = gl.getUniformLocation(program, 'sheenColorTexture');
            gl.uniform1i(this.uniforms.sheenColorTexture, textureEnum.sheenColorTexture);
        }
        if (this.transmissionTexture) {
            this.uniforms.transmissionTexture = gl.getUniformLocation(program, 'transmissionTexture');
            gl.uniform1i(this.uniforms.transmissionTexture, textureEnum.transmissionTexture);
        }
        if (this.specularTexture) {
            this.uniforms.specularTexture = gl.getUniformLocation(program, 'specularTexture');
            gl.uniform1i(this.uniforms.specularTexture, textureEnum.specularTexture);
        }
        if (this.specularColorTexture) {
            this.uniforms.specularColorTexture = gl.getUniformLocation(program, 'specularColorTexture');
            gl.uniform1i(this.uniforms.specularColorTexture, textureEnum.specularColorTexture);
        }
        if (this.thicknessTexture) {
            this.uniforms.thicknessTexture = gl.getUniformLocation(program, 'thicknessTexture');
            gl.uniform1i(this.uniforms.thicknessTexture, textureEnum.thicknessTexture);
        }

        this.uniforms.prefilterMap = gl.getUniformLocation(program, 'prefilterMap');
        this.uniforms.charlieMap = gl.getUniformLocation(program, 'charlieMap');
        this.uniforms.brdfLUT = gl.getUniformLocation(program, 'brdfLUT');
        this.uniforms.irradianceMap = gl.getUniformLocation(program, 'irradianceMap');
        this.uniforms.depthTexture = gl.getUniformLocation(program, 'depthTexture');
        this.uniforms.colorTexture = gl.getUniformLocation(program, 'colorTexture');
        this.uniforms.Sheen_E = gl.getUniformLocation(program, 'Sheen_E');

        gl.uniform1i(this.uniforms.prefilterMap, textureEnum.prefilterTexture);
        gl.uniform1i(this.uniforms.charlieMap, textureEnum.charlieTexture);
        gl.uniform1i(this.uniforms.brdfLUT, textureEnum.brdfLUTTexture);
        gl.uniform1i(this.uniforms.irradianceMap, textureEnum.irradianceTexture);
        gl.uniform1i(this.uniforms.Sheen_E, textureEnum.Sheen_E);

        {
            const mIndex = gl.getUniformBlockIndex(program, 'Material');
            gl.uniformBlockBinding(program, mIndex, 1);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.materialUniformBuffer.store, gl.STATIC_DRAW);
            this.UBO = mUBO;
        }
        {
            const mIndex = gl.getUniformBlockIndex(program, 'LightColor');
            gl.uniformBlockBinding(program, mIndex, 3);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.lightColorBuffer.store, gl.STATIC_DRAW);
            this.lightUBO1 = mUBO;
        }
        {
            const mIndex = gl.getUniformBlockIndex(program, 'LightPos');
            gl.uniformBlockBinding(program, mIndex, 4);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.lightPosBuffer.store, gl.STATIC_DRAW);
            this.lightUBO2 = mUBO;
        }
        {
            const mIndex = gl.getUniformBlockIndex(program, 'Spotdir');
            gl.uniformBlockBinding(program, mIndex, 5);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.spotdirBuffer.store, gl.STATIC_DRAW);
            this.lightUBO3 = mUBO;
        }
        {
            const mIndex = gl.getUniformBlockIndex(program, 'LightIntensity');
            gl.uniformBlockBinding(program, mIndex, 6);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.lightIntensityBuffer.store, gl.STATIC_DRAW);
            this.lightUBO4 = mUBO;
        }
        if (this.matrices.length) {
            const mIndex = gl.getUniformBlockIndex(program, 'TextureMatrices');
            gl.uniformBlockBinding(program, mIndex, 8);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.textureMatricesBuffer.store, gl.STATIC_DRAW);
            this.lightUBO5 = mUBO;
        }
    }

    createUniforms(camera, lights) {
        const spotDirs = new Float32Array(lights.length * 4);
        const lightPos = new Float32Array(lights.length * 4);
        const lightColor = new Float32Array(lights.length * 4);
        const lightProps = new Float32Array(lights.length * 4);
        const textureMatrices = new Float32Array(this.matrices.length * 16);
        lights.forEach((light, i) => {
            spotDirs.set(
                new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize()
                    .elements,
                i * 4
            );
            lightPos.set(light.getPosition(), i * 4);
            lightColor.set(light.color.elements, i * 4);
            lightProps.set([light.intensity, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]], i * 4);
        });
        this.matrices.forEach((m, i) => {
            textureMatrices.set(m.elements, i * 16);
        });

        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('baseColorFactor', this.baseColorFactor ?? [0.8, 0.8, 0.8, 1.0]);
            materialUniformBuffer.add('viewPos', camera.getPosition());
            materialUniformBuffer.add('specularFactor', this.specularFactor ?? 1);
            materialUniformBuffer.add('specularColorFactor', this.specularColorFactor ?? [1, 1, 1]);
            materialUniformBuffer.add('emissiveFactor', this.emissiveFactor ?? [0, 0, 0]);
            materialUniformBuffer.add('glossinessFactor', this.glossinessFactor ?? 0.5);
            materialUniformBuffer.add('metallicFactor', this.metallicFactor ?? 1);
            materialUniformBuffer.add('roughnessFactor', this.roughnessFactor ?? 1);
            materialUniformBuffer.add('clearcoatFactor', this.clearcoatFactor ?? 0);
            materialUniformBuffer.add('clearcoatRoughnessFactor', this.clearcoatRoughnessFactor ?? 0);
            materialUniformBuffer.add('sheenColorFactor', this.sheenColorFactor ?? 0);
            materialUniformBuffer.add('sheenRoughnessFactor', this.sheenRoughnessFactor ?? 0);
            materialUniformBuffer.add('transmissionFactor', this.transmissionFactor ?? 0);
            materialUniformBuffer.add('ior', this.ior ?? 1);
            materialUniformBuffer.add('normalTextureScale', this.normalTextureScale ?? 1);
            materialUniformBuffer.add('attenuationColor', this.attenuationColor ?? [1, 1, 1]);
            materialUniformBuffer.add('attenuationDistance', this.attenuationDistance ?? 1);
            materialUniformBuffer.add('thicknessFactor', this.thicknessFactor ?? 0);
            materialUniformBuffer.add('emissiveStrength', this.emissiveStrength ?? 1);
            materialUniformBuffer.add('anisotropy', [this.anisotropyStrength ?? 0, this.anisotropyRotation ?? 0]);
            materialUniformBuffer.add('iridescence', [this.iridescenceFactor ?? 0, this.iridescenceIOR ?? 1.3, this.iridescenceThicknessMaximum ?? 400, this.iridescenceThicknessMinimum ?? 100]);
            materialUniformBuffer.add('diffuseTransmissionFactor', [this.diffuseTransmissionFactor ?? 0, ...this.diffuseTransmissionColorFactor]);
            materialUniformBuffer.add('dispersionFactor', [this.dispersion ?? 0]);
            materialUniformBuffer.done();
            this.materialUniformBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightColor', lightColor);
            materialUniformBuffer.done();
            this.lightColorBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightPos', lightPos);
            materialUniformBuffer.done();
            this.lightPosBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('spotdir', spotDirs);
            materialUniformBuffer.done();
            this.spotdirBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightIntensity', lightProps);
            materialUniformBuffer.done();
            this.lightIntensityBuffer = materialUniformBuffer;
        }
        if (this.matrices.length) {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('textureMatrices', textureMatrices);
            materialUniformBuffer.done();
            this.textureMatricesBuffer = materialUniformBuffer;
        }
    }

    updateUniformsWebGPU(WebGPU: WEBGPU) {
        const { device } = WebGPU;
        const uniformBuffer = device.createBuffer({
            size: 256 + this.materialUniformBuffer.store.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.materialUniformBuffer.bufferWebGPU = uniformBuffer;
        const uniformBuffer2 = device.createBuffer({
            size: 256 + this.lightColorBuffer.store.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const uniformBuffer3 = device.createBuffer({
            size: 256 + this.lightPosBuffer.store.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.lightPosBuffer.bufferWebGPU = uniformBuffer3;
        const uniformBuffer4 = device.createBuffer({
            size: 256 + this.spotdirBuffer.store.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const uniformBuffer5 = device.createBuffer({
            size: 256 + this.lightIntensityBuffer.store.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        let uniformBuffer6;
        if (this.textureMatricesBuffer) {
            uniformBuffer6 = device.createBuffer({
                size: 256 + this.textureMatricesBuffer.store.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.textureMatricesBuffer.bufferWebGPU = uniformBuffer6;
        }
        const sampler = this.baseColorTexture
            ? this.baseColorTexture.sampler
            : device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat',
                addressModeW: 'repeat'
            });

        const uniformBindGroup1 = [
            {
                binding: 1,
                resource: {
                    buffer: uniformBuffer,
                    offset: 0,
                    size: this.materialUniformBuffer.store.byteLength
                }
            },
            {
                binding: 2,
                resource: sampler
            },
            {
                binding: 37,
                resource: device.createSampler({
                    mipmapFilter: 'nearest',
                    magFilter: 'nearest',
                    minFilter: 'nearest',
                })
            },
            {
                binding: 24,
                resource: device.createSampler({
                    mipmapFilter: 'linear',
                    magFilter: 'linear',
                    minFilter: 'linear',
                })
            },
            {
                binding: 3,
                resource: this.baseColorTexture?.createView({
                    // baseMipLevel: 3,
                    // mipLevelCount: 9,
                })
            },
            {
                binding: 4,
                resource: this.metallicRoughnessTexture?.createView()
            },
            {
                binding: 5,
                resource: this.normalTexture?.createView()
            },
            {
                binding: 6,
                resource: this.emissiveTexture?.createView()
            },
            {
                binding: 7,
                resource: this.occlusionTexture?.createView()
            },
            {
                binding: 8,
                resource: this.clearcoatTexture?.createView()
            },
            {
                binding: 9,
                resource: this.clearcoatRoughnessTexture?.createView()
            },
            {
                binding: 10,
                resource: this.transmissionTexture?.createView()
            },
            {
                binding: 11,
                resource: this.sheenColorTexture?.createView()
            },
            {
                binding: 12,
                resource: this.sheenRoughnessTexture?.createView()
            },
            {
                binding: 13,
                resource: this.clearcoatNormalTexture?.createView()
            },
            {
                binding: 14,
                resource: this.specularTexture?.createView()
            },
            {
                binding: 15,
                resource: {
                    buffer: uniformBuffer2,
                    offset: 0,
                    size: this.lightColorBuffer.store.byteLength
                }
            },
            {
                binding: 16,
                resource: {
                    buffer: uniformBuffer3,
                    offset: 0,
                    size: this.lightPosBuffer.store.byteLength
                }
            },
            {
                binding: 17,
                resource: {
                    buffer: uniformBuffer4,
                    offset: 0,
                    size: this.spotdirBuffer.store.byteLength
                }
            },
            {
                binding: 18,
                resource: {
                    buffer: uniformBuffer5,
                    offset: 0,
                    size: this.lightIntensityBuffer.store.byteLength
                }
            },
            {
                binding: 29,
                resource: this.thicknessTexture?.createView()
            },
            {
                binding: 31,
                resource: this.anisotropyTexture?.createView()
            },
            {
                binding: 32,
                resource: this.iridescenceThicknessTexture?.createView()
            },
            {
                binding: 38,
                resource: this.iridescenceTexture?.createView()
            },
            {
                binding: 33,
                resource: this.specularColorTexture?.createView()
            },
            {
                binding: 34,
                resource: this.diffuseTransmissionTexture?.createView()
            },
            {
                binding: 36,
                resource: this.diffuseTransmissionColorTexture?.createView()
            },
            {
                binding: 23,
                resource: this.textureMatricesBuffer && {
                    buffer: uniformBuffer6,
                    offset: 0,
                    size: this.textureMatricesBuffer.store.byteLength
                }
            },
        ];

        device.queue.writeBuffer(
            uniformBuffer,
            0,
            this.materialUniformBuffer.store.buffer,
            this.materialUniformBuffer.store.byteOffset,
            this.materialUniformBuffer.store.byteLength
        );
        device.queue.writeBuffer(
            uniformBuffer2,
            0,
            this.lightColorBuffer.store.buffer,
            this.lightColorBuffer.store.byteOffset,
            this.lightColorBuffer.store.byteLength
        );
        device.queue.writeBuffer(
            uniformBuffer3,
            0,
            this.lightPosBuffer.store.buffer,
            this.lightPosBuffer.store.byteOffset,
            this.lightPosBuffer.store.byteLength
        );
        device.queue.writeBuffer(
            uniformBuffer4,
            0,
            this.spotdirBuffer.store.buffer,
            this.spotdirBuffer.store.byteOffset,
            this.spotdirBuffer.store.byteLength
        );
        device.queue.writeBuffer(
            uniformBuffer5,
            0,
            this.lightIntensityBuffer.store.buffer,
            this.lightIntensityBuffer.store.byteOffset,
            this.lightIntensityBuffer.store.byteLength
        );
        if (this.textureMatricesBuffer) {
            device.queue.writeBuffer(
                uniformBuffer6,
                0,
                this.textureMatricesBuffer.store.buffer,
                this.textureMatricesBuffer.store.byteOffset,
                this.textureMatricesBuffer.store.byteLength
            );
        }

        this.uniformBindGroup1 = uniformBindGroup1.filter(r => r.resource);
    }

    hasNormal() {
        return Boolean(this.normalTexture) || Boolean(this.clearcoatNormalTexture);
    }

    setColor(gl, name, value) {
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.UBO);
        this.materialUniformBuffer.update(gl, name, value.elements);
    }

    setTexture(gl, name, type, value) {
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.lightUBO5);
        const i = this.matricesMap.get(name) * 16;
        if (type === 'offset') {
            this.textureMatricesBuffer.store[i] = value.elements[0];
            this.textureMatricesBuffer.store[i + 1] = value.elements[1];
        }

        if (type === 'scale') {
            this.textureMatricesBuffer.store[i + 4] = value.elements[0];
            this.textureMatricesBuffer.store[i + 5] = value.elements[1];
        }

        if (type === 'rotation') {
            this.textureMatricesBuffer.store[i + 8] = value.elements[0];
        }
        
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.textureMatricesBuffer.store);
    }

    setTextureWebGPU(gl, name, type, value) {
        const i = this.matricesMap.get(name) * 16;
        if (type === 'offset') {
            this.textureMatricesBuffer.store[i] = value.elements[0];
            this.textureMatricesBuffer.store[i + 1] = value.elements[1];
        }

        if (type === 'scale') {
            this.textureMatricesBuffer.store[i + 4] = value.elements[0];
            this.textureMatricesBuffer.store[i + 5] = value.elements[1];
        }

        if (type === 'rotation') {
            this.textureMatricesBuffer.store[i + 8] = value.elements[0];
        }
        
        gl.device.queue.writeBuffer(
            this.textureMatricesBuffer.bufferWebGPU,
            0,
            this.textureMatricesBuffer.store.buffer,
            this.textureMatricesBuffer.store.byteOffset,
            this.textureMatricesBuffer.store.byteLength
        );
    }

    setColorWebGPU(gl, name, value) {
        this.materialUniformBuffer.updateWebGPU(gl, name, value.elements);
    }
}
