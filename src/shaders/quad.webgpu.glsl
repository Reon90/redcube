#version 460
layout (location = 0) in vec2 pos;

layout (location = 0) out vec2 uv;

void main() {
    uv = pos * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;
    gl_Position = vec4(pos, 0.0, 1.0); 
}
