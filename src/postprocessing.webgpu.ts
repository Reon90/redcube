import { Camera } from './objects/index';
import { Renderer } from './renderer';
import { SSAO } from './postprocessors/ssao';
import { Bloom } from './postprocessors/bloom';
import { Shadow } from './postprocessors/shadow';
import { Refraction } from './postprocessors/refraction';
import { Light } from './postprocessors/light';
import { PostProcessor } from './postprocessors/base';

import quadShader from './shaders/quad.webgpu.glsl';
import composerShader from './shaders/composer.webgpu.glsl';
import { quadVertex } from './vertex';
import { Scattering } from './postprocessors/scattering';

let gl: WEBGPU;

const processorsMap = {
    bloom: Bloom,
    ssao: SSAO,
    shadow: Shadow,
    light: Light,
    refraction: Refraction,
    scattering: Scattering,
};

interface Texture extends WebGLTexture {
    index: number;
}

export class PostProcessing {
    screenTexture: { texture: GPUTexture; sampler: GPUSampler; };
    normalTexture: { texture: GPUTexture; sampler: GPUSampler; };
    irradianceTexture: { texture: GPUTexture; sampler: GPUSampler; };
    specTexture: { texture: GPUTexture; sampler: GPUSampler; };
    albedoTexture: { texture: GPUTexture; sampler: GPUSampler; };
    depthTexture: { texture: GPUTexture; sampler: GPUSampler; };
    preDepthTexture: { texture: GPUTexture; sampler: GPUSampler; };
    fakeDepth: { texture: GPUTexture; sampler: GPUSampler; };
    camera: Camera;
    renderer: Renderer;
    canvas: HTMLCanvasElement;
    framebuffer: WebGLFramebuffer;
    preframebuffer: WebGLFramebuffer;
    postprocessors: Array<PostProcessor>;
    VAO: WebGLBuffer;
    program: WebGLProgram;
    renderframebuffer: WebGLFramebuffer;
    MSAA: Number;
    renderScene: Function;
    pipeline: GPURenderPipeline;

    hasPostPass = false;
    hasPrePass = false;

    constructor(processors, renderScene) {
        this.renderScene = renderScene;
        this.postprocessors = processors.map(name => new processorsMap[name]());
    }

    add(name) {
        const p = new processorsMap[name]();
        p.setGL(gl);
        this.postprocessors.push(p);
        this.hasPostPass = true;
    }

    addPrepass(name) {
        const p = new processorsMap[name]();
        p.setGL(gl);
        this.postprocessors.push(p);
        this.hasPrePass = true;
    }

