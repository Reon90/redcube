#version 460
precision highp float;

layout (location = 0) in vec3 outUV;
layout (location = 0) out vec4 color;

layout(set = 0, binding = 1) uniform sampler baseSampler;
layout(set = 0, binding = 2) uniform texture2D diffuse;

const vec2 invAtan = vec2(0.1591, 0.3165);
vec2 SampleSphericalMap(vec3 v) {
    vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
    uv *= invAtan;
    uv += 0.5;
    return uv;
}

void main() {		
    vec2 uv = SampleSphericalMap(normalize(outUV));
    vec3 c = texture(sampler2D(diffuse, baseSampler), uv).rgb;
    
    color = vec4(c, 1.0);
}
