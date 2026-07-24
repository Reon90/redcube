declare module 'parse-hdr' {
    interface HDRImage {
        shape: [number, number];
        exposure: number;
        gamma: number;
        data: Float32Array;
    }
    export default function parseHDR(buffer: Uint8Array | ArrayBuffer): HDRImage;
}
