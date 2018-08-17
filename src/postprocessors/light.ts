import { PostProcessor } from './base';
import { compileShader } from '../utils';

import lightShader from '../shaders/light.glsl';
import lightVertShader from '../shaders/light-vert.glsl';
import { Matrix4, Vector3 } from '../matrix';

let gl;

interface Texture extends WebGLTexture {
    index: number;
}

export class Light extends PostProcessor {
    texture: Texture;
    program: WebGLProgram;
    scale: number;
    quadVAO: WebGLVertexArrayObjectOES;

    constructor() {
        super();

        this.scale = 1;
    }

    setGL(g) {
        gl = g;
    }
    
    preProcessing(PP) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        // gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // PP.renderScene(false, false);

        gl.useProgram(this.program);
        //gl.viewport( 0, 0, this.width / 2, this.height / 2);
        gl.bindVertexArray(this.quadVAO);

        var z = 1.76*3;
        var x = new Matrix4;
        //x.setOrtho(0.076, 0.076, this.camera.props.perspective.znear, this.camera.props.perspective.zfar);
        x.makeOrthographic(-z, z, z, -z, this.camera.props.perspective.znear, this.camera.props.perspective.zfar);


        gl.uniform1f( gl.getUniformLocation(this.program, 'size'), this.camera.modelSize);
        gl.uniform1f( gl.getUniformLocation(this.program, 'zoom'), this.camera.props.zoom);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'ortho'), false, x.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Iortho'), false, new Matrix4().setInverseOf(x).elements);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Iproj'), false, new Matrix4().setInverseOf(this.camera.projection).elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'proj'), false, this.camera.projection.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Iview'), false, this.camera.matrixWorld.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'Ilight'), false, this.light.matrixWorld.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'light'), false, this.light.matrixWorldInvert.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'view'), false, this.camera.matrixWorldInvert.elements);
        gl.uniform1i( gl.getUniformLocation(this.program, 'lightTexture'), PP.preDepthTexture.index);
        gl.uniform1i( gl.getUniformLocation(this.program, 'cameraTexture'), PP.depthTexture.index);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        //gl.viewport( 0, 0, this.width, this.height);
    }

    buildScreenBuffer(PP) {
        
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.texture = PP.createOneChannelTexture(this.scale);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        this.program = gl.createProgram();
        compileShader(gl.VERTEX_SHADER, lightVertShader, this.program);
        compileShader(gl.FRAGMENT_SHADER, lightShader, this.program);
        gl.linkProgram(this.program);

        const verts = [
            1.0, 1.0,
            -1.0, 1.0,
            -1.0, -1.0,
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ];
        this.quadVAO = gl.createVertexArray();
        gl.bindVertexArray(this.quadVAO);
        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return {name: 'LIGHT'};
    }

    attachUniform(program) {
        gl.uniform1i( gl.getUniformLocation(program, 'light'), this.texture.index);
    }

    postProcessing() {}
}
