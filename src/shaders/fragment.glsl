#version 300 es
precision highp float;

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
layout (location = 1) out vec3 normalColor;

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
    vec4 attenuationColor; 
    vec4 attenuationDistance; 
    vec4 thicknessFactor;
    vec4 emissiveStrength;
    vec4 anisotropy;
    vec4 iridescence;
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

uniform samplerCube prefilterMap;
uniform samplerCube charlieMap;
uniform sampler2D brdfLUT;  
uniform samplerCube irradianceMap;
uniform sampler2D depthTexture;
uniform sampler2D colorTexture;
uniform int isTone;
uniform int isIBL;
uniform int isDefaultLight;
uniform sampler2D Sheen_E;

const float RECIPROCAL_PI = 0.31830988618;
const float PI = 3.141592653589793;
const float EPSILON = 1e-6;
const float ambientStrength = 0.1;
const float specularStrength = 2.5;
const float specularPower = 32.0;
const float gamma = 2.2;


vec2 getUV(int index) {
    if (index == 2) {
        return outUV3;
    }
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
    #ifdef BASISU
    return srgbIn.rgb;
    #else
    return pow(srgbIn.rgb, vec3(2.2));
    #endif
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (vec3(1.0) - F0) * pow(1.0 - cosTheta, 5.0);
}
float fresnelSchlick(float cosTheta, float F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}
vec3 Schlick_to_F0(vec3 f, vec3 f90, float VdotH) {
    float x = clamp(1.0 - VdotH, 0.0, 1.0);
    float x2 = x * x;
    float x5 = clamp(x * x2 * x2, 0.0, 0.9999);

    return (f - f90 * x5) / (1.0 - x5);
}
vec3 Schlick_to_F0(vec3 f, float VdotH) {
    return Schlick_to_F0(f, vec3(1.0), VdotH);
}
float sq(float t) {
    return t * t;
}
vec3 sq(vec3 t) {
    return t * t;
}
// XYZ to sRGB color space
const mat3 XYZ_TO_REC709 = mat3(
     3.2404542, -0.9692660,  0.0556434,
    -1.5371385,  1.8760108, -0.2040259,
    -0.4985314,  0.0415560,  1.0572252
);

float applyIorToRoughness(float roughness, float ior) {
    #if defined VOLUME
    // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
    // an IOR of 1.5 results in the default amount of microfacet refraction.
    return roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
    #else
    return roughness;
    #endif
}

// Assume air interface for top
// Note: We don't handle the case fresnel0 == 1
vec3 Fresnel0ToIor(vec3 fresnel0) {
    vec3 sqrtF0 = sqrt(fresnel0);
    return (vec3(1.0) + sqrtF0) / (vec3(1.0) - sqrtF0);
}

// Conversion FO/IOR
vec3 IorToFresnel0(vec3 transmittedIor, float incidentIor) {
    return sq((transmittedIor - vec3(incidentIor)) / (transmittedIor + vec3(incidentIor)));
}

// ior is a value between 1.0 and 3.0. 1.0 is air interface
float IorToFresnel0(float transmittedIor, float incidentIor) {
    return sq((transmittedIor - incidentIor) / (transmittedIor + incidentIor));
}

// Fresnel equations for dielectric/dielectric interfaces.
// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
// Evaluation XYZ sensitivity curves in Fourier space
vec3 evalSensitivity(float OPD, vec3 shift) {
    float phase = 2.0 * PI * OPD * 1.0e-9;
    vec3 val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
    vec3 pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);
    vec3 var = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);

    vec3 xyz = val * sqrt(2.0 * PI * var) * cos(pos * phase + shift) * exp(-sq(phase) * var);
    xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09) * cos(2.2399e+06 * phase + shift[0]) * exp(-4.5282e+09 * sq(phase));
    xyz /= 1.0685e-7;

    vec3 srgb = XYZ_TO_REC709 * xyz;
    return srgb;
}

