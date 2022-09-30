#version VERSION

attribute vec3 a_Position;
attribute vec2 a_UV1;

varying vec2 v_UV1;

void main()
{
  v_UV1 = a_UV1;
  gl_Position = vec4(a_Position, 1.0);
}