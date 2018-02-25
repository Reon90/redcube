#version 300 es
precision highp float;

in vec2 outUV;
in vec3 outPosition;
#ifdef TANGENT
    in mat3 outTBN;
#else
    in vec3 outNormal;
#endif

out vec4 color;

uniform Material {
    vec4 baseColorFactor;
    vec3 lightPos;
    vec3 viewPos;
};
uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;
uniform sampler2D emissiveTexture;
uniform sampler2D occlusionTexture;

const float PI = 3.14159265359;
const float ambientStrength = 0.1;
const float specularStrength = 0.5;
const float specularPower = 32.0;
const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const float occlusionStrength = 0.5;
const vec3 emissiveFactor = vec3(1.0, 1.0, 1.0);

vec3 srgbToLinear(vec4 srgbIn) {
    return pow(srgbIn.rgb, vec3(2.2));
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.001);
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

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

void main() {
    #ifdef BASECOLORTEXTURE
        vec3 baseColor = srgbToLinear(texture(baseColorTexture, outUV));
    #else
        vec4 baseColor = baseColorFactor;
    #endif

    #ifdef OCCLUSIONMAP
        float ao = texture(occlusionTexture, outUV).r;
    #endif

    #ifdef METALROUGHNESSMAP
        float roughness = texture(metallicRoughnessTexture, outUV).g;
        float metallic = texture(metallicRoughnessTexture, outUV).b;
    #endif

    #ifdef EMISSIVEMAP
        vec3 emissive = srgbToLinear(texture(emissiveTexture, outUV)) * emissiveFactor;
        baseColor.rgb += emissive;
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
    vec3 H = normalize(viewDir + lightDir);
    float distance = length(lightPos - outPosition);
    float attenuation = 1.0 / (distance * distance);
    vec3 radiance = lightColor * attenuation;

    #ifdef USE_PBR
        vec3 F0 = vec3(0.04); 
        F0 = mix(F0, baseColor, metallic);

        vec3 light = vec3(0.0);

        float NDF = DistributionGGX(n, H, roughness);        
        float G = GeometrySmith(n, viewDir, lightDir, roughness);      
        vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);       
        
        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;     
        
        vec3 nominator = NDF * G * F;
        float denominator = 4.0 * max(dot(n, viewDir), 0.0) * max(dot(n, lightDir), 0.0);
        vec3 specular = nominator / max(denominator, 0.001);  

        float NdotL = max(dot(n, lightDir), 0.0);                
        light += (kD * baseColor / PI + specular) * radiance * NdotL;

        vec3 ambient = vec3(0.03) * baseColor * ao;
        baseColor = ambient + light;

        baseColor = baseColor / (baseColor + vec3(1.0));
        baseColor = pow(baseColor, vec3(1.0 / 2.2));  
   
        color = vec4(baseColor, 1.0);
    #else
        vec3 ambient = ambientStrength * lightColor;

        float diff = max(dot(n, lightDir), 0.0);
        vec3 diffuse = diff * lightColor;

        vec3 reflectDir = reflect(-lightDir, n);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
        vec3 specular = specularStrength * spec * lightColor;

        color = vec4(baseColor.rgb * (ambient + diffuse + specular), 1.0);
    #endif
}
