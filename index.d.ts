declare module '*.vert' {
    const content: string;
    export default content;
}
declare module '*.frag' {
    const content: string;
    export default content;
}
declare module '*.glsl' {
    const content: string;
    export default content;
}

interface WEBGPU {
    glslang: any;
    context: GPUCanvasContext;
    device: GPUDevice;
    renderPassDescriptor: GPURenderPassDescriptor;
    commandEncoder?: GPUCommandEncoder;
}
