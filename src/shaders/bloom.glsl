#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D uOriginal;
uniform sampler2D ssao;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;

void main() {
    vec3 c = texture(uOriginal, uv).rgb;
    #ifdef BLOOM
        vec3 vT1 = texture(uTexture1, uv).rgb;
        vec3 vT2 = texture(uTexture2, uv).rgb;
        vec3 vT3 = texture(uTexture3, uv).rgb;
        vec3 vT4 = texture(uTexture4, uv).rgb;
        c = c + vT1 + vT2 + vT3 + vT4;
    #endif
    #ifdef SSAO
        c = c * texture(ssao, uv).r;
    #endif

    color = vec4(c, 1.0);
}
