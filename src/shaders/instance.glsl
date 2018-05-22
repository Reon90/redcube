#version 300 es
precision highp float;

layout (location = 0) in vec2 inPosition;

uniform mat4 MVPMatrix;

void main() {
    gl_PointSize = 3.0;
    gl_Position = MVPMatrix * vec4(inPosition, 0.0, 1.0);
}
