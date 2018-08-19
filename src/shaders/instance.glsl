#version 300 es
precision highp float;
precision highp sampler3D;

layout (location = 0) in vec3 inPosition;
out float depth;

uniform sampler2D light;
uniform mat4 MVPMatrix;

//out float x;

void main() {
    //x = float(gl_InstanceID) / 100.0;
    gl_PointSize = 1.0;
    vec4 point = MVPMatrix * vec4(inPosition, 1.0);
    vec2 uv = (point.xy / point.w) * 0.5 + 0.5;
    depth = texture(light, uv).r;
    gl_Position = point;
}
