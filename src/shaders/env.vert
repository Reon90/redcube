#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;

uniform mat4 projection;
uniform mat4 view;

out vec3 outUV;

void main() {
	outUV = inPosition;
    mat4 rotView = mat4(mat3(view));
    gl_Position = projection * rotView * vec4(inPosition, 1.0);
}
