#ifdef HAS_TEXCOORD_0
  varying vec2 v_texCoord;
#endif

uniform sampler2D baseColorMap;
uniform sampler2D metallicRoughnessMap;
uniform sampler2D normalMap;
uniform sampler2D occlusionMap;
uniform sampler2D emissiveMap;

float metallicFromMap() {
  #ifdef HAS_TEXCOORD_0
    return texture2D(metallicRoughnessMap, v_texCoord).b;
  #endif
  return 1.0;
}

vec4 baseColorFromMap() {
  #ifdef HAS_TEXCOORD_0
    return texture2D(baseColorMap, v_texCoord);
  #endif
  return vec4(1.0);
}

float roughnessFromMap() {
  #ifdef HAS_TEXCOORD_0
    return texture2D(metallicRoughnessMap, v_texCoord).g;
  #endif
  return 1.0;
}

float occlusionFromMap() {
  #ifdef HAS_TEXCOORD_0
    return texture2D(occlusionMap, v_texCoord).r;
  #endif
  return 1.0;
}

vec3 normalFromMap() {
  #ifdef HAS_TEXCOORD_0
  #ifdef HAS_NORMAL_MAP
    return normalize(texture2D(normalMap, v_texCoord).rgb * 2.0 - 1.0);
  #endif
  #endif
  return vec3(1.0);
}

vec4 emissiveFromMap() {
  #ifdef HAS_TEXCOORD_0
  #ifdef EMISSIVE_MAP
    return texture2D(emissiveMap, v_texCoord);
  #endif
  #endif
  return vec4(0.0);
}

