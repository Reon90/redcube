#version 300 es
precision highp float;

layout (location = 0) out vec4 color;

uniform Material {
    vec4 baseColorFactor;
    vec3 lightPos;
    vec3 viewPos;
    mat3 textureMatrix;
    float isOutline;
};
uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;
uniform sampler2D emissiveTexture;
uniform sampler2D occlusionTexture;

uniform samplerCube prefilterMap;
uniform sampler2D   brdfLUT;  
uniform samplerCube irradianceMap;
uniform sampler2D depthTexture;

void main() {
    color = vec4(1.0, 1.0, 1.0, 1.0);
}