vec3 evalIridescence(float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0) {
    vec3 I;

    // Force iridescenceIOR -> outsideIOR when thinFilmThickness -> 0.0
    float iridescenceIOR = mix(outsideIOR, eta2, smoothstep(0.0, 0.03, thinFilmThickness));
    // Evaluate the cosTheta on the base layer (Snell law)
    float sinTheta2Sq = sq(outsideIOR / iridescenceIOR) * (1.0 - sq(cosTheta1));

    // Handle TIR:
    float cosTheta2Sq = 1.0 - sinTheta2Sq;
    if (cosTheta2Sq < 0.0) {
        return vec3(1.0);
    }

    float cosTheta2 = sqrt(cosTheta2Sq);

    // First interface
    float R0 = IorToFresnel0(iridescenceIOR, outsideIOR);
    float R12 = fresnelSchlick(cosTheta1, R0);
    float R21 = R12;
    float T121 = 1.0 - R12;
    float phi12 = 0.0;
    if (iridescenceIOR < outsideIOR) phi12 = PI;
    float phi21 = PI - phi12;

    // Second interface
    vec3 baseIOR = Fresnel0ToIor(clamp(baseF0, 0.0, 0.9999)); // guard against 1.0
    vec3 R1 = IorToFresnel0(baseIOR, iridescenceIOR);
    vec3 R23 = fresnelSchlick(cosTheta2, R1);
    vec3 phi23 = vec3(0.0);
    if (baseIOR[0] < iridescenceIOR) phi23[0] = PI;
    if (baseIOR[1] < iridescenceIOR) phi23[1] = PI;
    if (baseIOR[2] < iridescenceIOR) phi23[2] = PI;

    // Phase shift
    float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
    vec3 phi = vec3(phi21) + phi23;

    // Compound terms
    vec3 R123 = clamp(R12 * R23, 1e-5, 0.9999);
    vec3 r123 = sqrt(R123);
    vec3 Rs = sq(T121) * R23 / (vec3(1.0) - R123);

    // Reflectance term for m = 0 (DC term amplitude)
    vec3 C0 = R12 + Rs;
    I = C0;

    // Reflectance term for m > 0 (pairs of diracs)
    vec3 Cm = Rs - T121;
    for (int m = 1; m <= 2; ++m)
    {
        Cm *= r123;
        vec3 Sm = 2.0 * evalSensitivity(float(m) * OPD, float(m) * phi);
        I += Cm * Sm;
    }

    // Since out of gamut colors might be produced, negative color values are clamped to 0.
    return max(I, vec3(0.0));
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float NdotH = max(dot(N, H), 0.01);
    float a = max(roughness*roughness, 0.01);
    float alphaRoughnessSq = a * a;
    float f = (NdotH * NdotH) * (alphaRoughnessSq - 1.0) + 1.0;
    return alphaRoughnessSq / (PI * f * f);
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

float fresnelSchlickRoughness(float cosTheta, float F0, float roughness) {
    return F0 + (max(1.0 - roughness, F0) - F0) * pow(1.0 - cosTheta, 5.0);
}
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}
vec3 calcTransmission(vec3 color, vec3 N, float roughness, vec3 V, float transmission, float thickness) {
    vec4 refractS = projection * view * vec4(outPosition + refract(-V, N, 1.0 / ior.x) * thickness, 1.0);
    refractS.xy = refractS.xy / refractS.w;
    refractS.xy = refractS.xy * 0.5 + 0.5;
    const float MAX_REFLECTION_LOD = 10.0;
    vec3 baseColor = textureLod(colorTexture, refractS.xy, applyIorToRoughness(roughness, ior.x) * MAX_REFLECTION_LOD).xyz;

    return transmission * baseColor * color;
}

