#version VERSION

VERT_IN vec3 a_Position;
VERT_IN vec2 a_UV1;

VERT_OUT vec2 v_UV1;

void main() {
  v_UV1 = a_UV1;
  gl_Position = vec4(a_Position, 1.0);
}