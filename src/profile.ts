type PassKind = 'render' | 'compute';

export interface GPUPassTiming {
    label: string;
    kind: PassKind;
    startIndex: number;
    endIndex: number;
    // times are in nanoseconds (BigInt), ms provided for convenience
    beginNs?: bigint;
    endNs?: bigint;
    durationMs?: number;
}

export interface FrameTimings {
    frameIndex: number;
    cpuEncodeMs: number;
    gpuTotalMs?: number; // undefined if timestamp-query not available
    passes: GPUPassTiming[]; // durations per pass (if available)
}

interface QueryFrame {
    querySet?: GPUQuerySet; // type: 'timestamp'
    resolveBuffer?: GPUBuffer; // QUERY_RESOLVE | COPY_SRC
    readbackBuffer?: GPUBuffer; // COPY_DST | MAP_READ
    nextQuery: number; // next free query index
    passes: GPUPassTiming[]; // pass labels + indices this frame
}

export interface WebGPUProfilerOptions {
    // Max number of timestamp *writes* per frame (2 per pass: begin + end)
    maxTimestampWrites?: number; // default 64 (== 32 passes)
    framesInFlight?: number; // default 2
    label?: string;
}

export class WebGPUProfiler {
    private device: GPUDevice;
    private canTimestamp: boolean;
    private opts: Required<WebGPUProfilerOptions>;
    private frames: QueryFrame[] = [];
    private frameCursor = 0;

    private frameCpuStart = 0;
    private frameIndex = 0;

    constructor(device: GPUDevice, opts: WebGPUProfilerOptions = {}) {
        this.device = device;
        this.canTimestamp = device.features.has('timestamp-query');

        this.opts = {
            maxTimestampWrites: opts.maxTimestampWrites ?? 64,
            framesInFlight: opts.framesInFlight ?? 2,
            label: opts.label ?? 'WebGPUProfiler',
        };

        // Double-buffer (or more) query resources for safe map/copy
        for (let i = 0; i < this.opts.framesInFlight; ++i) {
            this.frames.push(this.makeQueryFrame(i));
        }
    }

    /** Begin a new frame (CPU timing starts here). Call once per frame. */
    beginFrame(): void {
        this.frameCpuStart = performance.now();
        // Reset current frame's bookkeeping
        const f = this.currFrame();
        f.nextQuery = 0;
        f.passes.length = 0;
    }

    /** Wraps a render pass with timestampWrites when available. */
    beginTimedRenderPass(encoder: GPUCommandEncoder, desc: GPURenderPassDescriptor, label = 'render'): GPURenderPassEncoder {
        if (!this.canTimestamp) {
            return encoder.beginRenderPass(desc);
        }
        const f = this.currFrame();
        // Reserve 2 query slots (begin/end)
        const begin = this.reserveQuery(f);
        const end = this.reserveQuery(f);

        const timedDesc: GPURenderPassDescriptor = {
            ...desc,
            timestampWrites: {
                querySet: f.querySet!,
                beginningOfPassWriteIndex: begin,
                endOfPassWriteIndex: end,
            },
        };

        f.passes.push({ label, kind: 'render', startIndex: begin, endIndex: end });
        return encoder.beginRenderPass(timedDesc);
    }

    /** Wraps a compute pass with timestampWrites when available. */
    beginTimedComputePass(encoder: GPUCommandEncoder, desc: GPUComputePassDescriptor = {}, label = 'compute'): GPUComputePassEncoder {
        if (!this.canTimestamp) {
            return encoder.beginComputePass(desc);
        }
        const f = this.currFrame();
        const begin = this.reserveQuery(f);
        const end = this.reserveQuery(f);

        const timedDesc: GPUComputePassDescriptor = {
            ...desc,
            timestampWrites: {
                querySet: f.querySet!,
                beginningOfPassWriteIndex: begin,
                endOfPassWriteIndex: end,
            },
        };

        f.passes.push({ label, kind: 'compute', startIndex: begin, endIndex: end });
        return encoder.beginComputePass(timedDesc);
    }

