#version 300 es
precision highp float;
precision highp sampler3D;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_velocity;
layout(location = 2) in float a_spawntime;
layout(location = 3) in float a_lifetime;

out vec3 v_position;
out vec3 v_velocity;
out float v_spawntime;
out float v_lifetime;

uniform float u_time;
uniform sampler3D noize;
uniform float count;

float rand(vec3 co) {
    return texture(noize, co).r;
}

const float lifetime = 15000.0;
const vec3 center = vec3(0.5, 0.5, 0.5);
const vec3 acceleration = vec3(0.0, 0.0, 0.0);

void main() {
    if (a_spawntime == 0.0 || (u_time - a_spawntime) > a_lifetime) {
        float x = float(gl_InstanceID) / count;
        float t = u_time/1000.0 * x;
        v_position = vec3(
            rand(vec3(x, x, t)),
            rand(vec3(1.0 - x, 1.0 - x, t)),
            rand(vec3(x, 0.5, t))
        ) - center;
        v_velocity = vec3(
            rand(vec3(x, x, t)),
            rand(vec3(1.0 - x, 1.0 - x, t)),
            rand(vec3(x, 0.5, t))
        ) - center;
        v_spawntime = u_time;
        v_lifetime = rand(vec3(x, 0.5, t)) * lifetime;
    } else {
        v_velocity = a_velocity + 0.01 * acceleration;
        v_position = a_position + 0.01 * v_velocity;
        v_spawntime = a_spawntime;
        v_lifetime = a_lifetime;
    }
}
