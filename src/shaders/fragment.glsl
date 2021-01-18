#version 300 es
precision highp float;

#define IBL 1

in vec4 vColor;
in vec2 outUV0;
in vec2 outUV2;
in vec3 outPosition;
in vec4 outPositionView;
#ifdef TANGENT
    in mat3 outTBN;
#else
    in vec3 outNormal;
#endif

layout (location = 0) out vec4 color;
layout (location = 1) out vec3 normalColor;

uniform Material {
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
uniform SphericalHarmonics {
    mat4 rotationMatrix;
    vec3 vSphericalL00;
    vec3 vSphericalL1_1;
    vec3 vSphericalL10;
    vec3 vSphericalL11;
    vec3 vSphericalL2_2;
    vec3 vSphericalL2_1;
    vec3 vSphericalL20;
    vec3 vSphericalL21;
    vec3 vSphericalL22;
};

uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;
uniform sampler2D emissiveTexture;
uniform sampler2D occlusionTexture;
uniform sampler2D clearcoatTexture;
uniform sampler2D clearcoatRoughnessTexture;
uniform sampler2D sheenColorTexture;
uniform sampler2D sheenRoughnessTexture;
uniform sampler2D clearcoatNormalTexture;

uniform samplerCube prefilterMap;
uniform sampler2D brdfLUT;  
uniform samplerCube irradianceMap;
uniform sampler2D depthTexture;
uniform sampler2D Sheen_E;

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

float ShadowCalculation(vec4 fragPosLightSpace, float bias) {
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;
    float currentDepth = projCoords.z;

    float shadow = 0.0;
    vec2 texelSize = 1.0 / vec2(textureSize(depthTexture, 0));
    for (int x = -2; x <= 2; ++x) {
        for (int y = -2; y <= 2; ++y) {
            float pcfDepth = texture(depthTexture, projCoords.xy + vec2(x, y) * texelSize).r;
            shadow += currentDepth - bias > pcfDepth ? 0.5 : 0.0;
        }
    }
    shadow /= 25.0;

    return shadow;
}

vec3 srgbToLinear(vec4 srgbIn) {
    return pow(srgbIn.rgb, vec3(2.2));
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
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}

vec3 computeEnvironmentIrradiance(vec3 normal) {
    return vSphericalL00
        + vSphericalL1_1 * (normal.y)
        + vSphericalL10 * (normal.z)
        + vSphericalL11 * (normal.x)
        + vSphericalL2_2 * (normal.y * normal.x)
        + vSphericalL2_1 * (normal.y * normal.z)
        + vSphericalL20 * ((3.0 * normal.z * normal.z) - 1.0)
        + vSphericalL21 * (normal.z * normal.x)
        + vSphericalL22 * (normal.x * normal.x - (normal.y * normal.y));
}
vec3 IBLAmbient(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, float roughness, vec3 viewDir, float ao) {
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor, metallic);

    #ifdef SPECULARGLOSSINESSMAP
        F0 = specularMap;
    #endif

    vec3 F = fresnelSchlickRoughness(max(dot(n, viewDir), 0.0), F0, roughness);

    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;

    const float MAX_REFLECTION_LOD = 4.0;
    #ifdef SPHERICAL_HARMONICS
    vec3 R = reflect(viewDir, n);
    vec4 rotatedR = rotationMatrix * vec4(R, 0.0);
    vec3 prefilteredColor = srgbToLinear(textureLod(prefilterMap, rotatedR.xyz, roughness * MAX_REFLECTION_LOD));
    vec3 irradianceVector = vec3(rotationMatrix * vec4(n, 0)).xyz;
    vec3 irradiance = computeEnvironmentIrradiance(irradianceVector).rgb;
    #else
    vec3 R = reflect(-viewDir, n);
    vec3 prefilteredColor = textureLod(prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;
    vec3 irradiance = texture(irradianceMap, n).rgb;
    #endif
    vec2 envBRDF  = texture(brdfLUT, vec2(max(dot(n, viewDir), 0.0), roughness)).rg;
    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);
    vec3 diffuse = baseColor * irradiance;

    return (kD * diffuse + specular) * ao;
}

