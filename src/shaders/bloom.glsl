#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D original;
uniform sampler2D position;
uniform sampler2D normal;
uniform sampler2D ssao;
uniform sampler2D bloom;

void main() {
    vec3 c = texture(original, uv).rgb;
    #ifdef BLOOM
        c += texture(bloom, uv).rgb;
    #endif
    #ifdef SSAO
        c *= texture(ssao, uv).r;
    #endif

    color = vec4(c, 1.0);
}
