#version 300 es
precision highp float;

in vec2 uv;
// in vec4 tPos1;
// in vec4 tPos2;
in vec4 vPosLight1;
in vec4 vPosLight2;
out float color;

uniform sampler2D lightTexture;
uniform sampler2D cameraTexture;

uniform mat4 proj;
uniform mat4 light;
uniform mat4 view;

const int samples = 80;

void main() {
    float stp = 1.0/float(samples);
	float k = 0.0;
    float d = 0.0;

    for (int i = 0; i < samples; i++) {

        //vec4 vPos = mix(tPos1,tPos2,k);
        vec4 vPosLight = mix(vPosLight1,vPosLight2,k);
        k += stp;

        vec3 ShadowTexC = (vPosLight.xyz/vPosLight.w) * 0.5 + 0.5;

        float add = step(texture(lightTexture, ShadowTexC.xy).x, ShadowTexC.z);
        d += add*stp;
	}

    color = min((1.0 - d), 0.2);
}
