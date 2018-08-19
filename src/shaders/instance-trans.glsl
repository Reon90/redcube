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
uniform vec3 acceleration;
uniform mat4 MVPMatrix;
uniform sampler3D noize;
uniform float count;

float rand(vec3 co) {
    return texture(noize, co).r;
}

void main() {
    if (a_spawntime == 0.0 || (u_time - a_spawntime > a_lifetime) || a_position.y < -0.5) {
        // Generate a new particle
        float x = float(gl_InstanceID) / count;
        float t = u_time/1000.0 * x;
        v_position = vec3(
            (rand(vec3(x, x, t)) - 1.0) * 4.0,
            (rand(vec3(1.0 - x, 1.0 - x, t)) - 0.5) * 8.0,
            (rand(vec3(x, 0.5, t)) - 0.5) * 4.0
        );
        v_velocity = vec3(
            rand(vec3(x, x, t)),
            rand(vec3(1.0 - x, 1.0 - x, t)) - 0.5,
            rand(vec3(x, 0.5, t)) - 0.5
        );
        v_spawntime = u_time;
        v_lifetime = (rand(vec3(x, x, t)) + 0.5) * 15000.0;
    } else {
        v_velocity = a_velocity + 0.01 * acceleration;
        v_position = a_position + 0.01 * v_velocity;
        v_spawntime = a_spawntime;
        v_lifetime = a_lifetime;
    }
}
