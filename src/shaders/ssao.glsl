#version 300 es
precision highp float;

in vec2 uv;
out float color;

const int kernelSize = 32;
const float radius = 2.5;
const float bias = 1.0;
const float power = 2.0;

uniform sampler2D normBuff;
uniform sampler2D depthBuff;
uniform sampler2D noice;
uniform vec2 noiseScale;
uniform vec3 kernels[kernelSize];
uniform mat4 proj;
uniform mat4 projI;
uniform float zFar;
uniform float zNear;

vec3 getPositionFromDepth(float depth) {
	vec4 clipSpaceLocation = vec4(0.0);
	clipSpaceLocation.xy = uv * 2.0 - 1.0;
	clipSpaceLocation.z = depth * 2.0 - 1.0;;
	clipSpaceLocation.w = 1.0;
	vec4 homogenousLocation = projI * clipSpaceLocation;
	homogenousLocation.xyz = homogenousLocation.xyz / homogenousLocation.w;
	return homogenousLocation.xyz;
}

void main() {
	float depth = texture(depthBuff, uv).x;
	if ((2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear)) > 0.99) {
		discard;
	}

	vec3 pos = getPositionFromDepth(depth);
	vec3 normal = normalize(texture(normBuff, uv).xyz);
	vec3 rvec = normalize(texture(noice, uv * noiseScale).xyz);

	vec3 tangent = normalize(rvec - normal * dot(rvec, normal));
	vec3 bitangent = cross(tangent, normal);
	mat3 rotate = mat3(tangent, bitangent, normal);

	float occlusion  = 0.0;
	for (int i = 0; i < kernelSize; i++) {
		vec3 samplePos = rotate * kernels[i];
		samplePos = pos + samplePos * radius;

		vec4 shift = proj * vec4(samplePos, 1.0);
		shift.xy /= shift.w;
		shift.xy = shift.xy * 0.5 + 0.5;

		float sampleDepth = getPositionFromDepth(texture(depthBuff, shift.xy).r).z;

		float distanceCheck = smoothstep(0.0, 1.0, radius / abs(pos.z - sampleDepth));
		occlusion  += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0) * distanceCheck;
	}

	occlusion = 1.0 - (occlusion / float(kernelSize));
	color = pow(occlusion, power);
}
