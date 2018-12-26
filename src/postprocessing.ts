import { createProgram, createTexture } from './utils';
import { Camera } from './objects/index';
import { Renderer } from './renderer';
import { SSAO } from './postprocessors/ssao';
import { Bloom } from './postprocessors/bloom';
import { Shadow } from './postprocessors/shadow';
import { Light } from './postprocessors/light';
import { PostProcessor } from './postprocessors/base';

import quadShader from './shaders/quad.glsl';
import composerShader from './shaders/composer.glsl';

let gl;

const processorsMap = {
    bloom: Bloom,
    ssao: SSAO,
    shadow: Shadow,
    light: Light
};

interface Texture extends WebGLTexture {
    index: number;
}

export class PostProcessing {
    screenTexture: Texture;
    normalTexture: Texture;
    depthTexture: Texture;
    preDepthTexture: Texture;
    fakeDepth: Texture;
    camera: Camera;
    renderer: Renderer;
    canvas: HTMLCanvasElement;
    framebuffer: WebGLFramebuffer;
    preframebuffer: WebGLFramebuffer;
    postprocessors: Array<PostProcessor>;
    VAO: WebGLBuffer;
    program: WebGLProgram;
    renderframebuffer: WebGLFramebuffer;
    MSAA: Number;
    renderScene: Function;

    constructor(processors, renderScene) {
        this.renderScene = renderScene;
        this.postprocessors = processors.map(name => new processorsMap[name]());
        this.MSAA = 4;
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    setCamera(camera) {
        this.camera = camera;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCamera(camera);
        });
    }

    setLight(light) {
        this.postprocessors.forEach(postProcessor => {
            postProcessor.light = light;
        });
    }

    setGl(g) {
        if (g) {
            gl = g;
            this.postprocessors.forEach(postProcessor => {
                postProcessor.setGL(gl);
            });
            // this.fakeDepth = this.createNoiceTexture(
            //     1,
            //     new Float32Array([1, 1, 0])
            // );
        }
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.postprocessors.forEach(postProcessor => {
            postProcessor.setCanvas(canvas);
        });
    }

    get width() {
        return this.canvas.offsetWidth * devicePixelRatio;
    }

    get height() {
        return this.canvas.offsetHeight * devicePixelRatio;
    }

    bindPrePass() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.preframebuffer);
    }

    bindPostPass() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderframebuffer);
    }

    preProcessing() {
        this.postprocessors.forEach(postProcessor =>
            postProcessor.preProcessing(this)
        );
    }

    postProcessing() {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.renderframebuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer);

        gl.readBuffer(gl.COLOR_ATTACHMENT0);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        gl.blitFramebuffer(
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height,
            gl.COLOR_BUFFER_BIT,
            gl.NEAREST
        );

        gl.readBuffer(gl.COLOR_ATTACHMENT1);
        gl.drawBuffers([gl.NONE, gl.COLOR_ATTACHMENT1]);
        gl.blitFramebuffer(
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height,
            gl.COLOR_BUFFER_BIT,
            gl.NEAREST
        );

        gl.blitFramebuffer(
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height,
            gl.DEPTH_BUFFER_BIT,
            gl.NEAREST
        );

        gl.bindVertexArray(this.VAO);
        this.postprocessors.forEach(postProcessor =>
            postProcessor.postProcessing(this)
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(this.program);

        this.postprocessors.forEach(postProcessor => {
            postProcessor.attachUniform(this.program);
        });

        gl.uniform1i(
            gl.getUniformLocation(this.program, 'original'),
            this.screenTexture.index
        );
        gl.uniform1i(
            gl.getUniformLocation(this.program, 'normal'),
            this.normalTexture.index
        );
        gl.uniform1i(
            gl.getUniformLocation(this.program, 'depth'),
            this.depthTexture.index
        );
        gl.uniform1i(
            gl.getUniformLocation(this.program, 'preDepth'),
            this.preDepthTexture.index
        );

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    createByteTexture() {
        const texture = createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.width,
            this.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        return texture;
    }

    createDefaultTexture(scale = 1) {
        const texture = createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA16F,
            this.width / scale,
            this.height / scale,
            0,
            gl.RGBA,
            gl.FLOAT,
            null
        );
        return texture;
    }

    createOneChannelTexture(scale = 1) {
        const texture = createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R8,
            this.width / scale,
            this.height / scale,
            0,
            gl.RED,
            gl.UNSIGNED_BYTE,
            null
        );
        return texture;
    }

    createDepthTexture() {
        const texture = createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.DEPTH_COMPONENT24,
            this.width,
            this.height,
            0,
            gl.DEPTH_COMPONENT,
            gl.UNSIGNED_INT,
            null
        );
        return texture;
    }

    createNoiceTexture(size, data) {
        const texture = createTexture();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGB16F,
            size,
            size,
            0,
            gl.RGB,
            gl.FLOAT,
            data
        );
        return texture;
    }

    buildScreenBuffer() {
        gl.getExtension('EXT_color_buffer_float');
        gl.getExtension('OES_texture_float_linear');

        if (this.postprocessors.length === 0) {
            return true;
        }

        const defines = this.postprocessors.map(postProcessor =>
            postProcessor.buildScreenBuffer(this)
        );
        const defineStr = defines
            .map(define => `#define ${define.name} ${define.value || 1}` + '\n')
            .join('');

        const verts = [
            1.0,
            1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            1.0,
            1.0
        ];
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        const VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        const colorRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, colorRB);
        gl.renderbufferStorageMultisample(
            gl.RENDERBUFFER,
            this.MSAA,
            gl.RGBA16F,
            this.width,
            this.height
        );

        const normalRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, normalRB);
        gl.renderbufferStorageMultisample(
            gl.RENDERBUFFER,
            this.MSAA,
            gl.RGBA16F,
            this.width,
            this.height
        );

        const depthRB = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRB);
        gl.renderbufferStorageMultisample(
            gl.RENDERBUFFER,
            this.MSAA,
            gl.DEPTH_COMPONENT24,
            this.width,
            this.height
        );

        this.renderframebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderframebuffer);
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.RENDERBUFFER,
            colorRB
        );
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT1,
            gl.RENDERBUFFER,
            normalRB
        );
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            depthRB
        );
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        this.screenTexture = this.createDefaultTexture();
        this.normalTexture = this.createDefaultTexture();
        this.depthTexture = this.createDepthTexture();

        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this.screenTexture,
            0
        );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT1,
            gl.TEXTURE_2D,
            this.normalTexture,
            0
        );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            this.depthTexture,
            0
        );
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.preframebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.preframebuffer);
        this.preDepthTexture = this.createDepthTexture();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            this.preDepthTexture,
            0
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.program = createProgram(
            quadShader.replace(/\n/, `\n${defineStr}`),
            composerShader.replace(/\n/, `\n${defineStr}`)
        );
    }

    clear() {
        console.error('implement');
    }
}
