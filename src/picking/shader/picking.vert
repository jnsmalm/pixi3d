#version 100

attribute vec3 a_Position;

uniform mat4 u_ModelViewProjection;

void main() {
  gl_Position = u_ModelViewProjection * vec4(a_Position, 1.0);
}