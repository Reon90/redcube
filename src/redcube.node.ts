/// <reference path='../index.d.ts'/>

import { Container } from './container';
import { Renderer } from './renderer';
import { Scene, Camera, Light } from './objects/index';
import { Events } from './events';
import { Env } from './env';
import { Parse } from './parse';
import { Matrix4 } from './matrix';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { Light as PPLight } from './postprocessors/light';

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
        await this.parse.initTextures();
        this.parse.buildSkin();
        this.parse.buildMesh();
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
        this.camera = this.parse.camera;
        this.parse.calculateFov(this.camera.props.isInitial);
        this.resize();
        } catch(e) {
            console.log(e);
        }

        scene.tracks = this.parse.tracks;
        scene.cameras = this.parse.cameras;
        scene.lights = this.parse.lights;

        cb(scene);
    }

    resize() {
        const z = 5 * this.camera.modelSize;

        if (this.camera.props.isInitial) {
            this.camera.setZ(z);
        }
        this.camera.updateNF();
    }
}

export { RedCube };
