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
uniform mat4 Iproj;
uniform mat4 Iview;
uniform mat4 ortho;
uniform float zoom;
uniform float size;

void main() {
    float N = -size/2.0;
    float F = size/2.0;
    float XY = size;

    vec4 p1 = Iview * Iproj * vec4(pos, -1.0/4.0, 1.0);
    vec4 p2 = Iview * Iproj * vec4(pos, 1.0/4.0, 1.0);

    tPos1 = proj * view * p1;
    tPos2 = proj * view * p2;

	vPosLight1 = ortho * light * p1;
    vPosLight2 = ortho * light * p2;
	
	uv = pos * 0.5 + 0.5;
	gl_Position = vec4(pos, 0.0, 1.0);
}

// gl_Position = proj * view * Iview * Iproj * tPos1;