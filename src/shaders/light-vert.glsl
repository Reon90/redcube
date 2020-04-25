#version 300 es
precision highp float;

layout (location = 0) in vec2 pos;

out vec2 uv;
out vec4 vPosLight1;
out vec4 vPosLight2;
out vec3 outPositionView;
out vec3 outPositionLight;

uniform mat4 proj;
uniform mat4 light;
uniform mat4 Iproj;
uniform mat4 Iview;
uniform mat4 view;

void main() {
    vec4 p1 = Iview * Iproj * vec4(pos, -1.0/16.0, 1.0);
    vec4 p2 = Iview * Iproj * vec4(pos, 1.0/16.0, 1.0);

	vPosLight1 = proj * light * p1;
    vPosLight2 = proj * light * p2;
    outPositionLight = vec3(light * p1);
    outPositionView = vec3(view * p1);

	uv = pos * 0.5 + 0.5;
	gl_Position = vec4(pos, 0.0, 1.0);
}
