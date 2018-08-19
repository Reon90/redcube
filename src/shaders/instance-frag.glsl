#version 300 es
precision highp float;

layout (location = 0) out vec4 color;
in float depth;

void main() {
    //color = vec4(0.0, 0.0, 0.8, 1.0) * texture( image, gl_PointCoord );
    if (depth < 0.05) {
        discard;
    }
    color = vec4(1.0, 1.0, 1.0, 1.0);
}
