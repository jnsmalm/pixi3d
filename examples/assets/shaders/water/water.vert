attribute vec3 a_Position;
attribute vec2 a_UV1;

varying vec2 v_UV1;

uniform mat4 u_World;
uniform mat4 u_ViewProjection;

void main() {
  v_UV1 = a_UV1;
  gl_Position = u_ViewProjection * u_World * vec4(a_Position, 1.0);
}