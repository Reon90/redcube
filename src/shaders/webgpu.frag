#version 450

#define IBL 1
#define USE_PBR 1

layout(location = 0) in vec2 outUV0;
layout(location = 4) in mat3 outTBN;
layout(location = 1) in vec2 outUV2;
layout(location = 2) in vec3 outPosition;
layout(location = 3) in vec4 vColor;

layout(location = 0) out vec4 color;

layout(set = 0, binding = 0) uniform Matrices {
    mat4 model;
    mat4 normalMatrix;
    mat4 view;
    mat4 projection;
    mat4 light;
    vec4 isShadow;
} matrices;
layout(set = 0, binding = 1) uniform Uniforms {
    vec4 baseColorFactor;
    vec3 viewPos;
    mat3 textureMatrix;
    vec3 specularFactor;
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
} uniforms;
layout(set = 0, binding = 15) uniform LightColor {
    vec3 lightColor[LIGHTNUMBER];
} lightColor_;
layout(set = 0, binding = 17) uniform Spotdir {
    vec3 spotdir[LIGHTNUMBER];
} spotdir_;
layout(set = 0, binding = 18) uniform LightIntensity {
    vec4 lightIntensity[LIGHTNUMBER];
} lightIntensity_;
layout(set = 0, binding = 16) uniform LightPos {
    vec3 lightPos[LIGHTNUMBER];
} lightPos_;

layout(set = 0, binding = 2) uniform sampler baseSampler;
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
#ifdef SHADOWMAP
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




const float RECIPROCAL_PI = 0.31830988618;
const float PI = 3.14159265359;
const float EPSILON = 1e-6;
const float ambientStrength = 0.1;
const float specularStrength = 2.5;
const float specularPower = 32.0;
const float gamma = 2.2;


vec2 getUV(int index) {
    if (index == 1) {
        return outUV0;
    } else {
        return outUV2;
    }
}

// float ShadowCalculation(vec4 fragPosLightSpace, float bias) {
//     vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
//     projCoords = projCoords * 0.5 + 0.5;
//     float currentDepth = projCoords.z;

//     float shadow = 0.0;
//     vec2 texelSize = 1.0 / vec2(textureSize(depthTexture, 0));
//     for (int x = -2; x <= 2; ++x) {
//         for (int y = -2; y <= 2; ++y) {
//             float pcfDepth = texture(depthTexture, projCoords.xy + vec2(x, y) * texelSize).r;
//             shadow += currentDepth - bias > pcfDepth ? 0.5 : 0.0;
//         }
//     }
//     shadow /= 25.0;

//     return shadow;
// }

vec3 srgbToLinear(vec4 srgbIn) {
    #ifdef BASISU
    return srgbIn.rgb;
    #else
    return pow(srgbIn.rgb, vec3(2.2));
    #endif
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness*roughness;
    float a2 = max(a*a, 0.0001);
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.0001);
}

float GeometrySchlickGGX(float cosTheta, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;

    float nom   = cosTheta;
    float denom = cosTheta * (1.0 - k) + k;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}
float fresnelSchlickRoughness(float cosTheta, float F0, float roughness) {
    return F0 + (max(1.0 - roughness, F0) - F0) * pow(1.0 - cosTheta, 5.0);
}
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}

