import { Scene, Mesh, SkinnedMesh, Camera, Bone } from './objects';
import { Matrix3, Matrix4, Vector2, Vector3, Vector4, Frustum } from './matrix';
import { Events } from './events';
import { Env } from './env';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { setGl, setGlEnum, getComponentType, getMethod, getAnimationComponent, getAnimationMethod, interpolation, walk, sceneToArcBall, canvasToWorld, calculateProjection, getAttributeIndex } from './utils';

let gl;

class RedCube {
    constructor(url, canvas) {
        this.reflow = true;
        this.scene = new Scene();
        this.color = [0.8, 0.8, 0.8, 1.0];
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.canvas = canvas;
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this._camera = new Camera;
        this._camera.isInitial = true;
        this._camera.props = {
            type: 'perspective', 
            perspective: {
                yfov: 0.6,
                znear: 0.01,
                zfar: 2e6,
                aspectRatio: null
            }
        };
        this.zoom = 1;
        this._camera.setZ(5);

        this.glEnum = {};

        this.events = new Events(this.redraw.bind(this));

        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;

        //this.env = new Env;
        //this.env.setCamera(this._camera);

        // this.PP = new PostProcessing;
        // this.PP.setCanvas(this.canvas);
        // this.PP.setCamera(this._camera);

        this.parse = new Parse(url);
        this.parse.setScene(this.scene);
        this.parse.setCamera(this._camera, this.aspect, this.zoom);
        this.parse.setUpdateCamera(this.updateCamera.bind(this));
        this.parse.setCanvas(this.canvas);
        this.parse.setResize(this.resize.bind(this));    
    }

    init() {
        return this.parse.getJson()
            .then(this.glInit.bind(this))
            .then(this.parse.initTextures.bind(this.parse))
            // .then(this.PP.buildScreenBuffer.bind(this.PP))
            .then(this.parse.getBuffer.bind(this.parse))
            .then(this.parse.buildSkin.bind(this.parse))
            .then(this.parse.buildMesh.bind(this.parse))
            .then(this.parse.buildAnimation.bind(this.parse))
            // .then(this.env.createEnvironmentBuffer.bind(this.env))
            .then(this.draw.bind(this))
            .catch(console.error);
    }

    updateCamera(camera) {
        this._camera = camera;
    }

    setColor(color) {
        this.color = color;
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.zoom = coordsStart;
            this._camera.setProjection(calculateProjection(this._camera.props, this.aspect, this.zoom).elements);
            this.needUpdateProjection = true;
        }
        if (type === 'rotate') {
            const p0 = new Vector3(sceneToArcBall(canvasToWorld(...coordsStart, this._camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight)));
            const p1 = new Vector3(sceneToArcBall(canvasToWorld(...coordsMove, this._camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight)));
            const angle = Vector3.angle(p0, p1) * 5;
            if (angle < 1e-6 || isNaN(angle)) {
                return;
            }

            const v = Vector3.cross(p0, p1).normalize();
            const sin = Math.sin(angle / 2);
            const q = new Vector4([v.elements[0] * sin, v.elements[1] * sin, v.elements[2] * sin, Math.cos(angle / 2)]);

            const m = new Matrix4();
            m.makeRotationFromQuaternion(q.elements);
            m.multiply(this._camera.matrixWorld);
            this._camera.setMatrixWorld(m.elements);
            this.needUpdateView = true;          

            // const diff = Vector3.angle(new Vector3([0, 1, 0]).applyQuaternion(new Vector4().setFromRotationMatrix(m)), new Vector3([0, 1, 0]));
            // if (diff <= Math.PI / 2) {
            //     this.needUpdateView = true;
            // }
        }
        if (type === 'pan') {
            const p0 = new Vector3(canvasToWorld(...coordsStart, this._camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight).elements);
            const p1 = new Vector3(canvasToWorld(...coordsMove, this._camera.projection, this.canvas.offsetWidth, this.canvas.offsetHeight).elements);
            const pan = this._camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);

