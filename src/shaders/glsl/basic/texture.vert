precision mediump float;

attribute vec3 position;
attribute vec2 texCoord;

varying vec2 v_texCoord;

uniform mat4 world;
uniform mat4 viewProjection;

void main() {
  v_texCoord = texCoord;
  gl_Position = viewProjection * world * vec4(position, 1.0);
}