import { compileShader, createProgram, createTexture, calculateProjection, textureEnum } from './utils';
import { Matrix4, Vector3, Vector4 } from './matrix';
import { Camera } from './objects/index';
import parseHDR from 'parse-hdr';

import vertex from './shaders/env.vert';
import cube from './shaders/cube.frag';
import irradiance from './shaders/irradiance.frag';
import cubeMipmap from './shaders/cube-mipmap.frag';
import bdrf from './shaders/bdrf.frag';
import quad from './shaders/quad.glsl';
import { cubeVertex, quadVertex } from './vertex';
import { SphericalHarmonics, SphericalPolynomial } from './SH';
import { UniformBuffer } from './objects/uniform';
//@ts-ignore
import Sheen_E from '../src/images/Sheen_E.hdr';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}
interface FrameBuffer extends WebGLFramebuffer {
    size: number;
}

interface IBLData {
    specularImages: Array<Array<HTMLImageElement>>;
}

export class Env {
    camera: Camera;
    envMatrix: Matrix4;
    VAO: WebGLBuffer;
    quadVAO: WebGLBuffer;
    IndexBufferLength: number;
    cubeprogram: WebGLProgram;
    irradianceprogram: WebGLProgram;
    mipmapcubeprogram: WebGLProgram;
    bdrfprogram: WebGLProgram;
    level: WebGLUniformLocation;
    diffuse: WebGLUniformLocation;
    MVPMatrix: WebGLUniformLocation;
    framebuffer: FrameBuffer;
    irradiancebuffer: FrameBuffer;
    prefilterbuffer: FrameBuffer;
    views: Array<Matrix4>;
    views2: Array<Matrix4>;
    prefilterrender: WebGLRenderbuffer;
    brdfbuffer: FrameBuffer;
    canvas: HTMLCanvasElement;
    url: string;
    sampler: WebGLTexture;
    samplerCube: WebGLTexture;
    envData: IBLData;
    uniformBuffer: UniformBuffer;

    originalCubeTexture: Texture;
    brdfLUTTexture: Texture;
    original2DTexture: Texture;
    irradiancemap: Texture;
    prefilterMap: Texture;
    charlieMap: Texture;
    Sheen_E: Texture;

    constructor(url) {
        this.url = url;
        this.envMatrix = new Matrix4();
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setGl(g) {
        gl = g;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }

    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }

