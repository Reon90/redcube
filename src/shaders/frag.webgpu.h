#version 460

#extension GL_EXT_samplerless_texture_functions:require

#ifdef DIFFUSE_TRANSMISSION
    #define SCATTERING 1
#endif

#define texture2D(p, uv) texture(sampler2D(p, baseSampler), uv)
#define textureCube(p, uv) texture(samplerCube(p, unfilteredSampler), uv)
#define textureLodCube(p, uv, i) textureLod(samplerCube(p, unfilteredSampler), uv, i)
#define textureLod2D(p, uv, i) textureLod(sampler2D(p, baseSampler), uv, i)

#define IBL 1
#define USE_PBR 1

layout(location = 0) in vec2 outUV0;
layout(location = 4) in mat3 outTBN;
#ifdef MULTIUV
layout(location = 1) in vec2 outUV2;
layout(location = 8) in vec2 outUV3;
#endif
layout(location = 2) in vec3 outPosition;
layout(location = 3) in vec4 vColor;
layout(location = 7) in vec4 outPositionView;

layout(location = 0) out vec4 color;
// layout (location = 1) out vec4 normalColor;
layout (location = 1) out vec4 irradianceColor;
layout (location = 2) out vec4 albedoColor;
layout (location = 3) out vec4 specColor;

layout(set = 0, binding = 0) uniform Matrices {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
};
layout(set = 0, binding = 1) uniform Uniforms {
    vec4 baseColorFactor;
    vec3 viewPos;
    vec3 specularFactor;
    vec3 specularColorFactor;
    vec3 emissiveFactor;
    vec4 glossinessFactor;
    vec4 metallicFactor;
    vec4 roughnessFactor;
    vec4 clearcoatFactor;
    vec4 clearcoatRoughnessFactor;
    vec4 sheenColorFactor;
    vec4 sheenRoughnessFactor;
    vec4 transmissionFactor;
    vec4 ior;
    vec4 normalTextureScale;
    vec4 attenuationColorFactor; 
    vec4 attenuationDistance; 
    vec4 thicknessFactor;
    vec4 emissiveStrength;
    vec4 anisotropyFactor;
    vec4 iridescence;
    vec4 diffuseTransmissionFactor;
    vec4 dispersionFactor;
};
layout(set = 0, binding = 27) uniform SphericalHarmonics {
    vec4 vSphericalL00;
    vec4 vSphericalL1_1;
    vec4 vSphericalL10;
    vec4 vSphericalL11;
    vec4 vSphericalL2_2;
    vec4 vSphericalL2_1;
    vec4 vSphericalL20;
    vec4 vSphericalL21;
    vec4 vSphericalL22;
    mat4 rotationMatrix;
};
layout(set = 0, binding = 15) uniform LightColor {
    vec3 lightColor[LIGHTNUMBER];
};
layout(set = 0, binding = 17) uniform Spotdir {
    vec3 spotdir[LIGHTNUMBER];
};
layout(set = 0, binding = 18) uniform LightIntensity {
    vec4 lightIntensity[LIGHTNUMBER];
};
layout(set = 0, binding = 16) uniform LightPos {
    vec3 lightPos[LIGHTNUMBER];
};
#if defined MATRICES
layout(set = 0, binding = 23) uniform TextureMatrices {
    mat4 textureMatrices[MATRICES];
};
#endif

layout(set = 0, binding = 2) uniform sampler baseSampler;
layout(set = 0, binding = 24) uniform sampler unfilteredSampler;
#ifdef BASECOLORTEXTURE
layout(set = 0, binding = 3) uniform texture2D baseColorTexture;
#endif
#ifdef METALROUGHNESSMAP
layout(set = 0, binding = 4) uniform texture2D metallicRoughnessTexture;
#endif
#ifdef NORMALMAP
layout(set = 0, binding = 5) uniform texture2D normalTexture;
#endif
#ifdef EMISSIVEMAP
layout(set = 0, binding = 6) uniform texture2D emissiveTexture;
#endif
#ifdef OCCLUSIONMAP
layout(set = 0, binding = 7) uniform texture2D occlusionTexture;
#endif
#ifdef CLEARCOATMAP
layout(set = 0, binding = 8) uniform texture2D clearcoatTexture;
#endif
#ifdef CLEARCOATROUGHMAP
layout(set = 0, binding = 9) uniform texture2D clearcoatRoughnessTexture;
#endif
#ifdef TRANSMISSIONMAP
layout(set = 0, binding = 10) uniform texture2D transmissionTexture;
#endif
#ifdef SHEENMAP
layout(set = 0, binding = 11) uniform texture2D sheenColorTexture;
layout(set = 0, binding = 12) uniform texture2D sheenRoughnessTexture;
#endif
#ifdef CLEARCOATNORMALMAP
layout(set = 0, binding = 13) uniform texture2D clearcoatNormalTexture;
#endif
#ifdef SPECULARMAP
layout(set = 0, binding = 14) uniform texture2D specularTexture;
#endif
layout(set = 0, binding = 19) uniform textureCube prefilterMap;
layout(set = 0, binding = 20) uniform textureCube irradianceMap;
layout(set = 0, binding = 21) uniform texture2D brdfLUT;
#ifdef SHADOWMAP
layout(set = 0, binding = 25) uniform texture2D depthTexture;
#endif
layout(set = 0, binding = 26) uniform texture2D colorTexture;
layout(set = 0, binding = 28) uniform texture2D Sheen_E;
layout(set = 0, binding = 29) uniform texture2D thicknessTexture;
layout(set = 0, binding = 31) uniform texture2D anisotropyTexture;
layout(set = 0, binding = 32) uniform texture2D iridescenceThicknessTexture;
layout(set = 0, binding = 33) uniform texture2D specularColorTexture;
layout(set = 0, binding = 34) uniform texture2D diffuseTransmissionTexture;
layout(set = 0, binding = 35) uniform textureCube charlieMap;

layout(set = 0, binding = 30) uniform StateUniform {
    vec4 isTone;
    vec4 isIBL;
    vec4 isDefaultLight;
};
