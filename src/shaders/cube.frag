#version 300 es
precision highp float;

in vec3 outUV;
layout (location = 0) out vec4 color;

uniform sampler2D diffuse;

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 SampleSphericalMap(vec3 v) {
    vec2 uv = vec2(atan(v.y, v.x), asin(v.z));
    uv *= invAtan;
    uv += 0.5;
    return uv;
}

void main() {		
    vec2 uv = SampleSphericalMap(normalize(outUV));
    vec3 c = texture(diffuse, uv).rgb;
    
    color = vec4(c, 1.0);
}