            this._camera.matrixWorld.translate(delta.elements[0], delta.elements[1], 0);
            this._camera.setMatrixWorld(this._camera.matrixWorld.elements);
            this.needUpdateView = true;
        }
        if (type === 'resize') {
            this.resize();
            this.needUpdateProjection = true;
        }
        
        this.reflow = true;
    }

    resize() {
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
        gl.viewport( 0, 0, this.canvas.offsetWidth * devicePixelRatio, this.canvas.offsetHeight * devicePixelRatio);
        this._camera.setProjection(calculateProjection(this._camera.props, this.aspect, this.zoom).elements);

        if (this._camera.isInitial) {
            const z = 1 / this.canvas.width * this._camera.modelSize * 5000;
            this._camera.setZ(z);
            this.needUpdateView = true;
        }
    }

    buildBuffer(indexBuffer, ...buffer) {
        if (indexBuffer) {
            if (indexBuffer.buffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
            } else {
                const bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.value, gl.STATIC_DRAW);
                indexBuffer.buffer = bufferGL;
            }
        }

        buffer.forEach(b => {
            if (!b.buffer) {
                const bufferGL = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferGL);
                gl.bufferData(gl.ARRAY_BUFFER, b.value, gl.STATIC_DRAW);
                b.buffer = bufferGL;
            }
        });
    }

    glInit() {
        gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.gl = gl;

        for (const k in gl) {
            const v = gl[k];
            if (typeof v === 'number') {
                this.glEnum[v] = k;
            }
        }
        setGlEnum(this.glEnum);
        setGl(gl);
        //this.env.setGl(gl);
        //this.PP.setGl(gl);
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
                    mesh.matrix[getAnimationMethod(v.type)](out.elements);
                }
            } else if (v.type === 'scale') {
                const out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                for (const mesh of v.meshes) {
                    mesh.matrix[getAnimationMethod(v.type)](...out.elements);
                }
            } else if (v.type === 'weights') {
                const out = new Vector2;
                out.lerp(vector.elements, vector2.elements, t);

                for (const m of v.meshes) {
                    const [mesh] = m.children;
                    const geometry = {};

                    for (const k in mesh.geometry.attributes) {
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
                    mesh.matrix[getAnimationMethod(v.type)](...out.elements);
                }
            } else {
                console.error('ERROR');
            }

            for (const mesh of v.meshes) {
                walk(mesh, node => {
                    const m = new Matrix4;
                    m.multiply( node.parent.matrixWorld );
                    m.multiply(node.matrix);
                    node.setMatrixWorld(m.elements);

                    if (node instanceof Bone) {
                        node.reflow = true;
                    }

                    if (node instanceof Mesh) {
                        node.reflow = true;
                    }

                    if (node instanceof Camera && node === this._camera) {
                        this.needUpdateView = true;
                    }
                });
            }

            this.reflow = true;
        }
    }

    setMesh(blends, nonBlends, node) {
        if ( node.parent && node.parent.matrixWorld ) {
            const m = new Matrix4();
            m.multiply( node.parent.matrixWorld );
            m.multiply(node.matrixAnimation);
            
            node.setMatrixWorld(m.elements);
        }

        if (node instanceof SkinnedMesh) {
            node.bones = this.parse.skins[node.skin].bones;
            node.boneInverses = this.parse.skins[node.skin].boneInverses;
            node.bindShapeMatrix = this.parse.skins[node.skin].bindShapeMatrix;
        }

        if (node instanceof Mesh) {
            if (node.material.blend) {
                blends.push(node);
            } else {
                nonBlends.push(node);
            }
        }
    }

    draw() {
        gl.clearColor(...this.color);

        this.render();
    }

    render(time = 0) {
        const sec = time / 1000;

        this.animate(sec);
        
        if (this.reflow) {
            //this.PP.bindBuffer();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            gl.disable(gl.BLEND);
            gl.depthMask(true);
            gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);

            walk(this.scene, node => {
                if (node instanceof Mesh) {
                    this._draw(node);
                }
            });

            walk(this.scene, node => {
                if (node instanceof Bone) {
                    node.reflow = false;
                }
            });
            this.needUpdateView = false;
            this.needUpdateProjection = false;

            //this.env.createEnvironment();

            // const blends = [];
            // const nonBlends = [];
            // walk(this.scene, this.setMesh.bind(this, blends, nonBlends));

            // const planes = Frustum(this._camera.getViewProjMatrix());

            // if (nonBlends.length) {
            //     for (const e in this.parse.unblendEnable) {
            //         gl.enable(e);
            //     }
            //     for (const mesh of nonBlends) {
            //         if (mesh.isVisible(planes)) {
            //             this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
            //             this._draw(mesh);
            //         }
            //     }
            //     for (const e in this.parse.unblendEnable) {
            //         gl.disable(e);
            //     }
            // }

            // if (blends.length) {
            //     const blendsSorted = [];
            //     for (const mesh of blends) {
            //         if (mesh.isVisible(planes)) {
            //             blendsSorted.push(mesh);
            //         }
            //     }
            //     if (blendsSorted.length) {
            //         blendsSorted.sort((a, b) => a.distance - b.distance);

            //         for (const e in this.parse.blendEnable) {
            //             gl.enable(e);
            //         }
            //         for (const f in this.parse.blendTechnique) {
            //             gl[f](...this.parse.blendTechnique[f]);
            //         }
            //         for (const mesh of blendsSorted) {
            //             this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
            //             this._draw(mesh);
            //         }
            //         for (const e in this.parse.blendEnable) {
            //             gl.disable(e);
            //         }
            //         for (const f in this.parse.blendTechnique) {
            //             if (f === 'depthMask') {
            //                 gl[f](true);
            //             }
            //             if (f === 'blendFuncSeparate') {
            //                 gl[f](gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
            //             }
            //             if (f === 'blendEquationSeparate') {
            //                 gl[f](gl.FUNC_ADD, gl.FUNC_ADD);
            //             }
            //         }
            //     }
            // }

            //this.PP.postProcessing();
        }

        this.fps++;
        this.elapsedTime += (time - this.lastTime);
        this.lastTime = time;
        if (this.elapsedTime >= 1000) {
            this.counterEl.innerHTML = this.fps;
            this.fps = 0;
            this.elapsedTime -= 1000;
        }

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
            gl.bufferSubData(gl.UNIFORM_BUFFER, 32 * Float32Array.BYTES_PER_ELEMENT, this._camera.matrixWorldInvert.elements);
        }

        if (this.needUpdateProjection) {
            gl.bufferSubData(gl.UNIFORM_BUFFER, 48 * Float32Array.BYTES_PER_ELEMENT, this._camera.projection.elements);
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
                gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([this._camera.matrixWorld.elements[12], this._camera.matrixWorld.elements[13], this._camera.matrixWorld.elements[14]]));
                gl.bufferSubData(gl.UNIFORM_BUFFER, 8 * Float32Array.BYTES_PER_ELEMENT, new Float32Array([this._camera.matrixWorld.elements[12], this._camera.matrixWorld.elements[13], this._camera.matrixWorld.elements[14]]));
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
        if (mesh.material.alphaMode === 'BLEND') {
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        }

        // const {_camera} = this;
        
        // for (const k in mesh.geometry.attributes) {
        //     const v = mesh.geometry.attributes[k];

        //     gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer);
            
        //     let a;
        //     if (v[k] !== undefined) {
        //         a = v[k];
        //     } else {
        //         a = gl.getAttribLocation(mesh.program, k);
        //         if (a !== 0 && !a) {
        //             console.warn(`dont get ${k} from shader`);
        //             delete mesh.geometry.attributes[k];
        //             continue;
        //         }
        //         v[k] = a;
        //         gl.enableVertexAttribArray(a);
        //     }

        //     gl.vertexAttribPointer(a, getComponentType(v.type), gl.FLOAT, false, 0, 0);
        // }

        // for (const k in mesh.material.uniforms) {
        //     const v = mesh.material.uniforms[k];
        //     let matricies, value;

        //     if (v.type === gl.SAMPLER_2D) {
        //         value = [this.parse.textures[v.value[0]].count];
        //     }

        //     switch (v.semantic) {
        //     case 'MODELVIEWPROJECTION':
        //         v.value = mesh.getModelViewProjMatrix(_camera);
        //         break;
        //     case 'MODELVIEWPROJECTIONINVERSE':
        //         v.value = mesh.getModelViewProjMatrix(_camera).invert();
        //         break;
        //     case 'VIEW':
        //         v.value = mesh.getViewMatrix(_camera);
        //         break;
        //     case 'VIEWINVERSE':
        //         v.value = mesh.getViewMatrix(_camera).invert();
        //         break;
        //     case 'MODEL':
        //         v.value = mesh.matrixWorld;
        //         break;
        //     case 'MODELINVERSETRANSPOSE':
        //         v.value = new Matrix3().normalFromMat4(mesh.matrixWorld);
        //         break;
        //     case 'MODELINVERSE':
        //         v.value = new Matrix4(mesh.matrixWorld).invert();
        //         break;
        //     case 'MODELVIEW':
        //         v.value = mesh.getModelViewMatrix(v.node, _camera);
        //         break;
        //     case 'MODELVIEWINVERSE':
        //         v.value = mesh.getModelViewMatrix(v.node, _camera).invert();
        //         break;
        //     case 'PROJECTION':
        //         v.value = mesh.getProjectionMatrix(_camera);
        //         break;
        //     case 'PROJECTIONINVERSE':
        //         v.value = new Matrix4(mesh.getProjectionMatrix(_camera)).invert();
        //         break;
        //     case 'MODELVIEWINVERSETRANSPOSE':
        //         v.value = mesh.getNormalMatrix();
        //         break;
        //     case 'VIEWPORT':
        //         v.value = new Float32Array([0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight]);
        //         break;
        //     case 'JOINTMATRIX':
        //         matricies = mesh.getJointMatrix();
        //         break;
        //     }

        //     let u;
        //     if (v[k] !== undefined) {
        //         u = v[k];
        //     } else {
        //         u = gl.getUniformLocation(mesh.program, k);
        //         if (u !== 0 && !u) {
        //             console.warn(`dont get ${k} from shader`);
        //             delete mesh.material.uniforms[k];
        //             continue;
        //         }
        //         v[k] = u;
        //     }

        //     if (v.type !== gl.SAMPLER_2D) {
        //         value = v.value || v.node;
        //     }

        //     if (value.elements) {
        //         gl[getMethod(v.type)](u, false, value.elements);
        //     } else if (matricies) {
        //         const concatArr = new Float32Array(matricies.length * 16);
        //         let i = 0;
        //         for (const m of matricies) {
        //             concatArr.set(m.elements, i * 16);
        //             i++;
        //         }

        //         gl[getMethod(v.type)](u, false, concatArr);
        //     } else {
        //         gl[getMethod(v.type)](u, ...value);
        //     }
        // }

        if (mesh.geometry.indicesBuffer) {
            gl.drawElements(mesh.mode || gl.TRIANGLES, mesh.geometry.indicesBuffer.length, mesh.geometry.indicesBuffer.BYTES_PER_ELEMENT === 4 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.mode || gl.TRIANGLES, 0, mesh.geometry.attributes.POSITION.length / 3);
        }
    }
}

export { RedCube };
