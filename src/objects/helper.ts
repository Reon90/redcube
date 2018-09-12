import { Object3D } from './object3d';
import { createProgram } from '../utils';
import { Matrix4 } from '../matrix';

import vertexShader from '../shaders/base.vert';
import fragmentShader from '../shaders/base.frag';

export class Arrow extends Object3D {
    VAO: WebGLBuffer;
    program: WebGLProgram;
    visible: boolean;

    constructor(gl, parent, verts) {
        super('arrow', parent);

        this.visible = true;
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        const VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        this.program = createProgram(vertexShader, fragmentShader);
    }

    draw(gl, {camera}) {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.VAO);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'proj'), false, camera.projection.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'view'), false, camera.matrixWorldInvert.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'model'), false, new Matrix4().elements);

        gl.drawArrays(gl.LINES, 0, 2);
    }
}
