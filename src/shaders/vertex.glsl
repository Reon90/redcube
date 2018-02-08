#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inUV;

out vec2 outUV;
out vec3 outNormal;
out vec3 outPosition;

uniform Matrices {
	mat4 model;
	mat4 normalMatrix;
	mat4 view;
	mat4 projection;
};

void main() {
	outUV = inUV;
	outNormal = normalize(mat3(normalMatrix) * inNormal);
	outPosition = vec3(model * vec4(inPosition, 1.0));
	gl_Position = projection * view * model * vec4(inPosition, 1.0);
}
