interface Store {
    [key: string]: Float32Array;
}
export class UniformBuffer {
    offset: number;
    map: Map<string, number>;
    tempStore: Store;
    store: Float32Array;

    bufferWebGPU: GPUBuffer;

    constructor() {
        this.map = new Map();
        this.tempStore = {};
        this.offset = 0;
    }

    getBuffer(v) {
        const { length } = v;
        if (length === 3) {
            return new Float32Array([v[0], v[1], v[2], 0]);
        }
        if (length === 9) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0]);
        }
        if (length === 12) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0, v[9], v[10], v[11], 0]);
        }
        if (length === 6) {
            return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0]);
        }

        return v;
    }

    add(name, value) {
        if (value.length === undefined) {
            value = [value];
        }
        this.map.set(name, this.offset);
        const buffer = this.getBuffer(value);
        this.tempStore[name] = buffer;
        this.offset += Math.max(buffer.length, 4);
    }

    update(gl, name, value, skip = false) {
        if (value.length === undefined) {
            value = new Float32Array([value]);
        }
        const offset = this.map.get(name);
        if (offset === undefined) {
            return;
        }
        const buffer = this.getBuffer(value);
        this.store.set(buffer, offset);
        if (skip) {
            return;
        }
        gl.bufferSubData(gl.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, buffer);
    }

    updateWebGPU(WebGPU: WEBGPU, name, value) {
        const { device } = WebGPU;
        if (value.length === undefined) {
            value = new Float32Array([value]);
        }
        const offset = this.map.get(name);
        if (offset === undefined) {
            return;
        }
        const buffer = this.getBuffer(value);
        this.store.set(buffer, offset);

        device.queue.writeBuffer(
            this.bufferWebGPU,
            offset * Float32Array.BYTES_PER_ELEMENT,
            buffer.buffer,
            buffer.byteOffset,
            buffer.byteLength
        );
    }

    done() {
        this.store = new Float32Array(this.offset);
        for (const [name, offset] of this.map) {
            this.store.set(this.tempStore[name], offset);
        }
        this.tempStore = null;
    }
}
