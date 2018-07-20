#version 300 es
precision highp float;

layout (location = 0) in vec2 pos;

out vec2 uv;
out vec4 pos1;
out vec4 pos2;

uniform mat4 proj;
uniform mat4 light;

const float N = -2.8311319764089067;
const float F = -5.778493839936308;

vec4 lerp(vec4 a, vec4 b, float t) {
    return a + t * (b - a);
}

void main() {
    pos1 = proj * light * vec4(pos * 1.0, N, 1.0);
    pos2 = proj * light * vec4(pos * 1.0, F, 1.0);

    uv = pos * 0.5 + 0.5;
    gl_Position = vec4(pos, 0.0, 1.0);
}
