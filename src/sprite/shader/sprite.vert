precision highp float;

attribute vec2 aVertexPosition;

attribute vec4 aMatrix0;
attribute vec4 aMatrix1;
attribute vec4 aMatrix2;
attribute vec4 aMatrix3;

attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;

uniform vec4 tint;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main(void) {
  mat4 modelMatrix = mat4(aMatrix0, aMatrix1, aMatrix2, aMatrix3);

  gl_Position = modelMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);

  vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y);
  vTextureId = aTextureId;
  vColor = aColor * tint;
}