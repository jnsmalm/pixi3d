#version 100

precision highp float;

uniform vec3 u_Id;

void main() {
  gl_FragColor = vec4(u_Id / 255.0, 1.0);
}