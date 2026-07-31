import { Mesh, Bone, Light, Camera, Object3D } from './objects/index';
import { Vector, Vector2, Vector3, Vector4, Frustum } from './matrix';
import { interpolation, walk } from './utils';
import { FPS } from './fps';
import { Light as PPLight } from './postprocessors/light';
import { Attributes } from './objects/geometry';
import type { Env } from './env';
import type { Track, State } from './state';

export type { State, RenderPassState, Track, Key, Skin, Define } from './state';

declare global {
    interface Window {
        __FORCE_DETERMINISTIC__?: boolean;
    }
}

// Renderer holds no references to its collaborators (gl/scene/camera/parse
// output/env/PP/particles) - every read goes through getState() so there's
// exactly one canonical copy of each value, owned by RedCube. Only fps is
// genuinely private, per-instance runtime state.
export class Renderer {
    fps: FPS;
    getState: () => State;
    reflow = true;
    needUpdateView = true;
    needUpdateProjection = true;
    currentTrack = 0;

    constructor(getState: () => State) {
        this.fps = new FPS();
        this.getState = getState;
    }

    step(sec: number, v: Track) {
        const val = interpolation(sec, v.keys);

        if (val[0] === -1 || val[1] === -1 || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const current = v.keys[val[0]];
        const { component } = v;
        let vectorC: new (src: Float32Array) => Vector | Vector3 | Vector4;
        if (component === 3) {
            vectorC = Vector3;
        } else if (component === 4) {
            vectorC = Vector4;
        } else {
            vectorC = Vector;
        }
        const vector = new vectorC(current.value as Float32Array);

        if (v.type === 'rotation') {
            for (const mesh of v.meshes) {
                const scale = mesh.matrix.getScaling();
                mesh.matrix.makeRotationFromQuaternion(vector.elements);
                mesh.matrix.scale(scale);
            }
        } else if (v.type === 'scale') {
            for (const mesh of v.meshes) {
                if (mesh.matrix.animated) {
                    const scale = mesh.matrix.getScaling();
                    mesh.matrix.restoreScale(scale);
                }

                mesh.matrix.scale(vector as Vector3);
                mesh.matrix.animated = true;
            }
        } else if (v.type === 'translation') {
            for (const mesh of v.meshes) {
                mesh.matrix.setTranslate(vector as Vector3);
            }
        } else if (v.type === 'visible') {
            for (const mesh of v.meshes) {
                mesh.visible = vector.elements[0] !== 0;
            }
        }
    }

    spline(sec: number, v: Track) {
        const val = interpolation(sec, v.keys);

        if (val[0] === -1 || val[1] === -1 || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const t = sec;
        const t1 = v.keys[val[1]].time;
        const t0 = v.keys[val[0]].time;
        const stride = v.component;

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
                const scale = mesh.matrix.getScaling();
                mesh.matrix.makeRotationFromQuaternion(out.elements);
                mesh.matrix.scale(scale);
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

    updateGeometry(mesh: Mesh, geometry: Attributes) {
        mesh.geometry.update(this.getState().gl as WebGL2RenderingContext, geometry);
    }

    interpolation(sec: number, v: Track) {
        const val = interpolation(sec, v.keys);

        if (val[0] === -1 || val[1] === -1 || (val[0] === 0 && val[1] === 0)) {
            return false;
        }

        const startFrame = v.keys[val[0]];
        const endFrame = v.keys[val[1]];
        // eslint-disable-next-line
        const t = val[2] as number;

        const { component } = v;
        let vectorC: new (src: Float32Array) => Vector | Vector2 | Vector3 | Vector4;
        if (component === 2) {
            vectorC = Vector2;
        } else if (component === 3) {
            vectorC = Vector3;
        } else if (component === 4) {
            vectorC = Vector4;
        } else {
            vectorC = Vector;
        }
        const vector = new vectorC(startFrame.value as Float32Array);
        const vector2 = new vectorC(endFrame.value as Float32Array);

        if (v.type === 'rotation') {
            const out = new Vector4();
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                const scale = mesh.matrix.getScaling();
                mesh.matrix.makeRotationFromQuaternion(out.elements);
                mesh.matrix.scale(scale);
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
                const geometry: Attributes = {};

                for (const k in mesh.geometry.targets[0]) {
                    if (k !== 'POSITION') {
                        continue;
                    }
                    geometry[k] = mesh.geometry.attributes[k]!.slice();
                    for (let i = 0; i < out.elements.length; i++) {
                        if (out.elements[i] === 0) {
                            continue;
                        }

                        const offset = 0;
                        for (let l = 0; l < geometry[k]!.length; l++) {
                            // if (k === 'TANGENT' && (l + 1) % 4 === 0) {
                            //     offset++;
                            //     continue;
                            // }
                            geometry[k]![l] += out.elements[i] * mesh.geometry.targets[i][k]![l - offset];
                        }
                    }
                }

                this.updateGeometry(mesh, geometry);
            }
        } else if (v.type === 'translation') {
            const out = new Vector3();
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                mesh.matrix.setTranslate(out);
            }
        } else {
            const out = v.component === 2 ? new Vector2() : v.component === 4 ? new Vector4() : new Vector(new Float32Array(1));
            out.lerp(vector.elements, vector2.elements, t);

            for (const mesh of v.meshes) {
                this.updateMaterial(mesh, v.type, out);
            }
        }
    }

    updateMaterial(mesh: Mesh, type: string, out: { elements: Float32Array }) {
        const gl = this.getState().gl as WebGL2RenderingContext;
        const s = type.split('/');
        const last = s[s.length - 1];

        if (last === 'offset' || last === 'rotation' || last === 'scale') {
            const name = s[s.length - 4];
            mesh.material.setTexture(gl, name, last, out);
        } else {
            mesh.repaint = true;
            mesh.material.setColor(gl, s[s.length - 1], out);
        }
    }

    animate(sec: number) {
        const { tracks, camera } = this.getState();
        if (!tracks.length) {
            return;
        }
        const duration = Math.max(...tracks.map((t) => t[0].duration));
        const increment = Math.floor(sec / duration);
        sec -= increment * duration;

        for (const track of tracks.sort((a, b) => a[0].duration - b[0].duration)) {
            for (const v of track) {
                let result: boolean | undefined;
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
                    walk<Mesh, Object3D>(mesh, (node) => {
                        node.updateMatrix();

                        if (node instanceof Bone) {
                            node.reflow = true;
                        }

                        if (node instanceof Mesh) {
                            node.reflow = true;
                        }

                        if (node instanceof Light) {
                            this.needUpdateView = true;
                        }

                        if (node instanceof Camera && node === camera) {
                            this.needUpdateView = true;
                        }
                    });
                }

                this.reflow = true;
            }
        }
    }

