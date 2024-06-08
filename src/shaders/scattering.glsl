#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

#define rcp(x) 1./x
#define GOLDEN_RATIO 1.618033988749895
#define TWO_PI 6.2831855
vec2 Golden2dSeq(int i, float n) {
    return vec2(float(i) / n + (0.5f / n), fract(float(i) * rcp(GOLDEN_RATIO)));
}
vec2 SampleDiskGolden(int i, int sampleCount) {
    vec2 f = Golden2dSeq(i, float(sampleCount));
    return vec2(sqrt(f.x), TWO_PI * f.y);
}
const float PI = 3.1415926535897932384626433832795f;
const float RECIPROCAL_PI = 0.3183098861837907f;
const float RECIPROCAL_PI2 = 0.15915494309189535f;
const float HALF_MIN = 5.96046448e-08f;
const float LinearEncodePowerApprox = 2.2f;
const float GammaEncodePowerApprox = 1.0f / LinearEncodePowerApprox;
const vec3 LuminanceEncodeApprox = vec3(0.2126f, 0.7152f, 0.0722f);
const float Epsilon = 0.0000001f;
#define saturate(x) clamp(x, 0.0, 1.0)
#define absEps(x) abs(x)+Epsilon
#define maxEps(x) max(x, Epsilon)
#define saturateEps(x) clamp(x, Epsilon, 1.0)
mat3 transposeMat3(mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];
    mat3 outMatrix = mat3(vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z));
    return outMatrix;
}
mat3 inverseMat3(mat3 inMatrix) {
    float a00 = inMatrix[0][0], a01 = inMatrix[0][1], a02 = inMatrix[0][2];
    float a10 = inMatrix[1][0], a11 = inMatrix[1][1], a12 = inMatrix[1][2];
    float a20 = inMatrix[2][0], a21 = inMatrix[2][1], a22 = inMatrix[2][2];
    float b01 = a22 * a11 - a12 * a21;
    float b11 = -a22 * a10 + a12 * a20;
    float b21 = a21 * a10 - a11 * a20;
    float det = a00 * b01 + a01 * b11 + a02 * b21;
    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11), b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10), b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}
float toLinearSpace(float color) {
    return pow(color, LinearEncodePowerApprox);
}
vec3 toLinearSpace(vec3 color) {
    return pow(color, vec3(LinearEncodePowerApprox));
}
vec4 toLinearSpace(vec4 color) {
    return vec4(pow(color.rgb, vec3(LinearEncodePowerApprox)), color.a);
}
float toGammaSpace(float color) {
    return pow(color, GammaEncodePowerApprox);
}
vec3 toGammaSpace(vec3 color) {
    return pow(color, vec3(GammaEncodePowerApprox));
}
vec4 toGammaSpace(vec4 color) {
    return vec4(pow(color.rgb, vec3(GammaEncodePowerApprox)), color.a);
}
float square(float value) {
    return value * value;
}
vec3 square(vec3 value) {
    return value * value;
}
float pow5(float value) {
    float sq = value * value;
    return sq * sq * value;
}
float getLuminance(vec3 color) {
    return clamp(dot(color, LuminanceEncodeApprox), 0.f, 1.f);
}
float getRand(vec2 seed) {
    return fract(sin(dot(seed.xy, vec2(12.9898f, 78.233f))) * 43758.5453f);
}
float dither(vec2 seed, float varianceAmount) {
    float rand = getRand(seed);
    float normVariance = varianceAmount / 255.0f;
    float dither = mix(-normVariance, normVariance, rand);
    return dither;
}
const float rgbdMaxRange = 255.0f;
vec4 toRGBD(vec3 color) {
    float maxRGB = maxEps(max(color.r, max(color.g, color.b)));
    float D = max(rgbdMaxRange / maxRGB, 1.f);
    D = clamp(floor(D) / 255.0f, 0.f, 1.f);
    vec3 rgb = color.rgb * D;
    rgb = toGammaSpace(rgb);
    return vec4(clamp(rgb, 0.f, 1.f), D);
}
vec3 fromRGBD(vec4 rgbd) {
    rgbd.rgb = toLinearSpace(rgbd.rgb);
    return rgbd.rgb / rgbd.a;
}
vec3 parallaxCorrectNormal(vec3 vertexPos, vec3 origVec, vec3 cubeSize, vec3 cubePos) {
    vec3 invOrigVec = vec3(1.0f, 1.0f, 1.0f) / origVec;
    vec3 halfSize = cubeSize * 0.5f;
    vec3 intersecAtMaxPlane = (cubePos + halfSize - vertexPos) * invOrigVec;
    vec3 intersecAtMinPlane = (cubePos - halfSize - vertexPos) * invOrigVec;
    vec3 largestIntersec = max(intersecAtMaxPlane, intersecAtMinPlane);
    float distance = min(min(largestIntersec.x, largestIntersec.y), largestIntersec.z);
    vec3 intersectPositionWS = vertexPos + origVec * distance;
    return intersectPositionWS - cubePos;
}
bool testLightingForSSS(float diffusionProfile) {
    return diffusionProfile < 1.f;
}

