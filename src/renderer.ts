import { Scene, Mesh, Camera, Bone } from './objects/index';
import { Vector, Vector3, Vector4, Frustum } from './matrix';
import { getAnimationComponent, interpolation, walk } from './utils';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { FPS } from './fps';
import { Light as PPLight } from './postprocessors/light';
import { Env } from './env';

let gl;

export class Renderer {
    parse: Parse;
    PP: PostProcessing;
    scene: Scene;
    Particles: Particles;
    fps: FPS;
    camera: Camera;
    getState: Function;
    reflow: boolean;
    needUpdateProjection: boolean;
    needUpdateView: boolean;
    env: Env;
    currentTrack: number;

    constructor(getState) {
        this.reflow = true;
        this.fps = new FPS();
        this.getState = getState;
        this.currentTrack = 0;
    }

    setEnv(env) {
        this.env = env;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setParticles(Particles) {
        this.Particles = Particles;
    }

    setScene(scene) {
        this.scene = scene;
    }

    setPp(pp) {
        this.PP = pp;
    }

    setGl(g) {
        gl = g;
    }

    setParser(parser) {
        this.parse = parser;
    }

    step(sec, v) {
        const val = interpolation(sec, v.keys);

        if ((val[0] === -1 || val[1] === -1) || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const current = v.keys[val[0]];
        const component = getAnimationComponent(v.type);
        let vectorC;
        if (component === 3) {
            vectorC = Vector3;
        } else if (component === 4) {
            vectorC = Vector4;
        } else {
            vectorC = Vector;
        }
        const vector = new vectorC(current.value);

        if (v.type === 'rotation') {
            for (const mesh of v.meshes) {
                mesh.matrix.makeRotationFromQuaternion(vector.elements);
            }
        } else if (v.type === 'scale') {
            for (const mesh of v.meshes) {
                if (mesh.matrix.animated) {
                    const scale = mesh.matrix.getScaling();
                    mesh.matrix.restoreScale(scale);
                }

                mesh.matrix.scale(vector);
                mesh.matrix.animated = true;
            }
        } else if (v.type === 'translation') {
            for (const mesh of v.meshes) {
                mesh.matrix.setTranslate(vector);
            }
        }
    }

    spline(sec, v) {
        const val = interpolation(sec, v.keys);

        if ((val[0] === -1 || val[1] === -1) || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const t = sec;
        const t1 = v.keys[val[1]].time;
        const t0 = v.keys[val[0]].time;
        const stride = getAnimationComponent(v.type);

        const td = t1 - t0;
        const p = (t - t0) / td;
        const pp = p * p;
        const ppp = pp * p;

        const s2 = -2 * ppp + 3 * pp;
        const s3 = ppp - pp;
        const s0 = 1 - s2;
        const s1 = s3 - pp + p;

        const result = new Float32Array(stride);
        for (let i = 0; i !== stride; i++) {
            const p0 = v.keys[val[0]].value[stride + i]; // point
            const m0 = v.keys[val[0]].value[stride * 2 + i] * td; // outTangent
            const p1 = v.keys[val[1]].value[stride + i]; // point + 1
            const m1 = v.keys[val[1]].value[i] * td; // inTangent + 1

            result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

            if (isNaN(result[i])) {
                return false;
            }
        }

        if (v.type === 'rotation') {
            const out = new Vector4(result).normalize();

            for (const mesh of v.meshes) {
                mesh.matrix.makeRotationFromQuaternion(out.elements);
            }
        } else if (v.type === 'scale') {
            const out = new Vector3(result);

            for (const mesh of v.meshes) {
                if (mesh.matrix.animated) {
                    const scale = mesh.matrix.getScaling();
                    mesh.matrix.restoreScale(scale);
                }

                mesh.matrix.scale(out);
                mesh.matrix.animated = true;
            }
        } else if (v.type === 'translation') {
            const out = new Vector3(result);

            for (const mesh of v.meshes) {
                mesh.matrix.setTranslate(out);
            }
        }
    }

    interpolation(sec, v) {
        const val = interpolation(sec, v.keys);

        if ((val[0] === -1 || val[1] === -1) || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const startFrame = v.keys[val[0]];
        const endFrame = v.keys[val[1]];
        // eslint-disable-next-line
        const t = val[2];

        const component = getAnimationComponent(v.type);
        let vectorC;
        if (component === 3) {
            vectorC = Vector3;
        } else if (component === 4) {
            vectorC = Vector4;
        } else {
            vectorC = Vector;
        }
        const vector = new vectorC(startFrame.value);
        const vector2 = new vectorC(endFrame.value);

        if (v.type === 'rotation') {
            const out = new Vector4();
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                mesh.matrix.makeRotationFromQuaternion(out.elements);
            }
        } else if (v.type === 'scale') {
            const out = new Vector3();
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                if (mesh.matrix.animated) {
                    const scale = mesh.matrix.getScaling();
                    mesh.matrix.restoreScale(scale);
                }

                mesh.matrix.scale(out);
                mesh.matrix.animated = true;
            }
        } else if (v.type === 'weights') {
            const out = new Vector(vector.elements);
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                const geometry = {};

                for (const k in mesh.geometry.targets[0]) {
                    if (k !== 'POSITION') {
                        continue;
                    }
                    geometry[k] = mesh.geometry.attributes[k].slice();
                    for (let i = 0; i < out.elements.length; i++) {
                        if (out.elements[i] === 0) {
                            continue;
                        }

                        const offset = 0;
                        for (let l = 0; l < geometry[k].length; l++) {
                            // if (k === 'TANGENT' && (l + 1) % 4 === 0) {
                            //     offset++;
                            //     continue;
                            // }
                            geometry[k][l] += out.elements[i] * mesh.geometry.targets[i][k][l - offset];
                        }
                    }
                }

                mesh.geometry.update(gl, geometry);
            }
        } else if (v.type === 'translation') {
            const out = new Vector3();
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                mesh.matrix.setTranslate(out);
            }
        } else {
            console.error('ERROR');
        }
    }

