type PassKind = 'render' | 'compute';
export interface GPUPassTiming {
    label: string;
    kind: PassKind;
    startIndex: number;
    endIndex: number;
    beginNs?: bigint;
    endNs?: bigint;
    durationMs?: number;
}
export interface FrameTimings {
    frameIndex: number;
    cpuEncodeMs: number;
    gpuTotalMs?: number;
    passes: GPUPassTiming[];
}
export interface WebGPUProfilerOptions {
    maxTimestampWrites?: number;
    framesInFlight?: number;
    label?: string;
}
export declare class WebGPUProfiler {
    private device;
    private canTimestamp;
    private opts;
    private frames;
    private frameCursor;
    private frameCpuStart;
    private frameIndex;
    constructor(device: GPUDevice, opts?: WebGPUProfilerOptions);
    /** Begin a new frame (CPU timing starts here). Call once per frame. */
    beginFrame(): void;
    /** Wraps a render pass with timestampWrites when available. */
    beginTimedRenderPass(encoder: GPUCommandEncoder, desc: GPURenderPassDescriptor, label?: string): GPURenderPassEncoder;
    /** Wraps a compute pass with timestampWrites when available. */
    beginTimedComputePass(encoder: GPUCommandEncoder, desc?: GPUComputePassDescriptor, label?: string): GPUComputePassEncoder;
    /**
     * Must be called before finishing the encoder:
     * resolves the timestamp queries used this frame and stages them for readback.
     */
    resolveQueries(encoder: GPUCommandEncoder): void;
    /**
     * Finish the frame. Call AFTER you submit the command buffer(s).
     * Returns timings (CPU + GPU if available).
     */
    endFrame(): Promise<FrameTimings>;
    /** Destroy all GPU resources created by the profiler. */
    destroy(): void;
    private currFrame;
    private reserveQuery;
    private makeQueryFrame;
}
export {};
