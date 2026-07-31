import { Scene, Camera } from './objects/index';
import { State } from './state';
declare class RedCube {
    url: string;
    state: State;
    camera: Camera;
    constructor(url: string);
    private withPatchAsync;
    init(cb: (scene: Scene) => void): Promise<void>;
    resize(): void;
}
export { RedCube };
