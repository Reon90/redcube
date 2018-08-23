#version 300 es
precision highp float;

in vec3 localPos;
layout (location = 0) out vec4 color;

uniform samplerCube diffuse;
uniform float level;

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 SampleSphericalMap(vec3 v)
{
    vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
    uv *= invAtan;
    uv += 0.5;
    return uv;
}

void main() {		
    //vec2 uv = SampleSphericalMap(normalize(localPos));
    vec3 c = texture(diffuse, localPos).rgb;
    
    color = vec4(c, 1.0);
}
