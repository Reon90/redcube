import { Scene, Camera } from './objects/index';
import { getJson, getBuffer } from './parseLoader';
import { buildMesh, buildSkin, buildAnimation, calculateFov } from './parseSceneBuilder';
import { initTextures } from './parseTextures';
import { State, commit } from './state';

const FOV = 45; // degrees

class RedCube {
    url: string;
    state: State;
    camera!: Camera;

    constructor(url: string) {
        if (!url) {
            throw new Error('RedCube: a glTF url must be passed as the first constructor argument');
        }

        this.url = url;
        const scene = new Scene();
        this.state = {
            scene,
            url,
            host: url.substr(0, url.lastIndexOf('/') + 1),
            defines: [],
            tracks: [],
            json: undefined,
            skins: [],
            cameras: [],
            lights: [],
            textures: null,
            images: new Map(),
            samplers: null,
            arrayBuffer: null,
            programs: {},
            renderState: {},
            isIBL: true,
            isDefaultLight: true,
            needUpdateView: true,
            needUpdateProjection: true,
        } as unknown as State;
    }

    private async withPatchAsync<T>(run: (patch: Partial<State>) => Promise<T>): Promise<T> {
        const patch: Partial<State> = {};
        const result = await run(patch);
        commit(this.state, patch);
        return result;
    }

    async init(cb: (scene: Scene) => void) {
        await this.withPatchAsync<void | boolean>((patch) => getJson(this.state, patch));
        await this.withPatchAsync((patch) => getBuffer(this.state, patch));
        await this.withPatchAsync((patch) => initTextures(this.state, patch, false));
        buildSkin(this.state);
        await buildMesh(this.state);
        buildAnimation(this.state);

        if (this.state.cameras.length === 0) {
            this.camera = new Camera(
                {
                    type: 'perspective',
                    isInitial: true,
                    zoom: 1,
                    aspect: 1,
                    perspective: {
                        yfov: (FOV * Math.PI) / 180,
                    },
                },
                'perspective',
            );
            this.state.cameras.push(this.camera);
        }
        const [c] = this.state.cameras;
        this.camera = c;
        this.state.camera = c;
        calculateFov(this.state, this.camera.props.isInitial);
        this.resize();

        this.state.scene.tracks = this.state.tracks;
        this.state.scene.cameras = this.state.cameras;
        this.state.scene.lights = this.state.lights;

        cb(this.state.scene);
    }

    resize() {
        const z = this.camera.modelSize!;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        this.camera.updateNF();
    }
}

export { RedCube };
