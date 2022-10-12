FRAG_IN vec2 v_UVCoord1;
FRAG_IN vec2 v_UVCoord2;

// General Material
#ifdef HAS_NORMAL_MAP
uniform sampler2D u_NormalSampler;
uniform float u_NormalScale;
uniform int u_NormalUVSet;
uniform mat3 u_NormalUVTransform;
#endif

#ifdef HAS_EMISSIVE_MAP
uniform sampler2D u_EmissiveSampler;
uniform int u_EmissiveUVSet;
uniform vec3 u_EmissiveFactor;
uniform mat3 u_EmissiveUVTransform;
#endif

#ifdef HAS_OCCLUSION_MAP
uniform sampler2D u_OcclusionSampler;
uniform int u_OcclusionUVSet;
uniform float u_OcclusionStrength;
uniform mat3 u_OcclusionUVTransform;
#endif

#ifdef HAS_SPRITESHEET
  uniform mat3 u_BaseColorUVTransforms[UV_COUNT];
  FRAG_IN float v_BaseColorUVIndex;  
#endif

// Metallic Roughness Material
#ifdef HAS_BASE_COLOR_MAP
uniform sampler2D u_BaseColorSampler;
uniform int u_BaseColorUVSet;
uniform mat3 u_BaseColorUVTransform;
#endif

#ifdef HAS_METALLIC_ROUGHNESS_MAP
uniform sampler2D u_MetallicRoughnessSampler;
uniform int u_MetallicRoughnessUVSet;
uniform mat3 u_MetallicRoughnessUVTransform;
#endif

// Specular Glossiness Material
#ifdef HAS_DIFFUSE_MAP
uniform sampler2D u_DiffuseSampler;
uniform int u_DiffuseUVSet;
uniform mat3 u_DiffuseUVTransform;
#endif

#ifdef HAS_SPECULAR_GLOSSINESS_MAP
uniform sampler2D u_SpecularGlossinessSampler;
uniform int u_SpecularGlossinessUVSet;
uniform mat3 u_SpecularGlossinessUVTransform;
#endif

// IBL
#ifdef USE_IBL
uniform samplerCube u_DiffuseEnvSampler;
uniform samplerCube u_SpecularEnvSampler;
uniform sampler2D u_brdfLUT;
#endif

#ifdef USE_SHADOW_MAPPING
uniform sampler2D u_ShadowSampler;
#endif

vec2 getNormalUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_NORMAL_MAP
    uv.xy = u_NormalUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_NORMAL_UV_TRANSFORM
    uv = u_NormalUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec2 getEmissiveUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_EMISSIVE_MAP
    uv.xy = u_EmissiveUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_EMISSIVE_UV_TRANSFORM
    uv = u_EmissiveUVTransform * uv;
    #endif
#endif

    return uv.xy;
}

vec2 getOcclusionUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_OCCLUSION_MAP
    uv.xy = u_OcclusionUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_OCCLUSION_UV_TRANSFORM
    uv = u_OcclusionUVTransform * uv;
    #endif
#endif
    return uv.xy;
}



vec2 getBaseColorUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_BASE_COLOR_MAP
    uv.xy = u_BaseColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
#endif
#ifdef FLIP_UV_X
    uv.x = 1.0 - uv.x;
#endif
#ifdef FLIP_UV_Y
    uv.y = 1.0 - uv.y;
#endif
#ifdef HAS_BASE_COLOR_MAP
    #ifdef HAS_SPRITESHEET
      highp int index = int(v_BaseColorUVIndex);
      if(index > -1) {
        uv = u_BaseColorUVTransforms[index] * uv;
      }
    #elif defined(HAS_BASECOLOR_UV_TRANSFORM)
        uv = u_BaseColorUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec2 getMetallicRoughnessUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_METALLIC_ROUGHNESS_MAP
    uv.xy = u_MetallicRoughnessUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_METALLICROUGHNESS_UV_TRANSFORM
    uv = u_MetallicRoughnessUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec2 getSpecularGlossinessUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_SPECULAR_GLOSSINESS_MAP
    uv.xy = u_SpecularGlossinessUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_SPECULARGLOSSINESS_UV_TRANSFORM
    uv = u_SpecularGlossinessUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec2 getDiffuseUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_DIFFUSE_MAP
    uv.xy = u_DiffuseUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_DIFFUSE_UV_TRANSFORM
    uv = u_DiffuseUVTransform * uv;
    #endif
#endif
    return uv.xy;
}
