#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform vec3 u_Id;

void main() {
  gl_FragColor = vec4(u_Id / 255.0, 1.0);
}