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
import { quadFull } from './vertex';
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
    screenTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    normalTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    irradianceTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    specTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    albedoTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    depthTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    preDepthTexture: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
    fakeDepth: { texture: GPUTexture; sampler: GPUSampler; view: GPUTextureView; };
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
    target: GPURenderPassColorAttachment[] | undefined;
    vertexBuffer: GPUBuffer;
    bindGroup: GPUBindGroup;

    hasPostPass = true;
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
        // @ts-expect-error
        this.target = this.pipeline.pass.colorAttachments;
    }

    preProcessing() {
        // @ts-expect-error
        this.postprocessors.forEach(postProcessor => postProcessor.preProcessingWebGPU(this));
    }

    postProcessing() {
        const { device, context } = gl;
        // @ts-expect-error
        this.postprocessors.forEach(postProcessor => postProcessor.postProcessingWebGPU(this));

        const commandEncoder = device.createCommandEncoder();
        const shadowPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                // attachment is acquired in render loop.
                view: context.getCurrentTexture().createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear' as GPULoadOp,
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            }],
            depthStencilAttachment: {
                view: this.depthTexture.view,
                depthLoadOp: 'clear',
                depthClearValue: 1.0,
                depthStoreOp: 'store'
            }
        });
        shadowPass.setPipeline(this.pipeline);
        shadowPass.setVertexBuffer(0, this.vertexBuffer);
        shadowPass.setBindGroup(
            0,
            this.bindGroup
        );
        shadowPass.draw(6);

        shadowPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    createByteTexture(label: string) {
        const sampler = gl.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest'
        });
        const texture = gl.device.createTexture({
            size: [this.width, this.height, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'bgra8unorm',
            label
        });
        return { texture, sampler, view: texture.createView() };
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
        return { texture, sampler, view: texture.createView() };
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
        return { texture, sampler, view: texture.createView() };
    }

    createDepthTexture(label: string) {
        const sampler = gl.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest'
        });
        const texture = gl.device.createTexture({
            size: [this.width, this.height, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            format: 'depth32float',
            label
        });
        return { texture, sampler, view: texture.createView() };
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
        return { texture, sampler, view: texture.createView() };
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

    buildPipeline(WebGPU: WEBGPU, vertex, fragment, vertexId, entries, screen = false, label) {
        const { device, glslang, wgsl } = WebGPU;

        function convertGLSLtoWGSL(code: string, type: string) {
            const spirv = glslang.compileGLSL(code, type);
            return wgsl
                .convertSpirV2WGSL(spirv);
        }

        const bindGroupLayout = device.createBindGroupLayout({
            entries,
            label
        });
        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });
        const fragmentCode ='diagnostic(off,derivative_uniformity);\n' + convertGLSLtoWGSL(fragment, 'fragment');
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
                    code: fragmentCode,
                    label
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: screen ? 'bgra8unorm' : 'rgba16float'
                    }
                ]
            },

            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: screen ? {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth32float'
            } : undefined
        });
        return pipeline;
    }

    buildScreenBuffer() {
        if (this.postprocessors.length === 0) {
            return true;
        }

        this.vertexBuffer = this.buildVertex(gl, quadFull);

        this.screenTexture = this.createDefaultTexture();
        this.normalTexture = this.createByteTexture('normalTexture');
        this.irradianceTexture = this.createDefaultTexture();
        this.specTexture = this.createDefaultTexture();
        this.albedoTexture = this.createDefaultTexture();
        this.depthTexture = this.createDepthTexture('depthTexture');
        this.preDepthTexture = this.createDepthTexture('preDepthTexture');
        const colorAttachments = [
            {
                view: this.screenTexture.texture.createView(),
                storeOp: 'store' as GPUStoreOp,
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            },
            // {
            //     view: this.normalTexture.texture.createView(),
            //     storeOp: 'store' as GPUStoreOp,
            //     loadOp: 'clear',
            //     clearValue: { r: 0, g: 0, b: 0, a: 1.0 }
            // },
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
                    sampler: {}
                },
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
                {
                    binding: 9,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ],
            true,
            'screen'
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
        const entriesExternal = this.postprocessors
            // @ts-expect-error
            .filter(p => p.attachUniformWebGPU)
            // @ts-expect-error
            .map(postProcessor => postProcessor.attachUniformWebGPU());

        const entries = [
            {
                binding: 10,
                resource: this.screenTexture.sampler
            },
            {
                binding: 0,
                resource: this.screenTexture.view
            },
            {
                binding: 9,
                resource: this.specTexture.view
            },
            ...entriesExternal
        ];
        this.bindGroup = gl.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries
        })
    }

    clear() {
        console.error('implement');
    }
}
