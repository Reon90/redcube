#version 300 es
precision highp float;
precision highp sampler3D;

layout (location = 0) in vec3 inPosition;
layout(location = 1) in vec3 a_velocity;

uniform mat4 MVPMatrix;
uniform sampler3D noize;

out float x;

void main() {
    x = float(gl_InstanceID) / 100.0;
    gl_PointSize = 2.0;
    gl_Position = MVPMatrix * vec4(inPosition, 1.0);
}