    /**
     * Must be called before finishing the encoder:
     * resolves the timestamp queries used this frame and stages them for readback.
     */
    resolveQueries(encoder: GPUCommandEncoder): void {
        if (!this.canTimestamp) return;
        const f = this.currFrame();
        if (!f.querySet || f.nextQuery === 0) return;

        encoder.resolveQuerySet(f.querySet, 0, f.nextQuery, f.resolveBuffer!, 0);

        // copy to the readback buffer only if it's unmapped
        if (f.readbackBuffer!.mapState === 'unmapped') {
            encoder.copyBufferToBuffer(f.resolveBuffer!, 0, f.readbackBuffer!, 0, f.nextQuery * 8);
        }
    }

    /**
     * Finish the frame. Call AFTER you submit the command buffer(s).
     * Returns timings (CPU + GPU if available).
     */
    async endFrame(): Promise<FrameTimings> {
        const cpuEncodeMs = performance.now() - this.frameCpuStart;
        const f = this.currFrame();
        const frameIndex = this.frameIndex++;

        let gpuTotalMs: number | undefined;
        const passes = f.passes.map((p) => ({ ...p }));

        if (this.canTimestamp && f.readbackBuffer!.mapState === 'unmapped' && f.nextQuery > 0) {
            await f.readbackBuffer!.mapAsync(GPUMapMode.READ);
            try {
                const u8 = new Uint8Array(f.readbackBuffer!.getMappedRange(0, f.nextQuery * 8));
                const ns = new BigUint64Array(u8.buffer, u8.byteOffset, f.nextQuery);

                // Fill begin/end for each pass and compute durations
                for (const p of passes) {
                    const begin = ns[p.startIndex];
                    const end = ns[p.endIndex];
                    if (begin !== undefined && end !== undefined) {
                        p.beginNs = begin;
                        p.endNs = end;
                        // Results are in nanoseconds (quantized by browsers for privacy)
                        const durNs = end - begin;
                        p.durationMs = Number(durNs) / 1e6;
                    }
                }
                gpuTotalMs = passes.reduce((a, p) => a + (p.durationMs ?? 0), 0);
            } finally {
                f.readbackBuffer!.unmap();
            }
        }

        // Advance to next frame’s resources
        this.frameCursor = (this.frameCursor + 1) % this.opts.framesInFlight;

        return { frameIndex, cpuEncodeMs, gpuTotalMs, passes };
    }

    /** Destroy all GPU resources created by the profiler. */
    destroy(): void {
        for (const f of this.frames) {
            f.querySet?.destroy();
            f.resolveBuffer?.destroy();
            f.readbackBuffer?.destroy();
        }
        this.frames.length = 0;
    }

    // ------- internals -------

    private currFrame(): QueryFrame {
        return this.frames[this.frameCursor];
    }

    private reserveQuery(f: QueryFrame): number {
        if (!this.canTimestamp) return 0;
        if (!f.querySet) throw new Error('Profiler querySet missing');
        if (f.nextQuery + 1 >= f.querySet.count) {
            console.warn(`[${this.opts.label}] Out of timestamp slots this frame — increase maxTimestampWrites.`);
            // Allocate a dummy index to avoid crashing; pass will still run, just without end timestamp.
            return Math.max(0, f.querySet.count - 1);
        }
        return f.nextQuery++;
    }

    private makeQueryFrame(i: number): QueryFrame {
        if (!this.canTimestamp) {
            return { nextQuery: 0, passes: [] };
        }
        const count = this.opts.maxTimestampWrites;

        const querySet = this.device.createQuerySet({
            label: `${this.opts.label}/timestamps#${i}`,
            type: 'timestamp',
            count,
        });

        const resolveBuffer = this.device.createBuffer({
            label: `${this.opts.label}/resolve#${i}`,
            size: count * 8, // 64-bit per timestamp
            usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
        });

        const readbackBuffer = this.device.createBuffer({
            label: `${this.opts.label}/readback#${i}`,
            size: resolveBuffer.size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        return {
            querySet,
            resolveBuffer,
            readbackBuffer,
            nextQuery: 0,
            passes: [],
        };
    }
}
