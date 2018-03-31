#version 300 es
precision highp float;

in vec2 outUV;
layout (location = 0) out vec4 color;
layout (location = 3) out vec4 hdr;

uniform sampler2D diffuse;
uniform float level;

const vec3 hdrColor = vec3(0.2126, 0.7152, 0.0722);

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

    float brightness = dot(color.rgb, hdrColor);
    if (brightness > 1.0) {
        hdr = vec4(color.rgb, 1.0);
    } else {
        hdr = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
