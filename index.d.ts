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

declare module '*.h' {
    const content: string;
    export default content;
}

declare module '*.hdr' {
    const content: string;
    export default content;
}

interface WEBGPU {
    features: GPUSupportedFeatures,
    glslang: any;
    wgsl: any;
    context: GPUCanvasContext;
    device: GPUDevice;
    renderPassDescriptor: GPURenderPassDescriptor;
    commandEncoder?: GPUCommandEncoder;
    nearestSampler?: GPUSampler;
    linearSampler?: GPUSampler;
}
