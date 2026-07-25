import { Matrix4 } from '../matrix';
import { Object3D } from './object3d';
import { Mesh } from './mesh';
import { Camera } from './camera';
import { Light } from './light';
import { Track } from '../parse';
export declare class Scene {
    children: Array<Object3D>;
    bin: Array<string | ArrayBuffer>;
    matrixWorld: Matrix4;
    matrix: Matrix4;
    transparentChildren: Array<Mesh>;
    opaqueChildren: Array<Mesh>;
    meshes: Array<Mesh>;
    tracks?: Array<Track[]>;
    cameras?: Array<Camera>;
    lights?: Array<Light>;
    variants: {
        name: string;
    }[];
    visible: boolean;
    constructor();
}
