import { compileShader, getTextureIndex, calculateProjection } from './utils';
import { Matrix4, Vector3 } from './matrix';
import { Camera } from './objects';

import vertex from './shaders/env.vert';
import cube from './shaders/cube.frag';
import irradiance from './shaders/irradiance.frag';
import cubeMipmap from './shaders/cube-mipmap.frag';
import bdrf from './shaders/bdrf.frag';
import quad from './shaders/quad.glsl';

let gl;

interface Texture extends WebGLTexture {
    count: number;
    data: WebGLBuffer;
}
interface FrameBuffer extends WebGLFramebuffer {
    size: number;
}

export class Env {
    _camera: Camera;
    envMatrix: Matrix4;
    VAO: WebGLBuffer;
    quadVAO: WebGLBuffer;
    IndexBufferLength: number;
    cubeprogram: WebGLProgram;
    irradianceprogram: WebGLProgram;
    mipmapcubeprogram: WebGLProgram;
    bdrfprogram: WebGLProgram;
    level: WebGLUniformLocation;
    diffuse: WebGLUniformLocation;
    MVPMatrix: WebGLUniformLocation;
    texture: Texture;
    irradiancemap: Texture;
    prefilterMap: Texture;
    framebuffer: FrameBuffer;
    irradiancebuffer: FrameBuffer;
    prefilterbuffer: FrameBuffer;
    views: Array<Matrix4>;
    map: Texture;
    brdfLUTTexture: Texture;
    prefilterrender: WebGLRenderbuffer;
    brdfbuffer: FrameBuffer;
    canvas: HTMLCanvasElement;

    constructor() {
        this.envMatrix = new Matrix4;
    }

    setCamera(camera) {
        this._camera = camera;
    }

