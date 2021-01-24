import { Matrix3, Vector3, Matrix4 } from '../matrix';
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
    emissiveTexture: WebGLUniformLocation;
    prefilterMap: WebGLUniformLocation;
    brdfLUT: WebGLUniformLocation;
    irradianceMap: WebGLUniformLocation;
    depthTexture: WebGLUniformLocation;
    colorTexture: WebGLUniformLocation;
    Sheen_E: WebGLUniformLocation;
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
    doubleSided: boolean;
    defines: Array<{name: string}>
    matrix: Matrix3;
    uniformBuffer: UniformBuffer;
    lightUBO1: WebGLBuffer;
    lightUniformBuffer1: UniformBuffer;
    lightUBO2: WebGLBuffer;
    lightUniformBuffer2: UniformBuffer;
    lightUBO3: WebGLBuffer;
    lightUniformBuffer3: UniformBuffer;
    lightUBO4: WebGLBuffer;
    lightUniformBuffer4: UniformBuffer;

    constructor(m = defaultMaterial, textures, defines, lights) {
        super();

        const material = Object.assign({}, m);
        this.defines = defines;
        this.name = material.name;

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
                defines.push({ name: 'CLEARCOATMAP', value: texCoord ? 2 : 1 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.buildTrans(ex, defines, 'CLEARCOATMAP');
                    }
                }
            }
            if (cl.clearcoatNormalTexture) {
                const { extensions, texCoord } = cl.clearcoatNormalTexture;
                this.clearcoatNormalTexture = textures[cl.clearcoatNormalTexture.index];
                defines.push({ name: 'CLEARCOATNORMALMAP', value: texCoord ? 2 : 1 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.buildTrans(ex, defines, 'CLEARCOATNORMALMAP');
                    }
                }
            }
            if (cl.clearcoatRoughnessTexture) {
                const { extensions, texCoord } = cl.clearcoatRoughnessTexture;
                this.clearcoatRoughnessTexture = textures[cl.clearcoatRoughnessTexture.index];
                defines.push({ name: 'CLEARCOATROUGHMAP', value: texCoord ? 2 : 1 });
                if (extensions) {
                    const ex = extensions.KHR_texture_transform;
                    if (ex) {
                        this.buildTrans(ex, defines, 'CLEARCOATROUGHMAP');
                    }
                }
            }
        }

        if (material.extensions && material.extensions.KHR_materials_sheen) {
            const { sheenColorTexture, sheenColorFactor, sheenRoughnessFactor, sheenRoughnessTexture } = material.extensions.KHR_materials_sheen;
            this.sheenColorFactor = sheenColorFactor;
            this.sheenRoughnessFactor = sheenRoughnessFactor;
            if (sheenColorTexture) {
                this.sheenColorTexture = textures[sheenColorTexture.index];
                defines.push({ name: 'SHEENMAP' });
            }
            if (sheenRoughnessTexture) {
                this.sheenRoughnessTexture = textures[sheenRoughnessTexture.index];
                defines.push({ name: 'SHEENMAP' });
            }
        }

        if (material.extensions && material.extensions.KHR_materials_transmission) {
            const { transmissionFactor, transmissionTexture } = material.extensions.KHR_materials_transmission;
            this.transmissionFactor = transmissionFactor;
            if (transmissionTexture) {
                this.transmissionTexture = textures[transmissionTexture.index];
                defines.push({ name: 'TRANSMISSIONMAP' });
            }
            defines.push({ name: 'TRANSMISSION' });
        }

        this.uniforms = {
            baseColorTexture: null,
            metallicRoughnessTexture: null,
            normalTexture: null,
            occlusionTexture: null,
            clearcoatTexture: null,
            clearcoatRoughnessTexture: null,
            sheenRoughnessTexture: null,
            sheenColorTexture: null,
            clearcoatNormalTexture: null,
            emissiveTexture: null,
            prefilterMap: null,
            brdfLUT: null,
            irradianceMap: null,
            transmissionTexture: null,
            colorTexture: null,
            Sheen_E: null,
            depthTexture: null
        };
        const pbrMetallicRoughness = material.pbrMetallicRoughness;
        if (pbrMetallicRoughness) {
            this.baseColorFactor = pbrMetallicRoughness.baseColorFactor;
            this.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
            this.metallicFactor = pbrMetallicRoughness.metallicFactor;
            this.specularFactor = pbrMetallicRoughness.specularFactor;
            this.glossinessFactor = pbrMetallicRoughness.glossinessFactor;
        }
        this.alpha = material.alphaMode === 'BLEND';
        this.blend = material.blend;
        this.doubleSided = material.doubleSided;
        this.emissiveFactor = material.emissiveFactor;
        this.extras = material.extras;

        if (pbrMetallicRoughness && pbrMetallicRoughness.metallicRoughnessTexture) {
            const { extensions, texCoord } = pbrMetallicRoughness.metallicRoughnessTexture;
            this.metallicRoughnessTexture = textures[pbrMetallicRoughness.metallicRoughnessTexture.index];
            defines.push({ name: 'METALROUGHNESSMAP', value: texCoord ? 2 : 1 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.buildTrans(ex, defines, 'METALROUGHNESSMAP');
                }
            }
        }
        if (material.normalTexture) {
            const { extensions, texCoord } = material.normalTexture;
            this.normalTexture = textures[material.normalTexture.index];
            defines.push({ name: 'NORMALMAP', value: texCoord ? 2 : 1 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.buildTrans(ex, defines, 'NORMALMAP');
                }
            }
        }
        if (material.occlusionTexture) {
            const { extensions, texCoord } = material.occlusionTexture;
            this.occlusionTexture = textures[material.occlusionTexture.index];
            defines.push({ name: 'OCCLUSIONMAP', value: texCoord ? 2 : 1 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.buildTrans(ex, defines, 'OCCLUSIONMAP');
                }
            }
        }
        if (pbrMetallicRoughness && pbrMetallicRoughness.baseColorTexture) {
            const { extensions, texCoord } = pbrMetallicRoughness.baseColorTexture;
            this.baseColorTexture = textures[pbrMetallicRoughness.baseColorTexture.index];
            defines.push({ name: 'BASECOLORTEXTURE', value: texCoord ? 2 : 1 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.buildTrans(ex, defines, 'BASECOLORTEXTURE');
                }
            }
        }
        if (material.emissiveTexture) {
            const { extensions, texCoord } = material.emissiveTexture;
            this.emissiveTexture = textures[material.emissiveTexture.index];
            defines.push({ name: 'EMISSIVEMAP', value: texCoord ? 2 : 1 });
            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    this.buildTrans(ex, defines, 'EMISSIVEMAP');
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
        defines.push({ name: 'LIGHTNUMBER', value: lights.length });

        if (material.extensions && material.extensions.KHR_materials_unlit) {
            defines.push({ name: 'NOLIGHT' });
        }
    }

    buildTrans(ex, defines, name = '') {
        if (ex.offset || ex.scale || ex.rotation) {
        const offset = ex.offset || [0, 0];
        const scale = ex.scale || [1, 1];
        const rotation = ex.rotation || 0;
        this.matrix = new Matrix3().set([...offset, 0, ...scale, 0, rotation, 0, 0]);
        defines.push({ name: name + '_TEXTURE_TRANSFORM' });
        }
    }

    setHarmonics(sphericalHarmonics) {
        this.sphericalHarmonics = sphericalHarmonics;
    }

    createUniforms(gl, program) {
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
        if (this.sheenColorTexture) {
            this.uniforms.sheenColorTexture = gl.getUniformLocation(program, 'sheenColorTexture');
            gl.uniform1i(this.uniforms.sheenColorTexture, textureEnum.sheenColorTexture);
        }
        if (this.transmissionTexture) {
            this.uniforms.transmissionTexture = gl.getUniformLocation(program, 'transmissionTexture');
            gl.uniform1i(this.uniforms.transmissionTexture, textureEnum.transmissionTexture);
        }

        this.uniforms.prefilterMap = gl.getUniformLocation(program, 'prefilterMap');
        this.uniforms.brdfLUT = gl.getUniformLocation(program, 'brdfLUT');
        this.uniforms.irradianceMap = gl.getUniformLocation(program, 'irradianceMap');
        this.uniforms.depthTexture = gl.getUniformLocation(program, 'depthTexture');
        this.uniforms.colorTexture = gl.getUniformLocation(program, 'colorTexture');
        this.uniforms.Sheen_E = gl.getUniformLocation(program, 'Sheen_E');

        gl.uniform1i(this.uniforms.prefilterMap, textureEnum.prefilterTexture);
        gl.uniform1i(this.uniforms.brdfLUT, textureEnum.brdfLUTTexture);
        gl.uniform1i(this.uniforms.irradianceMap, textureEnum.irradianceTexture);
        gl.uniform1i(this.uniforms.Sheen_E, textureEnum.Sheen_E);
    }

    updateUniforms(gl, program, camera, lights) {
        const spotDirs = new Float32Array(lights.length * 3);
        const lightPos = new Float32Array(lights.length * 3);
        const lightColor = new Float32Array(lights.length * 3);
        const lightProps = new Float32Array(lights.length * 4);
        lights.forEach((light, i) => {
            spotDirs.set(
                new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize()
                    .elements,
                i * 3
            );
            lightPos.set(light.getPosition(), i * 3);
            lightColor.set(light.color.elements, i * 3);
            lightProps.set([light.intensity, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]], i * 4);
        });

        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('baseColorFactor', this.baseColorFactor ?? [0.8, 0.8, 0.8, 1.0]);
            materialUniformBuffer.add('viewPos', camera.getPosition());
            materialUniformBuffer.add('textureMatrix', (this.matrix && this.matrix.elements) || new Matrix3().elements);
            materialUniformBuffer.add('specularFactor', this.specularFactor ?? [0, 0, 0]);
            materialUniformBuffer.add('emissiveFactor', this.emissiveFactor ?? [0, 0, 0]);
            materialUniformBuffer.add('glossinessFactor', this.glossinessFactor ?? 0.5);
            materialUniformBuffer.add('metallicFactor', this.metallicFactor ?? 1);
            materialUniformBuffer.add('roughnessFactor', this.roughnessFactor ?? 1);
            materialUniformBuffer.add('clearcoatFactor', this.clearcoatFactor ?? 0);
            materialUniformBuffer.add('clearcoatRoughnessFactor', this.clearcoatRoughnessFactor ?? 0);
            materialUniformBuffer.add('sheenColorFactor', this.sheenColorFactor ?? 0);
            materialUniformBuffer.add('sheenRoughnessFactor', this.sheenRoughnessFactor ?? 0);
            materialUniformBuffer.add('transmissionFactor', this.transmissionFactor ?? 0);
            materialUniformBuffer.done();

            const mIndex = gl.getUniformBlockIndex(program, 'Material');
            gl.uniformBlockBinding(program, mIndex, 1);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.UBO = mUBO;
            this.uniformBuffer = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightColor', lightColor);
            materialUniformBuffer.done();

            const mIndex = gl.getUniformBlockIndex(program, 'LightColor');
            gl.uniformBlockBinding(program, mIndex, 3);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO1 = mUBO;
            this.lightUniformBuffer1 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightPos', lightPos);
            materialUniformBuffer.done();

            const mIndex = gl.getUniformBlockIndex(program, 'LightPos');
            gl.uniformBlockBinding(program, mIndex, 4);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO2 = mUBO;
            this.lightUniformBuffer2 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('spotdir', spotDirs);
            materialUniformBuffer.done();

            const mIndex = gl.getUniformBlockIndex(program, 'Spotdir');
            gl.uniformBlockBinding(program, mIndex, 5);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO3 = mUBO;
            this.lightUniformBuffer3 = materialUniformBuffer;
        }
        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('lightIntensity', lightProps);
            materialUniformBuffer.done();

            const mIndex = gl.getUniformBlockIndex(program, 'LightIntensity');
            gl.uniformBlockBinding(program, mIndex, 6);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, materialUniformBuffer.store, gl.STATIC_DRAW);
            this.lightUBO4 = mUBO;
            this.lightUniformBuffer4 = materialUniformBuffer;
        }
    }

    hasNormal() {
        return Boolean(this.normalTexture) || Boolean(this.clearcoatNormalTexture);
    }
}
