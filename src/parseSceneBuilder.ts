import { buildArray, getDataType, walk, calculateProjection, calculateOffset, normalize } from './utils';
import { Mesh, SkinnedMesh, Bone, Camera, Object3D, Scene, Light, Material } from './objects/index';
import type { CameraProps } from './objects/camera';
import { Matrix4, Box, Vector3 } from './matrix';
import { Node, MeshPrimitive } from '../GLTF';
import { DecoderModule } from './decoder';
import { Geometry } from './objects/geometry';
import type { ParseContext, ReadonlyParseContext, Track, Skin, Key } from './parseContext';

// Read-only: builds and returns a Mesh without reassigning any ParseContext
// field (defines.push mutates the array ParseContext already owns, it
// doesn't reassign the `defines` property itself).
export function buildPrim(
    input: ReadonlyParseContext,
    el: Node,
    parent: Object3D,
    name: string,
    skin: number | undefined,
    weights: number[] | undefined,
    primitive: MeshPrimitive,
) {
    const m = input.json.materials && input.json.materials[primitive.material!];
    if (input.json.extensions && input.json.extensions.EXT_lights_image_based) {
        input.defines.push({
            name: 'SPHERICAL_HARMONICS',
            value: Math.ceil(Math.log(input.json.extensions.EXT_lights_image_based.lights[0].specularImageSize) * Math.LOG2E) + 10,
        });
    }
    if (input.json.extensionsUsed && input.json.extensionsUsed.includes('KHR_texture_basisu')) {
        input.defines.push({ name: 'BASISU' });
    }
    const defines = [...input.defines];
    const material = new Material(m, input.textures!, defines);
    if (skin !== undefined) {
        defines.push({
            name: 'JOINTNUMBER',
            value: input.skins[skin].jointNames.length,
        });
    }
    if (primitive.indices !== undefined || primitive.attributes['TANGENT'] !== undefined) {
        defines.push({ name: 'TANGENT' });
    }
    if (primitive.attributes['TEXCOORD_1'] !== undefined || primitive.attributes['TEXCOORD_2'] !== undefined) {
        defines.push({ name: 'MULTIUV' });
    }
    if (primitive.attributes['TEXCOORD_2'] !== undefined) {
        defines.push({ name: 'MULTIUV2' });
    }
    if (primitive.attributes['COLOR_0']) {
        defines.push({ name: 'COLOR' });
    }

    const mesh = skin !== undefined ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
    const geometry = new Geometry(input.json, input.arrayBuffer!, weights!, input.draco, primitive);
    if (primitive.attributes.TANGENT === undefined) {
        defines.push({ name: 'USERIGHTHANDEDSYSTEM' });
    }

    if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
        const variants = primitive.extensions.KHR_materials_variants.mappings.map((m: { material: number; variants: number[] }) => {
            return { ...m, m: new Material(input.json.materials![m.material], input.textures!, [...defines]) };
        });
        mesh.setVariants(variants);
    }
    mesh.setMode(primitive.mode);
    mesh.setMaterial(material);
    mesh.setGeometry(geometry);
    if (el.scale && el.scale[0] < 0) {
        mesh.setFrontFace();
    }
    if (el.scale && material.thicknessFactor) {
        material.thicknessFactor *= el.scale[0];
    }
    mesh.setDefines(material.defines);
    if (mesh instanceof SkinnedMesh) {
        mesh.skin = skin!;
    }
    mesh.matrices = parent.matrices;
    mesh.updateMatrix();
    mesh.calculateBounding();
    mesh.visible = parent.visible;
    mesh.instances = parent.instances;

    return mesh;
}