    setGl(g) {
        gl = g;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }

    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }

    draw() {
        const m = new Matrix4;
        const cam = Object.assign({}, this._camera.props, {
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        gl.enable(gl.CULL_FACE);
        const program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, `#version 300 es
        precision highp float;
        
        layout (location = 0) in vec3 inPosition;
        
        out vec3 outUV;

        uniform mat4 projection;
        uniform mat4 view;
        
        void main() {
            outUV = inPosition;
            gl_Position = projection * view * vec4(inPosition, 1.0);
        }
        `, program);
        compileShader(gl.FRAGMENT_SHADER, `#version 300 es
        precision highp float;
        
        in vec3 outUV;
        layout (location = 0) out vec4 color;

        uniform samplerCube environmentMap;
        
        void main() {
            vec3 c = texture(environmentMap, outUV).rgb;
            
            color = vec4(c, 1.0);
        }
        `, program);
        gl.linkProgram(program);
        gl.useProgram(program);
        gl.bindVertexArray(this.VAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), false, m.elements);
        gl.uniform1i(gl.getUniformLocation(program, 'environmentMap'), this.prefilterMap.count);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'view'), false, this._camera.matrixWorldInvert.elements);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    createEnvironment() {
        gl.enable(gl.CULL_FACE);
        const m = new Matrix4;
        const cam = Object.assign({}, this._camera.props, {
            perspective: {
                yfov: Math.PI / 2,
                znear: 0.01,
                zfar: 10000
            }
        });
        m.multiply(calculateProjection(cam));

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.useProgram(this.cubeprogram);
            gl.bindVertexArray(this.VAO);
            gl.viewport(0, 0, this.framebuffer.size, this.framebuffer.size);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.cubeprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.cubeprogram, 'diffuse'), this.texture.count);

            for (let i = 0; i < 6; i++) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.map, 0);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.cubeprogram, 'view'), false, this.views[i].elements);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.irradiancebuffer);
            gl.useProgram(this.irradianceprogram);
            gl.bindVertexArray(this.VAO);
            gl.viewport(0, 0, this.irradiancebuffer.size, this.irradiancebuffer.size);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.irradianceprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.irradianceprogram, 'environmentMap'), this.map.count);
            for (let i = 0; i < 6; i++) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.irradiancemap, 0);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.irradianceprogram, 'view'), false, this.views[i].elements);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.prefilterbuffer);
            gl.useProgram(this.mipmapcubeprogram);
            gl.bindVertexArray(this.VAO);

            gl.uniformMatrix4fv(gl.getUniformLocation(this.mipmapcubeprogram, 'projection'), false, m.elements);
            gl.uniform1i(gl.getUniformLocation(this.mipmapcubeprogram, 'environmentMap'), this.map.count);
            const maxMipLevels = 5;
            for (let mip = 0; mip < maxMipLevels; ++mip) {
                const mipWidth  = this.prefilterbuffer.size * Math.pow(0.5, mip);
                const mipHeight = this.prefilterbuffer.size * Math.pow(0.5, mip);

                gl.viewport(0, 0, mipWidth, mipHeight);
                const roughness = mip / (maxMipLevels - 1);
                gl.uniform1f(gl.getUniformLocation(this.mipmapcubeprogram, 'roughness'), roughness);

                for (let i = 0; i < 6; i++) {
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.prefilterMap, mip);
                    gl.uniformMatrix4fv(gl.getUniformLocation(this.mipmapcubeprogram, 'view'), false, this.views[i].elements);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 36);
                }
            }

            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.brdfbuffer);
            gl.useProgram(this.bdrfprogram);
            gl.bindVertexArray(this.quadVAO);
            gl.viewport(0, 0, this.brdfbuffer.size, this.brdfbuffer.size);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.brdfLUTTexture, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindVertexArray(null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        gl.disable(gl.CULL_FACE);
        gl.viewport(0, 0, this.width, this.height);
    }

    createEnvironmentBuffer() {
        {
            const size = 32;
            const captureFBO = gl.createFramebuffer();
            this.irradiancebuffer = captureFBO;
            this.irradiancebuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const count = getTextureIndex();
            const texture = gl.createTexture();
            texture.count = count;
            gl.activeTexture(gl[`TEXTURE${count}`]);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, 0);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            this.irradiancemap = texture;
        }

        {
            const size = 512;
            const captureFBO = gl.createFramebuffer();
            this.framebuffer = captureFBO;
            this.framebuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const count = getTextureIndex();
            const texture = gl.createTexture();
            texture.count = count;
            gl.activeTexture(gl[`TEXTURE${count}`]);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, 0);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            this.map = texture;
        }

        {
            const size = 128;
            const captureFBO = gl.createFramebuffer();
            this.prefilterbuffer = captureFBO;
            this.prefilterbuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const count = getTextureIndex();
            const texture = gl.createTexture();
            texture.count = count;
            gl.activeTexture(gl[`TEXTURE${count}`]);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, texture, i);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            this.prefilterMap = texture;
        }

        {
            const size = 512;
            const captureFBO = gl.createFramebuffer();
            this.brdfbuffer = captureFBO;
            this.brdfbuffer.size = size;
            gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

            const count = getTextureIndex();
            const texture = gl.createTexture();
            texture.count = count;
            gl.activeTexture(gl[`TEXTURE${count}`]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, size, size, 0, gl.RG, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            this.brdfLUTTexture = texture;

            const verts = [
                -1.0, 1.0,
                -1.0, -1.0,
                1.0, 1.0,
                1.0, -1.0,
            ];
            this.quadVAO = gl.createVertexArray();
            gl.bindVertexArray(this.quadVAO);
            const quadVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            gl.bindVertexArray(null);
        }

        const views = [
            [new Vector3([0, 1, 0]), Math.PI / 2], // Right
            [new Vector3([0, 1, 0]), -Math.PI / 2], // Left
            [new Vector3([1, 0, 0]), -Math.PI / 2], // Top
            [new Vector3([1, 0, 0]), Math.PI / 2], // Bottom
            [new Vector3([0, 1, 0]), Math.PI], // Front
            [new Vector3([0, 1, 0]), 0], // Back
        ];
        this.views = views.map((view, i) => {
            const camMatrix = new Matrix4;
            camMatrix.makeRotationAxis(view[0], view[1]);

            if (i !== 2 && i !== 3) {
                const m = new Matrix4;
                m.makeRotationAxis(new Vector3([0, 0, 1]), Math.PI);
                camMatrix.multiply(m);
            }

            camMatrix.multiply(this._camera.matrix);
            return new Matrix4().setInverseOf(camMatrix);
        });

        const verts = [         
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
    
            -1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,
    
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
    
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
    
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
    
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0
        ];

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        {
            const VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        }
        gl.bindVertexArray(null);

        this.cubeprogram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, vertex, this.cubeprogram);
        compileShader(gl.FRAGMENT_SHADER, cube, this.cubeprogram);
        gl.linkProgram(this.cubeprogram);

        this.irradianceprogram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, vertex, this.irradianceprogram);
        compileShader(gl.FRAGMENT_SHADER, irradiance, this.irradianceprogram);
        gl.linkProgram(this.irradianceprogram);

        this.mipmapcubeprogram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, vertex, this.mipmapcubeprogram);
        compileShader(gl.FRAGMENT_SHADER, cubeMipmap, this.mipmapcubeprogram);
        gl.linkProgram(this.mipmapcubeprogram);

        this.bdrfprogram = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, quad, this.bdrfprogram);
        compileShader(gl.FRAGMENT_SHADER, bdrf, this.bdrfprogram);
        gl.linkProgram(this.bdrfprogram);

        return fetch(`../royal_esplanade_1k.bin`).then(res => res.arrayBuffer()).then(buffer => {
            const data = new Float32Array(buffer);

            const index = getTextureIndex();
            this.texture = {
                data: gl.createTexture(),
                count: index
            };
            gl.activeTexture(gl[`TEXTURE${this.texture.count}`]);
            gl.bindTexture(gl.TEXTURE_2D, this.texture.data);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 1024, 512, 0, gl.RGBA, gl.FLOAT, data);

            this.createEnvironment();

            return true;
        });
    }
}
