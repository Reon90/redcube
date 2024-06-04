import vertexShaderGLSL from '../shaders/webgpu.vert';
import fragmentShaderGLSL from '../shaders/webgpu.frag';

export function create(device, glslang, wgsl, uniformBindGroup1, defines) {
    //const programHash = defines.map(define => `${define.name}${define.value || 1}`).join('');
    const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
    const program = [vertexShaderGLSL.replace(/\n/, `\n${defineStr}`), fragmentShaderGLSL.replace(/\n/, `\n${defineStr}`)];

    const entries: GPUBindGroupLayoutEntry[] = [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {}
        }
    ];

    uniformBindGroup1.forEach(u => {
        if (u.binding > 2 && u.binding < 15) {
            entries.push({
                binding: u.binding,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            });
        }
    });

    entries.push(
        {
            binding: 15,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 16,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 17,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 18,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 19,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                viewDimension: 'cube',
                sampleType: 'float'
            }
        },
        {
            binding: 20,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                viewDimension: 'cube',
                sampleType: 'float'
            }
        },
        {
            binding: 21,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: 'float'
            }
        },
        {
            binding: 24,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
                type: 'filtering'
            }
        }
    );

    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        entries.push({
            binding: 22,
            visibility: GPUShaderStage.VERTEX,
            buffer: {}
        });
    }

    const bindGroupLayout = device.createBindGroupLayout({
        entries
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    const vertexLayout = [3, 2, 3, 4];
    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        vertexLayout.push(4, 4);
    }
    if (defines.find(d => d.name === 'COLOR')) {
        vertexLayout.push(4);
    }
    if (defines.find(d => d.name === 'MULTIUV')) {
        vertexLayout.push(2);
    }
    const cubeVertexSize = Float32Array.BYTES_PER_ELEMENT * vertexLayout.reduce((a, b) => a + b, 0); // Byte size of one cube vertex.
    const buffers = [
        {
            arrayStride: cubeVertexSize,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3'
                },
                {
                    shaderLocation: 1,
                    offset: Float32Array.BYTES_PER_ELEMENT * vertexLayout[0],
                    format: 'float32x2'
                },
                {
                    shaderLocation: 2,
                    offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1]),
                    format: 'float32x3'
                },
                {
                    shaderLocation: 3,
                    offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2]),
                    format: 'float32x4'
                }
            ]
        }
    ];
    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        buffers[0].attributes.push(
            {
                shaderLocation: 4,
                offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
                format: 'float32x4'
            },
            {
                shaderLocation: 5,
                offset:
                    Float32Array.BYTES_PER_ELEMENT *
                    (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3] + vertexLayout[4]),
                format: 'float32x4'
            }
        );
    }
    if (defines.find(d => d.name === 'COLOR')) {
        buffers[0].attributes.push({
            shaderLocation: 6,
            offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
            format: 'float32x4'
        });
    }
    if (defines.find(d => d.name === 'MULTIUV')) {
        buffers[0].attributes.push({
            shaderLocation: 7,
            offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
            format: 'float32x2'
        });
    }

    function convertGLSLtoWGSL(code: string, type: string) {
        const spirv = glslang.compileGLSL(code, type);
        return wgsl
            .convertSpirV2WGSL(spirv)
            .replaceAll('type ', 'alias ');
    }

    const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: device.createShaderModule({
                code: convertGLSLtoWGSL(program[0], 'vertex'),
                source: program[0],
                transform: glsl => convertGLSLtoWGSL(glsl, 'vertex')
            }),
            entryPoint: 'main',
            buffers
        },
        fragment: {
            module: device.createShaderModule({
                code: convertGLSLtoWGSL(program[1], 'fragment'),
                source: program[1],
                transform: glsl => convertGLSLtoWGSL(glsl, 'fragment')
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: 'bgra8unorm',
                    blend: defines.find(d => d.name === 'ALPHATEST')
                        ? {
                            color: {
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add'
                            },
                            alpha: {
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add'
                            }
                        }
                        : undefined
                }
            ]
        },

        primitive: {
            topology: 'triangle-list',
            cullMode: defines.find(d => d.name === 'DOUBLESIDED') ? 'none' : 'back'
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth32float'
        }
    });
    return pipeline;
}
