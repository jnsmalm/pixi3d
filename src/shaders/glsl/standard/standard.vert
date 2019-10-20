precision mediump float;

#define ATTRIBUTE_NORMAL 0
#define ATTRIBUTE_TEXCOORD 0

attribute vec3 position;
#if (ATTRIBUTE_NORMAL == 1)
  attribute vec3 normal;
#endif
#if (ATTRIBUTE_TEXCOORD == 1)
  attribute vec2 texCoord;
#endif

#if (ATTRIBUTE_NORMAL == 1)
  varying vec3 v_normal;
#endif
#if (ATTRIBUTE_TEXCOORD == 1)
  varying vec2 v_texCoord;
#endif

uniform mat4 transposedInversedWorld;
uniform mat4 world;
uniform mat4 viewProjection;

void main() {
  gl_Position = viewProjection * world * vec4(position, 1.0);

  #if (ATTRIBUTE_TEXCOORD == 1)
    v_texCoord = texCoord;
  #endif
  #if (ATTRIBUTE_NORMAL == 1)
    v_normal = mat3(transposedInversedWorld) * normal;
  #endif
}