#version 460
precision highp float;

layout(location = 0) in vec2 inuv;
layout(location = 0) out vec4 color;

layout(set = 0, binding = 0) uniform texture2D original;
layout(set = 0, binding = 1) uniform texture2D position;
layout(set = 0, binding = 2) uniform texture2D normal;
layout(set = 0, binding = 3) uniform texture2D ssao;
layout(set = 0, binding = 4) uniform texture2D bloom;
layout(set = 0, binding = 5) uniform texture2D depth;
layout(set = 0, binding = 6) uniform texture2D preDepth;
layout(set = 0, binding = 7) uniform texture2D light;
layout(set = 0, binding = 8) uniform texture2D scattering;
layout(set = 0, binding = 9) uniform texture2D spec;
layout(set = 0, binding = 10) uniform sampler baseSampler;

const float gamma = 2.2;

void main() {
    vec2 uv = inuv;
    uv.y = 1.0 - inuv.y;
    vec3 c = texture(sampler2D(original, baseSampler), uv).rgb;
    #ifdef BLOOM
        c += texture(sampler2D(bloom, baseSampler), uv).rgb;
    #endif
    #ifdef SSAO
        c *= texture(sampler2D(ssao, baseSampler), uv).r;
    #endif
    #ifdef LIGHT
        c += texture(sampler2D(light, baseSampler), uv).r;
    #endif
    #ifdef SCATTERING
        c = texture(sampler2D(scattering, baseSampler), uv).rgb;
        c += texture(sampler2D(spec, baseSampler), uv).rgb;
    #endif

    c.rgb = pow(c.rgb, vec3(1.0 / gamma));

    color = vec4(c, 1.0);
}