    drawQuad() {
        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            perspective: {
                yfov: 0.3,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        gl.enable(gl.CULL_FACE);
        const program = gl.createProgram();
        compileShader(
            gl.VERTEX_SHADER,
            `#version 300 es
        precision highp float;
        
        layout (location = 0) in vec2 inPosition;
        
        out vec2 outUV;

        uniform mat4 projection;
        uniform mat4 view;
        
        void main() {
            outUV = inPosition;
            gl_Position = projection * view * vec4(inPosition, 0.0, 1.0);
        }
        `,
            program
        );
        compileShader(
            gl.FRAGMENT_SHADER,
            `#version 300 es
        precision highp float;
        
        in vec2 outUV;
        layout (location = 0) out vec4 color;

        uniform sampler2D environmentMap;
        
        void main() {
            vec3 c = texture(environmentMap, outUV).rgb;
            
            color = vec4(c, 1.0);
        }
        `,
            program
        );
        gl.linkProgram(program);
        gl.useProgram(program);
        gl.bindVertexArray(this.quadVAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), false, m.elements);
        gl.uniform1i(gl.getUniformLocation(program, 'environmentMap'), this.charlieMap.index);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), false, this.camera.matrixWorldInvert.elements);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    draw() {
        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            perspective: {
                yfov: 0.3,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        gl.enable(gl.CULL_FACE);
        const program = gl.createProgram();
        compileShader(
            gl.VERTEX_SHADER,
            `#version 300 es
        precision highp float;
        
        layout (location = 0) in vec3 inPosition;
        
        out vec3 outUV;

        uniform mat4 projection;
        uniform mat4 view;
        uniform mat4 model;
        
        void main() {
            outUV = inPosition;
            gl_Position = projection * view * model * vec4(inPosition*0.1, 1.0);
        }
        `,
            program
        );
        compileShader(
            gl.FRAGMENT_SHADER,
            `#version 300 es
        precision highp float;
        
        in vec3 outUV;
        layout (location = 0) out vec4 color;
        uniform mat4 rotation;

        uniform samplerCube environmentMap;
        
        void main() {
            vec4 c = textureLod(environmentMap, outUV, 1.0);
            
            color = c;
        }
        `,
            program
        );
        //gl.disable(gl.DEPTH_TEST);
        gl.linkProgram(program);
        gl.useProgram(program);
        gl.bindVertexArray(this.VAO);
        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('view', this.camera.matrixWorldInvert.elements);
        uniformBuffer.add('projection', m.elements);
        uniformBuffer.done();
        //gl.uniformMatrix4fv(gl.getUniformLocation(program, 'rotation'), false, uniformBuffer.store.subarray(36));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), false, m.elements);
        const s = this.camera.modelSize * 2;
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'model'), false,
            new Matrix4().makeRotationAxis(new Vector3([1, 0, 0]), Math.PI).scale(new Vector3([s, s, s])).elements
        );
        gl.uniform1i(gl.getUniformLocation(program, 'environmentMap'), this.charlieMap.index);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), false, this.camera.matrixWorldInvert.elements);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.enable(gl.DEPTH_TEST);
    }

    createEnvironment() {
        gl.enable(gl.CULL_FACE);
        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            aspect: 1,
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        if (!this.envData) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.useProgram(this.cubeprogram);
            gl.bindVertexArray(this.VAO);
            gl.viewport(0, 0, this.framebuffer.size, this.framebuffer.size);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.cubeprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.cubeprogram, 'diffuse'), this.original2DTexture.index);
            const maxMipLevels = 10;
            for (let mip = 0; mip < maxMipLevels; ++mip) {
                const mipWidth = this.framebuffer.size * Math.pow(0.5, mip);
                const mipHeight = this.framebuffer.size * Math.pow(0.5, mip);

                gl.viewport(0, 0, mipWidth, mipHeight);
                //const roughness = mip / (maxMipLevels - 1);
                //gl.uniform1f(gl.getUniformLocation(this.cubeprogram, 'roughness'), roughness);

                for (let i = 0; i < 6; i++) {
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                        this.originalCubeTexture,
                        mip
                    );
                    gl.uniformMatrix4fv(gl.getUniformLocation(this.cubeprogram, 'view'), false, this.views[i].elements);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 36);
                }
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        if (!this.envData) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.irradiancebuffer);
            gl.useProgram(this.irradianceprogram);
            gl.bindVertexArray(this.VAO);
            gl.viewport(0, 0, this.irradiancebuffer.size, this.irradiancebuffer.size);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.irradianceprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.irradianceprogram, 'environmentMap'), this.originalCubeTexture.index);
            for (let i = 0; i < 6; i++) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.irradiancemap, 0);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.irradianceprogram, 'view'), false, this.views2[i].elements);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        if (!this.envData) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.prefilterbuffer);
            gl.useProgram(this.mipmapcubeprogram);
            gl.bindVertexArray(this.VAO);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.mipmapcubeprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.mipmapcubeprogram, 'environmentMap'), this.originalCubeTexture.index);
            const maxMipLevels = 5;
            for (let mip = 0; mip < maxMipLevels; ++mip) {
                const mipWidth = this.prefilterbuffer.size * Math.pow(0.5, mip);
                const mipHeight = this.prefilterbuffer.size * Math.pow(0.5, mip);

                gl.viewport(0, 0, mipWidth, mipHeight);
                const roughness = mip / (maxMipLevels - 1);
                gl.uniform1f(gl.getUniformLocation(this.mipmapcubeprogram, 'roughness'), roughness);

                for (let i = 0; i < 6; i++) {
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                        this.prefilterMap,
                        mip
                    );
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT1,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                        this.charlieMap,
                        mip
                    );
                    gl.uniformMatrix4fv(gl.getUniformLocation(this.mipmapcubeprogram, 'view'), false, this.views2[i].elements);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 36);
                }
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.brdfbuffer);
            gl.useProgram(this.bdrfprogram);
            gl.bindVertexArray(this.quadVAO);
            gl.viewport(0, 0, this.brdfbuffer.size, this.brdfbuffer.size);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.brdfLUTTexture, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        gl.disable(gl.CULL_FACE);
        gl.viewport(0, 0, this.width, this.height);
    }

    updateUniform(gl, program) {
        if (this.uniformBuffer) {
            const mIndex = gl.getUniformBlockIndex(program, 'SphericalHarmonics');
            gl.uniformBlockBinding(program, mIndex, 7);
            const mUBO = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, mUBO);
            gl.bufferData(gl.UNIFORM_BUFFER, this.uniformBuffer.store, gl.STATIC_DRAW);
            return mUBO;
        }
    }

    async createEnvironmentBuffer(envData) {
        this.envData = envData;

        if (envData) {
            const matrix = new Matrix4();
            matrix.makeRotationFromQuaternion(new Vector4(envData.rotation).elements);
            const sphericalHarmonics = SphericalHarmonics.FromArray(envData.irradianceCoefficients);
            sphericalHarmonics.scaleInPlace(envData.intensity);
            sphericalHarmonics.convertIrradianceToLambertianRadiance();
            const sphericalPolynomial = SphericalPolynomial.FromHarmonics(sphericalHarmonics);
            const { preScaledHarmonics } = sphericalPolynomial;
            const uniformBuffer = new UniformBuffer();
            uniformBuffer.add('vSphericalL00', preScaledHarmonics.l00.elements);
            uniformBuffer.add('vSphericalL1_1', preScaledHarmonics.l1_1.elements);
            uniformBuffer.add('vSphericalL10', preScaledHarmonics.l10.elements);
            uniformBuffer.add('vSphericalL11', preScaledHarmonics.l11.elements);
            uniformBuffer.add('vSphericalL2_2', preScaledHarmonics.l2_2.elements);
            uniformBuffer.add('vSphericalL2_1', preScaledHarmonics.l2_1.elements);
            uniformBuffer.add('vSphericalL20', preScaledHarmonics.l20.elements);
            uniformBuffer.add('vSphericalL21', preScaledHarmonics.l21.elements);
            uniformBuffer.add('vSphericalL22', preScaledHarmonics.l22.elements);
            uniformBuffer.add('rotationMatrix', matrix.elements);
            uniformBuffer.done();
            this.uniformBuffer = uniformBuffer;
        }

        {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.sampler = sampler;
        }

        {
            const sampler = gl.createSampler();
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            this.samplerCube = sampler;
        }

        {
            const size = 32;
            const captureFBO = gl.createFramebuffer();
            this.irradiancebuffer = captureFBO;
            this.irradiancebuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const texture = createTexture(gl.TEXTURE_CUBE_MAP, textureEnum.irradianceTexture);
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, 0);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            this.irradiancemap = texture;
        }

        {
            const size = 512;
            const captureFBO = gl.createFramebuffer();
            this.framebuffer = captureFBO;
            this.framebuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const texture = createTexture(gl.TEXTURE_CUBE_MAP);
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, 0);
            }
            gl.bindSampler(texture.index, this.samplerCube);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            this.originalCubeTexture = texture;
        }

        {
            const size = 128;
            const captureFBO = gl.createFramebuffer();
            this.prefilterbuffer = captureFBO;
            this.prefilterbuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const texture = createTexture(gl.TEXTURE_CUBE_MAP, textureEnum.prefilterTexture);
            if (this.envData) {
                const x = [
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                for (let j = 0; j < this.envData.specularImages.length; j++) {
                    // @ts-ignore
                    const s = this.envData.specularImageSize * Math.pow(0.5, j);
                    for (let i = 0; i < 6; i++) {
                        gl.texImage2D(x[i], j, gl.RGBA, s, s, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.envData.specularImages[j][i]);
                        // gl.texImage2D(x[i], j, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.envData.specularImages[j][i]);
                    }
                }
                gl.bindSampler(texture.index, this.samplerCube);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            } else {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                for (let i = 0; i < 6; i++) {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, i);
                }
                gl.bindSampler(texture.index, this.samplerCube);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

                const texture2 = createTexture(gl.TEXTURE_CUBE_MAP, textureEnum.charlieTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                for (let i = 0; i < 6; i++) {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture2, i);
                }
                gl.bindSampler(texture2.index, this.samplerCube);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                this.charlieMap = texture2;
                gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
            }
            this.prefilterMap = texture;
        }

        {
            const size = 512;
            const captureFBO = gl.createFramebuffer();
            this.brdfbuffer = captureFBO;
            this.brdfbuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const texture = createTexture(gl.TEXTURE_2D, textureEnum.brdfLUTTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
            gl.bindSampler(texture.index, this.sampler);
            this.brdfLUTTexture = texture;

            this.quadVAO = gl.createVertexArray();
            gl.bindVertexArray(this.quadVAO);
            const quadVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertex), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            gl.bindVertexArray(null);
        }

        const views = [
            [new Vector3([0, 1, 0]), Math.PI / 2], // Right
            [new Vector3([0, 1, 0]), -Math.PI / 2], // Left
            [new Vector3([1, 0, 0]), 0], // Top
            [new Vector3([1, 0, 0]), Math.PI], // Bottom
            [new Vector3([1, 0, 0]), -Math.PI / 2], // Front
            [new Vector3([1, 0, 0]), Math.PI / 2] // Back
        ];
        this.views = views.map((view, i) => {
            const camMatrix = new Matrix4();
            camMatrix.makeRotationAxis(view[0], view[1]);

            if (i === 5) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), Math.PI);
                camMatrix.multiply(m);
            }
            if (i === 0) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), Math.PI / 2);
                camMatrix.multiply(m);
            }
            if (i === 1) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), -Math.PI / 2);
                camMatrix.multiply(m);
            }

            return new Matrix4().setInverseOf(camMatrix);
        });
        const views2 = [
            [new Vector3([0, 1, 0]), Math.PI], // Right
            [new Vector3([0, 1, 0]), 0], // Left
            [new Vector3([1, 0, 0]), Math.PI / 2], // Top
            [new Vector3([1, 0, 0]), -Math.PI / 2], // Bottom
            [new Vector3([0, 1, 0]), Math.PI / 2], // Front
            [new Vector3([0, 1, 0]), -Math.PI / 2] // Back
        ];
        this.views2 = views2.map((view, i) => {
            const camMatrix = new Matrix4();
            camMatrix.makeRotationAxis(view[0], view[1]);

            if (i === 2) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), Math.PI / 2);
                camMatrix.multiply(m);
            }
            if (i === 3) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), -Math.PI / 2);
                camMatrix.multiply(m);
            }

            return new Matrix4().setInverseOf(camMatrix);
        });

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertex), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        }
        gl.bindVertexArray(null);

        this.cubeprogram = createProgram(vertex, cube);
        this.irradianceprogram = createProgram(vertex, irradiance);
        this.mipmapcubeprogram = createProgram(vertex, cubeMipmap);
        this.bdrfprogram = createProgram(quad, bdrf);

        await fetch(this.url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const { data, shape } = parseHDR(buffer);

                this.original2DTexture = createTexture();
                //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, shape[0], shape[1], 0, gl.RGBA, gl.FLOAT, data);
                gl.bindSampler(this.original2DTexture.index, this.sampler);

                this.createEnvironment();

                return true;
            });
        await fetch(Sheen_E)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const { data, shape } = parseHDR(buffer);

                this.Sheen_E = createTexture(gl.TEXTURE_2D, textureEnum.Sheen_E);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, shape[0], shape[1], 0, gl.RGBA, gl.FLOAT, data);
                gl.bindSampler(this.Sheen_E.index, this.sampler);

                return true;
            });
    }
}
