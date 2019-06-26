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

const FOV = 15; // degrees

class RedCube {

    parse: Parse;

    constructor(url) {
        if (!url) {
            throw new Error('Url not found');
        }

        this.url = url;
    }

    async init(cb) {
        const scene = new Scene();
        try {
        this.parse = new Parse(this.url, []);

        this.parse.setScene(scene);

        await this.parse.getJson();
        await this.parse.getBuffer();
        await this.parse.initTextures();
        this.parse.buildSkin();
        this.parse.buildMesh();
        this.parse.buildAnimation();
        } catch(e) {
            console.log(e);
        }

        cb(scene);
    }

}

export { RedCube };