// Read-only: recursively builds the node tree (cameras/lights.push and
// json.nodes mutation are all through references ParseContext already
// owns - no ParseContext field itself is reassigned).
export function buildNode(input: ReadonlyParseContext, parent: Object3D | Scene, name: number) {
    const el = input.json.nodes![name];
    let child: Object3D;

    if (el.camera !== undefined) {
        const camera = Object.assign(
            {
                zoom: 1,
                isInitial: false,
                aspect: input.canvas ? input.canvas.offsetWidth / input.canvas.offsetHeight : 1,
            },
            input.json.cameras![el.camera],
        ) as unknown as CameraProps;

        const camObj = new Camera(camera, name, parent);
        const proj = calculateProjection(camObj.props);
        camObj.setProjection(proj!);

        input.cameras.push(camObj);
        child = camObj;
    } else if (el.extensions && el.extensions.KHR_lights_punctual) {
        if (input.lights.find((l) => l.id === el.name)) {
            return;
        }
        const light = input.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
        light.isInitial = false;

        const lightObj = new Light(light, name, parent);
        input.lights.push(lightObj);
        child = lightObj;
    } else {
        if (el.isBone !== undefined) {
            child = new Bone(name, parent);
        } else {
            child = new Object3D(name, parent);
        }
    }

    if (el.translation || el.rotation || el.scale) {
        child.setPosition(el.translation, el.rotation, el.scale);
    } else if (el.matrix) {
        child.setMatrix(el.matrix);
    }
    child.updateMatrix();

    child.visible = parent.visible;
    if (el.extensions && el.extensions.KHR_node_visibility) {
        child.visible = el.extensions.KHR_node_visibility.visible;
    }

    if (el.extensions && el.extensions.EXT_mesh_gpu_instancing) {
        const { attributes } = el.extensions.EXT_mesh_gpu_instancing;
        const keys = ['ROTATION', 'SCALE', 'TRANSLATION'];
        for (const key of keys) {
            if (!attributes[key]) {
                continue;
            }
            const stride = key === 'ROTATION' ? 4 : 3;
            const accessor = input.json.accessors![attributes[key]];
            const bufferView = input.json.bufferViews![accessor.bufferView!];
            const buffer = buildArray(
                input.arrayBuffer![bufferView.buffer],
                accessor.componentType,
                calculateOffset(bufferView.byteOffset, accessor.byteOffset),
                getDataType(accessor.type)! * accessor.count,
            )!;
            if (child.instances === 1) {
                child.instances = buffer.length / stride;
                child.matrices = Array.from({ length: child.instances });
                for (let i = 0; i < child.instances; i++) {
                    child.matrices[i] = new Matrix4();
                }
            }
            for (let i = 0; i < buffer.length; i += stride) {
                const m = child.matrices[i / stride];
                if (key === 'ROTATION') {
                    m.makeRotationFromQuaternion([buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]]);
                } else if (key === 'SCALE') {
                    m.scale(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
                } else if (key === 'TRANSLATION') {
                    m.setTranslate(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
                }
            }
        }
    }

    child.id = el.name;
    parent.children.push(child);
    parent = child;

    if (el.mesh !== undefined) {
        parent.children.push(
            ...input.json.meshes![el.mesh].primitives.map((primitive) =>
                buildPrim(input, el, parent, input.json.meshes![el.mesh!].name!, el.skin, input.json.meshes![el.mesh!].weights, primitive),
            ),
        );
    }

    if (el.children && el.children.length) {
        el.children.forEach((childName) => buildNode(input, parent, childName));
    }
}

// Read-only: mutates the Scene/Camera objects reached through ParseContext,
// but never reassigns a ParseContext field itself.
export function calculateFov(input: ReadonlyParseContext, isInitial: boolean) {
    const box = new Box();
    walk(input.scene, (node: Object3D | Scene) => {
        if (node instanceof Mesh) {
            box.expand(node.geometry.boundingSphere);
        }
    });
    const size = box.getSize();

    if (isInitial) {
        const center = new Vector3().add(box.min).add(box.max).scale(0.5);
        const matrix = new Matrix4();
        matrix.translate(center.x, center.y, center.z);
        matrix.invert();
        input.scene.matrixWorld.multiply(matrix);
        walk(input.scene, (node: Object3D | Scene) => {
            if (node instanceof Object3D) {
                node.updateMatrix();
            }
        });
    }

    input.cameras.forEach((c) => {
        c.modelSize = size;
    });

    input.resize();
}

export async function buildMesh(input: ReadonlyParseContext, output: Partial<ParseContext>) {
    if (input.json.extensionsUsed && input.json.extensionsUsed.includes('KHR_draco_mesh_compression')) {
        output.draco = await DecoderModule();
    }
    if (input.json.extensions && input.json.extensions.KHR_materials_variants) {
        input.scene.variants = input.json.extensions.KHR_materials_variants.variants;
    }

    input.json.scenes![input.json.scene !== undefined ? input.json.scene : 0].nodes!.forEach((n) => {
        if (input.json.nodes![n].extensions !== undefined) {
            buildNode(input, input.scene, n);
        }
        if (input.json.nodes![n].children && input.json.nodes![n].children!.length) {
            buildNode(input, input.scene, n);
        }
        if (input.json.nodes![n].mesh !== undefined) {
            buildNode(input, input.scene, n);
        }
        if (input.json.nodes![n].camera !== undefined) {
            buildNode(input, input.scene, n);
        }
    });
    if (input.lights.length === 0 && input.light) {
        input.lights.push(input.light);
    }

    walk(input.scene, (mesh: Object3D | Scene) => {
        if (mesh instanceof Mesh) {
            if (mesh.material.alpha) {
                input.scene.transparentChildren.push(mesh);
            } else {
                input.scene.opaqueChildren.push(mesh);
            }
            input.scene.meshes.push(mesh);
            mesh.material.defines.push({ name: 'LIGHTNUMBER', value: input.lights.length });

            input.lights.forEach((light, i) => {
                if (light.visible) {
                    if (light.type === 'directional') {
                        mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
                    } else {
                        const p = mesh.getPosition();
                        const distance = new Vector3(light.getPosition()).distanceToSquared(p[0], p[1], p[2]);
                        const attenuation =
                            Math.max(Math.min(1.0 - Math.pow(distance / light.range, 4.0), 1.0), 0.0) / Math.pow(distance, 2.0);
                        if (attenuation > 0) {
                            mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
                        }
                    }
                }
            });
        }
    });
    input.scene.meshes.forEach((m) => {
        if (m.material.lights[0] === -1) {
            m.material.lights[0] = 0;
        }
    });

    input.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
    input.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
}

// Read-only: pushes onto skins/mutates json.nodes in place, no ParseContext
// field itself is reassigned.
export function buildSkin(input: ReadonlyParseContext) {
    if (!input.json.skins) {
        return true;
    }
    for (const skin of input.json.skins) {
        const acc = input.json.accessors![skin.inverseBindMatrices!];
        const buffer = input.json.bufferViews![acc.bufferView!];
        const array = buildArray(
            input.arrayBuffer![buffer.buffer],
            acc.componentType,
            calculateOffset(buffer.byteOffset, acc.byteOffset),
            getDataType(acc.type)! * acc.count,
        )!;

        const v: Skin & { inverseBindMatrices: typeof array } = {
            jointNames: skin.joints,
            inverseBindMatrices: array,
            bones: [],
            boneInverses: [],
        };

        let i = 0;
        for (const join of v.jointNames) {
            //walk(this.scene, this.buildBones.bind(this, join, v));
            input.json.nodes![join].isBone = true;
            const m = v.inverseBindMatrices;
            const mat = new Matrix4().set(m.slice(i * 16, (i + 1) * 16))!;
            v.boneInverses.push(mat);
            i++;
        }
        input.skins.push(v);
    }
}

// Read-only: pushes onto tracks, no ParseContext field itself is reassigned.
export function buildAnimation(input: ReadonlyParseContext) {
    if (!input.json.animations) {
        return true;
    }
    for (const animation of input.json.animations) {
        const tracks: Track[] = [];
        for (const channel of animation.channels) {
            const duration = 0;
            const sampler = animation.samplers[channel.sampler];

            if (sampler) {
                const { target } = channel;
                let name: string | number | undefined = target.node;
                let { path } = target;
                if (name === undefined) {
                    const s = target.extensions.KHR_animation_pointer.pointer.split('/');
                    if (s[1] === 'materials') {
                        const mat = input.json.materials![Number(s[2])].name;
                        ({ name } = input.scene.meshes.find((m) => m.material.name === mat)!);
                        path = s.splice(3).join('/');
                    }
                    if (s[1] === 'nodes') {
                        ({ name } = input.json.nodes![Number(s[2])]);
                        path = s[5];
                    }
                }
                const input_ = animation.parameters !== undefined ? animation.parameters[sampler.input] : sampler.input;
                const output = animation.parameters !== undefined ? animation.parameters[sampler.output] : sampler.output;

                const inputAccessor = input.json.accessors![input_];
                const outputAccessor = input.json.accessors![output];
                const inputBuffer = input.json.bufferViews![inputAccessor.bufferView!];
                const outputBuffer = input.json.bufferViews![outputAccessor.bufferView!];

                const inputArray = buildArray(
                    input.arrayBuffer![inputBuffer.buffer],
                    inputAccessor.componentType,
                    calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset),
                    getDataType(inputAccessor.type)! * inputAccessor.count,
                )!;
                const outputArray = buildArray(
                    input.arrayBuffer![outputBuffer.buffer],
                    outputAccessor.componentType,
                    calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
                    getDataType(outputAccessor.type)! * outputAccessor.count,
                )!;

                const meshes: Mesh[] = [];
                walk(input.scene, (node: Object3D | Scene) => {
                    if ((node as Object3D).name === name || (node as Object3D).id === name) {
                        if (path === 'weights' && node instanceof Object3D) {
                            meshes.push(...(node.children as Mesh[]));
                        } else {
                            meshes.push(node as Mesh);
                        }
                    }
                });

                let component = path === 'weights' ? meshes[0].geometry.targets.length : getDataType(outputAccessor.type)!;
                if (sampler.interpolation === 'CUBICSPLINE') {
                    component = component * 3;
                }
                const keys: Key[] = [];
                for (let i = 0; i < inputArray.length; i++) {
                    const firstT = inputArray[i];
                    const firstV = outputArray.slice(i * component, (i + 1) * component);

                    keys.push({
                        time: firstT,
                        value: normalize(firstV),
                    });
                }
                if (keys.length >= 2) {
                    if (meshes.length) {
                        tracks.push({
                            duration: Math.max(keys[keys.length - 1].time, duration),
                            stoped: false,
                            meshes: meshes,
                            component,
                            type: path,
                            name: `${meshes[0].name}.${path}`,
                            keys: keys,
                            interpolation: sampler.interpolation!,
                        });
                    }
                }
            }
        }
        input.tracks.push(tracks);
    }
}
