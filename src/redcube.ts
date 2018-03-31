/// <reference path='../index.d.ts'/>

import { Scene, Mesh, SkinnedMesh, Camera, Bone } from './objects';
import { Matrix4, Vector2, Vector3, Vector4 } from './matrix';
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
                yfov: 0.6,
                znear: 1,
                zfar: 2e6
            }
        });

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

    updatePP() {

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
        this.camera.setProjection(calculateProjection(this.camera.props));

        if (this.camera.props.isInitial) {
            const z = 1 / this.canvas.width * this.camera.modelSize * 5000;
            this.camera.setZ(z);
            if (this.camera.modelSize < 1) {
                this.camera.props.perspective.znear = 0.01;
                this.camera.setProjection(calculateProjection(this.camera.props));
            }
            this.needUpdateView = true;
        }

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
            this.PP.bindBuffer();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.env.createEnvironment();

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            this.scene.opaqueChildren.forEach(mesh => this._draw(mesh));
            if (this.scene.transparentChildren.length) {
                gl.enable(gl.BLEND);
                gl.depthMask(false);
                gl.blendFuncSeparate(gl.SRC_COLOR, gl.DST_COLOR, gl.ONE, gl.ZERO);
                // gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

                this.scene.transparentChildren.forEach(mesh => this._draw(mesh));

                gl.disable(gl.BLEND);
                gl.depthMask(true);
                gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
            }

            walk(this.scene, node => {
                if (node instanceof Bone) {
                    node.reflow = false;
                }
            });
            this.needUpdateView = false;
            this.needUpdateProjection = false;

            this.PP.postProcessing();
        }

        this.fps.tick(time);

        this.reflow = false;
        requestAnimationFrame(this.render.bind(this));
    }

    _draw(mesh) {
        gl.useProgram(mesh.program);

        gl.bindVertexArray(mesh.geometry.VAO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, mesh.geometry.UBO);
        if (mesh.reflow) { // matrixWorld changed
            const normalMatrix = new Matrix4(mesh.matrixWorld);
            normalMatrix.invert().transpose();
            const matrices = new Float32Array(32);
            matrices.set(mesh.matrixWorld.elements);
            matrices.set(normalMatrix.elements, 16);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
            mesh.reflow = false;
        }

        if (this.needUpdateView) {
            gl.bufferSubData(gl.UNIFORM_BUFFER, 32 * Float32Array.BYTES_PER_ELEMENT, this.camera.matrixWorldInvert.elements);
        }

        if (this.needUpdateProjection) {
            gl.bufferSubData(gl.UNIFORM_BUFFER, 48 * Float32Array.BYTES_PER_ELEMENT, this.camera.projection.elements);
        }

        if (mesh instanceof SkinnedMesh) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, mesh.geometry.SKIN);
            if (mesh.bones.some(bone => bone.reflow)) {
                const jointMatrix = mesh.getJointMatrix();
                const matrices = new Float32Array(jointMatrix.length * 16);
                let i = 0;
                for (const j of jointMatrix) {
                    matrices.set(j.elements, 0 + 16 * i);
                    i++;
                }
                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
            }
        }
        if (mesh.material.UBO) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, mesh.material.UBO);

            if (this.needUpdateView) {
                gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([this.camera.matrixWorld.elements[12], this.camera.matrixWorld.elements[13], this.camera.matrixWorld.elements[14]]));
                gl.bufferSubData(gl.UNIFORM_BUFFER, 8 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([this.camera.matrixWorld.elements[12], this.camera.matrixWorld.elements[13], this.camera.matrixWorld.elements[14]]));
            }
        }
        if (mesh.material.pbrMetallicRoughness.baseColorTexture) {
            gl.uniform1i(mesh.material.uniforms.baseColorTexture, mesh.material.pbrMetallicRoughness.baseColorTexture.count);
        }
        if (mesh.material.pbrMetallicRoughness.metallicRoughnessTexture) {
            gl.uniform1i(mesh.material.uniforms.metallicRoughnessTexture, mesh.material.pbrMetallicRoughness.metallicRoughnessTexture.count);
        }
        if (mesh.material.normalTexture) {
            gl.uniform1i(mesh.material.uniforms.normalTexture, mesh.material.normalTexture.count);
        }
        if (mesh.material.occlusionTexture) {
            gl.uniform1i(mesh.material.uniforms.occlusionTexture, mesh.material.occlusionTexture.count);
        }
        if (mesh.material.emissiveTexture) {
            gl.uniform1i(mesh.material.uniforms.emissiveTexture, mesh.material.emissiveTexture.count);
        }
        if (mesh.material.doubleSided) {
            gl.disable(gl.CULL_FACE);
        }

        if (mesh.geometry.indicesBuffer) {
            gl.drawElements(mesh.mode || gl.TRIANGLES, mesh.geometry.indicesBuffer.length, mesh.geometry.indicesBuffer.BYTES_PER_ELEMENT === 4 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.mode || gl.TRIANGLES, 0, mesh.geometry.attributes.POSITION.length / 3);
        }

        if (mesh.material.doubleSided) {
            gl.enable(gl.CULL_FACE);
        }
    }
}

export { RedCube };
