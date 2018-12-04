#version 300 es
precision highp float;

#define IBL 1

in vec4 vColor;
in vec2 outUV;
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
    vec3 lightPos;
    vec3 viewPos;
    mat3 textureMatrix;
    vec3 specularFactor;
    float glossinessFactor;
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

const float RECIPROCAL_PI = 0.31830988618;
const float PI = 3.14159265359;
const float EPSILON = 1e-6;
const float ambientStrength = 0.1;
const float specularStrength = 2.5;
const float specularPower = 32.0;
#ifdef USE_PBR
const vec3 lightColor = vec3(10.0, 10.0, 10.0);
#else
const vec3 lightColor = vec3(1.0, 1.0, 1.0);
#endif
const vec3 emissiveFactor = vec3(1.0, 1.0, 1.0);
const float gamma = 2.2;

vec2 getUV(int index) {
    if (index == 1) {
        return outUV;
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

vec3 IBLAmbient(vec3 specularMap, vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir, float ao) {
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, baseColor, metallic);

    #ifdef SPECULARGLOSSINESSMAP
        F0 = specularMap;
    #endif

    vec3 F = fresnelSchlickRoughness(max(dot(n, viewDir), 0.0), F0, roughness);

    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;

    vec3 R = reflect(-viewDir, n);   
    const float MAX_REFLECTION_LOD = 4.0;
    vec3 prefilteredColor = textureLod(prefilterMap, R,  roughness * MAX_REFLECTION_LOD).rgb;
    vec2 envBRDF  = texture(brdfLUT, vec2(max(dot(n, viewDir), 0.0), roughness)).rg;
    vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y);

    vec3 irradiance = texture(irradianceMap, n).rgb;
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
	if (a > 1.0f) return 1.0f;
	if (a < 0.0f) return 0.0f;
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

void main() {
    #ifdef BASECOLORTEXTURE
        vec2 uv = outUV;
        #ifdef TEXTURE_TRANSFORM
            uv = ( textureMatrix * vec3(uv.xy, 1.0) ).xy;
        #endif
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
    #endif

    if ( length(vColor.rgb) != 0.0 ) {
        baseColor.rgb *= vColor.rgb;
    }

    #ifdef OCCLUSIONMAP
        float ao = texture(occlusionTexture, outUV).r;
    #else
        float ao = 0.2;
    #endif

    float roughness = 0.5;
    float metallic = 0.5;
    vec3 specularMap = vec3(0);
    #ifdef SPECULARGLOSSINESSMAP
        #ifdef METALROUGHNESSMAP
            roughness = 1.0 - texture(metallicRoughnessTexture, outUV).a;
            specularMap = srgbToLinear(texture(metallicRoughnessTexture, outUV));
        #else
            roughness = glossinessFactor;
            specularMap = specularFactor;
        #endif
    #else
        #ifdef METALROUGHNESSMAP
            roughness = texture(metallicRoughnessTexture, outUV).g;
            metallic = texture(metallicRoughnessTexture, outUV).b;
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

    vec3 viewDir = normalize(viewPos - outPosition);
    vec3 lightDir = normalize(lightPos - outPosition);
    float NdotL = max(dot(n, lightDir), 0.0);
    vec3 H = normalize(viewDir + lightDir);
    float distance = length(lightPos - outPosition);
    float attenuation = 1.0 / (distance * distance);
    vec3 radiance = lightColor; //* attenuation;

    float shadow = 1.0;
    #ifdef SHADOWMAP
        float shadowBias = max(0.05 * (1.0 - dot(n, lightDir)), 0.005);
        shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);
    #endif

    #ifdef USE_PBR
        vec3 specular = CookTorranceSpecular(specularMap, baseColor, metallic, n, H, roughness, viewDir, lightDir);
        vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir);
        #ifdef SPECULARGLOSSINESSMAP
            diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));
        #endif

        vec3 ambient = vec3(0.0);
        #ifdef IBL
            ambient = IBLAmbient(specularMap, baseColor, metallic, n, H, roughness, viewDir, lightDir, ao);
        #else
            ambient = vec3(0.03) * baseColor * ao;
        #endif

        vec3 emissive = vec3(0.0);
        #ifdef EMISSIVEMAP
            emissive = srgbToLinear(texture(emissiveTexture, getUV(EMISSIVEMAP))) * emissiveFactor;
        #endif

        color = vec4(shadow * (emissive + ambient + (diffuse + specular) * radiance * NdotL), alpha);
    #else
        vec3 ambient = ambientStrength * lightColor;

        float diff = max(dot(n, lightDir), 0.0);
        vec3 diffuse = diff * lightColor;

        vec3 reflectDir = reflect(-lightDir, n);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
        vec3 specular = specularStrength * spec * lightColor;

        color = vec4(baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);
    #endif

    #ifdef TONE
        color.rgb = color.rgb / (color.rgb + vec3(1.0));
        color.rgb = pow(color.rgb, vec3(1.0 / gamma));
    #endif

    normalColor = n;
}
