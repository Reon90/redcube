#version 300 es
precision highp float;

// #ifdef DIFFUSE_TRANSMISSION
//     #define SCATTERING 1
// #endif

#define texture2D(p, uv) texture(p, uv)
#define textureCube(p, uv) texture(p, uv)
#define textureLodCube(p, uv, i) textureLod(p, uv, i)
#define textureLod2D(p, uv, i) textureLod(p, uv, i)

in vec4 vColor;
in vec2 outUV0;
in vec2 outUV2;
in vec2 outUV3;
in vec3 outPosition;
in vec4 outPositionView;
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

uniform Material {
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
uniform Matrices {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
};
uniform LightColor {
    vec3 lightColor[LIGHTNUMBER];
};
uniform Spotdir {
    vec3 spotdir[LIGHTNUMBER];
};
uniform LightIntensity {
    vec4 lightIntensity[LIGHTNUMBER];
};
uniform LightPos {
    vec3 lightPos[LIGHTNUMBER];
};
#if defined MATRICES
uniform TextureMatrices {
    mat4 textureMatrices[MATRICES];
};
#endif
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
uniform vec2 isTone;
uniform vec2 isIBL;
uniform vec2 isDefaultLight;
uniform sampler2D Sheen_E;
