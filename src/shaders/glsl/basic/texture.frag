precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D texture;

void main() {
  gl_FragColor = texture2D(texture, v_texCoord);
}