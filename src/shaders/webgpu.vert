#version 460
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUv;
layout (location = 2) in vec3 inNormal;
#ifdef JOINTNUMBER
layout (location = 4) in vec4 inJoint;
layout (location = 5) in vec4 inWeight;
#endif
#ifdef TANGENT
layout (location = 3) in vec4 inTangent;
#endif
#ifdef COLOR
layout (location = 6) in vec4 inColor;
#endif
#ifdef MULTIUV
layout (location = 7) in vec2 inUV2;
#endif

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

#ifdef JOINTNUMBER
layout(set = 0, binding = 22) uniform Skin {
    mat4 joint[JOINTNUMBER];
};
#endif

void main() {
    #ifdef JOINTNUMBER
        mat4 skin = inWeight.x * joint[int(inJoint.x)];
        skin += inWeight.y * joint[int(inJoint.y)];
        skin += inWeight.z * joint[int(inJoint.z)];
        skin += inWeight.w * joint[int(inJoint.w)];
    #else
        mat4 skin = mat4(1.0);
    #endif

    #ifdef TANGENT
    vec3 normalW = normalize(vec3(uniforms.model * vec4(inNormal.xyz, 0.0)));
    vec3 tangentW = normalize(vec3(uniforms.model * vec4(inTangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;
    outTBN = mat3(tangentW, bitangentW, normalW);
    #else
    outTBN = mat3(vec3(0), vec3(0), normalize(mat3(uniforms.normalMatrix) * mat3(skin) * inNormal));
    #endif

    gl_Position = uniforms.projection * uniforms.view * uniforms.model * skin * vec4(inPosition, 1.0);
    outPosition = vec3(uniforms.model * skin * vec4(inPosition, 1.0));
    outUV0 = inUv;
    #ifdef MULTIUV
    outUV2 = inUV2;
    #endif
    #ifdef COLOR
    vColor = inColor;
    #else
    vColor = vec4(1);
    #endif
}