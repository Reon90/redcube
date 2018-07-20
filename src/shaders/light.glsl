#version 300 es
precision highp float;

in vec2 uv;
in vec4 pos1;
in vec4 pos2;
out float color;

uniform sampler2D lightTexture;
uniform sampler2D cameraTexture;

const float N = 5.8;
const float F = 2.85;

void main() {

    float lightDepth = texture(lightTexture, uv).r;
    float cameraDepth = texture(cameraTexture, uv).r;

    float stp = 1.0/5.0;  //step of k - 80 samples
	float k = 0.0;
    float d = 0.0;

    // vec2 g_vZTrans = vec2(1.0/N,(N-F)/(F*N));
	// float v_d = -1.0/dot(vec2(1.0,cameraDepth),g_vZTrans);

    for (int i = 0; i < 5; i++) {
		// interpolation
		vec4 tPos = mix(pos1,pos2,k += stp);
        vec3 projCoords = tPos.xyz / tPos.w;
        projCoords = projCoords * 0.5 + 0.5;
        float closestDepth = texture(lightTexture, projCoords.xy).r; 
        float currentDepth = projCoords.z;
        d += currentDepth > closestDepth ? stp : 0.0;
 
		// and depth-tests
        // texture(lightTexture,uv).x

		// vec2 add = step(vec2(,v_d),tPos.zw); 
		// d += add.x*add.y;
	}

    //d = 1.0-d*stp*0.5;
    color = 1.0 - d;
    //color = vec4(vec3(1.0 - (cameraDepth > lightDepth ? 1.0 : 0.0)), 1.0);
}
