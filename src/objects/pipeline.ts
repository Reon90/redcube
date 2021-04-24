import vertexShaderGLSL from '../shaders/webgpu.vert';
import fragmentShaderGLSL from '../shaders/webgpu.frag';

export function create(device, glslang, uniformBindGroup1, defines) {

    //const programHash = defines.map(define => `${define.name}${define.value || 1}`).join('');
    const defineStr = defines.map(define => `#define ${define.name} ${define.value || 1}` + '\n').join('');
    const program = [vertexShaderGLSL.replace(/\n/, `\n${defineStr}`), fragmentShaderGLSL.replace(/\n/, `\n${defineStr}`)];

    const entries: GPUBindGroupLayoutEntry[] = [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {}
        }
    ]

    uniformBindGroup1.forEach(u => {
        if (u.binding > 2 && u.binding < 15) {
            entries.push({
                binding: u.binding,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            })
        }
    })

    entries.push({
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
          viewDimension: 'cube'
        }
      }, {
        binding: 20,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          viewDimension: 'cube'
      }
      }, {
        binding: 21,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      })

const bindGroupLayout = device.createBindGroupLayout({
    entries
  });

const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
  });


const vertexLayout = [3, 2, 3, 4];
const cubeVertexSize = Float32Array.BYTES_PER_ELEMENT * vertexLayout.reduce((a,b) => a + b, 0); // Byte size of one cube vertex.
const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: device.createShaderModule({
            code: glslang.compileGLSL(program[0], "vertex"),
            source: program[0],
            transform: (glsl) => glslang.compileGLSL(glsl, 'vertex'),
          }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: cubeVertexSize,
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: 0,
              format: 'float32x3',
            },
            {
            // position
            shaderLocation: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * vertexLayout[0],
            format: 'float32x2',
            },
            {
                // position
                shaderLocation: 2,
                offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1]),
                format: 'float32x3',
                },
                {
                    // position
                    shaderLocation: 3,
                    offset: Float32Array.BYTES_PER_ELEMENT * (vertexLayout[0] + vertexLayout[1] + vertexLayout[2]),
                    format: 'float32x3',
                    }
          ],
        },
      ]
    },
    fragment: {
      module: device.createShaderModule({
            code: glslang.compileGLSL(program[1], "fragment"),
            source: program[1],
            transform: (glsl) => glslang.compileGLSL(glsl, 'fragment'),
          }),
      entryPoint: 'main',
      targets: [
        {
          format: 'bgra8unorm',
        },
      ]
    },

    primitive: {
      topology: 'triangle-list',
      cullMode: 'none'
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus-stencil8',
    }
  });
  return pipeline;
}
