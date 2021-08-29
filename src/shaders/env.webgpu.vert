#version 460
precision highp float;

layout (location = 0) in vec3 inPosition;

layout(set = 0, binding = 0) uniform Uniforms {
    vec4 index;
    mat4 projection;
    mat4 view[6];
} uniforms;


layout (location = 0) out vec3 outUV;

void main() {
	outUV = inPosition;
    mat4 rotView = mat4(mat3(uniforms.view[int(uniforms.index.x)]));
    gl_Position = uniforms.projection * rotView * vec4(inPosition, 1.0);
}
