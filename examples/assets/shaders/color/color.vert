attribute vec3 a_Position;

uniform mat4 u_World;
uniform mat4 u_ViewProjection;

void main() {
  gl_Position = u_ViewProjection * u_World * vec4(a_Position, 1.0);
}