    animate(sec) {
        if (!this.parse.tracks.length) {
            return;
        }
        const t = this.parse.tracks[this.currentTrack];
        const duration = Math.max(...this.parse.tracks.map(t => t[0].duration))
        const increment = Math.floor(sec / duration);
        sec -= increment * duration;

        for (const track of this.parse.tracks.sort((a, b) => a[0].duration - b[0].duration)) {
        for (const v of track) {
            let result;
            switch (v.interpolation) {
                case 'LINEAR':
                    result = this.interpolation(sec, v);
                    break;
                case 'CUBICSPLINE':
                    result = this.spline(sec, v);
                    break;
                case 'STEP':
                    result = this.step(sec, v);
                    break;
                default:
                    result = this.interpolation(sec, v);
                    break;
            }

            if (result === false) {
                continue;
            }
            for (const mesh of v.meshes) {
                walk(mesh, node => {
                    node.updateMatrix();

                    if (node instanceof Bone) {
                        node.reflow = true;
                    }

                    if (node instanceof Mesh) {
                        node.reflow = true;
                    }

                    if (node instanceof Camera && node === this.camera) {
                        this.needUpdateView = true;
                    }
                });
            }

            this.reflow = true;
        }
        }
    }

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);

        if (this.reflow) {
            if (this.PP.postprocessors.length > 0) {
                this.PP.bindPrePass();
                this.PP.preProcessing();
                //this.PP.bindPostPass();
            }

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            //this.env.draw();

            this.renderScene();
            this.clean();

            if (this.PP.postprocessors.some(p => p instanceof PPLight)) {
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                this.Particles.draw(time);
                this.reflow = true;
            }

            // if (this.PP.postprocessors.length > 0) {
            //     this.PP.postProcessing();
            // }
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    renderScene() {
        if (this.needUpdateView) {
            const planes = Frustum(this.camera.getViewProjMatrix());

            this.scene.meshes.forEach(mesh => {
                mesh.visible = mesh.isVisible(planes);
            });
        }

        this.scene.opaqueChildren.forEach(mesh => {
            if (mesh.visible) {
                mesh.draw(gl, this.getState());
            }
        });
        if (this.scene.transparentChildren.length) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.scene.transparentChildren.forEach(mesh => {
                if (mesh.visible) {
                    mesh.draw(gl, this.getState());
                }
            });

            gl.disable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ZERO);
        }
    }

    clean() {
        walk(this.scene, node => {
            node.reflow = false;
        });
        this.needUpdateView = false;
        this.needUpdateProjection = false;
        this.reflow = false;
    }
}
