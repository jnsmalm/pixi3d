precision mediump float;

varying vec3 v_normal;

uniform vec3 lightPosition;

void main() {
  float dot = max(0.0, dot(v_normal, normalize(lightPosition)));
  gl_FragColor = vec4(dot, dot, dot, 1.0);
}