vec3 computeEnvironmentIrradiance(vec3 normal) {
    return vSphericalL00.xyz
        + vSphericalL1_1.xyz * (normal.y)
        + vSphericalL10.xyz * (normal.z)
        + vSphericalL11.xyz * (normal.x)
        + vSphericalL2_2.xyz * (normal.y * normal.x)
        + vSphericalL2_1.xyz * (normal.y * normal.z)
        + vSphericalL20.xyz * ((3.0 * normal.z * normal.z) - 1.0)
        + vSphericalL21.xyz * (normal.z * normal.x)
        + vSphericalL22.xyz * (normal.x * normal.x - (normal.y * normal.y));
}
float sheenDistribution(float sheenRoughness, vec3 N, vec3 H) {
    float NdotH = max(dot(N, H), 0.0);
    float alphaG = max(sheenRoughness * sheenRoughness, 0.01);
    float invR = 1.0 / alphaG;
    float cos2h = NdotH * NdotH;
    float sin2h = 1.0 - cos2h;
    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);
}
float lambdaSheenNumericHelper(float x, float alphaG) {
    float oneMinusAlphaSq = (1.0 - alphaG) * (1.0 - alphaG);
    float a = mix(21.5473, 25.3245, oneMinusAlphaSq);
    float b = mix(3.82987, 3.32435, oneMinusAlphaSq);
    float c = mix(0.19823, 0.16801, oneMinusAlphaSq);
    float d = mix(-1.97760, -1.27393, oneMinusAlphaSq);
    float e = mix(-4.32054, -4.85967, oneMinusAlphaSq);
    return a / (1.0 + b * pow(x, c)) + d * x + e;
}
float lambdaSheen(float cosTheta, float alphaG) {
    if (abs(cosTheta) < 0.5) {
        return exp(lambdaSheenNumericHelper(cosTheta, alphaG));
    } else {
        return exp(2.0 * lambdaSheenNumericHelper(0.5, alphaG) - lambdaSheenNumericHelper(1.0 - cosTheta, alphaG));
    }
}
float sheenVisibility(vec3 N, vec3 V, vec3 L, float sheenRoughness) {
    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);

    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]
    float alphaG = sheenRoughness * sheenRoughness;

    return clamp(1.0 / ((1.0 + lambdaSheen(NdotV, alphaG) + lambdaSheen(NdotL, alphaG)) *
        (4.0 * NdotV * NdotL)), 0.0, 1.0);
}
float E(float x, float y) {
    return texture(Sheen_E, vec2(x,y)).r;
}
float max3(vec3 v) { return max(max(v.x, v.y), v.z); }
vec3 IBLAmbient(vec3 baseColor, float metallic, vec3 n, float roughness, vec3 viewDir, float transmission, vec3 sheenColor, float sheenRoughness, vec3 iridescenceFresnel, float iridescenceFactor, vec3 F0, float specularWeight, inout vec3 f_sheen, out vec3 specular) {
    vec3 F = fresnelSchlickRoughness(max(dot(n, viewDir), 0.0), F0, roughness);

    vec3 kD = vec3(1.0) - F * specularWeight;
    #if defined SPECULARGLOSSINESSMAP
    #else
        kD *= 1.0 - clamp(metallic, 0.0, 0.9);
    #endif
    #if defined IRIDESCENCE
    kD = vec3(1.0) - mix(F, iridescenceFresnel, iridescenceFactor) * specularWeight;
    kD *= 1.0 - clamp(metallic, 0.0, 0.9);
    #endif

    vec3 R;
    #ifdef SPHERICAL_HARMONICS
    R = reflect(viewDir, n);
    vec4 rotatedR = rotationMatrix * vec4(R.x * -1.0, R.y, R.z, 0.0);
    R = rotatedR.xyz;
    vec4 prefilterColor = textureLod(prefilterMap, R, roughness * float(SPHERICAL_HARMONICS));
    vec3 prefilteredColor = srgbToLinear(vec4(prefilterColor.rgb, 0.0)) / pow(prefilterColor.a, 2.2);
    vec3 irradianceVector = vec3(rotationMatrix * vec4(n.x, n.y, n.z * -1.0, 0)).xyz;
    vec3 irradiance = computeEnvironmentIrradiance(irradianceVector).rgb;
    #else
    const float MAX_REFLECTION_LOD = 4.0;
    R = reflect(-viewDir, n);
    vec3 prefilteredColor = textureLod(prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;
    vec3 irradiance = texture(irradianceMap, n).rgb;
    #endif
    vec2 envBRDF  = texture(brdfLUT, vec2(max(dot(n, viewDir), 0.0), roughness)).rg;
    vec3 kS = F;
    #if defined IRIDESCENCE
    kS = mix(F, iridescenceFresnel, iridescenceFactor);
    #endif
    specular = prefilteredColor * (kS * specularWeight * envBRDF.x + envBRDF.y);

    #if defined SHEEN
    float charliebrdf = texture(brdfLUT, vec2(max(dot(n, viewDir), 0.0), sheenRoughness)).b;
    vec3 sheenSample = textureLod(charlieMap, R, sheenRoughness * MAX_REFLECTION_LOD).rgb;
    f_sheen += sheenSample * sheenColor * charliebrdf;
    #endif

    return (1.0 - transmission) * kD * irradiance * baseColor;
}

float specEnv(vec3 N, vec3 V, float metallic, float roughness, vec3 F0, float specularWeight) {
    float F = fresnelSchlickRoughness(max(dot(N, V), 0.0), (F0.x+F0.y+F0.z)/3.0, roughness);
    vec2 envBRDF  = texture(brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;
    return (F * specularWeight * envBRDF.x + envBRDF.y);
}

vec3 CookTorranceSpecular2(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 iridescenceFresnel, float iridescenceFactor, vec3 F0, float specularWeight) {
    float D = DistributionGGX(n, H, roughness);
    float G = GeometrySmith(n, viewDir, lightDir, roughness);
    vec3 F = mix(fresnelSchlick(max(dot(viewDir, H), 0.0), F0), iridescenceFresnel, iridescenceFactor);

    vec3 nominator = D * G * F * specularWeight;
    float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);
    return nominator / max(denominator, 0.001);
}

vec3 CookTorranceSpecular(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 F0, float specularWeight) {
    float D = DistributionGGX(n, H, roughness);
    float G = GeometrySmith(n, viewDir, lightDir, roughness);
    vec3 F = fresnelSchlick(max(dot(viewDir, H), 0.0), F0); 

    vec3 nominator = D * G * F * specularWeight;
    float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);
    return nominator / max(denominator, 0.001);
}