const vec3 diffusionS = vec3(1.0);
const float diffusionD = 1.0;
const float filterRadii = 16.5644;

uniform sampler2D textureSampler;
uniform sampler2D irradianceSampler;
uniform sampler2D depthSampler;
uniform sampler2D albedoSampler;
const float metersPerUnit = 0.1;

const float LOG2_E = 1.4426950408889634f;
const float SSS_PIXELS_PER_SAMPLE = 4.f;
const int _SssSampleBudget = 40;
#define rcp(x) 1./x
#define Sq(x) x*x
#define SSS_BILATERAL_FILTER true
vec3 EvalBurleyDiffusionProfile(float r, vec3 S) {
    vec3 exp_13 = exp2(((LOG2_E * (-1.0f / 3.0f)) * r) * S);
    vec3 expSum = exp_13 * (1.f + exp_13 * exp_13);
    return (S * rcp(8.f * PI)) * expSum;
}
vec2 SampleBurleyDiffusionProfile(float u, float rcpS) {
    u = 1.f - u;
    float g = 1.f + (4.f * u) * (2.f * u + sqrt(1.f + (4.f * u) * u));
    float n = exp2(log2(g) * (-1.0f / 3.0f));
    float p = (g * n) * n;
    float c = 1.f + p + n;
    float d = (3.f / LOG2_E * 2.f) + (3.f / LOG2_E) * log2(u);
    float x = (3.f / LOG2_E) * log2(c) - d;
    float rcpExp = ((c * c) * c) * rcp((4.f * u) * ((c * c) + (4.f * u) * (4.f * u)));
    float r = x * rcpS;
    float rcpPdf = (8.f * PI * rcpS) * rcpExp;
    return vec2(r, rcpPdf);
}
vec3 ComputeBilateralWeight(float xy2, float z, float mmPerUnit, vec3 S, float rcpPdf) {
    float r = sqrt(xy2 + (z * mmPerUnit) * (z * mmPerUnit));
    float area = rcpPdf;
    return EvalBurleyDiffusionProfile(r, S) * area;
}
void EvaluateSample(int i, int n, vec3 S, float d, vec3 centerPosVS, float mmPerUnit, float pixelsPerMm, float phase, inout vec3 totalIrradiance, inout vec3 totalWeight) {
    float scale = rcp(float(n));
    float offset = rcp(float(n)) * 0.5f;
    float sinPhase, cosPhase;
    sinPhase = sin(phase);
    cosPhase = cos(phase);
    vec2 bdp = SampleBurleyDiffusionProfile(float(i) * scale + offset, d);
    float r = bdp.x;
    float rcpPdf = bdp.y;
    float phi = SampleDiskGolden(i, n).y;
    float sinPhi, cosPhi;
    sinPhi = sin(phi);
    cosPhi = cos(phi);
    float sinPsi = cosPhase * sinPhi + sinPhase * cosPhi;
    float cosPsi = cosPhase * cosPhi - sinPhase * sinPhi;
    vec2 vec = r * vec2(cosPsi, sinPsi);
    vec2 position;
    float xy2;
    vec2 texelSize = 1.0 / vec2(textureSize(depthSampler, 0));
    position = uv + round((pixelsPerMm * r) * vec2(cosPsi, sinPsi)) * texelSize;
    xy2 = r * r;
    vec4 textureSample = texture(irradianceSampler, position);
    float viewZ = texture(depthSampler, position).r;
    vec3 irradiance = textureSample.rgb;
    //if(testLightingForSSS(textureSample.a)) {
        float relZ = viewZ - centerPosVS.z;
        vec3 weight = ComputeBilateralWeight(xy2, relZ, mmPerUnit, S, rcpPdf);
        totalIrradiance += weight * irradiance;
        totalWeight += weight;
    // } else {

    // }
}

