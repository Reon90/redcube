#version 300 es
precision highp float;

in vec2 outUV;
in vec3 outNormal;
in vec3 outPosition;

out vec4 color;

uniform Material {
	vec4 baseColorFactor;
	vec3 lightPos;
};
uniform sampler2D baseColorTexture;

void main() {
	#ifdef BASECOLORTEXTURE
	    vec4 baseColor = texture(baseColorTexture, outUV);
	#else
	    vec4 baseColor = baseColorFactor;
	#endif

	vec3 lightDir = normalize(lightPos - outPosition);
	float diffuse = max(dot(outNormal, lightDir), 0.0);

    color = vec4(baseColor.rgb * diffuse, 1.0);
}
