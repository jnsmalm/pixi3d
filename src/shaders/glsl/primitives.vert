precision mediump float;

#define INSERT

#import <tbn.glsl>
#import <animation.glsl>

attribute vec3 position;
varying vec3 v_position;

#ifdef HAS_NORMAL
  attribute vec3 normal;
  varying vec3 v_normal;
#endif
#ifdef HAS_TEXCOORD_0
  attribute vec2 texCoord;
  varying vec2 v_texCoord;
#endif
#ifdef HAS_TANGENT
  attribute vec4 tangent;
  varying mat3 v_TBN;
#endif

uniform mat4 world;
uniform mat4 viewProjection;

void main() {
  vec3 position = position;
  #ifdef USE_MORPHING
    position += getTargetPosition();
  #endif
  gl_Position = viewProjection * world * vec4(position, 1.0);
  #ifdef HAS_NORMAL
    vec3 normal = normal;
    #ifdef USE_MORPHING
      normal += getTargetNormal();
    #endif
    v_normal = mat3(world) * normal;
  #endif
  #ifdef HAS_TEXCOORD_0
    v_texCoord = texCoord;
  #endif
  #ifdef HAS_TANGENT
    vec4 tangent = tangent;
    #ifdef USE_MORPHING
      tangent += getTargetTangent();
    #endif
    v_TBN = TBN(normal, tangent, world);
  #endif
  v_position = mat3(world) * position;
}