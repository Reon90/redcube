#version 300 es
precision highp float;
precision highp sampler3D;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_velocity;
layout(location = 2) in float a_spawntime;
layout(location = 3) in float a_lifetime;

out vec3 v_position;
out vec3 v_velocity;
out float v_spawntime;
out float v_lifetime;

uniform float u_time;
uniform sampler3D noize;
uniform float count;

float rand(vec3 co) {
    return texture(noize, co).r;
}

vec3 snoiseVec3( vec3 x ) {
  float s  = rand(vec3( x ));
  float s1 = rand(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = rand(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;
}

vec3 curlNoise( vec3 p ) {
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

const float lifetime = 15000.0;
const vec3 center = vec3(0.5, 0.5, 0.5);
float acceleration = 2.0;

void main() {
    if (a_spawntime == 0.0 || (u_time - a_spawntime) > a_lifetime) {
        float x = float(gl_InstanceID) / count;
        float t = u_time/1000.0 * x;
        v_position = center - vec3(
            rand(vec3(x, x, t)),
            rand(vec3(1.0 - x, 1.0 - x, t)),
            rand(vec3(x, 0.5, t))
        );
        v_velocity = center- vec3(
            rand(vec3(x, x, t)),
            rand(vec3(1.0 - x, 1.0 - x, t)),
            rand(vec3(x, 0.5, t))
        );
        v_spawntime = u_time;
        v_lifetime = rand(vec3(x, 0.5, t)) * lifetime;
    } else {
        vec3 curlVelocity = curlNoise(a_position) - a_velocity;
        v_velocity = a_velocity + 0.01 * curlVelocity;
        v_position = a_position + 0.01 * v_velocity * acceleration;
        v_spawntime = a_spawntime;
        v_lifetime = a_lifetime;
    }
}
