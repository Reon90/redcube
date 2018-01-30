import { Scene, Mesh, SkinnedMesh, Camera } from './objects';
import { Matrix3, Matrix4, Vector3, Vector4, Frustum } from './matrix';
import { Events } from './events';
import { Env } from './env';
import { Parse } from './parse';
import { PostProcessing } from './postprocessing';
import { setGl, setGlEnum, getComponentType, getMethod, getAnimationComponent, getAnimationMethod, interpolation, compileShader, walk } from './utils';

let gl;

class RedCube {
    constructor(url, canvas) {
        this.reflow = true;
        this.scene = new Scene();
        this.color = [0.6, 0.6, 0.6, 1.0];
        this.url = url;
        this.host = url.substr(0, url.lastIndexOf('/') + 1);
        this.canvas = canvas;
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this._camera = new Camera;
        this._camera.props = {
            type: 'perspective', 
            perspective: {
                yfov: null,
                znear: 1,
                zfar: 2e6,
                aspectRatio: null
            }
        };
        this.zoom = 1;
        this._camera.setZ(5);

        this.glEnum = {};

        this.events = new Events(this.redraw.bind(this));
        this.cameraPosition = new Vector3([0, 0, 0.05]);

        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute('style', 'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;');
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;

        this.env = new Env;
        this.env.setCamera(this._camera);

        this.PP = new PostProcessing;
        this.PP.setCanvas(this.canvas);
        this.PP.setCamera(this._camera);

        this.parse = new Parse(url);
        this.parse.setScene(this.scene);
        this.parse.setCamera(this._camera);
        this.parse.setCanvas(this.canvas);
        this.parse.setResize(this.resize.bind(this));
    }

    init() {
        return this.parse.getJson()
            .then(this.glInit.bind(this))
            .then(this.PP.buildScreenBuffer.bind(this.PP))
            .then(this.parse.getBuffer.bind(this.parse))
            .then(this.parse.buildMesh.bind(this.parse))
            .then(this.parse.initTextures.bind(this.parse))
            .then(this.parse.buildAnimation.bind(this.parse))
            .then(this.parse.buildSkin.bind(this.parse))
            .then(this.env.createEnvironmentBuffer.bind(this.env))
            .then(this.draw.bind(this))
            .catch(console.error);
    }

    setColor(color) {
        this.color = color;
    }

    redraw(type, coordsStart, coordsMove) {
        if (type === 'zoom') {
            this.zoom = coordsStart;
            this._camera.setProjection(this.calculateProjection(this._camera.props).elements);
        }
        if (type === 'rotate') {
            const p0 = new Vector3(this.sceneToArcBall(this.canvasToWorld(...coordsStart)));
            const p1 = new Vector3(this.sceneToArcBall(this.canvasToWorld(...coordsMove)));
            const angle = Vector3.angle(p0, p1) * 2;
            if (angle < 1e-6 || isNaN(angle)) {
                return;
            }

            const v = Vector3.cross(p0, p1).normalize();
            const sin = Math.sin(angle / 2);
            const q = new Vector4([v.elements[0] * -sin, v.elements[1] * -sin, v.elements[2] * -sin, Math.cos(angle / 2)]);

            const m = new Matrix4();
            m.makeRotationFromQuaternion(q.elements);

            this.scene.matrixWorld.multiply(m);
            this.env.envMatrix.multiply(m);
        }
        if (type === 'pan') {
            const p0 = new Vector3(this.canvasToWorld(...coordsStart).elements);
            const p1 = new Vector3(this.canvasToWorld(...coordsMove).elements);
            const pan = this._camera.modelSize * 100;
            const delta = p1.subtract(p0).scale(pan);

            this.scene.matrixWorld.translate(-delta.elements[0], -delta.elements[1], 0);
        }
        if (type === 'resize') {
            this.resize();
        }
        
        this.reflow = true;
    }

    resize() {
        this.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        gl.viewport( 0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight );
        this._camera.setProjection(this.calculateProjection(this._camera.props).elements);
    }

    sceneToArcBall(pos) {
        let len = pos.elements[0] * pos.elements[0] + pos.elements[1] * pos.elements[1];
        const sz = 0.04 * 0.04 - len;
        if (sz > 0) {
            return [pos.elements[0], pos.elements[1], Math.sqrt(sz)];
        } else {
            len = Math.sqrt(len);
            return [0.04 * pos.elements[0] / len, 0.04 * pos.elements[1] / len, 0];
        }
    }

