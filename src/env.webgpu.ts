import { calculateProjection, generateMipmaps } from './utils';
import { Matrix4, Vector3, Vector4 } from './matrix';
import { Camera } from './objects/index';
import parseHDR from 'parse-hdr';

import vertex from './shaders/env.webgpu.vert';
import cube from './shaders/cube.webgpu.frag';
import irradiance from './shaders/irradiance.webgpu.frag';
import cubeMipmap from './shaders/cube-mipmap.webgpu.frag';
import bdrf from './shaders/bdrf.webgpu.frag';
import quad from './shaders/quad.webgpu.glsl';
import { cubeVertex, quadFull } from './vertex';
import { UniformBuffer } from './objects/uniform';
//@ts-ignore
import Sheen_E from '../src/images/Sheen_E.hdr';
import { SphericalHarmonics, SphericalPolynomial } from './SH';

interface Texture extends WebGLTexture {
    index: number;
}
interface FrameBuffer extends WebGLFramebuffer {
    size: number;
}

interface IBLData {
    specularImages: Array<Array<{ bitmap: ImageBitmap }>>;
    specularImageSize: number;
}

const FULL_SIZE = 512;
let RADIANCE_SIZE = 128;
const IRRADIANCE_SIZE = 32;

function loadHDR(device, { data, shape, usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST }, mipLevelCount) {
    const img = new Float16Array(data.length);
    let k;
    let r;
    let g;
    let b;
    let a;
    let m;
    for (let j = 0; j <= shape[1]; j++) {
        for (let i = 0; i <= shape[0]; i++) {
            k = j * shape[0] + i;
            r = data[4 * k];
            g = data[4 * k + 1];
            b = data[4 * k + 2];
            a = data[4 * k + 3];

            m = (shape[1] - j + 1) * shape[0] + i;
            img[4 * m] = r;
            img[4 * m + 1] = g;
            img[4 * m + 2] = b;
            img[4 * m + 3] = a;
        }
    }

    const tex = device.createTexture({
        mipLevelCount,
        size: [shape[0], shape[1], 1],
        format: 'rgba16float', // TODO 16 filtered vs 32 non-filtered
        usage,
    });
    const bytesPerRow = shape[0] * 4 * 2;
    device.queue.writeTexture(
        { texture: tex },
        img,
        {
            // offset: 0,
            bytesPerRow,
            // rowsPerImage: shape[1]
        },
        [shape[0], shape[1], 1],
    );
    return tex;
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
    prefilterrender: WebGLRenderbuffer;
    brdfbuffer: FrameBuffer;
    canvas: HTMLCanvasElement;
    url: string;
    sampler: WebGLTexture;
    samplerCube: WebGLTexture;
    envData: IBLData;
    uniformBuffer: UniformBuffer;

    originalCubeTexture: GPUTexture;
    brdfLUTTexture: Texture;
    original2DTexture: Texture;
    irradiancemap: Texture;
    prefilterMap: Texture;
    Sheen_E: GPUTexture;

    prefilterTexture: GPUTexture;
    charlieTexture: GPUTexture;
    irradianceTexture: GPUTexture;
    bdrfTexture: GPUTexture;
    cubeTexture: GPUTexture;
    pipeline: GPURenderPipeline;
    pipeline2: GPURenderPipeline;
    pipeline3: GPURenderPipeline;

    constructor(url) {
        this.url = url;
        this.envMatrix = new Matrix4();
    }

    setCamera(camera) {
        this.camera = camera;
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

    drawQuad(WebGPU: WEBGPU, x) {
        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            perspective: {
                yfov: 0.3,
                znear: 0.01,
                zfar: 10000,
            },
        });
        m.multiply(calculateProjection(cam));

        const vertex = `#version 460
        precision highp float;
        
        layout (location = 0) in vec2 inPosition;
        
        layout (location = 0) out vec2 outUV;

        //uniform mat4 projection;
        //uniform mat4 view;
        
        void main() {
            outUV = inPosition * 0.5 + 0.5;
            gl_Position = vec4(inPosition, 0.0, 1.0);
        }
        `;
        const fragment = `#version 460
        precision highp float;
        
        layout (location = 0) in vec2 outUV;
        layout (location = 0) out vec4 color;

        layout(set = 0, binding = 0) uniform sampler baseSampler;
        layout(set = 0, binding = 1) uniform texture2D environmentMap;
        
        void main() {
            vec3 c = textureLod(sampler2D(environmentMap, baseSampler), outUV, 2.0).rgb;
            
            color = vec4(c, 1.0);
        }
        `;

        //gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), false, m.elements);
        //gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), false, this.camera.matrixWorldInvert.elements);

        const { device, context } = WebGPU;

        let pass;
        {
            const depthTexture = device.createTexture({
                size: [this.width, this.height, 1],
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
                format: 'depth32float',
            });
            const depthTextureView = depthTexture.createView();

            pass = {
                colorAttachments: [
                    {
                        view: context.getCurrentTexture().createView(),
                        storeOp: 'store' as GPUStoreOp,
                        loadOp: 'clear',
                        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    },
                ],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadOp: 'clear',
                    depthClearValue: 1.0,
                    depthStoreOp: 'store',
                },
            };
        }
        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const entries = [
            {
                binding: 0,
                resource: sampler,
            },
            {
                binding: 1,
                resource: x.createView(),
            },
        ];

        const commandEncoder = device.createCommandEncoder();
        const shadowPass = commandEncoder.beginRenderPass(pass);
        const p = this.buildPipeline(
            WebGPU,
            vertex,
            fragment,
            2,
            [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering',
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                    },
                },
            ],
            [
                {
                    format: 'bgra8unorm',
                },
            ],
        );
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, quadFull));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries,
            }),
        );
        shadowPass.draw(6);

        shadowPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    drawCube(WebGPU: WEBGPU, shadowPass) {
        const { device } = WebGPU;
        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            perspective: {
                yfov: 0.3,
                znear: 0.01,
                zfar: 10000,
            },
        });
        m.multiply(calculateProjection(cam));

        const uniformBuffer = new UniformBuffer();
        const s = this.camera.modelSize * 2;
        uniformBuffer.add('model', new Matrix4().makeRotationAxis(new Vector3([1, 0, 0]), Math.PI).scale(new Vector3([s, s, s])).elements);
        uniformBuffer.add('view', this.camera.matrixWorldInvert.elements);
        uniformBuffer.add('projection', m.elements);
        uniformBuffer.done();
        const matrixSize = uniformBuffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;
        const u = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(u, 0, uniformBuffer.store.buffer, uniformBuffer.store.byteOffset, uniformBuffer.store.byteLength);

        const vertex = `#version 460
        precision highp float;
        
        layout (location = 0) in vec3 inPosition;
        
        layout (location = 0) out vec3 outUV;

        layout(set = 0, binding = 0) uniform Uniforms {
            mat4 model;
            mat4 view;
            mat4 projection;
        };
        
        void main() {
            outUV = inPosition;
            gl_Position = projection * view * model * vec4(inPosition, 1.0);
        }
        `;
        const fragment = `#version 460
        precision highp float;
        
        layout (location = 0) in vec3 outUV;
        layout (location = 0) out vec4 color;

        layout(set = 0, binding = 1) uniform sampler baseSampler;
        layout(set = 0, binding = 2) uniform textureCube environmentMap;
        
        void main() {
            vec3 c = textureLod(samplerCube(environmentMap, baseSampler), outUV, 1.0).rgb;
            
            color = vec4(c, 1.0);
        }
        `;
        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const entries = [
            {
                binding: 0,
                resource: {
                    buffer: u,
                    offset: 0,
                    size: matrixSize,
                },
            },
            {
                binding: 1,
                resource: sampler,
            },
            {
                binding: 2,
                resource: this.cubeTexture.createView({
                    dimension: 'cube',
                }),
            },
        ];

        //const commandEncoder = device.createCommandEncoder();
        //const shadowPass = commandEncoder.beginRenderPass(pass);
        const p = this.buildPipeline(
            WebGPU,
            vertex,
            fragment,
            3,
            [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering',
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        viewDimension: 'cube',
                        sampleType: 'float',
                    },
                },
            ],
            [{ format: 'bgra8unorm' }],
        );
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, cubeVertex));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries,
            }),
        );
        shadowPass.draw(36);

        //shadowPass.end();
        //device.queue.submit([commandEncoder.finish()]);
    }

    async createEnvironmentBuffer(envData, WebGPU: WEBGPU) {
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

            const buffer = WebGPU.device.createBuffer({
                size: 256 + uniformBuffer.store.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            uniformBuffer.bufferWebGPU = buffer;
            WebGPU.device.queue.writeBuffer(
                buffer,
                0,
                uniformBuffer.store.buffer,
                uniformBuffer.store.byteOffset,
                uniformBuffer.store.byteLength,
            );

            RADIANCE_SIZE = envData.specularImageSize;
        }
    }

    async createTexture(WebGPU: WEBGPU) {
        const views = [
            [new Vector3([0, 1, 0]), Math.PI / 2], // Right
            [new Vector3([0, 1, 0]), -Math.PI / 2], // Left
            [new Vector3([1, 0, 0]), Math.PI / 2], // Top
            [new Vector3([1, 0, 0]), -Math.PI / 2], // Bottom
            [new Vector3([0, 1, 0]), Math.PI], // Front
            [new Vector3([0, 1, 0]), 0], // Back
        ];
        this.views = views.map((view, i) => {
            const camMatrix = new Matrix4();
            camMatrix.makeRotationAxis(view[0], view[1]);

            if (i !== 2 && i !== 3) {
                const m = new Matrix4();
                m.makeRotationAxis(new Vector3([0, 0, 1]), Math.PI);
                camMatrix.multiply(m);
            }

            return new Matrix4().setInverseOf(camMatrix);
        });

        const { device } = WebGPU;
        await fetch(this.url)
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
                const env = parseHDR(buffer);
                const mipLevelCount = Math.floor(Math.log2(env.shape[0])) - 1;
                const tex = loadHDR(device, env, mipLevelCount);
                generateMipmaps(device, tex, env.shape[0], env.shape[1], mipLevelCount);

                this.originalCubeTexture = tex;
                return tex;
            });
        await fetch(Sheen_E)
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
                const tex = loadHDR(device, parseHDR(buffer), 1);

                this.Sheen_E = tex;
                return tex;
            });
    }

    buildPass(WebGPU: WEBGPU, size): [GPURenderPassDescriptor, GPUTexture] {
        const { device } = WebGPU;

        const depthTexture = device.createTexture({
            size: [size, size, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
        });
        const depthTextureView = depthTexture.createView();

        const colorTexture = device.createTexture({
            size: [size, size, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
            format: 'rgba16float',
        });
        const colorTextureView = colorTexture.createView();

        return [
            {
                colorAttachments: [
                    {
                        view: colorTextureView,
                        storeOp: 'store' as GPUStoreOp,
                        loadOp: 'clear' as GPULoadOp,
                        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    },
                ],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthLoadOp: 'clear' as GPULoadOp,
                    depthClearValue: 1.0,
                    depthStoreOp: 'store' as GPUStoreOp,
                },
            },
            colorTexture,
        ];
    }

    buildPipeline(WebGPU: WEBGPU, vertex, fragment, vertexId, entries, targets) {
        const { device, glslang, wgsl } = WebGPU;

        function convertGLSLtoWGSL(code: string, type: string) {
            const spirv = glslang.compileGLSL(code, type);
            return wgsl.convertSpirV2WGSL(spirv);
        }

        const bindGroupLayout = device.createBindGroupLayout({
            entries,
        });
        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        });

        const pipeline = device.createRenderPipeline({
            label: 'env-pipeline',
            layout: pipelineLayout,
            vertex: {
                module: device.createShaderModule({
                    code: convertGLSLtoWGSL(vertex, 'vertex'),
                }),
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: Float32Array.BYTES_PER_ELEMENT * vertexId,
                        attributes: [
                            {
                                // position
                                shaderLocation: 0,
                                offset: 0,
                                format: `float32x${vertexId}` as GPUVertexFormat,
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: device.createShaderModule({
                    code: convertGLSLtoWGSL(fragment, 'fragment'),
                }),
                entryPoint: 'main',
                targets,
            },

            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: {
                depthWriteEnabled: false,
                depthCompare: 'less',
                format: 'depth32float',
            },
        });
        return pipeline;
    }

    buildVertex(WebGPU: WEBGPU, g) {
        const { device } = WebGPU;
        const verticesBuffer = device.createBuffer({
            size: g.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(verticesBuffer.getMappedRange()).set(g);
        verticesBuffer.unmap();
        return verticesBuffer;
    }

    drawBRDF(WebGPU: WEBGPU) {
        const { device } = WebGPU;

        this.bdrfTexture = device.createTexture({
            label: 'bdrfTexture',
            size: [FULL_SIZE, FULL_SIZE, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float',
        });

        const commandEncoder = device.createCommandEncoder();
        const [pass, colorTexture] = this.buildPass(WebGPU, FULL_SIZE);
        const shadowPass = commandEncoder.beginRenderPass(pass);
        const p = this.buildPipeline(
            WebGPU,
            quad,
            bdrf,
            2,
            [],
            [
                {
                    format: 'rgba16float',
                },
            ],
        );
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, quadFull));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries: [],
            }),
        );
        shadowPass.setViewport(0, 0, FULL_SIZE, FULL_SIZE, 0, 1);
        shadowPass.draw(6);

        shadowPass.end();

        commandEncoder.copyTextureToTexture({ texture: colorTexture }, { texture: this.bdrfTexture }, [FULL_SIZE, FULL_SIZE, 1]);

        device.queue.submit([commandEncoder.finish()]);
    }

    drawWebGPU(WebGPU: WEBGPU, mipWidth, mipHeight, layer, mip) {
        const { device } = WebGPU;

        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            aspect: 1,
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000,
            },
        });
        m.multiply(calculateProjection(cam));
        const roughness = mip / 4;
        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('index', new Float32Array([layer, roughness, 0, 0]));
        uniformBuffer.add('projection', m.elements);
        uniformBuffer.add('view0', this.views[0].elements);
        uniformBuffer.add('view1', this.views[1].elements);
        uniformBuffer.add('view2', this.views[2].elements);
        uniformBuffer.add('view3', this.views[3].elements);
        uniformBuffer.add('view4', this.views[4].elements);
        uniformBuffer.add('view5', this.views[5].elements);
        uniformBuffer.done();
        const matrixSize = uniformBuffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;
        const u = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(u, 0, uniformBuffer.store.buffer, uniformBuffer.store.byteOffset, uniformBuffer.store.byteLength);

        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const entries = [
            {
                binding: 0,
                resource: {
                    buffer: u,
                    offset: 0,
                    size: matrixSize,
                },
            },
            {
                binding: 1,
                resource: sampler,
            },
            {
                binding: 2,
                resource: this.originalCubeTexture.createView(),
            },
        ];

        const entriesL = [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {},
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: 'filtering',
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType: 'float',
                },
            },
        ];

        const commandEncoder = device.createCommandEncoder();
        const [pass, colorTexture] = this.buildPass(WebGPU, FULL_SIZE);
        const shadowPass = commandEncoder.beginRenderPass(pass);
        const p =
            this.pipeline ||
            this.buildPipeline(WebGPU, vertex, cube, 3, entriesL, [
                {
                    format: 'rgba16float',
                },
            ]);
        this.pipeline = p;
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, cubeVertex));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries,
            }),
        );
        shadowPass.setViewport(0, 0, mipWidth, mipHeight, 0, 1);
        shadowPass.draw(36);

        shadowPass.end();

        commandEncoder.copyTextureToTexture({ texture: colorTexture }, { texture: this.cubeTexture, mipLevel: mip, origin: { z: layer } }, [
            mipWidth,
            mipHeight,
            1,
        ]);

        device.queue.submit([commandEncoder.finish()]);
    }

    drawWebGPU2(WebGPU: WEBGPU, mipWidth, mipHeight, layer, mip) {
        const { device } = WebGPU;

        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            aspect: 1,
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000,
            },
        });
        m.multiply(calculateProjection(cam));
        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('index', new Float32Array([layer, 0, 0, 0]));
        uniformBuffer.add('projection', m.elements);
        uniformBuffer.add('view0', this.views[0].elements);
        uniformBuffer.add('view1', this.views[1].elements);
        uniformBuffer.add('view2', this.views[2].elements);
        uniformBuffer.add('view3', this.views[3].elements);
        uniformBuffer.add('view4', this.views[4].elements);
        uniformBuffer.add('view5', this.views[5].elements);
        uniformBuffer.done();
        const matrixSize = uniformBuffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;
        const u = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(u, 0, uniformBuffer.store.buffer, uniformBuffer.store.byteOffset, uniformBuffer.store.byteLength);

        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const entries = [
            {
                binding: 0,
                resource: {
                    buffer: u,
                    offset: 0,
                    size: matrixSize,
                },
            },
            {
                binding: 1,
                resource: sampler,
            },
            {
                binding: 2,
                resource: this.cubeTexture.createView({
                    dimension: 'cube',
                }),
            },
        ];

        const entriesL = [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {},
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: 'filtering',
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    viewDimension: 'cube',
                    sampleType: 'float',
                },
            },
        ];

        const commandEncoder = device.createCommandEncoder();
        const [pass, colorTexture] = this.buildPass(WebGPU, IRRADIANCE_SIZE);
        const shadowPass = commandEncoder.beginRenderPass(pass);
        const p =
            this.pipeline2 ||
            this.buildPipeline(WebGPU, vertex, irradiance, 3, entriesL, [
                {
                    format: 'rgba16float',
                },
            ]);
        this.pipeline2 = p;
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, cubeVertex));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries,
            }),
        );
        shadowPass.setViewport(0, 0, mipWidth, mipHeight, 0, 1);
        shadowPass.draw(36);

        shadowPass.end();

        commandEncoder.copyTextureToTexture(
            { texture: colorTexture },
            { texture: this.irradianceTexture, mipLevel: mip, origin: { z: layer } },
            [mipWidth, mipHeight, 1],
        );

        device.queue.submit([commandEncoder.finish()]);
    }

    drawWebGPU3(WebGPU: WEBGPU, mipWidth, mipHeight, layer, mip) {
        const { device } = WebGPU;

        const m = new Matrix4();
        const cam = Object.assign({}, this.camera.props, {
            aspect: 1,
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000,
            },
        });
        m.multiply(calculateProjection(cam));
        const roughness = mip / 4;
        const uniformBuffer = new UniformBuffer();
        uniformBuffer.add('index', new Float32Array([layer, roughness, 0, 0]));
        uniformBuffer.add('projection', m.elements);
        uniformBuffer.add('view0', this.views[0].elements);
        uniformBuffer.add('view1', this.views[1].elements);
        uniformBuffer.add('view2', this.views[2].elements);
        uniformBuffer.add('view3', this.views[3].elements);
        uniformBuffer.add('view4', this.views[4].elements);
        uniformBuffer.add('view5', this.views[5].elements);
        uniformBuffer.done();
        const matrixSize = uniformBuffer.store.byteLength;
        const offset = 256; // uniformBindGroup offset must be 256-byte aligned
        const uniformBufferSize = offset + matrixSize;
        const u = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(u, 0, uniformBuffer.store.buffer, uniformBuffer.store.byteOffset, uniformBuffer.store.byteLength);

        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const entries = [
            {
                binding: 0,
                resource: {
                    buffer: u,
                    offset: 0,
                    size: matrixSize,
                },
            },
            {
                binding: 1,
                resource: sampler,
            },
            {
                binding: 2,
                resource: this.cubeTexture.createView({
                    dimension: 'cube',
                }),
            },
        ];

        const entriesL = [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {},
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: 'filtering',
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    viewDimension: 'cube',
                    sampleType: 'float',
                },
            },
        ];

        const commandEncoder = device.createCommandEncoder();
        const [pass, colorTexture] = this.buildPass(WebGPU, RADIANCE_SIZE);
        const colorTexture2 = device.createTexture({
            size: [RADIANCE_SIZE, RADIANCE_SIZE, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
            format: 'rgba16float',
        });
        // @ts-expect-error
        pass.colorAttachments.push({
            view: colorTexture2.createView(),
            storeOp: 'store' as GPUStoreOp,
            loadOp: 'clear' as GPULoadOp,
            clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        });
        const shadowPass = commandEncoder.beginRenderPass(pass);
        const p =
            this.pipeline3 ||
            this.buildPipeline(WebGPU, vertex, cubeMipmap, 3, entriesL, [
                {
                    format: 'rgba16float',
                },
                { format: 'rgba16float' },
            ]);
        this.pipeline3 = p;
        shadowPass.setPipeline(p);
        shadowPass.setVertexBuffer(0, this.buildVertex(WebGPU, cubeVertex));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: p.getBindGroupLayout(0),
                entries,
            }),
        );
        shadowPass.setViewport(0, 0, mipWidth, mipHeight, 0, 1);
        shadowPass.draw(36);

        shadowPass.end();

        if (this.envData) {
            let i = layer;
            if (layer === 2) {
                i = 3;
            }
            if (layer === 3) {
                i = 2;
            }
            const data = this.envData.specularImages[mip][i];

            device.queue.copyExternalImageToTexture(
                { source: data.bitmap },
                { texture: this.prefilterTexture, mipLevel: mip, origin: { z: layer } },
                { width: mipWidth, height: mipHeight, depthOrArrayLayers: 1 },
            );
        } else {
            commandEncoder.copyTextureToTexture(
                { texture: colorTexture },
                { texture: this.prefilterTexture, mipLevel: mip, origin: { z: layer } },
                [mipWidth, mipHeight, 1],
            );
            commandEncoder.copyTextureToTexture(
                { texture: colorTexture2 },
                { texture: this.charlieTexture, mipLevel: mip, origin: { z: layer } },
                [mipWidth, mipHeight, 1],
            );
        }

        device.queue.submit([commandEncoder.finish()]);
    }

    drawMips(WebGPU: WEBGPU) {
        const { device } = WebGPU;
        const mipLevelCount = 5;
        this.cubeTexture = device.createTexture({
            mipLevelCount,
            size: [FULL_SIZE, FULL_SIZE, 6],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float',
        });

        for (let mip = 0; mip < mipLevelCount; ++mip) {
            const mipWidth = FULL_SIZE * Math.pow(0.5, mip);
            const mipHeight = FULL_SIZE * Math.pow(0.5, mip);

            for (let i = 0; i < 6; i++) {
                this.drawWebGPU(WebGPU, mipWidth, mipHeight, i, mip);
            }
        }
    }

    drawIrradiance(WebGPU: WEBGPU) {
        const { device } = WebGPU;
        this.irradianceTexture = device.createTexture({
            label: 'irradianceTexture',
            size: [IRRADIANCE_SIZE, IRRADIANCE_SIZE, 6],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float',
        });

        for (let i = 0; i < 6; i++) {
            this.drawWebGPU2(WebGPU, IRRADIANCE_SIZE, IRRADIANCE_SIZE, i, 0);
        }
    }

    drawPrefilter(WebGPU: WEBGPU) {
        const { device } = WebGPU;
        const mipLevelCount = Math.floor(Math.log2(RADIANCE_SIZE)) - 2;
        this.prefilterTexture = device.createTexture({
            label: 'prefilterTexture',
            mipLevelCount,
            size: [RADIANCE_SIZE, RADIANCE_SIZE, 6],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float',
        });
        this.charlieTexture = device.createTexture({
            label: 'charlieTexture',
            mipLevelCount,
            size: [RADIANCE_SIZE, RADIANCE_SIZE, 6],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float',
        });

        for (let mip = 0; mip < mipLevelCount; ++mip) {
            const mipWidth = RADIANCE_SIZE * Math.pow(0.5, mip);
            const mipHeight = RADIANCE_SIZE * Math.pow(0.5, mip);

            for (let i = 0; i < 6; i++) {
                this.drawWebGPU3(WebGPU, mipWidth, mipHeight, i, mip);
            }
        }
    }
}