// vec3 computeEnvironmentIrradiance(vec3 normal) {
//     return vSphericalL00
//         + vSphericalL1_1 * (normal.y)
//         + vSphericalL10 * (normal.z)
//         + vSphericalL11 * (normal.x)
//         + vSphericalL2_2 * (normal.y * normal.x)
//         + vSphericalL2_1 * (normal.y * normal.z)
//         + vSphericalL20 * ((3.0 * normal.z * normal.z) - 1.0)
//         + vSphericalL21 * (normal.z * normal.x)
//         + vSphericalL22 * (normal.x * normal.x - (normal.y * normal.y));
// }
vec3 IBLAmbient(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, float roughness, vec3 viewDir) {
    vec3 F0 = mix(vec3(0.05), baseColor, metallic);

    #if defined SPECULARGLOSSINESSMAP || defined SPECULARMAP
        F0 = specularMap;
    #endif

    vec3 F = fresnelSchlickRoughness(max(dot(n, viewDir), 0.0), F0, roughness);

    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;

    const float MAX_REFLECTION_LOD = 3.0;
    #ifdef SPHERICAL_HARMONICS
    vec3 R = reflect(viewDir, n);
    vec4 rotatedR = rotationMatrix * vec4(R, 0.0);
    vec4 prefilterColor = textureLod(samplerCube(prefilterMap, baseSampler), rotatedR.xyz, roughness * MAX_REFLECTION_LOD);
    vec3 prefilteredColor = srgbToLinear(vec4(prefilterColor.rgb, 0.0)) / prefilterColor.a;
    vec3 irradianceVector = vec3(rotationMatrix * vec4(n, 0)).xyz;
    vec3 irradiance = computeEnvironmentIrradiance(irradianceVector).rgb;
    #else
    vec3 R = reflect(-viewDir, n);
    vec3 prefilteredColor = textureLod(samplerCube(prefilterMap, baseSampler), R, roughness * MAX_REFLECTION_LOD).rgb;
    vec3 irradiance = texture(samplerCube(irradianceMap, baseSampler), n).rgb;
    #endif
    vec2 envBRDF  = texture(sampler2D(brdfLUT, baseSampler), vec2(max(dot(n, viewDir), 0.0), roughness)).rg;
    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);

    #if defined TRANSMISSION || defined CLEARCOAT
    return specular;
    #else
    return (kD * irradiance * baseColor + specular);
    #endif
}

float specEnv(vec3 N, vec3 V, float metallic, float roughness) {
    float F0 = mix(0.05, 1.0, metallic);

    float F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
    vec2 envBRDF  = texture(sampler2D(brdfLUT, baseSampler), vec2(max(dot(N, V), 0.0), roughness)).rg;
    return (F * envBRDF.x + envBRDF.y);
}

vec3 CookTorranceSpecular(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir) {
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, baseColor, metallic);

    #if defined SPECULARGLOSSINESSMAP || defined SPECULARMAP
        F0 = specularMap;
    #endif

    float D = DistributionGGX(n, H, roughness);
    float G = GeometrySmith(n, viewDir, lightDir, roughness);      
    vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0); 

    vec3 nominator = D * G * F;
    float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);
    return nominator / max(denominator, 0.001);
}

vec3 LambertDiffuse(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir) {
    float NdotL = max(dot(n, lightDir), 0.0);
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor, metallic);

    vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);    

    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;
    return baseColor * kD / PI;
}

float saturate(float a) {
	if (a > 1.0) return 1.0;
	if (a < 0.0) return 0.0;
	return a;
}
vec3 ImprovedOrenNayarDiffuse(vec3 baseColor, float metallic, vec3 N, vec3 H, float a, vec3 V, vec3 L) {
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor, metallic);
    #if defined SPECULARGLOSSINESSMAP
        F0 = specularMap;
    #endif
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
    vec3 kD = vec3(1.0) - F;
    #if defined SPECULARGLOSSINESSMAP
    #else
        kD *= 1.0 - metallic;
    #endif
    vec3 diffuseColor = baseColor * kD;
	// calculate intermediary values
	float dotNL = saturate(dot(N, L));
	float dotNV = saturate(dot(N, V));
	float dotLV = saturate(dot(L, V));
	float dotLH = saturate(dot(L, H));

	float s = dotLV - dotNL * dotNV;
	float t = mix(1.0, max(max(dotNL, dotNV), 0.001), step(0.0, s));
	float st = s * (1.0 / (t + EPSILON));

	float sigma2 = a;
	vec3 A = diffuseColor * (0.17 * sigma2 / (sigma2 + 0.13)) + vec3(1.0 - 0.5 * sigma2 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);
	return (diffuseColor * max(0.0, dotNL)) * (A + vec3(B * s / t) / PI);
}

