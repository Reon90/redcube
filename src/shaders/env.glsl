#version 300 es
precision highp float;

layout (location = 0) in vec3 pos;
layout (location = 1) in vec2 aUV;

uniform mat4 uMVPMatrix;

out vec2 uv;

void main() {
	uv = aUV;
    gl_Position = uMVPMatrix * vec4(pos, 1.0);
}
