precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 v_normal;

uniform mat4 world;
uniform mat3 transposedInversedWorld;
uniform mat4 viewProjection;

void main() {
  v_normal = transposedInversedWorld * normal;
  gl_Position = viewProjection * world * vec4(position, 1.0);
}