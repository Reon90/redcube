#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inUV;
layout (location = 3) in vec4 inJoint;
layout (location = 4) in vec4 inWeight;
layout (location = 5) in vec4 inTangent;

out vec2 outUV;
out vec3 outPosition;
out vec3 outPositionView;
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

    outUV = inUV;
    #ifdef TANGENT
        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));
        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));
        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;
        outTBN = mat3(tangentW, bitangentW, normalW);
    #else
        outNormal = normalize(mat3(normalMatrix) * mat3(skin) * inNormal);
    #endif
    outPosition = vec3(model * skin * vec4(inPosition, 1.0));
    outPositionView = vec3(view * model * skin * vec4(inPosition, 1.0));
    gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);
}
