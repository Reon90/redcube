#version 300 es
precision highp float;

layout (location = 0) in vec3 pos;

uniform mat4 view;
uniform mat4 model;
uniform mat4 proj;

void main() {
	gl_Position = proj * view * model * vec4(pos, 1.0);
}
