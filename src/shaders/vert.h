#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inUV;
layout (location = 4) in vec4 inJoint;
layout (location = 5) in vec4 inWeight;
layout (location = 3) in vec4 inTangent;
layout (location = 6) in vec4 inColor;
layout (location = 7) in vec2 inUV2;
layout (location = 8) in vec2 inUV3;
layout (location = 9) in float uMaterialID;

uniform sampler2D uTransformTex;

out vec4 vColor;
out vec2 outUV0;
out vec2 outUV2;
out vec2 outUV3;
out vec3 outPosition;
out vec4 outPositionView;
out float id;
#ifdef TANGENT
    out mat3 outTBN;
#else
    out vec3 outNormal;
#endif

struct Transform {
    mat4 model;
};
Transform fetchTransform(int id) {
    Transform t;

    // 8 texels across (0..7)
    t.model[0] = texelFetch(uTransformTex, ivec2(0, id), 0);
    t.model[1] = texelFetch(uTransformTex, ivec2(1, id), 0);
    t.model[2] = texelFetch(uTransformTex, ivec2(2, id), 0);
    t.model[3] = texelFetch(uTransformTex, ivec2(3, id), 0);

    return t;
}
uniform Matrices2 {
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