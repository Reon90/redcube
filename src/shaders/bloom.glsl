#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D diff;

const vec3 hdrColor = vec3(0.2126, 0.7152, 0.0722);
const float brightnessThreshold = 0.8;

void main() {
    vec3 c = texture(diff, uv).rgb;
    float brightness = dot(c, hdrColor);
    if (brightness > brightnessThreshold) {
        color = vec4(c, 1.0);
    } else {
        color = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
