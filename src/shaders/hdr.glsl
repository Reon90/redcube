#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D uTexture;

void main() 
{
    const float gamma = 2.2;
    const float exposure = 1.0;
    vec3 hdrColor = texture(uTexture, uv).rgb;

    vec3 mapped = vec3(1.0) - exp(-hdrColor * exposure);
    mapped = pow(mapped, vec3(1.0 / gamma));
  
    color = vec4(vec3( 1.0 ) - exp( -1.0 * hdrColor ), 1.0);
}
