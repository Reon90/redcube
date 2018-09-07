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

    add(name, value) {
        this.map.set(name, this.offset);
        this.tempStore[name] = value;
        this.offset += Math.max(value.length, 4);
    }

    update(gl, name, value) {
        const offset = this.map.get(name);
        this.store.set(value, offset);
        gl.bufferSubData(gl.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, value);
    }

    done() {
        this.store = new Float32Array(this.offset);
        for (const [name, offset] of this.map) {
            this.store.set(this.tempStore[name], offset);
        }
        this.tempStore = null;
    }
}
