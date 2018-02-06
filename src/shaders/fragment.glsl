#version 300 es
precision highp float;

in vec2 outUV;
in vec3 outNormal;
in vec3 outPosition;

out vec4 color;

uniform Material {
	vec4 baseColorFactor;
	vec3 lightPos;
	vec3 viewPos;
};
uniform sampler2D baseColorTexture;

const float ambientStrength = 0.1;
const float specularStrength = 0.5;
const float specularPower = 32.0;
const vec3 lightColor = vec3(1.0, 1.0, 1.0);

void main() {
	#ifdef BASECOLORTEXTURE
	    vec4 baseColor = texture(baseColorTexture, outUV);
	#else
	    vec4 baseColor = baseColorFactor;
	#endif

    vec3 ambient = ambientStrength * lightColor;

	vec3 lightDir = normalize(lightPos - outPosition);
	float diff = max(dot(outNormal, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	vec3 viewDir = normalize(viewPos - outPosition);
	vec3 reflectDir = reflect(-lightDir, outNormal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
	vec3 specular = specularStrength * spec * lightColor;

    color = vec4(baseColor.rgb * (ambient + diffuse + specular), 1.0);
}
