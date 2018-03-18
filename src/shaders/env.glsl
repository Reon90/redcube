#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;

uniform mat4 MVPMatrix;

out vec2 outUV;

void main() {
	outUV = inUV;
    gl_Position = MVPMatrix * vec4(inPosition, 1.0);
}
