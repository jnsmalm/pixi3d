#version 100

attribute vec3 a_Position;

uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Projection;

void main() {
  gl_Position = u_Projection * u_View * u_World * vec4(a_Position, 1.0);
}