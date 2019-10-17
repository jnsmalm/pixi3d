precision mediump float;

varying vec3 v_normal;

uniform vec4 baseColor;
uniform vec3 directionalLight;

void main() {
  float dot = max(0.0, dot(v_normal, normalize(directionalLight)));
  gl_FragColor = vec4(baseColor.rgb * dot, 1.0);
}