    setCamera(camera) {
        this.camera = camera;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCamera(camera);
        });
    }

    setLight(light) {
        this.postprocessors.forEach(postProcessor => {
            postProcessor.light = light;
        });
    }

    setGl(g) {
        if (g) {
            gl = g;
            this.postprocessors.forEach(postProcessor => {
                postProcessor.setGL(gl);
            });
            this.fakeDepth = this.createNoiceTexture(1, new Float32Array([1, 1, 0]));
        }
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCanvas(canvas);
        });
    }

    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }

    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }

    bindPrePass() {
        
    }

    bindPostPass() {
        
    }

    preProcessing() {
        // @ts-expect-error
        this.postprocessors.forEach(postProcessor => postProcessor.preProcessingWebGPU(this));
    }

    postProcessing() {
        const { device } = gl;
        this.postprocessors.forEach(postProcessor => postProcessor.postProcessing(this));

        this.postprocessors.forEach(postProcessor => {
            postProcessor.attachUniform(this.program);
        });

        const sampler = device.createSampler({
            magFilter: 'linear'
        });
        const entries = [
            {
                binding: 10,
                resource: sampler
            },
            {
                binding: 0,
                resource: this.screenTexture.texture.createView()
            },
            {
                binding: 1,
                resource: this.normalTexture.texture.createView()
            },
            {
                binding: 2,
                resource: this.depthTexture.texture.createView()
            },
            {
                binding: 3,
                resource: this.preDepthTexture.texture.createView()
            },
            {
                binding: 4,
                resource: this.specTexture.texture.createView()
            }
        ];
        const commandEncoder = device.createCommandEncoder();
        // @ts-expect-error
        const shadowPass = commandEncoder.beginRenderPass(this.pipeline.pass);
        shadowPass.setPipeline(this.pipeline);
        shadowPass.setVertexBuffer(0, this.buildVertex(gl, quadVertex));
        shadowPass.setBindGroup(
            0,
            device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries
            })
        );
        shadowPass.draw(6);

        shadowPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    createByteTexture() {
        const sampler = gl.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest'
        });
        const texture = gl.device.createTexture({
            size: [this.width, this.height, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'bgra8unorm'
        });
        return { texture, sampler };
    }

    createDefaultTexture(scale = 1, hasMipmap = false) {
        const sampler = gl.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: hasMipmap ? 'linear' : undefined
        });
        const texture = gl.device.createTexture({
            size: [this.width / scale, this.height / scale, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float'
        });
        return { texture, sampler };
    }

    createOneChannelTexture(scale = 1) {
        const sampler = gl.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear'
        });
        const texture = gl.device.createTexture({
            size: [this.width / scale, this.height / scale, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'r8uint'
        });
        return { texture, sampler };
    }

    createDepthTexture() {
        const sampler = gl.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest'
        });
        const texture = gl.device.createTexture({
            size: [this.width, this.height, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'depth24plus'
        });
        return { texture, sampler };
    }

    createNoiceTexture(size, data) {
        const sampler = gl.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',
            addressModeU: 'repeat',
            addressModeV: 'repeat'
        });
        const texture = gl.device.createTexture({
            size: [size, size, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'rgba16float'
        });
        return { texture, sampler };
    }

    buildVertex(WebGPU: WEBGPU, g) {
        const { device } = WebGPU;
        const verticesBuffer = device.createBuffer({
            size: g.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
        });
        new Float32Array(verticesBuffer.getMappedRange()).set(g);
        verticesBuffer.unmap();
        return verticesBuffer;
    }

    buildPipeline(WebGPU: WEBGPU, vertex, fragment, vertexId, entries, screen = false) {
        const { device, glslang, wgsl } = WebGPU;

        function convertGLSLtoWGSL(code: string, type: string) {
            const spirv = glslang.compileGLSL(code, type);
            return wgsl
                .convertSpirV2WGSL(spirv)
                .replaceAll('type ', 'alias ');
        }

        const bindGroupLayout = device.createBindGroupLayout({
            entries
        });
        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        const pipeline = device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: device.createShaderModule({
                    code: convertGLSLtoWGSL(vertex, 'vertex')
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
                                format: `float32x${vertexId}` as GPUVertexFormat
                            }
                        ]
                    }
                ]
            },
            fragment: {
                module: device.createShaderModule({
                    code: convertGLSLtoWGSL(fragment, 'fragment')
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: screen ? 'bgra8unorm' : 'rgba32float'
                    }
                ]
            },

            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth32float'
            }
        });
        return pipeline;
    }

    buildScreenBuffer() {
        if (this.postprocessors.length === 0) {
            return true;
        }

        this.screenTexture = this.createDefaultTexture();
        this.normalTexture = this.createDefaultTexture();
        this.irradianceTexture = this.createDefaultTexture();
        this.specTexture = this.createDefaultTexture();
        this.albedoTexture = this.createDefaultTexture();
        this.depthTexture = this.createDepthTexture();
        this.preDepthTexture = this.createDepthTexture();
        const colorAttachments = [
            {
                view: this.screenTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            },
            {
                view: this.normalTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            },
            {
                view: this.irradianceTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            },
            {
                view: this.albedoTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            },
            {
                view: this.specTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            }
        ];

        // @ts-expect-error
        const defines = this.postprocessors.map(postProcessor => postProcessor.buildScreenBufferWebGPU(this));
        const defineStr = defines.map(define => `#define ${define.name} ${define.value ?? 1}` + '\n').join('');
        this.program = [quadShader.replace(/\n/, `\n${defineStr}`), composerShader.replace(/\n/, `\n${defineStr}`)];

        this.pipeline = this.buildPipeline(
            gl,
            this.program[0],
            this.program[1],
            2,
            [
                {
                    binding: 10,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering',
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                },
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float'
                    }
                }
            ],
            true
        );
        // @ts-expect-error
        this.pipeline.pass = {
            colorAttachments,
            depthStencilAttachment: {
                view: this.depthTexture.texture.createView(),
                depthLoadOp: 'clear',
                depthClearValue: 1.0,
                depthStoreOp: 'store'
            }
        };
    }

    clear() {
        console.error('implement');
    }
}
