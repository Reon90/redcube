interface Store {
    [key: string]: ArrayLike<number>;
}
export interface UniformBufferLike {
    store?: Float32Array;
    bufferWebGPU?: GPUBuffer;
}
export declare class UniformBuffer {
    offset: number;
    map: Map<string, number>;
    tempStore: Store | null;
    store?: Float32Array;
    bufferWebGPU?: GPUBuffer;
    isTexture: boolean;
    constructor(isTexture?: boolean);
    getBuffer(v: ArrayLike<number>): ArrayLike<number>;
    add(name: string, value: number | ArrayLike<number>): void;
    update(gl: WebGL2RenderingContext, name: string, value: number | ArrayLike<number>, skip?: boolean): void;
    updateWebGPU(WebGPU: WEBGPU, name: string, value: number | ArrayLike<number>, skip?: boolean): void;
    done(): void;
}
export {};
