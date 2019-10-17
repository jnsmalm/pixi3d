precision mediump float;

varying vec3 v_normal;

uniform vec4 baseColor;
uniform vec3 lightPosition;

void main() {
  float dot = max(0.0, dot(v_normal, normalize(lightPosition)));
  gl_FragColor = baseColor * dot;
}