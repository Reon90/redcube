#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_velocity;
layout(location = 2) in float a_spawntime;
layout(location = 3) in float a_lifetime;

out vec2 v_position;
out vec2 v_velocity;
out float v_spawntime;
out float v_lifetime;

uniform float u_time;
uniform vec2 acceleration;
uniform mat4 MVPMatrix;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    if (a_spawntime == 0.0 || (u_time - a_spawntime > a_lifetime) || a_position.y < -0.5) {
        // Generate a new particle
        v_position = vec2(0.0, 0.0);
        v_velocity = vec2(rand(vec2(gl_InstanceID, 0.0)) - 0.5, rand(vec2(gl_InstanceID, gl_InstanceID)));
        v_spawntime = u_time;
        v_lifetime = 5000.0;
    } else {
        v_velocity = a_velocity + 0.01 * acceleration;
        v_position = a_position + 0.01 * v_velocity;
        v_spawntime = a_spawntime;
        v_lifetime = a_lifetime;
    }

    gl_PointSize = 3.0;
    gl_Position =  MVPMatrix * vec4(a_position, 0.0, 1.0);
}
