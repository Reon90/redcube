import { GlTf, Image as GLTFImage, BufferView } from '../GLTF';
export interface FetchedImage {
    sampler: unknown;
    mimeType?: string;
    name?: string;
    image: unknown;
}
export interface ImageSource {
    json: {
        bufferViews?: BufferView[];
    };
    arrayBuffer: ArrayBufferLike[] | null;
}
export declare function fetchJSON(url: string): Promise<GlTf>;
export declare function fetchBinary(url: string): Promise<ArrayBuffer>;
export declare function fetchImage(isbitmap: boolean, s: ImageSource, { bufferView, mimeType, uri }: GLTFImage, { url, name }: {
    url: string;
    name?: string;
}, sampler: unknown): Promise<FetchedImage>;