vec3 LambertDiffuse(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir, vec3 F0, float specularWeight) {
    float NdotL = max(dot(n, lightDir), 0.0);

    vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);    

    vec3 kD = vec3(1.0) - F * specularWeight;
    #if defined SPECULARGLOSSINESSMAP
    #else
        kD *= 1.0 - metallic;
    #endif
    return baseColor * kD / PI;
}

float saturate(float a) {
	if (a > 1.0) return 1.0;
	if (a < 0.0) return 0.0;
	return a;
}
vec3 ImprovedOrenNayarDiffuse(vec3 baseColor, float metallic, vec3 N, vec3 H, float a, vec3 V, vec3 L, vec3 F0, vec3 iridescenceFresnel, float iridescenceFactor, float specularWeight) {
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
    vec3 kD = vec3(1.0) - F * specularWeight;
    #if defined SPECULARGLOSSINESSMAP
    #else
        kD *= 1.0 - metallic;
    #endif
    #if defined IRIDESCENCE
    kD = vec3(1.0) - mix(F, iridescenceFresnel, iridescenceFactor) * specularWeight;
    kD *= 1.0 - clamp(metallic, 0.0, 0.9);
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
	return (diffuseColor * max(0.0, dotNL)) * (A + vec3(B * s / t) / PI) / PI;
}

vec2 applyTransform(vec2 uv, mat4 textureMatrix) {
    mat3 translation = mat3(1, 0, 0, 0, 1, 0, textureMatrix[0].x, textureMatrix[0].y, 1);
    mat3 rotation = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    if (textureMatrix[2].x != 0.0) {
        rotation = mat3(
            cos(-textureMatrix[2].x), sin(-textureMatrix[2].x), 0,
            -sin(-textureMatrix[2].x), cos(-textureMatrix[2].x), 0,
            0, 0, 1
        );
    }
    mat3 scale = mat3(textureMatrix[1].x, 0, 0, 0, textureMatrix[1].y, 0, 0, 0, 1);

    mat3 matrix = translation * rotation * scale;
    vec2 outUV = ( matrix * vec3(uv, 1.0) ).xy;
    return outUV;
}