    canvasToWorld(x, y) {
        const newM = new Matrix4();
        newM.setTranslate(...this.cameraPosition.elements);
        const m = new Matrix4(this._camera.projection);
        m.multiply(newM);

        const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
        mp.elements[0] = (2 * x / this.canvas.width - 1) * mp.elements[3];
        mp.elements[1] = (-2 * y / this.canvas.height + 1) * mp.elements[3];

        return m.invert().multiplyVector4(mp);
    }

    calculateProjection(cam) {
        let proj;
        if ( cam.type === 'perspective' && cam.perspective ) {
            const {yfov} = cam.perspective;
            const aspectRatio = cam.perspective.aspectRatio || this.aspect;
            const xfov = yfov * this.aspect;

            if (this.aspect !== aspectRatio) {
                console.warn('this.canvas size and this.canvas size from scene dont equal');
            }

            proj = new Matrix4().setPerspective(xfov * this.zoom * (180 / Math.PI), this.aspect, cam.perspective.znear || 1, cam.perspective.zfar || 2e6);
        } else if ( cam.type === 'orthographic' && cam.orthographic ) {
            proj = new Matrix4().setOrtho( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, cam.orthographic.znear, cam.orthographic.zfar);
        }

        return proj;
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
        this.env.setGl(gl);
        this.PP.setGl(gl);
        this.parse.setGl(gl);
        this.parse.setGlEnum(this.glEnum);

        const shaderArr = [];
        for (const p of this.scene.program) {
            shaderArr.push(fetch(`${this.host}${p.fragmentShader}.glsl`).then(res => res.text()));
            shaderArr.push(fetch(`${this.host}${p.vertexShader}.glsl`).then(res => res.text()));
        }

        return Promise.all(shaderArr)
            .then(this.compileShader.bind(this));
    }

