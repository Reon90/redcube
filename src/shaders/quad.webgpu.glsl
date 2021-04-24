#version 450
layout (location = 0) in vec2 pos;

layout (location = 0) out vec2 uv;

void main() {
    uv = pos * 0.5 + 0.5;
    gl_Position = vec4(pos, 0.0, 1.0); 
}
