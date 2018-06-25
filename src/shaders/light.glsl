#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform sampler2D lightTexture;
uniform sampler2D cameraTexture;

void main() {
    float lightDepth = texture(lightTexture, uv).r;
    float cameraDepth = texture(cameraTexture, uv).r;
    color = vec4(vec3(1.0 - (cameraDepth > lightDepth ? 1.0 : 0.0)), 1.0);
}
