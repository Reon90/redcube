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

void main() 
{
    vec4 vOriginal = texture(uOriginal, uv);
    vec4 vT1 = texture(uTexture1, uv);
    vec4 vT2 = texture(uTexture2, uv);
    vec4 vT3 = texture(uTexture3, uv);
    vec4 vT4 = texture(uTexture4, uv);
    vec4 c = vOriginal + vT1 + vT2 + vT3 + vT4;
    color = vec4(c.rgb * texture(ssao, uv).r, 1.0);
}
