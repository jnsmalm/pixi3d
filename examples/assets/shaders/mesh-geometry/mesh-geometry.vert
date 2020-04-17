attribute vec3 a_Position;
attribute vec3 a_Color;

varying vec3 v_Color;

uniform mat4 u_World;
uniform mat4 u_ViewProjection;

void main() {
  gl_Position = u_ViewProjection * u_World * vec4(a_Position, 1.0);
  v_Color = a_Color;
}