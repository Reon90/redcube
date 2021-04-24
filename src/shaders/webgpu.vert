#version 450
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUv;
layout (location = 2) in vec3 inNormal;
// layout (location = 4) in vec4 inJoint;
// layout (location = 5) in vec4 inWeight;
layout (location = 3) in vec4 inTangent;
// layout (location = 6) in vec4 inColor;
// layout (location = 7) in vec2 inUV2;

layout(location = 0) out vec2 outUV0;
layout(location = 1) out vec2 outUV2;
layout(location = 4) out mat3 outTBN;
layout(location = 2) out vec3 outPosition;
layout(location = 3) out vec4 vColor;

layout(set = 0, binding = 0) uniform Uniforms {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
} uniforms;

void main() {
    vec3 normalW = normalize(vec3(uniforms.model * vec4(inNormal.xyz, 0.0)));
    vec3 tangentW = normalize(vec3(uniforms.model * vec4(inTangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;
    outTBN = mat3(tangentW, bitangentW, normalW);

    gl_Position = uniforms.projection * uniforms.view * uniforms.model * vec4(inPosition, 1.0);
    outPosition = vec3(uniforms.model * vec4(inPosition, 1.0));
    outUV0 = inUv;
    outUV2 = inUv;
    vColor = vec4(1);
}