precision mediump float;

varying vec3 v_normal;
varying vec2 v_texCoord;

uniform sampler2D texture;
uniform vec3 lightPosition;

void main() {
  float dot = max(0.0, dot(v_normal, normalize(lightPosition)));
  vec4 color = texture2D(texture, v_texCoord);

  gl_FragColor = vec4(color.rgb * dot, color.a);
}