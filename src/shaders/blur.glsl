#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform vec2 offset;
uniform float level;
uniform sampler2D uTexture;

void main() 
{
    vec4 c = vec4(0);
    c += 15.0 * vec4(textureLod(uTexture, uv - offset, level).rgb * 0.1, 1.0);
    c += 16.0 * vec4(textureLod(uTexture, uv, level).rgb * 0.1, 1.0);
    c += 15.0 * vec4(textureLod(uTexture, uv + offset, level).rgb * 0.1, 1.0);
    color = c / 16.0;
}
