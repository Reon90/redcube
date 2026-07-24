import vertexShaderGLSL from '../shaders/vertex.glsl';
import fragmentShaderGLSL from '../shaders/fragment.glsl';
import fragGLSL from '../shaders/frag.webgpu.h';
import vertGLSL from '../shaders/vert.webgpu.h';
import type { Define } from '../parse';

const lineFragmentShader = `#version 460
    precision highp float;
    layout (location = 0) out vec4 color;

    void main() {
        color = vec4(0.0, 1.0, 0.0, 1.0);
    }`;

interface Glslang {
    compileGLSL(code: string, type: string): Uint32Array;
}
interface WgslConverter {
    convertSpirV2WGSL(spirv: Uint32Array): string;
}

export function create(
    device: GPUDevice,
    glslang: Glslang,
    wgsl: WgslConverter,
    uniformBindGroup1: GPUBindGroupEntry[],
    defines: Define[],
    mode: number,
    frontFace: boolean
) {
    const defineStr = defines.map(define => `#define ${define.name} ${define.value ?? 1}` + '\n').join('');
    const shaders = [vertexShaderGLSL, mode > 3 ? fragmentShaderGLSL : fragmentShaderGLSL]
        .map(p => p.replace(/#include ".*/g, str => {
            const subPath = str.split('"')[1];
            if (subPath.includes('vert')) {
                return vertGLSL;
            } else {
                return fragGLSL;
            }
        }))
        .map(p => p.replace(/\n/, `\n${defineStr}`));
    const program = [convertGLSLtoWGSL(shaders[0], 'vertex'), convertGLSLtoWGSL(shaders[1], 'fragment')];

    const entries: GPUBindGroupLayoutEntry[] = [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
                type: 'read-only-storage'
            }
        },
        {
            binding: 39,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {}
        },
        {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: 'storage'
            }
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

    const attributesToDefine: { shaderLocation: number; format: GPUVertexFormat; size: number }[] = [
        { shaderLocation: 0, format: 'float32x3', size: 3 }, // POSITION
        { shaderLocation: 1, format: 'float32x2', size: 2 }, // TEXCOORD_0
        { shaderLocation: 2, format: 'float32x3', size: 3 }, // NORMAL
        { shaderLocation: 3, format: 'float32x4', size: 4 }, // TANGENT
        { shaderLocation: 9, format: 'float32', size: 1 },   // order
    ];

    if (defines.find(d => d.name === 'JOINTNUMBER')) {
        attributesToDefine.push(
            { shaderLocation: 4, format: 'float32x4', size: 4 }, // JOINTS_0
            { shaderLocation: 5, format: 'float32x4', size: 4 }  // WEIGHTS_0
        );
    }
    if (defines.find(d => d.name === 'COLOR')) {
        attributesToDefine.push({ shaderLocation: 6, format: 'float32x4', size: 4 }); // COLOR_0
    }
    if (defines.find(d => d.name === 'MULTIUV')) {
        attributesToDefine.push({ shaderLocation: 7, format: 'float32x2', size: 2 }); // TEXCOORD_1
    }
    if (defines.find(d => d.name === 'MULTIUV2')) {
        attributesToDefine.push({ shaderLocation: 8, format: 'float32x2', size: 2 }); // TEXCOORD_2
    }

    const orderedAttributes = attributesToDefine.sort((a, b) => a.shaderLocation - b.shaderLocation);

    let offset = 0;
    const attributes = orderedAttributes.map(attr => {
        const currentOffset = offset;
        offset += attr.size * Float32Array.BYTES_PER_ELEMENT;
        return {
            shaderLocation: attr.shaderLocation,
            offset: currentOffset,
            format: attr.format,
        };
    });

    const cubeVertexSize = offset;
    const buffers = [
        {
            arrayStride: cubeVertexSize,
            attributes,
        },
    ];

    function convertGLSLtoWGSL(code: string, type: string) {
        const spirv = glslang.compileGLSL(code, type);
        return wgsl
            .convertSpirV2WGSL(spirv);
    }

    return [createPipeline(device, pipelineLayout, program, buffers, defines, mode, frontFace, false), createPipeline(device, pipelineLayout, program, buffers, defines, mode, frontFace, true)];
}

function createPipeline(
    device: GPUDevice,
    pipelineLayout: GPUPipelineLayout,
    program: string[],
    buffers: GPUVertexBufferLayout[],
    defines: Define[],
    mode: number,
    frontFace: boolean,
    hasTransmission: boolean
) {
    const pipeline = device.createRenderPipeline({
        label: hasTransmission ? 'transmission-pipeline' : 'main-pipeline',
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
            stripIndexFormat: getMode(mode)!.endsWith('strip') ? 'uint32' : undefined,
            topology: getMode(mode)!,
            cullMode: defines.find(d => d.name === 'DOUBLESIDED') ? 'none' : 'back'
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth32float'
        },
        multisample: {
            count: hasTransmission ? 1 : 4,
        }
    });
    return pipeline;
}

function getMode(mode: number) {
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