    render(time = 0) {
        const s = this.getState();
        const gl = s.gl as WebGL2RenderingContext;
        const sec = time / 1000;

        if (!window.__FORCE_DETERMINISTIC__) {
            this.animate(sec);
        }

        if (this.reflow) {
            if (s.pp!.hasPrePass) {
                s.pp!.bindPrePass();
                s.pp!.preProcessing();
            }
            if (s.pp!.hasPostPass) {
                s.pp!.bindPostPass();
            }

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            if (s.json.extensions && s.json.extensions.EXT_lights_image_based) {
                (s.env as Env).draw();
            }
            //\s.env.draw();

            this.renderScene();
            this.clean();

            if (s.pp!.postprocessors.some((p) => p instanceof PPLight)) {
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                s.particles!.draw(time);
                this.reflow = true;
            }

            if (s.pp!.hasPostPass) {
                s.pp!.postProcessing();
            }
        }

        this.fps.tick(time);

        requestAnimationFrame(this.render.bind(this));
    }

    renderScene() {
        const s = this.getState();
        const gl = s.gl as WebGL2RenderingContext;
        if (this.needUpdateView || this.reflow) {
            const planes = Frustum(s.camera.getViewProjMatrix());

            s.scene.meshes.forEach((mesh) => {
                mesh.visible = mesh.parent!.visible && mesh.isVisible(planes);
            });
        }

        if (this.needUpdateView) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, s.UBO!);
            s.cameraBuffer!.update(gl, 'view', s.camera.matrixWorldInvert.elements);
            s.cameraBuffer!.update(gl, 'light', s.light!.matrixWorldInvert.elements);

            gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, s.lightPosUniform!);
            s.lights.forEach((light, i) => {
                s.lightPosBuffer!.store!.set(light.getPosition(), i * 4);
            });
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, s.lightPosBuffer!.store!);
        }
        if (this.needUpdateProjection) {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, s.UBO!);
            s.cameraBuffer!.update(gl, 'projection', s.camera.projection.elements);
        }
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 4, s.lightColorUniform!);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, s.lightColorBuffer!.store!);
        s.lights.forEach((light, i) => {
            const offset = i * 4 * Float32Array.BYTES_PER_ELEMENT;
            if (light.visible === false) {
                gl.bufferSubData(gl.UNIFORM_BUFFER, offset, new Float32Array([0, 0, 0, 0]));
            }
        });
        s.scene.meshes.forEach((mesh, i) => {
            if (mesh.reflow) {
                gl.activeTexture(gl[`TEXTURE${31}`]);
                gl.bindTexture(gl.TEXTURE_2D, s.storage2!.texture);
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0, // Mipmap level
                    0, // xoffset
                    i, // yoffset
                    s.scene.meshes[0].geometry.uniformBuffer!.store!.length / Float32Array.BYTES_PER_ELEMENT,
                    1,
                    gl.RGBA,
                    gl.FLOAT,
                    mesh.matrixWorld.elements,
                );
                if (mesh.matrices.length) {
                    mesh.matrices.forEach((matrix, j) => {
                        gl.texSubImage2D(
                            gl.TEXTURE_2D,
                            0, // Mipmap level
                            0, // xoffset
                            i + j + 1, // yoffset
                            s.scene.meshes[0].geometry.uniformBuffer!.store!.length / Float32Array.BYTES_PER_ELEMENT,
                            1,
                            gl.RGBA,
                            gl.FLOAT,
                            matrix.elements,
                        );
                    });
                }
                mesh.reflow = false;
            }
            if (mesh.repaint) {
                gl.activeTexture(gl[`TEXTURE${30}`]);
                gl.bindTexture(gl.TEXTURE_2D, s.storage!.texture2);
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0, // Mipmap level
                    0, // xoffset
                    i, // yoffset
                    s.scene.meshes[0].material.materialUniformBuffer.store.length / Float32Array.BYTES_PER_ELEMENT,
                    1,
                    gl.RGBA,
                    gl.FLOAT,
                    mesh.material.materialUniformBuffer.store,
                );
                mesh.repaint = false;
            }
        });

        s.scene.opaqueChildren.forEach((mesh) => {
            if (mesh.visible) {
                mesh.draw(gl, s);
            }
        });
        if (s.scene.transparentChildren.length) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            s.scene.transparentChildren.forEach((mesh) => {
                if (mesh.visible) {
                    mesh.draw(gl, s);
                }
            });

            gl.disable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ZERO);
        }
    }

    clean() {
        walk(this.getState().scene, (node) => {
            (node as Object3D).reflow = false;
        });
        this.needUpdateView = false;
        this.needUpdateProjection = false;
        this.reflow = false;
    }
}
