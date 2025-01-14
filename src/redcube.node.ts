/// <reference path='../index.d.ts'/>

import { Scene, Camera } from './objects/index';
import { Parse } from './parse';

const FOV = 45; // degrees

class RedCube {
    url: string;
    parse: Parse;
    camera: Camera;

    constructor(url) {
        if (!url) {
            throw new Error('Url not found');
        }

        this.url = url;
    }

    async init(cb) {
        const scene = new Scene();
        try {
            this.parse = new Parse(this.url, [], () => {});

            this.parse.setScene(scene);

            await this.parse.getJson();
            await this.parse.getBuffer();
            await this.parse.initTextures(false);
            this.parse.buildSkin();
            await this.parse.buildMesh();
            this.parse.buildAnimation();

            if (this.parse.cameras.length === 0) {
                this.camera = new Camera(
                    {
                        type: 'perspective',
                        isInitial: true,
                        zoom: 1,
                        aspect: 1,
                        perspective: {
                            yfov: (FOV * Math.PI) / 180
                        }
                    },
                    'perspective'
                );
                this.parse.cameras.push(this.camera);
            }
            const [c] = this.parse.cameras;
            this.camera = c;
            this.parse.calculateFov(this.camera.props.isInitial);
            this.resize();
        } catch (e) {
            console.log(e);
        }

        scene.tracks = this.parse.tracks;
        scene.cameras = this.parse.cameras;
        scene.lights = this.parse.lights;

        cb(scene);
    }

    resize() {
        const z = this.camera.modelSize;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        this.camera.updateNF();
    }
}

export { RedCube };
