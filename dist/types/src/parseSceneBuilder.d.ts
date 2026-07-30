import { Mesh, Object3D, Scene } from './objects/index';
import { Node, MeshPrimitive } from '../GLTF';
import type { ParseContext, ReadonlyParseContext } from './parseContext';
export declare function buildPrim(input: ReadonlyParseContext, el: Node, parent: Object3D, name: string, skin: number | undefined, weights: number[] | undefined, primitive: MeshPrimitive): Mesh;
export declare function buildNode(input: ReadonlyParseContext, parent: Object3D | Scene, name: number): void;
export declare function calculateFov(input: ReadonlyParseContext, isInitial: boolean): void;
export declare function buildMesh(input: ReadonlyParseContext, output: Partial<ParseContext>): Promise<void>;
export declare function buildSkin(input: ReadonlyParseContext): true | undefined;
export declare function buildAnimation(input: ReadonlyParseContext): true | undefined;
