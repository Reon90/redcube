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

out vec4 vColor;
out vec2 outUV;
out vec2 outUV2;
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
    float isShadow;
};

#ifdef JOINTNUMBER
uniform Skin {
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

    vColor = inColor;
    outUV = inUV;
    outUV2 = inUV2;
    #ifdef TANGENT
        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));
        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));
        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;
        outTBN = mat3(tangentW, bitangentW, normalW);
    #else
        outNormal = normalize(mat3(normalMatrix) * mat3(skin) * inNormal);
    #endif
    outPosition = vec3(model * skin * vec4(inPosition, 1.0));
    outPositionView = projection * light * model * skin * vec4(inPosition, 1.0);
    if (isShadow == 1.0) {
        gl_Position = projection * light * model * skin * vec4(inPosition, 1.0);
    } else {
        gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);
    }
}
