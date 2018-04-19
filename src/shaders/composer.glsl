#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D original;
uniform sampler2D position;
uniform sampler2D normal;
uniform sampler2D ssao;
uniform sampler2D bloom;

const float gamma = 2.2;

void main() {
    vec3 c = texture(original, uv).rgb;
    #ifdef BLOOM
        c += texture(bloom, uv).rgb;
    #endif
    #ifdef SSAO
        c *= texture(ssao, uv).r;
    #endif

    c.rgb = pow(c.rgb, vec3(1.0 / gamma));

    color = vec4(c, 1.0);
}
