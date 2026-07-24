interface Store {
    [key: string]: ArrayLike<number>;
}
export class UniformBuffer {
    offset: number;
    map: Map<string, number>;
    tempStore: Store | null;
    store?: Float32Array;

    bufferWebGPU?: GPUBuffer;
    isTexture: boolean;

    constructor(isTexture = false) {
        this.map = new Map();
        this.tempStore = {};
        this.offset = 0;
        this.isTexture = isTexture;
    }

    getBuffer(v: ArrayLike<number>) {
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

    add(name: string, value: number | ArrayLike<number>) {
        if ((value as ArrayLike<number>).length === undefined) {
            value = [value as number];
        }
        this.map.set(name, this.offset);
        const buffer = this.getBuffer(value as ArrayLike<number>);
        this.tempStore![name] = buffer;
        if (this.isTexture) {
            this.offset += Math.max(buffer.length, 4);
        } else {
            this.offset += buffer.length;
        }
    }

    update(gl: WebGL2RenderingContext, name: string, value: number | ArrayLike<number>, skip = false) {
        if ((value as ArrayLike<number>).length === undefined) {
            value = new Float32Array([value as number]);
        }
        const offset = this.map.get(name);
        if (offset === undefined) {
            return;
        }
        const buffer = this.getBuffer(value as ArrayLike<number>);
        this.store!.set(buffer, offset);
        if (skip) {
            return;
        }
        gl.bufferSubData(gl.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, buffer as Float32Array);
    }

    updateWebGPU(WebGPU: WEBGPU, name: string, value: number | ArrayLike<number>, skip = false) {
        const { device } = WebGPU;
        if ((value as ArrayLike<number>).length === undefined) {
            value = new Float32Array([value as number]);
        }
        const offset = this.map.get(name);
        if (offset === undefined) {
            return;
        }
        const buffer = this.getBuffer(value as ArrayLike<number>);
        this.store!.set(buffer, offset);
        if (skip) {
            return;
        }

        device.queue.writeBuffer(
            this.bufferWebGPU!,
            offset * Float32Array.BYTES_PER_ELEMENT,
            (buffer as Float32Array).buffer,
            (buffer as Float32Array).byteOffset,
            (buffer as Float32Array).byteLength
        );
    }

    done() {
        this.store = new Float32Array(this.offset);
        for (const [name, offset] of this.map) {
            this.store.set(this.tempStore![name], offset);
        }
        this.tempStore = null;
    }
}