vec3 cocaLambert(vec3 alpha, float distance) {
    return exp(-alpha*distance);
}

vec3 computeColorAtDistanceInMedia(vec3 color, float distance) {
    return -log(color)/distance;
}

void main() {
    vec2 outUV = outUV0;
    #ifdef BASECOLORTEXTURE
        outUV = getUV(BASECOLORTEXTURE);
        #ifdef BASECOLORTEXTURE_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[BASECOLORTEXTURE_TEXTURE_TRANSFORM]);
        #endif
        vec3 baseColor = texture(baseColorTexture, outUV).rgb * baseColorFactor.rgb;
        float alpha = min(texture(baseColorTexture, outUV).a, baseColorFactor.a);
    #else
        vec3 baseColor = baseColorFactor.rgb;
        float alpha = baseColorFactor.a;
    #endif

    #ifdef ALPHATEST
    if ( alpha < ALPHATEST ) {
        discard;
    }
    if ( ALPHATEST > 0.01 ) {
        alpha = 1.0;
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

    float ao = 1.0;
    #ifdef OCCLUSIONMAP
        outUV = getUV(OCCLUSIONMAP);
        #ifdef OCCLUSIONMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[OCCLUSIONMAP_TEXTURE_TRANSFORM]);
        #endif
        ao = texture(occlusionTexture, outUV).r;
    #endif

    float roughness = roughnessFactor.x;
    float metallic = metallicFactor.x;
    float clearcoatRoughness = clearcoatRoughnessFactor.x;
    float clearcoat = clearcoatFactor.x;
    float clearcoatBlendFactor = clearcoat;
    vec3 sheenColor = sheenColorFactor.xyz;
    float sheenRoughness = sheenRoughnessFactor.x;
    float transmission = transmissionFactor.x;
    float thickness = clamp(thicknessFactor.x, 0.0, 1.0);
    #ifdef CLEARCOATMAP
        outUV = getUV(CLEARCOATMAP);
        #ifdef CLEARCOATMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATMAP_TEXTURE_TRANSFORM]);
        #endif
        clearcoatBlendFactor = texture(clearcoatTexture, outUV).r * clearcoat;
    #endif
    #ifdef CLEARCOATROUGHMAP
        outUV = getUV(CLEARCOATROUGHMAP);
        #ifdef CLEARCOATROUGHMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATROUGHMAP_TEXTURE_TRANSFORM]);
        #endif
        clearcoatRoughness = texture(clearcoatRoughnessTexture, outUV).g * clearcoatRoughness;
    #endif
    #ifdef SHEENMAP
        outUV = getUV(SHEENMAP);
        #ifdef SHEENMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[SHEENMAP_TEXTURE_TRANSFORM]);
        #endif
        vec3 sheenColorTextureV = texture(sheenColorTexture, outUV).rgb;
        sheenColor = sheenColorTextureV * sheenColor;
    #endif
    #ifdef SHEENROUGHNESSMAP
        outUV = getUV(SHEENROUGHNESSMAP);
        #ifdef SHEENROUGHNESSMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[SHEENROUGHNESSMAP_TEXTURE_TRANSFORM]);
        #endif
    vec4 sheenRoughnessTextureV = texture(sheenRoughnessTexture, outUV);
    sheenRoughness = sheenRoughnessTextureV.a * sheenRoughness;
    #endif
    float iridescenceThickness = iridescence.z;
    #ifdef IRIDESCENCEMAP
        iridescenceThickness = mix(iridescence.w, iridescence.z, texture(iridescenceThicknessTexture, outUV).g);
    #endif
    #ifdef TRANSMISSIONMAP
        float transmissionTextureV = texture(transmissionTexture, outUV).r;
        transmission = transmissionTextureV * transmission;
    #endif
    #ifdef THICKNESSMAP
        float thicknessTextureV = texture(thicknessTexture, outUV).g;
        thickness = thicknessTextureV * thickness;
    #endif
    vec3 specularMap = vec3(0);
    #ifdef SPECULARGLOSSINESSMAP
        #ifdef METALROUGHNESSMAP
            outUV = getUV(METALROUGHNESSMAP);
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV, textureMatrices[METALROUGHNESSMAP_TEXTURE_TRANSFORM]);
            #endif
            roughness = 1.0 - texture(metallicRoughnessTexture, outUV).a;
            specularMap = texture(metallicRoughnessTexture, outUV).rgb;
        #else
            roughness = glossinessFactor.x;
            specularMap = specularFactor;
        #endif
    #else
        #ifdef METALROUGHNESSMAP
            outUV = getUV(METALROUGHNESSMAP);
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV, textureMatrices[METALROUGHNESSMAP_TEXTURE_TRANSFORM]);
            #endif
            vec4 metallicRoughness = texture(metallicRoughnessTexture, outUV);
            roughness *= metallicRoughness.g;
            metallic *= metallicRoughness.b;
        #endif
    #endif
    float specularWeight = 1.0;
    #ifdef SPECULAR
        specularMap = specularColorFactor;
        #ifdef SPECULARCOLORMAP
        specularMap *= texture(specularColorTexture, outUV).rgb;
        #endif
        specularWeight = specularFactor.x;
        #ifdef SPECULARMAP
        specularWeight *= texture(specularTexture, outUV).a;
        #endif
    #endif
    vec3 F0 = mix(vec3(0.04), baseColor, metallic);
    #if defined IOR
    F0 = vec3(pow(( ior.x - 1.0) /  (ior.x + 1.0), 2.0));
    #endif
    #if defined SPECULAR
    F0 = mix(min(F0 * specularMap, vec3(1.0)), baseColor, metallic);
    #endif
    #if defined SPECULARGLOSSINESSMAP
        F0 = specularMap;
    #endif

    #ifdef TANGENT
        #ifdef NORMALMAP
            outUV = getUV(NORMALMAP);
            #ifdef NORMALMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV, textureMatrices[NORMALMAP_TEXTURE_TRANSFORM]);
            #endif
            vec3 n = texture(normalTexture, outUV).rgb;
            n = normalize(outTBN * (2.0 * n - 1.0) * vec3(normalTextureScale.x, normalTextureScale.x, 1.0));
        #else
            vec3 n = normalize(outTBN[2].xyz);
        #endif
    #else
        vec3 n = normalize(outNormal);
    #endif

    #ifdef TANGENT
    #ifdef CLEARCOATNORMALMAP
        outUV = getUV(CLEARCOATNORMALMAP);
        #ifdef CLEARCOATNORMALMAP_TEXTURE_TRANSFORM
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATNORMALMAP_TEXTURE_TRANSFORM]);
        #endif
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
        vec3 f_sheen = vec3(0.0);
        float albedoSheenScaling = 1.0;
        vec3 Lo = vec3(0.0);
        if (isDefaultLight == 1) {
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

            float NdotV = saturate(dot(n, viewDir));
            vec3 iridescenceF0 = vec3(0.0);
            #if defined IRIDESCENCE
            vec3 iridescenceFresnel = evalIridescence(1.0, iridescence.y, NdotV, iridescenceThickness, F0);
            iridescenceF0 = Schlick_to_F0(iridescenceFresnel, NdotV);
            vec3 specular = CookTorranceSpecular2(baseColor, metallic, n, H, roughness, viewDir, lightDir, anisotropy.x, iridescenceF0, iridescence.x, F0, specularWeight);
            #else
            vec3 specular = CookTorranceSpecular(baseColor, metallic, n, H, roughness, viewDir, lightDir, anisotropy.x, F0, specularWeight);
            #endif
            vec3 f_clearcoat = CookTorranceSpecular(vec3(0.0), 0.0, clearcoatNormal, H, clearcoatRoughness, viewDir, lightDir, anisotropy.x, F0, specularWeight);
            vec3 clearcoatFresnel = 1.0 - clearcoatBlendFactor * fresnelSchlick(saturate(dot(clearcoatNormal, viewDir)), vec3(0.04));
            vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir, F0, iridescenceF0, iridescence.x, specularWeight);
            #if defined SPECULARGLOSSINESSMAP
                diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));
            #endif
            #if defined SHEEN
            f_sheen = NdotL * (sheenColor * sheenDistribution(sheenRoughness, n, H) * sheenVisibility(n, viewDir, lightDir, sheenRoughness));
            albedoSheenScaling = min(1.0 - max3(sheenColor) * E(max(dot(viewDir, n), 0.0), sheenRoughness), 1.0 - max3(sheenColor) * E(max(dot(lightDir, n), 0.0), sheenRoughness));
            #endif

            diffuse *= (1.0 - transmission);
            Lo +=  (diffuse + specular * NdotL) * radiance * clearcoatFresnel + f_clearcoat * clearcoatBlendFactor;
        }
        }

        vec3 ambient = vec3(0.0);
        vec3 ambientClearcoat = vec3(0.0);
        vec3 clearcoatFresnel = vec3(1.0);
        vec3 f_transmission = cocaLambert(computeColorAtDistanceInMedia(attenuationColor.rgb, attenuationDistance.x), thickness) * calcTransmission(baseColor, n, roughness, viewDir, transmission, thickness);
        vec3 aSpecular;
        vec3 cSpecular;
        if (isIBL == 1) {
            float NdotV = saturate(dot(n, viewDir));
            vec3 iridescenceFresnel = evalIridescence(1.0, iridescence.y, NdotV, iridescenceThickness, F0);
            vec3 iridescenceF0 = Schlick_to_F0(iridescenceFresnel, NdotV);
            ambient = IBLAmbient(baseColor, metallic, n, roughness, viewDir, transmission, sheenColor, sheenRoughness, iridescenceF0, iridescence.x, F0, specularWeight, f_sheen, aSpecular);
            vec3 placeholder = vec3(0.0);
            ambientClearcoat = IBLAmbient(vec3(0.0), 0.0, clearcoatNormal, clearcoatRoughness, viewDir, transmission, sheenColor, sheenRoughness, iridescenceF0, iridescence.x, F0, specularWeight, placeholder, cSpecular) * clearcoatBlendFactor;
            #ifndef SPHERICAL_HARMONICS
            ambient += aSpecular;
            ambientClearcoat += cSpecular * clearcoatBlendFactor;
            #endif
            clearcoatFresnel = (1.0 - clearcoatBlendFactor * fresnelSchlick(saturate(dot(clearcoatNormal, viewDir)), vec3(0.04)));
        } else {
            ambient = vec3(0.03) * baseColor * 0.2;
        }

        vec3 emissive = emissiveFactor;
        #ifdef EMISSIVEMAP
            outUV = getUV(EMISSIVEMAP);
            #ifdef EMISSIVEMAP_TEXTURE_TRANSFORM
                outUV = applyTransform(outUV, textureMatrices[EMISSIVEMAP_TEXTURE_TRANSFORM]);
            #endif
            emissive *= texture(emissiveTexture, outUV).rgb;
        #endif
        emissive *= emissiveStrength.x;

        #ifdef TRANSMISSION
        float kT = 1.0 - specEnv(n, viewDir, metallic, roughness, F0, specularWeight);
        color = vec4((ambient + Lo + f_transmission * kT) * clearcoatFresnel + ambientClearcoat, alpha);
        #else
        color = vec4(ao * ((emissive + ambient + Lo) * clearcoatFresnel + ambientClearcoat), alpha);
        #endif

        color.rgb = f_sheen + color.rgb * albedoSheenScaling;
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

    if (isTone == 1) {
        #ifdef SPHERICAL_HARMONICS
        color.rgb  *= 4.0;
        vec3 X = max(vec3(0.0, 0.0, 0.0), color.rgb - 0.004);
        vec3 retColor = (X * (6.2 * X + 0.5)) / (X * (6.2 * X + 1.7) + 0.06);
        color.rgb = retColor * retColor;
        #else
        // color.rgb = color.rgb / (color.rgb + vec3(1.0));
        color.rgb = pow(color.rgb, vec3(1.0 / gamma));
        #endif
    }

    #ifdef SPHERICAL_HARMONICS
    color.rgb += aSpecular;
    #endif

    normalColor = n;
}