vec3 CookTorranceSpecular(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir) {
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, baseColor, metallic);

    #ifdef SPECULARGLOSSINESSMAP
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
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;
    vec3 diffuseColor = baseColor * kD;
	// calculate intermediary values
	float dotNL = saturate(dot(N, L));
	float dotNV = saturate(dot(N, V));
	float dotLV = saturate(dot(L, V));
	float dotLH = saturate(dot(L, H));

	float s = dotLV - dotNL * dotNV;
	float t = mix(1.0, max(dotNL, dotNV), step(0.0, s));
	float st = s * (1.0 / (t + EPSILON));

	float sigma2 = a;
	vec3 A = diffuseColor * (0.17 * sigma2 / (sigma2 + 0.13)) + vec3(1.0 - 0.5 * sigma2 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);
	return (diffuseColor * max(0.0, dotNL)) * (A + vec3(B * s / t) / PI);
}

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
float E(float x, float y) {
    return texture(Sheen_E, vec2(x,y)).r;
}

float max3(vec3 v) { return max(max(v.x, v.y), v.z); }

void main() {
    vec2 outUV = outUV0;
    #ifdef TEXTURE_TRANSFORM
        outUV = ( textureMatrix * vec3(outUV.xy, 1.0) ).xy;
    #endif
    #ifdef BASECOLORTEXTURE
        vec2 uv = outUV;
        vec3 baseColor = srgbToLinear(texture(baseColorTexture, uv)) * baseColorFactor.rgb;
        float alpha = min(texture(baseColorTexture, uv).a, baseColorFactor.a);
    #else
        vec3 baseColor = baseColorFactor.rgb;
        float alpha = baseColorFactor.a;
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

    #ifdef OCCLUSIONMAP
        float ao = texture(occlusionTexture, outUV).r;
    #else
        float ao = 0.2;
    #endif

    float roughness = roughnessFactor.x;
    float metallic = metallicFactor.x;
    float clearcoatRoughness = clearcoatRoughnessFactor.x;
    float clearcoat = clearcoatFactor.x;
    float clearcoatBlendFactor = clearcoat;
    vec3 sheenColor = sheenColorFactor.xyz;
    float sheenRoughness = sheenRoughnessFactor.x;
    #ifdef CLEARCOATMAP
        clearcoatBlendFactor = texture(clearcoatTexture, outUV).r * clearcoat;
    #endif
    #ifdef CLEARCOATROUGHMAP
        clearcoatRoughness = texture(clearcoatRoughnessTexture, outUV).g * clearcoatRoughness;
    #endif
    #ifdef SHEENMAP
        vec4 sheenRoughnessTextureV = texture(sheenRoughnessTexture, outUV);
        vec3 sheenColorTextureV = srgbToLinear(texture(sheenColorTexture, outUV));
        sheenColor = sheenColorTextureV * sheenColor;
        sheenRoughness = sheenRoughnessTextureV.a * sheenRoughness;
    #endif
    vec3 specularMap = vec3(0);
    #ifdef SPECULARGLOSSINESSMAP
        #ifdef METALROUGHNESSMAP
            roughness = 1.0 - texture(metallicRoughnessTexture, outUV).a;
            specularMap = srgbToLinear(texture(metallicRoughnessTexture, outUV));
        #else
            roughness = glossinessFactor.x;
            specularMap = specularFactor;
        #endif
    #else
        #ifdef METALROUGHNESSMAP
            vec4 metallicRoughness = texture(metallicRoughnessTexture, outUV);
            roughness *= metallicRoughness.g;
            metallic *= metallicRoughness.b;
        #endif
    #endif

    #ifdef TANGENT
        #ifdef NORMALMAP
            vec3 n = texture(normalTexture, outUV).rgb;
            n = normalize(outTBN * (2.0 * n - 1.0));
        #else
            vec3 n = outTBN[2].xyz;
        #endif
    #else
        vec3 n = outNormal;
    #endif

    #ifdef TANGENT
    #ifdef CLEARCOATNORMALMAP
        vec3 clearcoatNormal = texture(clearcoatNormalTexture, outUV).rgb;
        clearcoatNormal = normalize(outTBN * (2.0 * clearcoatNormal - 1.0));
    #else
        vec3 clearcoatNormal = outTBN[2].xyz;
    #endif
    #else
        vec3 clearcoatNormal = outNormal;
    #endif

    vec3 viewDir = normalize(viewPos - outPosition);

    #ifdef DOUBLESIDED
    if (dot(n, viewDir) < 0.0) {
        n = -n;
        clearcoatNormal = -clearcoatNormal;
    }
    #endif

    float shadow = 1.0;
    #ifdef SHADOWMAP
        vec3 l = normalize(lightPos[0] - outPosition);
        float shadowBias = max(0.05 * (1.0 - dot(n, l)), 0.005);
        shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);
    #endif

    #ifdef USE_PBR
        vec3 Lo = vec3(0.0);
        for (int i = 0; i < LIGHTNUMBER; ++i) {
            vec3 lightDir = normalize(lightPos[i] - outPosition);
            float NdotL = max(dot(n, lightDir), 0.0);
            vec3 H = normalize(viewDir + lightDir);

            vec3 radiance = lightColor[i] * lightIntensity[i].x;
            float distance = length(lightPos[i] - outPosition);
            float attenuation = 1.0 / (distance * distance);
            if (lightIntensity[i].w == 1.0) { // point
                radiance = radiance * attenuation;
            }
            if (lightIntensity[i].w == 2.0) { // spot
                float lightAngleScale = 1.0 / max(0.001, cos(lightIntensity[i].y) - cos(lightIntensity[i].z));
                float lightAngleOffset = -cos(lightIntensity[i].z) * lightAngleScale;

                float cd = dot(spotdir[i], lightDir);
                float attenuationSpot = saturate(cd * lightAngleScale + lightAngleOffset);
                attenuationSpot *= attenuationSpot;

                radiance = radiance * attenuationSpot * attenuation;
            }

            vec3 specular = CookTorranceSpecular(specularMap, baseColor, metallic, n, H, roughness, viewDir, lightDir);
            vec3 f_clearcoat = CookTorranceSpecular(specularMap, vec3(0.0), 0.0, clearcoatNormal, H, clearcoatRoughness, viewDir, lightDir);
            float NdotV = saturate(dot(clearcoatNormal, viewDir));
            vec3 clearcoatFresnel = 1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04));
            vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir);
            #ifdef SPECULARGLOSSINESSMAP
                diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));
            #endif
            vec3 f_sheen = sheenColor * sheenDistribution(sheenRoughness, n, H) * sheenVisibility(n, viewDir, lightDir, sheenRoughness);
            float sheenAlbedoScaling = min(1.0 - max3(sheenColor) * E(max(dot(viewDir, n), 0.0), sheenRoughness), 1.0 - max3(sheenColor) * E(max(dot(lightDir, n), 0.0), sheenRoughness));

            Lo += sheenAlbedoScaling * (diffuse + specular * NdotL) * radiance * clearcoatFresnel + f_clearcoat * clearcoatBlendFactor + f_sheen;
        }

        vec3 ambient = vec3(0.0);
        vec3 ambientClearcoat = vec3(0.0);
        vec3 clearcoatFresnel = vec3(1.0);
        #ifdef IBL
            ambient = max(vec3(0.03) * baseColor, IBLAmbient(specularMap, baseColor, metallic, n, roughness, viewDir, ao));
            ambientClearcoat = IBLAmbient(specularMap, vec3(0.0), 0.0, clearcoatNormal, clearcoatRoughness, viewDir, ao) * clearcoatBlendFactor;
            float NdotV = saturate(dot(clearcoatNormal, viewDir));
            clearcoatFresnel = (1.0 - clearcoatBlendFactor * fresnelSchlick(NdotV, vec3(0.04)));
        #else
            ambient = vec3(0.03) * baseColor * ao;
        #endif

        vec3 emissive = emissiveFactor;
        #ifdef EMISSIVEMAP
            emissive = srgbToLinear(texture(emissiveTexture, getUV(EMISSIVEMAP)));
        #endif

        color = vec4(shadow * ((emissive + ambient + Lo) * clearcoatFresnel + ambientClearcoat), alpha);
    #else
        vec3 lightDir = normalize(lightPos[0] - outPosition);
        vec3 ambient = ambientStrength * lightColor[0];

        float diff = max(dot(n, lightDir), 0.0);
        vec3 diffuse = diff * lightColor[0];

        vec3 reflectDir = reflect(-lightDir, n);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
        vec3 specular = specularStrength * spec * lightColor[0];

        color = vec4(baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);
    #endif

    #ifdef TONE
        color.rgb = color.rgb / (color.rgb + vec3(1.0));
        color.rgb = pow(color.rgb, vec3(1.0 / gamma));
    #endif

    normalColor = n;
}
