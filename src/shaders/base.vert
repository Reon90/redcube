#version 300 es
precision highp float;

layout (location = 0) in vec3 pos;

uniform Matrices {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    float isShadow;
};

void main() {
	gl_Position = projection * view * model * vec4(pos, 1.0);
}
