import { Matrix3, Vector3, Matrix4 } from '../matrix';
import { UniformBuffer } from './uniform';
import { Material as M } from '../../GLTF';
import { textureEnum } from '../utils';

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
    defines: Array<string>
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
            specularFactor: material.pbrMetallicRoughness.specularFactor,
            glossinessFactor: material.pbrMetallicRoughness.glossinessFactor
        };
        this.alpha = material.alphaMode === 'BLEND';
        this.blend = material.blend;
        this.doubleSided = material.doubleSided;
        this.emissiveFactor = material.emissiveFactor;
        this.extras = material.extras;

        if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
            this.pbrMetallicRoughness.metallicRoughnessTexture = textures[material.pbrMetallicRoughness.metallicRoughnessTexture.index];
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
            const { extensions } = material.pbrMetallicRoughness.baseColorTexture;
            this.pbrMetallicRoughness.baseColorTexture = textures[material.pbrMetallicRoughness.baseColorTexture.index];
            defines.push({ name: 'BASECOLORTEXTURE' });

            if (extensions) {
                const ex = extensions.KHR_texture_transform;
                if (ex) {
                    const translation = ex.offset && new Matrix3().set([1, 0, 0, 0, 1, 0, ex.offset[0], ex.offset[1], 1]);
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
                    const scale = ex.scale && new Matrix3().set([ex.scale[0], 0, 0, 0, ex.scale[1], 0, 0, 0, 1]);

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
        defines.push({ name: 'LIGHTNUMBER', value: lights.length });

        if (material.extensions && material.extensions.KHR_materials_unlit) {
            defines.push({ name: 'NOLIGHT' });
        }
    }

    createUniforms(gl, program) {
        gl.useProgram(program);

        if (this.pbrMetallicRoughness.baseColorTexture) {
            this.uniforms.baseColorTexture = gl.getUniformLocation(program, 'baseColorTexture');
            gl.uniform1i(this.uniforms.baseColorTexture, textureEnum.baseColorTexture);
        }
        if (this.pbrMetallicRoughness.metallicRoughnessTexture) {
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

        this.uniforms.prefilterMap = gl.getUniformLocation(program, 'prefilterMap');
        this.uniforms.brdfLUT = gl.getUniformLocation(program, 'brdfLUT');
        this.uniforms.irradianceMap = gl.getUniformLocation(program, 'irradianceMap');
        this.uniforms.depthTexture = gl.getUniformLocation(program, 'depthTexture');

        gl.uniform1i(this.uniforms.prefilterMap, textureEnum.prefilterTexture);
        gl.uniform1i(this.uniforms.brdfLUT, textureEnum.brdfLUTTexture);
        gl.uniform1i(this.uniforms.irradianceMap, textureEnum.irradianceTexture);
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
            lightProps.set([light.intensity, light.spot.innerConeAngle || 0, light.spot.outerConeAngle || 0, lightEnum[light.type]], i * 4);
        });

        {
            const materialUniformBuffer = new UniformBuffer();
            materialUniformBuffer.add('baseColorFactor', this.pbrMetallicRoughness.baseColorFactor || [0.8, 0.8, 0.8, 1.0]);
            materialUniformBuffer.add('viewPos', camera.getPosition());
            materialUniformBuffer.add('textureMatrix', (this.matrix && this.matrix.elements) || new Matrix3().elements);
            materialUniformBuffer.add('specularFactor', this.pbrMetallicRoughness.specularFactor || [0, 0, 0]);
            materialUniformBuffer.add('emissiveFactor', this.emissiveFactor || [0, 0, 0]);
            materialUniformBuffer.add('glossinessFactor', this.pbrMetallicRoughness.glossinessFactor || 0.5);
            materialUniformBuffer.add('metallicFactor', this.pbrMetallicRoughness.metallicFactor || 1);
            materialUniformBuffer.add('roughnessFactor', this.pbrMetallicRoughness.roughnessFactor || 1);
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
        return Boolean(this.normalTexture);
    }
}