float fresnelDielectric(float cosThetaI, float ni, float nt) {
  cosThetaI = clamp(cosThetaI, -1.0, 1.0);

  // Swap index of refraction if this is coming from inside the surface
  if (cosThetaI < 0.0) {
    float temp = ni;
    ni = nt;
    nt = temp;

    cosThetaI = -cosThetaI;
  }

  float sinThetaI = sqrt(max(0.0, 1.0 - cosThetaI * cosThetaI));
  float sinThetaT = ni / nt * sinThetaI;

  // Check for total internal reflection
  if (sinThetaT >= 1.0) {
    return 1.0;
  }

  float cosThetaT = sqrt(max(0.0, 1.0 - sinThetaT * sinThetaT));

  float rParallel = ((nt * cosThetaI) - (ni * cosThetaT)) /
                    ((nt * cosThetaI) + (ni * cosThetaT));
  float rPerpendicuar = ((ni * cosThetaI) - (nt * cosThetaT)) /
                        ((ni * cosThetaI) + (nt * cosThetaT));
  return (rParallel * rParallel + rPerpendicuar * rPerpendicuar) / 2.0;
}

bool Transmit(vec3 wm, vec3 wi, float n, out vec3 wo) {
  float c = dot(wi, wm);
  if (c < 0.0) {
    c = -c;
    wm = -wm;
  }

  float root = 1.0f - n * n * (1.0f - c * c);
  if (root <= 0.0)
    return false;

  wo = (n * c - sqrt(root)) * wm - n * wi;
  return true;
}
// vec3 calcTransmission(vec3 color, float metallic, vec3 N, vec3 H, float roughness, vec3 V, vec3 L, float transmission) {
//     vec4 refractS = matrices.projection * matrices.view * vec4(outPosition + refract(-V, N, uniforms.ior.x), 1.0);
//     refractS.xy = refractS.xy / refractS.w;
//     refractS.xy = refractS.xy * 0.5 + 0.5;
//     const float MAX_REFLECTION_LOD = 10.0;
//     vec3 baseColor = textureLod(colorTexture, refractS.xy, roughness * MAX_REFLECTION_LOD).xyz;

//     return transmission * baseColor * color;
// }

float sheenDistribution(float sheenRoughness, vec3 N, vec3 H) {
    float NdotH = max(dot(N, H), 0.0);
    float alphaG = max(sheenRoughness * sheenRoughness, 0.01);
    float invR = 1.0 / alphaG;
    float cos2h = NdotH * NdotH;
    float sin2h = 1.0 - cos2h;
    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);
}
float l(float x, float alphaG) {
    float oneMinusAlphaSq = (1.0 - alphaG) * (1.0 - alphaG);
    float a = mix(21.5473, 25.3245, oneMinusAlphaSq);
    float b = mix(3.82987, 3.32435, oneMinusAlphaSq);
    float c = mix(0.19823, 0.16801, oneMinusAlphaSq);
    float d = mix(-1.97760, -1.27393, oneMinusAlphaSq);
    float e = mix(-4.32054, -4.85967, oneMinusAlphaSq);
    return a / (1.0 + b * pow(x, c)) + d * x + e;
}
float lambdaSheen(float cosTheta, float alphaG) {
    return abs(cosTheta) < 0.5 ? exp(l(cosTheta, alphaG)) : exp(2.0 * l(0.5, alphaG) - l(1.0 - cosTheta, alphaG));
}
float sheenVisibility(vec3 N, vec3 V, vec3 L, float sheenRoughness) {
    float alphaG = sheenRoughness * sheenRoughness;
    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);
    float v = 1.0 / ((1.0 + lambdaSheen(NdotV, alphaG) + lambdaSheen(NdotL, alphaG)) * (4.0 * NdotV * NdotL));
    if (isnan(v) || isinf(v)) {
        v = 0.0;
    }
    return v;
}
// float E(float x, float y) {
//     return texture(Sheen_E, vec2(x,y)).r;
// }

