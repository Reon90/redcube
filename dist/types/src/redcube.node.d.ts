import { Scene, Camera } from './objects/index';
import { Parse } from './parse';
declare class RedCube {
    url: string;
    parse: Parse;
    camera: Camera;
    constructor(url: string);
    init(cb: (scene: Scene) => void): Promise<void>;
    resize(): void;
}
export { RedCube };
