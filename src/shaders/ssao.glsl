#version 300 es
precision highp float;

in vec2 uv;
out float color;

const int samples = 64;
const float radius = 2.5;
const float bias = -0.5;
const float power = 1.0;
const float zFar = 40.0;
const float zNear = 1.0; 

uniform sampler2D normBuff;
uniform sampler2D posBuff;
uniform sampler2D depthBuff;
uniform sampler2D randMap;
uniform vec2 scr;
uniform vec3 rndTable[samples];
uniform mat4 proj;

void main() {
	float depth = texture(depthBuff, uv).x;
	depth = (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
	if (depth==1.0) {
		discard;
	}

	vec3 pos = texture(posBuff, uv).xyz;
	vec3 normal = normalize(texture(normBuff, uv).xyz);
	vec3 rvec = normalize(texture(randMap, uv*scr).xyz);

	vec3 tangent = normalize(rvec-normal * dot(rvec, normal));
	vec3 bitangent = cross(tangent, normal);
	mat3 rotate = mat3(tangent, bitangent, normal);

	float occlusion  = 0.0;
	for (int i = 0; i < samples; i++) {
		vec3 samplePos = rotate * rndTable[i];
		samplePos = pos + samplePos * radius;

		vec4 shift = proj * vec4(samplePos, 1.0);
		shift.xy /= shift.w;
		shift.xy = shift.xy * 0.5 + 0.5;

		float sampleDepth = texture(posBuff, shift.xy).z;

		float distanceCheck = smoothstep(0.0, 1.0, radius / abs(pos.z - sampleDepth));
		occlusion  += (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0) * distanceCheck;
	}

	occlusion = (occlusion / float(samples));
	color = pow(occlusion, power);
}
