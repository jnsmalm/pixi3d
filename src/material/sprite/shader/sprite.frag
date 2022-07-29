#version VERSION

#define FEATURES

#if defined(WEBGL1) //&& defined(USE_TEX_LOD)
#extension GL_EXT_shader_texture_lod : enable
#endif

#if defined(WEBGL1)
#extension GL_OES_standard_derivatives : enable
#endif

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

vec4 _texture2D(sampler2D sampler, vec2 coord)
{
#ifdef WEBGL2
  return texture(sampler, coord);
#else
  return texture2D(sampler, coord);
#endif
}

vec4 _texture3D(samplerCube sampler, vec3 coord)
{
#ifdef WEBGL2
  return texture(sampler, coord);
#else
  return textureCube(sampler, coord);
#endif
}

#ifdef USE_INSTANCING
FRAG_IN vec4 v_InstanceColor;
#endif

#ifdef HAS_TEXTURE
uniform sampler2D u_Texture;
#endif
uniform vec4 u_Color;

#ifdef WEBGL2
out vec4 FRAG_COLOR;
#endif

#ifdef HAS_VERTEX_COLOR_VEC3
FRAG_IN vec3 v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
FRAG_IN vec4 v_Color;
#endif

FRAG_IN vec2 v_UVCoord;

vec4 getVertexColor()
{
vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

#ifdef HAS_VERTEX_COLOR_VEC3
color.rgb = v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
color = v_Color;
#endif

return color;
}

vec4 getTextureColor()
{
#ifdef HAS_TEXTURE
return _texture2D(u_Texture, v_UVCoord);
#else
return vec4(1.0, 1.0, 1.0, 1.0);
#endif
}

vec4 getInstanceColor()
{
#ifdef USE_INSTANCING
return v_InstanceColor;
#else
return vec4(1.0, 1.0, 1.0, 1.0);
#endif
}

void main()
{
vec4 color = getVertexColor() * getTextureColor() * getInstanceColor() * u_Color;
FRAG_COLOR = color;
}
