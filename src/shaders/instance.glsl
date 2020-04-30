#version 300 es
precision highp float;
precision highp sampler3D;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_velocity;
layout(location = 2) in float a_spawntime;
layout(location = 3) in float a_lifetime;
out float depth;

uniform sampler2D light;
uniform mat4 MVPMatrix;
uniform float u_time;

out float alpha;

void main() {
    gl_PointSize = 2.0;
    vec4 point = vec4(a_position, 1.0);
    vec2 uv = (point.xy / point.w) * 0.5 + 0.5;
    float life = a_lifetime - (u_time - a_spawntime);
    alpha = 1.0;
    if (life < 1000.0) {
        alpha = life / 1000.0;
    }
    depth = texture(light, uv).r;
    gl_Position = point;
}
