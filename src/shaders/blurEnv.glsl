#version 300 es
precision highp float;

in vec2 outUV;
out vec4 color;

uniform sampler2D diffuse;
uniform float level;

void main() {
    vec2 texelSize = 1.0 / vec2(textureSize(diffuse, 0));
    vec3 result = vec3(0.0);
    for (int x = -2; x < 2; ++x) 
    {
        for (int y = -2; y < 2; ++y) 
        {
            vec2 offset = vec2(float(x), float(y)) * texelSize;
            result += textureLod(diffuse, outUV + offset, level).rgb;
        }
    }
    color = vec4(result / 16.0, 1.0);
}
