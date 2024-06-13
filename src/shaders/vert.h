#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inUV;
layout (location = 3) in vec4 inJoint;
layout (location = 4) in vec4 inWeight;
layout (location = 5) in vec4 inTangent;
layout (location = 6) in vec4 inColor;
layout (location = 7) in vec2 inUV2;
layout (location = 8) in vec2 inUV3;

out vec4 vColor;
out vec2 outUV0;
out vec2 outUV2;
out vec2 outUV3;
out vec3 outPosition;
out vec4 outPositionView;
#ifdef TANGENT
    out mat3 outTBN;
#else
    out vec3 outNormal;
#endif

uniform Matrices {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
};

#ifdef JOINTNUMBER
uniform Skin {
    mat4 joint[JOINTNUMBER];
};
#endif