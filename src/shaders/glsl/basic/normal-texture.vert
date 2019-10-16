precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec3 v_normal;
varying vec2 v_texCoord;

uniform mat4 world;
uniform mat3 transposedInversedWorld;
uniform mat4 viewProjection;

void main() {
  v_normal = transposedInversedWorld * normal;
  v_texCoord = texCoord;
  
  gl_Position = viewProjection * world * vec4(position, 1.0);
}