    compileShader(res) {
        let program;
        let i = 0;
        for (const sh of res) {
            if (!program) {
                program = gl.createProgram();
            }

            let type;
            if (/gl_Position/.test(sh)) {
                type = gl.VERTEX_SHADER;
            } else {
                type = gl.FRAGMENT_SHADER;
            }

            const index = this.scene.program[i].shaders.push(compileShader(type, sh, program));
            if (index === 2) {
                this.scene.program[i].program = program;
                gl.linkProgram(program);
                program = null;
                i++;
            }
        }

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
            const vectorC = component === 3 ? Vector3 : Vector4;
            const vector = new vectorC(startFrame.value);
            const vector2 = new vectorC(endFrame.value);

            if (v.type === 'rotation') {
                const out = new Vector4;
                out.lerp(vector.elements, vector2.elements, t);
                
                v.mesh.matrixAnimation[getAnimationMethod(v.type)](out.elements);
            } else {
                const out = new Vector3;
                out.lerp(vector.elements, vector2.elements, t);

                v.mesh.matrixAnimation[getAnimationMethod(v.type)](...out.elements);
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

        if (node instanceof SkinnedMesh || node instanceof Mesh) {
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
            this.PP.bindBuffer();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENSIL_BUFFER_BIT);

            this.env.createEnvironment();

            const blends = [];
            const nonBlends = [];
            walk(this.scene, this.setMesh.bind(this, blends, nonBlends));

            const planes = Frustum(this._camera.getViewProjMatrix());

            if (nonBlends.length) {
                for (const e in this.parse.unblendEnable) {
                    gl.enable(e);
                }
                for (const mesh of nonBlends) {
                    if (mesh.isVisible(planes)) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                }
                for (const e in this.parse.unblendEnable) {
                    gl.disable(e);
                }
            }

            if (blends.length) {
                const blendsSorted = [];
                for (const mesh of blends) {
                    if (mesh.isVisible(planes)) {
                        blendsSorted.push(mesh);
                    }
                }
                if (blendsSorted.length) {
                    blendsSorted.sort((a, b) => a.distance - b.distance);

                    for (const e in this.parse.blendEnable) {
                        gl.enable(e);
                    }
                    for (const f in this.parse.blendTechnique) {
                        gl[f](...this.parse.blendTechnique[f]);
                    }
                    for (const mesh of blendsSorted) {
                        this.buildBuffer(mesh.geometry.indicesBuffer, ...(Object.values(mesh.geometry.attributes)));
                        this._draw(mesh);
                    }
                    for (const e in this.parse.blendEnable) {
                        gl.disable(e);
                    }
                    for (const f in this.parse.blendTechnique) {
                        if (f === 'depthMask') {
                            gl[f](true);
                        }
                        if (f === 'blendFuncSeparate') {
                            gl[f](gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
                        }
                        if (f === 'blendEquationSeparate') {
                            gl[f](gl.FUNC_ADD, gl.FUNC_ADD);
                        }
                    }
                }
            }

            this.PP.postProcessing();
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

        const {_camera} = this;
        
        for (const k in mesh.geometry.attributes) {
            const v = mesh.geometry.attributes[k];

            gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer);
            
            let a;
            if (v[k] !== undefined) {
                a = v[k];
            } else {
                a = gl.getAttribLocation(mesh.program, k);
                if (a !== 0 && !a) {
                    console.warn(`dont get ${k} from shader`);
                    delete mesh.geometry.attributes[k];
                    continue;
                }
                v[k] = a;
                gl.enableVertexAttribArray(a);
            }

            gl.vertexAttribPointer(a, getComponentType(v.type), gl.FLOAT, false, 0, 0);
        }

        for (const k in mesh.material.uniforms) {
            const v = mesh.material.uniforms[k];
            let matricies, value;

            if (v.type === gl.SAMPLER_2D) {
                value = [this.parse.textures[v.value[0]].count];
            }

            switch (v.semantic) {
            case 'MODELVIEWPROJECTION':
                v.value = mesh.getModelViewProjMatrix(_camera);
                break;
            case 'MODELVIEWPROJECTIONINVERSE':
                v.value = mesh.getModelViewProjMatrix(_camera).invert();
                break;
            case 'VIEW':
                v.value = mesh.getViewMatrix(_camera);
                break;
            case 'VIEWINVERSE':
                v.value = mesh.getViewMatrix(_camera).invert();
                break;
            case 'MODEL':
                v.value = mesh.matrixWorld;
                break;
            case 'MODELINVERSETRANSPOSE':
                v.value = new Matrix3().normalFromMat4(mesh.matrixWorld);
                break;
            case 'MODELINVERSE':
                v.value = new Matrix4(mesh.matrixWorld).invert();
                break;
            case 'MODELVIEW':
                v.value = mesh.getModelViewMatrix(v.node, _camera);
                break;
            case 'MODELVIEWINVERSE':
                v.value = mesh.getModelViewMatrix(v.node, _camera).invert();
                break;
            case 'PROJECTION':
                v.value = mesh.getProjectionMatrix(_camera);
                break;
            case 'PROJECTIONINVERSE':
                v.value = new Matrix4(mesh.getProjectionMatrix(_camera)).invert();
                break;
            case 'MODELVIEWINVERSETRANSPOSE':
                v.value = mesh.getNormalMatrix();
                break;
            case 'VIEWPORT':
                v.value = new Float32Array([0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight]);
                break;
            case 'JOINTMATRIX':
                matricies = mesh.getJointMatrix();
                break;
            }

            let u;
            if (v[k] !== undefined) {
                u = v[k];
            } else {
                u = gl.getUniformLocation(mesh.program, k);
                if (u !== 0 && !u) {
                    console.warn(`dont get ${k} from shader`);
                    delete mesh.material.uniforms[k];
                    continue;
                }
                v[k] = u;
            }

            if (v.type !== gl.SAMPLER_2D) {
                value = v.value || v.node;
            }

            if (value.elements) {
                gl[getMethod(v.type)](u, false, value.elements);
            } else if (matricies) {
                const concatArr = new Float32Array(matricies.length * 16);
                let i = 0;
                for (const m of matricies) {
                    concatArr.set(m.elements, i * 16);
                    i++;
                }

                gl[getMethod(v.type)](u, false, concatArr);
            } else {
                gl[getMethod(v.type)](u, ...value);
            }
        }

        if (mesh.geometry.indicesBuffer) {
            gl.drawElements(mesh.mode, mesh.geometry.indicesBuffer.value.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(mesh.mode, 0, mesh.geometry.attributes.a_position.value.length / 3);
        }
    }
}

export { RedCube };
