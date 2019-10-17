precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D baseColorTexture;

void main() {
  gl_FragColor = texture2D(baseColorTexture, v_texCoord);
}