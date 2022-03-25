#version 300 es
precision highp float;

in vec3 outUV;
layout (location = 0) out vec4 color;
layout (location = 1) out vec4 color2;

uniform samplerCube environmentMap;
uniform float roughness;

const float PI = 3.14159265359;

float RadicalInverse_VdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10; // / 0x100000000
}
// ----------------------------------------------------------------------------
vec2 Hammersley(uint i, uint N) {
    return vec2(float(i)/float(N), RadicalInverse_VdC(i));
}  
vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness, bool isCharlie, float cosZ) {
    float a = roughness*roughness;
	
    float phi = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

    if (isCharlie) {
        sinTheta = pow(Xi.y, a / (2.0*a + 1.0));
        cosTheta = sqrt(1.0 - sinTheta * sinTheta);
        cosZ = cosTheta;
    }
	
    // from spherical coordinates to cartesian coordinates
    vec3 H;
    H.x = cos(phi) * sinTheta;
    H.y = sin(phi) * sinTheta;
    H.z = cosTheta;
	
    // from tangent-space vector to world-space sample vector
    vec3 up        = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent   = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);
	
    vec3 sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
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

float D_Charlie(float sheenRoughness, float NdotH) {
    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]
    float invR = 1.0 / sheenRoughness;
    float cos2h = NdotH * NdotH;
    float sin2h = 1.0 - cos2h;
    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);
}

vec3 x(bool isCharlie) {
    vec3 N = normalize(outUV);    
    vec3 R = N;
    vec3 V = R;

    const uint SAMPLE_COUNT = 1024u;
    float totalWeight = 0.0;   
    vec3 prefilteredColor = vec3(0.0);     
    for(uint i = 0u; i < SAMPLE_COUNT; ++i) {
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);
        float cosZ;
        vec3 H  = ImportanceSampleGGX(Xi, N, roughness, isCharlie, cosZ);
        vec3 L  = normalize(2.0 * dot(V, H) * H - V);

        float NdotL = max(dot(N, L), 0.0);
        if (NdotL > 0.0) {
            float D = DistributionGGX(N, H, roughness);
            float pdf = (D * max(dot(N, H), 0.0) / (4.0 * max(dot(H, V), 0.0))) + 0.0001;
            if (isCharlie) {
                pdf = D_Charlie(roughness * roughness, cosZ);
            }
             
            float saTexel = 4.0 * PI / (6.0 * 512.0 * 512.0);
            float saSample = 1.0 / (float(SAMPLE_COUNT) * pdf + 0.00001);
             
            float mipLevel = roughness == 0.0 ? 0.0 :  0.5 * log2( saSample / saTexel )  ;
                                 
            prefilteredColor += textureLod( environmentMap, L, mipLevel ).rgb * NdotL;     
            totalWeight += NdotL;
        }
    }
    prefilteredColor = prefilteredColor / totalWeight;
    return prefilteredColor;
}

void main() {
    color = vec4(x(false), 1.0);
    color2 = vec4(x(true), 1.0);
}
