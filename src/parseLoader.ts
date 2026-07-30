import { GlTf } from '../GLTF';
import { fetchJSON, fetchBinary } from './fetch';
import type { ParseContext, ReadonlyParseContext } from './parseContext';

const BASE64_MARKER = ';base64,';

export function getJson(input: ReadonlyParseContext, output: Partial<ParseContext>) {
    if (/glb/.test(input.url)) {
        return fetchBinary(input.url).then((b: ArrayBuffer) => {
            const decoder = new TextDecoder('utf-8');
            const [jsonLength] = new Uint32Array(b, 12, 1);
            const jsonBuffer = new Uint8Array(b, 20, jsonLength);
            const json = JSON.parse(decoder.decode(jsonBuffer));
            const [bufferLength] = new Uint32Array(b, 20 + jsonLength, 1);
            const buffer = b.slice(28 + jsonLength, 28 + jsonLength + bufferLength);

            output.json = json;

            input.scene.bin.push(buffer);
        });
    } else {
        return fetchJSON(input.url).then((json: GlTf) => {
            for (const key in json.buffers) {
                input.scene.bin.push(json.buffers![Number(key)].uri!);
            }
            output.json = json;

            return true;
        });
    }
}

export function getBuffer(input: ReadonlyParseContext, output: Partial<ParseContext>) {
    return Promise.all(
        input.scene.bin.map((url) => {
            if (typeof url === 'string') {
                if (/base64/.test(url)) {
                    const base64Index = url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                    const base64 = url.substring(base64Index);
                    const raw = window.atob(base64);
                    const buffer = new ArrayBuffer(raw.length);
                    const array = new Uint8Array(buffer);
                    for (let i = 0; i < raw.length; i++) {
                        array[i] = raw.charCodeAt(i);
                    }
                    return buffer;
                } else {
                    return fetchBinary(`${input.host}${url}`); /*.then(res => res.arrayBuffer())*/
                }
            } else {
                return Promise.resolve(url);
            }
        }),
    ).then((buffers) => {
        output.arrayBuffer = buffers;
    });
}

// Read-only: computes and returns IBL environment data without reassigning
// any ParseContext field.
export async function getEnv(input: ReadonlyParseContext, isBuffer: boolean) {
    if (input.json.extensions && input.json.extensions.EXT_lights_image_based) {
        const [env] = input.json.extensions.EXT_lights_image_based.lights;
        const specularImages: (HTMLImageElement & { bitmap?: ImageBitmap })[][] = env.specularImages.map((cube: number[]) => {
            return cube.map((img: number) => {
                const accessor = input.json.images![img];
                const bufferView = input.json.bufferViews![accessor.bufferView!];
                const { buffer, byteLength, byteOffset } = bufferView;
                const view = new Uint8Array(input.arrayBuffer![buffer], byteOffset, byteLength);
                const blob = new Blob([view as BlobPart], { type: accessor.mimeType });
                const imageUrl = window.URL.createObjectURL(blob);
                const imageEl = new Image();
                imageEl.src = imageUrl;

                return imageEl;
            });
        });
        env.specularImages = specularImages;
        await new Promise((r) => setTimeout(r, 200));
        if (isBuffer) {
            for (const images of specularImages) {
                for (const image of images) {
                    image.bitmap = await createImageBitmap(image);
                }
            }
        }
        return env;
    }
}
