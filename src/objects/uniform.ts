interface Store {
    [key: string]: Float32Array;
}
export class UniformBuffer {
    offset: number;
    map: Map<string, number>;
    tempStore: Store;
    store: Float32Array;

    constructor() {
        this.map = new Map();
        this.tempStore = {};
        this.offset = 0;
    }

    getBuffer(v) {
        const { length } = v;
        if (length <= 4) {
            return v;
        }
        if (length === 9) {
            return new Float32Array([
                v[0],
                v[1],
                v[2],
                0,
                v[3],
                v[4],
                v[5],
                0,
                v[6],
                v[7],
                v[8],
                0
            ]);
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

    update(gl, name, value) {
        if (value.length === undefined) {
            value = new Float32Array([value]);
        }
        const offset = this.map.get(name);
        this.store.set(value, offset);
        gl.bufferSubData(
            gl.UNIFORM_BUFFER,
            offset * Float32Array.BYTES_PER_ELEMENT,
            value
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
