#include "./vert.h"

void main() {
    #if defined(WEBGPU)
    Transform tr = transforms.data[gl_InstanceIndex];
    #else
    Transform tr = fetchTransform(int(uMaterialID));
    #endif
    mat4 model = tr.model;

    #ifdef JOINTNUMBER
        mat4 skin = inWeight.x * joint[int(inJoint.x)];
        skin += inWeight.y * joint[int(inJoint.y)];
        skin += inWeight.z * joint[int(inJoint.z)];
        skin += inWeight.w * joint[int(inJoint.w)];
    #else
        mat4 skin = mat4(1.0);
    #endif

    #ifdef COLOR
    #ifdef COLOR_255
        vColor = inColor / 255.0;
    #else
        vColor = inColor;
    #endif
    #endif
    outUV0 = inUV;
    #ifdef MULTIUV
    outUV2 = inUV2;
    #endif
    #ifdef MULTIUV2
    outUV3 = inUV3;
    #endif
    #ifdef TANGENT
        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));
        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));
        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;
        #ifdef USERIGHTHANDEDSYSTEM
        tangentW *= 1.0; // invertX
        bitangentW *= -1.0; // invertY
        #endif
        outTBN = mat3(tangentW, bitangentW, normalW);
    #else
        outNormal = normalize(mat3(transpose(inverse(model))) * mat3(skin) * inNormal);
    #endif
    outPosition = vec3(model * skin * vec4(inPosition, 1.0));
    outPositionView = projection * light * model * skin * vec4(inPosition, 1.0);
    if (isShadow.x == 1.0) {
        gl_Position = projection * light * model * skin * vec4(inPosition, 1.0);
    } else {
        gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);
    }

    gl_PointSize = 1.0;
    #if defined(WEBGPU)
    id = gl_InstanceIndex;
    #else
    id = uMaterialID;
    #endif
}