void main(void) {
    vec4 irradianceAndDiffusionProfile = texture(irradianceSampler, uv);
    vec3 centerIrradiance = irradianceAndDiffusionProfile.rgb;
    int diffusionProfileIndex = int(round(irradianceAndDiffusionProfile.a * 255.f));
    float centerDepth = 0.f;
    vec4 inputColor = texture(textureSampler, uv);
    bool passedStencilTest = testLightingForSSS(irradianceAndDiffusionProfile.a);
    //if(passedStencilTest) {
        centerDepth = texture(depthSampler, uv).r;
    //}
    if(!passedStencilTest) {
        color = inputColor;
        //return;
    }
    float distScale = 1.f;
    vec3 S = diffusionS;
    float d = diffusionD;
    float filterRadius = filterRadii;
    vec2 centerPosNDC = uv;
    vec2 viewportSize = vec2(0.6520661863788713, 0.5773502691896256);
    vec2 texelSize = 1.0 / vec2(textureSize(depthSampler, 0));
    vec2 cornerPosNDC = uv + 0.5f * texelSize;
    vec3 centerPosVS = vec3(centerPosNDC * viewportSize, 1.0f) * centerDepth;
    vec3 cornerPosVS = vec3(cornerPosNDC * viewportSize, 1.0f) * centerDepth;
    float mmPerUnit = 1000.f * (metersPerUnit * rcp(distScale));
    float unitsPerMm = rcp(mmPerUnit);
    float unitsPerPixel = 2.f * abs(cornerPosVS.x - centerPosVS.x);
    float pixelsPerMm = rcp(unitsPerPixel) * unitsPerMm;
    float filterArea = PI * Sq(filterRadius * pixelsPerMm);
    int sampleCount = int(filterArea * rcp(SSS_PIXELS_PER_SAMPLE));
    int sampleBudget = _SssSampleBudget;
    int texturingMode = 0;
    vec3 albedo = texture(albedoSampler, uv).rgb;
    if(distScale == 0.f || sampleCount < 1) {
        color = vec4(inputColor.rgb + albedo * centerIrradiance, 1.0f);
        //return;
    }
    float phase = 0.f;
    int n = min(sampleCount, sampleBudget);
    vec3 centerWeight = vec3(0.f);
    vec3 totalIrradiance = vec3(0.f);
    vec3 totalWeight = vec3(0.f);
    for(int i = 0; i < n; i++) {
        EvaluateSample(i, n, S, d, centerPosVS, mmPerUnit, pixelsPerMm, phase, totalIrradiance, totalWeight);
    }
    totalWeight = max(totalWeight, HALF_MIN);
    color = vec4(inputColor.rgb + albedo * max(totalIrradiance / totalWeight, vec3(0.0f)), 1.f);
    //color = vec4(inputColor.rgb, 1.f);
}