float max3(vec3 v) { return max(max(v.x, v.y), v.z); }

vec2 applyTransform(vec2 uv) {
    mat3 translation = mat3(1, 0, 0, 0, 1, 0, uniforms.textureMatrix[0].x, uniforms.textureMatrix[0].y, 1);
    mat3 rotation = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    if (uniforms.textureMatrix[2].x != 0.0) {
        rotation = mat3(
            cos(-uniforms.textureMatrix[2].x), sin(-uniforms.textureMatrix[2].x), 0,
            -sin(-uniforms.textureMatrix[2].x), cos(-uniforms.textureMatrix[2].x), 0,
            0, 0, 1
        );
    }
    mat3 scale = mat3(uniforms.textureMatrix[1].x, 0, 0, 0, uniforms.textureMatrix[1].y, 0, 0, 0, 1);

    mat3 matrix = translation * rotation * scale;
    vec2 outUV = ( matrix * vec3(uv, 1.0) ).xy;
    return outUV;
}

void main() {
    vec2 outUV = outUV0;
    #ifdef BASECOLORTEXTURE
        outUV = getUV(BASECOLORTEXTURE);
        #ifdef BASECOLORTEXTURE_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        vec3 baseColor = srgbToLinear(texture(sampler2D(baseColorTexture, baseSampler), outUV)) * uniforms.baseColorFactor.rgb;
        float alpha = min(texture(sampler2D(baseColorTexture, baseSampler), outUV).a, uniforms.baseColorFactor.a);
    #else
        vec3 baseColor = uniforms.baseColorFactor.rgb;
        float alpha = uniforms.baseColorFactor.a;
    #endif

    #ifdef ALPHATEST
    if ( alpha < ALPHATEST ) {
        discard;
    }
    #else
        alpha = 1.0;
    #endif

    if ( length(vColor.rgb) != 0.0 ) {
        baseColor.rgb *= vColor.rgb;
    }

    #ifdef NOLIGHT
        color = vec4(baseColor, alpha);
        return;
    #endif

    float ao = 2.0;
    #ifdef OCCLUSIONMAP
        outUV = getUV(OCCLUSIONMAP);
        #ifdef OCCLUSIONMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        ao = texture(sampler2D(occlusionTexture, baseSampler), outUV).r;
    #endif

    float roughness = uniforms.roughnessFactor.x;
    float metallic = uniforms.metallicFactor.x;
    float clearcoatRoughness = uniforms.clearcoatRoughnessFactor.x;
    float clearcoat = uniforms.clearcoatFactor.x;
    float clearcoatBlendFactor = clearcoat;
    vec3 sheenColor = uniforms.sheenColorFactor.xyz;
    float sheenRoughness = uniforms.sheenRoughnessFactor.x;
    float transmission = uniforms.transmissionFactor.x;
    #ifdef CLEARCOATMAP
        outUV = getUV(CLEARCOATMAP);
        #ifdef CLEARCOATMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        clearcoatBlendFactor = texture(sampler2D(clearcoatTexture, baseSampler), outUV).r * clearcoat;
    #endif
    #ifdef CLEARCOATROUGHMAP
        outUV = getUV(CLEARCOATROUGHMAP);
        #ifdef CLEARCOATROUGHMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        clearcoatRoughness = texture(sampler2D(clearcoatRoughnessTexture, baseSampler), outUV).g * clearcoatRoughness;
    #endif
    #ifdef SHEENMAP
        outUV = getUV(SHEENMAP);
        #ifdef SHEENMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        vec4 sheenRoughnessTextureV = texture(sampler2D(sheenRoughnessTexture, baseSampler), outUV);
        vec3 sheenColorTextureV = srgbToLinear(texture(sheenColorTexture, outUV));
        sheenColor = sheenColorTextureV * sheenColor;
        sheenRoughness = sheenRoughnessTextureV.a * sheenRoughness;
    #endif
    #ifdef TRANSMISSIONMAP
        float transmissionTextureV = texture(sampler2D(transmissionTexture, baseSampler), outUV).r;
        transmission = transmissionTextureV * transmission;
    #endif
    vec3 specularMap = vec3(0);
    #ifdef SPECULARGLOSSINESSMAP
        #ifdef METALROUGHNESSMAP
            outUV = getUV(METALROUGHNESSMAP);
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV);
            #endif
            roughness = 1.0 - texture(sampler2D(metallicRoughnessTexture, baseSampler), outUV).a;
            specularMap = srgbToLinear(texture(sampler2D(metallicRoughnessTexture, baseSampler), outUV));
        #else
            roughness = glossinessFactor.x;
            specularMap = specularFactor;
        #endif
    #else
        #ifdef METALROUGHNESSMAP
            outUV = getUV(METALROUGHNESSMAP);
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV);
            #endif
            vec4 metallicRoughness = texture(sampler2D(metallicRoughnessTexture, baseSampler), outUV);
            roughness *= metallicRoughness.g;
            metallic *= metallicRoughness.b;
        #endif
    #endif
    #ifdef SPECULARMAP
        specularMap = texture(sampler2D(specularTexture, baseSampler), outUV).rgb * specularFactor;
    #endif

    #ifdef TANGENT
        #ifdef NORMALMAP
            outUV = getUV(NORMALMAP);
            #ifdef NORMALMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV);
            #endif
            vec3 n = texture(sampler2D(normalTexture, baseSampler), outUV).rgb;
            n = normalize(outTBN * (2.0 * n - 1.0));
        #else
            vec3 n = outTBN[2].xyz;
        #endif
    #else
        vec3 n = outNormal;
    #endif

    #ifdef TANGENT
    #ifdef CLEARCOATNORMALMAP
        outUV = getUV(CLEARCOATNORMALMAP);
        #ifdef CLEARCOATNORMALMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV);
        #endif
        vec3 clearcoatNormal = texture(sampler2D(clearcoatNormalTexture, baseSampler), outUV).rgb;
        clearcoatNormal = normalize(outTBN * (2.0 * clearcoatNormal - 1.0));
    #else
        vec3 clearcoatNormal = outTBN[2].xyz;
    #endif
    #else
        vec3 clearcoatNormal = outNormal;
    #endif

    mat4 m = inverse(matrices.view);
    vec3 viewDir = normalize(m[3].xyz - outPosition);

    #ifdef DOUBLESIDED
    if (dot(n, viewDir) < 0.0) {
        n = -n;
        clearcoatNormal = -clearcoatNormal;
    }
    #endif

    float shadow = 1.0;
    // #ifdef SHADOWMAP
    //     vec3 l = normalize(lightPos[0] - outPosition);
    //     float shadowBias = max(0.05 * (1.0 - dot(n, l)), 0.005);
    //     shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);
    // #endif

    #ifdef USE_PBR
        vec3 Lo = vec3(0.0);
        vec3 f_transmission = vec3(0.0);
        for (int i = 0; i < LIGHTNUMBER; ++i) {
            vec3 lightDir = normalize(lightPos_.lightPos[i] - outPosition);
            float NdotL = max(dot(n, lightDir), 0.0);
            vec3 H = normalize(viewDir + lightDir);

            vec3 radiance = lightColor_.lightColor[i] * lightIntensity_.lightIntensity[i].x;
            float distance = length(lightPos_.lightPos[i] - outPosition);
            float attenuation = 1.0 / (distance * distance);
            if (lightIntensity_.lightIntensity[i].w == 1.0) { // point
                radiance = radiance * attenuation;
            }
            if (lightIntensity_.lightIntensity[i].w == 2.0) { // spot
                float lightAngleScale = 1.0 / max(0.001, cos(lightIntensity_.lightIntensity[i].y) - cos(lightIntensity_.lightIntensity[i].z));
                float lightAngleOffset = -cos(lightIntensity_.lightIntensity[i].z) * lightAngleScale;

                float cd = dot(spotdir_.spotdir[i], lightDir);
                float attenuationSpot = saturate(cd * lightAngleScale + lightAngleOffset);
                attenuationSpot *= attenuationSpot;

                radiance = radiance * attenuationSpot * attenuation;
            }

            vec3 specular = CookTorranceSpecular(specularMap, baseColor, metallic, n, H, roughness, viewDir, lightDir);
            vec3 f_clearcoat = CookTorranceSpecular(specularMap, vec3(0.0), 0.0, clearcoatNormal, H, clearcoatRoughness, viewDir, lightDir);
            float NdotV = saturate(dot(clearcoatNormal, viewDir));
            vec3 clearcoatFresnel = 1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04));
            vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir);
            #if defined SPECULARGLOSSINESSMAP || defined SPECULARMAP
                diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));
            #endif
            vec3 f_sheen = sheenColor * sheenDistribution(sheenRoughness, n, H) * sheenVisibility(n, viewDir, lightDir, sheenRoughness);
            //float sheenAlbedoScaling = min(1.0 - max3(sheenColor) * E(max(dot(viewDir, n), 0.0), sheenRoughness), 1.0 - max3(sheenColor) * E(max(dot(lightDir, n), 0.0), sheenRoughness));
            float sheenAlbedoScaling=1.0;

            //f_transmission += calcTransmission(baseColor, metallic, n, H, roughness, viewDir, lightDir, transmission);
            diffuse *= (1.0 - transmission);

            Lo += sheenAlbedoScaling * (diffuse + specular * NdotL) * radiance * clearcoatFresnel + f_clearcoat * clearcoatBlendFactor + f_sheen;
        }

        vec3 ambient = vec3(0.0);
        vec3 ambientClearcoat = vec3(0.0);
        vec3 clearcoatFresnel = vec3(1.0);
        #ifdef IBL
            ambient = IBLAmbient(specularMap, baseColor, metallic, n, roughness, viewDir);
            ambientClearcoat = IBLAmbient(specularMap, vec3(0.0), 0.0, clearcoatNormal, clearcoatRoughness, viewDir) * clearcoatBlendFactor;
            float NdotV = saturate(dot(clearcoatNormal, viewDir));
            clearcoatFresnel = (1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04)));
        #else
            ambient = vec3(0.03) * baseColor * 0.2;
        #endif

        vec3 emissive = uniforms.emissiveFactor;
        #ifdef EMISSIVEMAP
            outUV = getUV(EMISSIVEMAP);
            #ifdef EMISSIVEMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV);
            #endif
            emissive = srgbToLinear(texture(sampler2D(emissiveTexture, baseSampler), outUV));
        #endif

        #ifdef TRANSMISSION
        color = vec4(ambient + Lo + f_transmission * (1.0 - specEnv(n, viewDir, metallic, roughness)), alpha);
        #else
        color = vec4(ao * shadow * ((emissive + ambient + Lo) * clearcoatFresnel + ambientClearcoat), alpha);
        #endif
    #else
        vec3 lightDir = normalize(lightPos_.lightPos[0] - outPosition);
        vec3 ambient = ambientStrength * lightColor_.lightColor[0];

        float diff = max(dot(n, lightDir), 0.0);
        vec3 diffuse = diff * lightColor_.lightColor[0];

        vec3 reflectDir = reflect(-lightDir, n);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
        vec3 specular = specularStrength * spec * lightColor_.lightColor[0];

        color = vec4(baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);
    #endif

    //if (isTone == 1) {
        color.rgb = color.rgb / (color.rgb + vec3(1.0));
        color.rgb = pow(color.rgb, vec3(1.0 / gamma));
    //}
}
