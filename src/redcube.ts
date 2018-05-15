/// <reference path='../index.d.ts'/>

import { Scene, Mesh, Camera, Bone, Light } from './objects';
import { Matrix4, Vector2, Vector3, Vector4, Frustum } from './matrix';
import { Events } from './events';
import { Env } from './env';
import { FPS } from './fps';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { setGl, getAnimationComponent, interpolation, walk, sceneToArcBall, canvasToWorld, calculateProjection, getAttributeIndex } from './utils';

let gl;

class RedCube {
    reflow: boolean;
    scene: Scene;
    camera: Camera;
    light: Light;
    canvas: HTMLCanvasElement;
    events: Events;
    parse: Parse;
    env: Env;
    needUpdateProjection: boolean;
    needUpdateView: boolean;
    fps: FPS;
    PP: PostProcessing;

    constructor(url, canvas, processors) {
        this.reflow = true;
        this.scene = new Scene;
        this.canvas = canvas;

        this.camera = new Camera;
        this.camera.setProps({
            type: 'perspective', 
            isInitial: true,
            zoom: 1,
            aspect: this.canvas.offsetWidth / this.canvas.offsetHeight,
            perspective: {
                yfov: 0.6
            }
        });

        this.light = new Light;

        this.events = new Events(this.redraw.bind(this));

        this.fps = new FPS;

        this.env = new Env;
        this.env.setCamera(this.camera);

        this.PP = new PostProcessing(processors);
        this.PP.setCanvas(this.canvas);
        this.PP.setCamera(this.camera);

        this.parse = new Parse(url);
        this.parse.setScene(this.scene);
        this.parse.setCamera(this.camera);
        this.parse.setLight(this.light);
        this.parse.setUpdateCamera(this.updateCamera.bind(this));
        this.parse.setCanvas(this.canvas);
        this.parse.setResize(this.resize.bind(this));    
    }

    init() {
        return this.parse.getJson()
            .then(this.glInit.bind(this))
            .then(this.parse.initTextures.bind(this.parse))
            .then(this.PP.buildScreenBuffer.bind(this.PP))
            .then(this.parse.getBuffer.bind(this.parse))
            .then(this.parse.buildSkin.bind(this.parse))
            .then(this.parse.buildMesh.bind(this.parse))
            .then(this.parse.buildAnimation.bind(this.parse))
            .then(this.env.createEnvironmentBuffer.bind(this.env))
            .then(this.draw.bind(this))
            .catch(console.error);
    }

    updateCamera(camera) {
        this.camera = camera;
        this.env.setCamera(camera);
        this.PP.setCamera(camera);
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.camera.props.zoom = coordsStart;
            this.camera.setProjection(calculateProjection(this.camera.props));
            this.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            const coordsStartWorld = canvasToWorld(coordsStart, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const coordsMoveWorld = canvasToWorld(coordsMove, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const p0 = new Vector3(sceneToArcBall(coordsStartWorld));
            const p1 = new Vector3(sceneToArcBall(coordsMoveWorld));
            const angle = Vector3.angle(p1, p0) * 5;
            if (angle < 1e-6 || isNaN(angle)) {
                return;
            }

            p0.applyMatrix4(this.camera.matrixWorld);
            p1.applyMatrix4(this.camera.matrixWorld);
            const v = Vector3.cross(p1, p0).normalize();

            const m = new Matrix4;
            m.makeRotationAxis(v, angle);
            m.multiply(this.camera.matrixWorld);

            this.camera.setMatrixWorld(m.elements);
            this.light.setMatrixWorld(m.elements);
            this.needUpdateView = true;
        }
        if (type === 'pan') {
            const coordsStartWorld = canvasToWorld(coordsStart, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const coordsMoveWorld = canvasToWorld(coordsMove, this.camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight);
            const p0 = new Vector3([...coordsStartWorld, 0]);
            const p1 = new Vector3([...coordsMoveWorld, 0]);
            const pan = this.camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);

            this.camera.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
            this.camera.setMatrixWorld(this.camera.matrixWorld.elements);
            this.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize(type);
            this.needUpdateProjection = true;
        }
        
        this.reflow = true;
    }

    resize(e) {
        this.camera.props.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
        gl.viewport( 0, 0, this.canvas.offsetWidth * devicePixelRatio, this.canvas.offsetHeight * devicePixelRatio);

        if (this.camera.props.isInitial) {
            const z = 1 / this.canvas.width * this.camera.modelSize * 3000;
            this.camera.setZ(z);
            this.light.setZ(z);
            this.needUpdateView = true;
        }

        const cameraZ = Math.abs(this.camera.matrixWorldInvert.elements[14]);
        const cameraProps = this.camera.props.perspective || this.camera.props.orthographic;
        if (cameraZ > this.camera.modelSize) {
            cameraProps.znear = cameraZ - this.camera.modelSize;
            cameraProps.zfar = cameraZ + this.camera.modelSize;
        } else {
            cameraProps.znear = 1;
            cameraProps.zfar = 10000;
        }
        this.camera.setProjection(calculateProjection(this.camera.props));

        if (e) {
            this.PP.clear();
            this.PP.buildScreenBuffer();
        }
    }

    glInit() {
        gl = this.canvas.getContext('webgl2', { antialias: false });

        if (!gl) {
            throw new Error('Webgl 2 doesnt support');
        }

        setGl(gl);
        this.env.setGl(gl);
        this.PP.setGl(gl);
        this.parse.setGl(gl);

        return true;
    }

    animate(sec) {
        for (const v of this.parse.tracks) {
            const val = interpolation(sec, v.keys);

            if (val[0] === -1 || val[1] === -1 || v.stoped) {
                continue;
            }
            if (val[0] === v.keys.length - 1) {
                v.stoped = true;
            }

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

    draw() {
        gl.clearColor(0.8, 0.8, 0.8, 1.0);

        this.render();
    }

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            this.PP.bindPrePass();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //gl.enable(gl.RASTERIZER_DISCARD);

            this.renderScene(true);

            //gl.disable(gl.RASTERIZER_DISCARD);
            this.PP.bindPostPass();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.env.createEnvironment();

            this.renderScene(false);

            walk(this.scene, node => {
                node.reflow = false;
            });
            this.needUpdateView = false;
            this.needUpdateProjection = false;

            this.PP.postProcessing();
        }

        this.fps.tick(time);

        this.reflow = false;
        requestAnimationFrame(this.render.bind(this));
    }

    renderScene(isShadow) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        if (this.needUpdateView) {
            const planes = Frustum(this.camera.getViewProjMatrix());

            this.scene.meshes.forEach(mesh => {
                mesh.visible = mesh.isVisible(planes);
            });
        }

        this.scene.opaqueChildren.forEach(mesh => {
            if (mesh.visible) {
                mesh.draw(gl, this.getState(), isShadow);
            }
        });
        if (this.scene.transparentChildren.length) {
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            gl.blendFuncSeparate(gl.SRC_COLOR, gl.DST_COLOR, gl.ONE, gl.ZERO);
            // gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            this.scene.transparentChildren.forEach(mesh => {
                if (mesh.visible) {
                    mesh.draw(gl, this.getState(), isShadow);
                }
            });

            gl.disable(gl.BLEND);
            gl.depthMask(true);
            gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        }
    }

    getState() {
        return {
            camera: this.camera,
            light: this.light,
            preDepthTexture: this.PP.preDepthTexture,
            fakeDepth: this.PP.fakeDepth,
            needUpdateView: this.needUpdateView, 
            needUpdateProjection: this.needUpdateProjection
        };
    }
}

export { RedCube };
