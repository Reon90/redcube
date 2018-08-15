#version 300 es
precision highp float;

layout (location = 0) in vec2 pos;

out vec2 uv;
out vec4 tPos1;
out vec4 tPos2;
out vec4 vPosLight1;
out vec4 vPosLight2;

uniform mat4 proj;
uniform mat4 light;
uniform mat4 view;

const float N = -1.45;
const float F = 1.45;

void main() {
    tPos1 = proj * view * vec4(pos * 1.0, N, 1.0);
    tPos2 = proj * view * vec4(pos * 1.0, F, 1.0);

	vPosLight1 = proj * light * vec4(pos * 1.0, N, 1.0);
    vPosLight2 = proj * light * vec4(pos * 1.0, F, 1.0);
	
	uv = pos * 0.5 + 0.5;
	gl_Position = vec4(pos, 0.0, 1.0);
}

// gl_Position = proj * view * Iview * Iproj * tPos1;