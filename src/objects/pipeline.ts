import vertexShaderGLSL from '../shaders/vertex.glsl';
import fragmentShaderGLSL from '../shaders/fragment.glsl';
import fragGLSL from '../shaders/frag.webgpu.h';
import vertGLSL from '../shaders/vert.webgpu.h';

const programs = {};

export function create(device: GPUDevice, glslang, wgsl, uniformBindGroup1, defines, hasTransmission, mode, frontFace) {
    const programHash = defines.map(define => `${define.name}${define.value ?? 1}`).join('');
    let program;
    if (programs[programHash]) {
        program = programs[programHash];
    } else {
        const defineStr = defines.map(define => `#define ${define.name} ${define.value ?? 1}` + '\n').join('');
        const shaders = [vertexShaderGLSL, fragmentShaderGLSL]
        .map(p => p.replace(/#include ".*/g, str => {
            const subPath = str.split('"')[1];
            if (subPath.includes('vert')) {
                return vertGLSL;
            } else {
                return fragGLSL;
            }
        }))
        .map(p => p.replace(/\n/, `\n${defineStr}`));
        programs[programHash] = [convertGLSLtoWGSL(shaders[0], 'vertex'), convertGLSLtoWGSL(shaders[1], 'fragment')];
        program = programs[programHash];
    }

    const entries: GPUBindGroupLayoutEntry[] = [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 39,
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
        },
        {
            binding: 37,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {}
        }
    ];

    uniformBindGroup1.forEach(u => {
        if ((u.binding > 2 && u.binding < 15) || u.binding === 29 || u.binding === 31 || u.binding === 32 || u.binding === 33 || u.binding === 34 || u.binding === 36 || u.binding === 38) {
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
        },
        {
            binding: 26,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {}
        },
        {
            binding: 28,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {}
        },
        {
            binding: 35,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                viewDimension: 'cube',
                sampleType: 'float'
            }
        },
        {
            binding: 30,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        }
    );

    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        entries.push({
            binding: 22,
            visibility: GPUShaderStage.VERTEX,
            buffer: {}
        });
    }
    if (defines.find(d => d.name === 'SPHERICAL_HARMONICS')) {
        entries.push({
            binding: 27,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {}
        });
    }
    if (defines.find(d => d.name === 'MATRICES')) {
        entries.push({
            binding: 23,
            visibility: GPUShaderStage.FRAGMENT,
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
                    format: 'float32x3' as GPUVertexFormat
                },
                {
                    shaderLocation: 1,
                    offset: Float32Array.BYTES_PER_ELEMENT * vertexLayout[0],
                    format: 'float32x2' as GPUVertexFormat
                },
                {
                    shaderLocation: 2,
                    offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1]),
                    format: 'float32x3' as GPUVertexFormat
                },
                {
                    shaderLocation: 3,
                    offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2]),
                    format: 'float32x4' as GPUVertexFormat
                }
            ]
        }
    ];
    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        buffers[0].attributes.push(
            {
                shaderLocation: 4,
                offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
                format: 'float32x4' as GPUVertexFormat
            },
            {
                shaderLocation: 5,
                offset:
                    Float32Array.BYTES_PER_ELEMENT *
                    (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3] + vertexLayout[4]),
                format: 'float32x4' as GPUVertexFormat
            }
        );
    }
    if (defines.find(d => d.name === 'COLOR')) {
        buffers[0].attributes.push({
            shaderLocation: 6,
            offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
            format: 'float32x4' as GPUVertexFormat
        });
    }
    if (defines.find(d => d.name === 'MULTIUV')) {
        buffers[0].attributes.push({
            shaderLocation: 7,
            offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
            format: 'float32x2' as GPUVertexFormat
        });
        buffers[0].attributes.push({
            shaderLocation: 8,
            offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2] + vertexLayout[3]),
            format: 'float32x2' as GPUVertexFormat
        });
    }

    function convertGLSLtoWGSL(code: string, type: string) {
        const spirv = glslang.compileGLSL(code, type);
        return wgsl
            .convertSpirV2WGSL(spirv);
    }

    const pipeline = device.createRenderPipeline({
        label: 'main-pipeline',
        layout: pipelineLayout,
        vertex: {
            module: device.createShaderModule({
                code: program[0]
            }),
            entryPoint: 'main',
            buffers
        },
        fragment: {
            module: device.createShaderModule({
                code: program[1]
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: hasTransmission ? 'bgra8unorm' : 'bgra8unorm',
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
                },
                // { format: 'rgba16float' },
                // { format: 'rgba16float' },
                // { format: 'rgba16float' }
            
            ]
        },

        primitive: {
            frontFace: frontFace ? 'cw' : 'ccw',
            stripIndexFormat: getMode(mode).endsWith('strip') ? 'uint32' : undefined,
            topology: getMode(mode),
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

function getMode(mode) {
    switch (mode) {
    case 0:
        return 'point-list';
    case 1:
        return 'line-list';
    case 2:
        return 'line-list';
    case 3:
        return 'line-strip';
    case 4:
        return 'triangle-list';
    case 5:
        return 'triangle-strip';
    case 6:
        return 'triangle-list';
    }
}
