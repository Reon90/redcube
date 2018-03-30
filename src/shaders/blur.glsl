#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform vec2 denom;
uniform sampler2D uTexture;

const float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main() {             
    vec2 offset = 1.0 / vec2(textureSize(uTexture, 0));
    vec3 result = texture(uTexture, uv).rgb * weight[0];

    for (int i = 1; i < 5; ++i) {
        result += texture(uTexture, uv + denom * (offset * float(i))).rgb * weight[i];
        result += texture(uTexture, uv - denom * (offset * float(i))).rgb * weight[i];
    }

    color = vec4(result, 1.0);
}
