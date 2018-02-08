#version 300 es
precision highp float;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inUV;
layout (location = 3) in vec4 inJoint;
layout (location = 4) in vec4 inWeight;

out vec2 outUV;
out vec3 outNormal;
out vec3 outPosition;

uniform Matrices {
	mat4 model;
	mat4 normalMatrix;
	mat4 view;
	mat4 projection;
	mat4 joint[2];
};

void main() {
	mat4 skin = inWeight.x * joint[int(inJoint.x)];
	skin += inWeight.y * joint[int(inJoint.y)];
	skin += inWeight.z * joint[int(inJoint.z)];
	skin += inWeight.w * joint[int(inJoint.w)];

	outUV = inUV;
	outNormal = normalize(mat3(normalMatrix) * mat3(skin) * inNormal);
	outPosition = vec3(model * skin * vec4(inPosition, 1.0));
	gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);
}
