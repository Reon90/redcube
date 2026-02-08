#version 300 es
precision highp float;

// #ifdef DIFFUSE_TRANSMISSION
//     #define SCATTERING 1
// #endif

#define texture2D(p, uv) texture(p, uv)
#define textureCube(p, uv) texture(p, uv)
#define textureLodCube(p, uv, i) textureLod(p, uv, i)
#define textureLod2D(p, uv, i) textureLod(p, uv, i)
#define textureLod2D2(p, uv, i) textureLod(p, uv, i)

uniform sampler2D uMaterialTex;

in vec4 vColor;
in vec2 outUV0;
in vec2 outUV2;
in vec2 outUV3;
in vec3 outPosition;
in vec4 outPositionView;
in float id;
#ifdef TANGENT
    in mat3 outTBN;
#else
    in vec3 outNormal;
#endif

layout (location = 0) out vec4 color;
layout (location = 1) out vec4 normalColor;
layout (location = 2) out vec4 irradianceColor;
layout (location = 3) out vec4 albedoColor;
layout (location = 4) out vec4 specColor;

struct Material {
    vec4 lights;
    vec4 iridescence;
    vec4 diffuseTransmissionFactor;
    vec4 baseColorFactor;
    vec3 specularColorFactor;
    vec3 emissiveFactor;
    vec3 sheenColorFactor;
    vec3 attenuationColorFactor; 
    vec3 specularFactor;
    vec2 anisotropyFactor;
    float glossinessFactor;
    float metallicFactor;
    float roughnessFactor;
    float clearcoatFactor;
    float clearcoatRoughnessFactor;
    float sheenRoughnessFactor;
    float transmissionFactor;
    float ior;
    float normalTextureScale;
    float attenuationDistance; 
    float thicknessFactor;
    float emissiveStrength;
    float dispersionFactor;
};

Material fetchMaterial(int id) {
    Material m;
    int row = id;
    m.baseColorFactor         = texelFetch(uMaterialTex, ivec2(3, row), 0);
    m.specularFactor          = texelFetch(uMaterialTex, ivec2(8, row), 0).xyz;
    m.specularColorFactor     = texelFetch(uMaterialTex, ivec2(4, row), 0).xyz;
    m.emissiveFactor          = texelFetch(uMaterialTex, ivec2(5, row), 0).xyz;
    m.glossinessFactor        = texelFetch(uMaterialTex, ivec2(10, row), 0).x;
    m.metallicFactor          = texelFetch(uMaterialTex, ivec2(11, row), 0).x;
    m.roughnessFactor         = texelFetch(uMaterialTex, ivec2(12, row), 0).x;
    m.clearcoatFactor         = texelFetch(uMaterialTex, ivec2(13, row), 0).x;
    m.clearcoatRoughnessFactor= texelFetch(uMaterialTex, ivec2(14, row), 0).x;
    m.sheenColorFactor        = texelFetch(uMaterialTex, ivec2(6, row), 0).xyz;
    m.sheenRoughnessFactor    = texelFetch(uMaterialTex, ivec2(15, row), 0).x;
    m.transmissionFactor      = texelFetch(uMaterialTex, ivec2(16, row), 0).x;
    m.ior                     = texelFetch(uMaterialTex, ivec2(17, row), 0).x;
    m.normalTextureScale      = texelFetch(uMaterialTex, ivec2(18, row), 0).x;
    m.attenuationColorFactor  = texelFetch(uMaterialTex, ivec2(7, row), 0).xyz;
    m.attenuationDistance     = texelFetch(uMaterialTex, ivec2(19, row), 0).x;
    m.thicknessFactor         = texelFetch(uMaterialTex, ivec2(20, row), 0).x;
    m.emissiveStrength        = texelFetch(uMaterialTex, ivec2(21, row), 0).x;
    m.anisotropyFactor        = texelFetch(uMaterialTex, ivec2(9, row), 0).xy;
    m.iridescence             = texelFetch(uMaterialTex, ivec2(1, row), 0);
    m.diffuseTransmissionFactor= texelFetch(uMaterialTex, ivec2(2, row), 0);
    m.dispersionFactor        = texelFetch(uMaterialTex, ivec2(22, row), 0).x;
    m.lights                  = texelFetch(uMaterialTex, ivec2(0, row), 0);
    return m;
}

uniform Matrices2 {
    mat4 view;
    mat4 projection;
    mat4 light;
    float isShadow;
};
uniform LightPos {
    vec4 lightPos[LIGHTNUMBER];
};
uniform LightColor {
    vec4 lightColor[LIGHTNUMBER];
};
uniform Spotdir {
    vec4 spotdir[LIGHTNUMBER];
};
uniform LightIntensity {
    vec4 lightIntensity[LIGHTNUMBER];
};
#if defined MATRICES
uniform TextureMatrices {
    mat4 textureMatrices[MATRICES];
};
#endif
#ifdef SPHERICAL_HARMONICS
uniform SphericalHarmonics {
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
#endif

uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;
uniform sampler2D emissiveTexture;
uniform sampler2D occlusionTexture;
uniform sampler2D clearcoatTexture;
uniform sampler2D clearcoatRoughnessTexture;
uniform sampler2D transmissionTexture;
uniform sampler2D sheenColorTexture;
uniform sampler2D sheenRoughnessTexture;
uniform sampler2D iridescenceThicknessTexture;
uniform sampler2D iridescenceTexture;
uniform sampler2D clearcoatNormalTexture;
uniform sampler2D specularTexture;
uniform sampler2D specularColorTexture;
uniform sampler2D thicknessTexture;
uniform sampler2D diffuseTransmissionTexture;
uniform sampler2D diffuseTransmissionColorTexture;
uniform sampler2D anisotropyTexture;

uniform samplerCube prefilterMap;
uniform samplerCube charlieMap;
uniform sampler2D brdfLUT;  
uniform samplerCube irradianceMap;
uniform sampler2D depthTexture;
uniform sampler2D colorTexture;
uniform float isTone;
uniform float isIBL;
uniform float isDefaultLight;
uniform sampler2D Sheen_E;
