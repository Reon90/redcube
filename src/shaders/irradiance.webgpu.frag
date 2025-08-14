#version 460
precision highp float;

layout (location = 0) in vec3 outUV;
layout (location = 0) out vec4 color;

layout(set = 0, binding = 1) uniform sampler baseSampler;
layout(set = 0, binding = 2) uniform textureCube environmentMap;

const float PI = 3.14159265359;

void main() {
    vec3 N = normalize(outUV);
    vec3 irradiance = vec3(0.0);

    vec3 up    = vec3(0.0, 1.0, 0.0);
    vec3 right = cross(up, N);
    up         = cross(N, right);

    float sampleDelta = 0.025;
    float nrSamples = 0.0; 
    for(float phi = 0.0; phi < 2.0 * PI; phi += sampleDelta)
    {
        for(float theta = 0.0; theta < 0.5 * PI; theta += sampleDelta)
        {
            // spherical to cartesian (in tangent space)
            vec3 tangentSample = vec3(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
            // tangent space to world
            vec3 sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * N;
            vec3 sampleVecFixed = vec3(sampleVec.z, sampleVec.y, sampleVec.x);

            float mip = floor(log2(512.0)) - 3.0;
            irradiance += textureLod(samplerCube(environmentMap, baseSampler), sampleVecFixed, mip).rgb * cos(theta) * sin(theta);
            nrSamples++;
        }
    }
    irradiance = PI * irradiance * (1.0 / float(nrSamples));
    
    color = vec4(irradiance, 1.0);
}
