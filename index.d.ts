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
    swapChain: GPUSwapChain;
    device: GPUDevice;
    renderPassDescriptor: GPURenderPassDescriptor;
    commandEncoder?: GPUCommandEncoder;
}
