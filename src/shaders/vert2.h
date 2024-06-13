#version 460
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inUV;
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
layout (location = 8) in vec2 inUV3;
#endif

layout(location = 0) out vec2 outUV0;
layout(location = 1) out vec2 outUV2;
layout(location = 8) out vec2 outUV3;
layout(location = 2) out vec3 outPosition;
layout(location = 3) out vec4 vColor;
layout(location = 4) out mat3 outTBN;
layout(location = 7) out vec4 outPositionView;

layout(set = 0, binding = 0) uniform Uniforms {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
};

#ifdef JOINTNUMBER
layout(set = 0, binding = 22) uniform Skin {
    mat4 joint[JOINTNUMBER];
};
#endif