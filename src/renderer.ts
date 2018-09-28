import { Scene, Mesh, Camera, Bone } from './objects/index';
import { Vector2, Vector3, Vector4, Frustum } from './matrix';
import { getAnimationComponent, interpolation, walk, getAttributeIndex } from './utils';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { Particles } from './particles';
import { FPS } from './fps';
import { Light as PPLight } from './postprocessors/light';
import { Shadow } from './postprocessors/shadow';
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

    constructor(getState) {
        this.reflow = true;
        this.fps = new FPS;
        this.getState = getState;
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

    animate(sec) {
        const increment = Math.floor(sec / this.parse.duration);
        sec -= increment * this.parse.duration;

        for (const v of this.parse.tracks) {
            const val = interpolation(sec, v.keys);

            if (val[0] === -1 || val[1] === -1 || v.stoped) {
                continue;
            }
            // if (val[0] === v.keys.length - 1) {
            //     v.stoped = true;
            // }

            const startFrame = v.keys[ val[0] ];
            const endFrame = v.keys[ val[1] ];
            // eslint-disable-next-line
            const t = val[2];
            
            const component = getAnimationComponent(v.type);
            let vectorC;
            if (component === 3) {
                vectorC = Vector3;
            } else if (component === 4) {
                vectorC = Vector4;
            } else if (component === 2) {
                vectorC = Vector2;
            }
            const vector = new vectorC(startFrame.value);
            const vector2 = new vectorC(endFrame.value);

            if (v.type === 'rotation') {
                const out = new Vector4;
                out.lerp(vector.elements, vector2.elements, t);
                
                for (const mesh of v.meshes) {
                    mesh.matrix.makeRotationFromQuaternion(out.elements);
                }
            } else if (v.type === 'scale') {
                const out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                for (const mesh of v.meshes) {
                    mesh.matrix.scale(out);
                }
            } else if (v.type === 'weights') {
                const out = new Vector2;
                out.lerp(vector.elements, vector2.elements, t);

                for (const mesh of v.meshes) {
                    const geometry = {};

                    for (const k in mesh.geometry.targets[0]) {
                        let offset = 0;
                        geometry[k] = new Float32Array(mesh.geometry.attributes[k].length);
                        for (let i = 0; i < geometry[k].length; i++) {
                            if (k === 'TANGENT' && (i + 1) % 4 === 0) {
                                offset++;
                                continue;
                            }
                            geometry[k][i] = mesh.geometry.attributes[k][i] + out.elements[0] * mesh.geometry.targets[0][k][i - offset] + out.elements[1] * mesh.geometry.targets[1][k][i - offset];
                        }
                    }

                    gl.bindVertexArray(mesh.geometry.VAO);

                    for (const k in geometry) {
                        const VBO = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
                        gl.bufferData(gl.ARRAY_BUFFER, geometry[k], gl.STATIC_DRAW);
                        const index = getAttributeIndex(k);
                        gl.enableVertexAttribArray(index[0]);
                        gl.vertexAttribPointer(index[0], index[1], index[2], false, 0, 0);
                    }

                    gl.bindVertexArray(null);
                }
            } else if (v.type === 'translation') {
                const out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                for (const mesh of v.meshes) {
                    mesh.matrix.setTranslate(out);
                }
            } else {
                console.error('ERROR');
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

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            if (this.PP.postprocessors.length > 0) {
                this.PP.bindPrePass();
                this.PP.preProcessing();
                this.PP.bindPostPass();
            }

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            //this.env.draw();

            this.renderScene(!this.PP.postprocessors.some(p => p instanceof Shadow), false);
            this.clean();

            if (this.PP.postprocessors.some(p => p instanceof PPLight)) {
                this.Particles.draw(time);
                this.reflow = true;
            }

            if (this.PP.postprocessors.length > 0) {
                this.PP.postProcessing();
            }
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    renderScene(isShadow, isLight) {
        gl.enable(gl.STENCIL_TEST);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.stencilMask(0x00);

        if (this.needUpdateView) {
            const planes = Frustum(this.camera.getViewProjMatrix());

            this.scene.meshes.forEach(mesh => {
                mesh.visible = mesh.isVisible(planes);
            });
        }

        this.scene.opaqueChildren.forEach((mesh, i) => {
            if (mesh.visible) {
                if (i == 0) {
                    gl.stencilFunc(gl.ALWAYS, 1, 0xFF); // каждый фрагмент обновит трафаретный буфер
                    gl.stencilMask(0xFF); // включить запись в трафаретный буфер
                }
                mesh.draw(gl, this.getState(), isShadow, isLight);
                if (i == 0) {
                    gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
                    gl.stencilMask(0x00); 
                    gl.disable(gl.DEPTH_TEST);
                    mesh.matrix.scale(new Vector3([1.1, 1.1, 1.1]));
                    mesh.updateMatrix();
                    mesh.reflow = true;

                    mesh.draw(gl, {...this.getState(), isOutline: true}, isShadow, isLight);
                    gl.stencilMask(0xFF);
                    gl.enable(gl.DEPTH_TEST);
                    gl.disable(gl.STENCIL_TEST);
                }
            }
        });
        if (this.scene.transparentChildren.length) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  

            this.scene.transparentChildren.forEach(mesh => {
                if (mesh.visible) {
                    mesh.draw(gl, this.getState(), isShadow, isLight);
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
