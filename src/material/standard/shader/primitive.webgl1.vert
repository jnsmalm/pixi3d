#version 100

#define FEATURES

#include <animation.webgl1.glsl>

attribute vec4 a_Position;
varying vec3 v_Position;

#ifdef USE_INSTANCING
attribute vec4 a_ModelMatrix0;
attribute vec4 a_ModelMatrix1;
attribute vec4 a_ModelMatrix2;
attribute vec4 a_ModelMatrix3;
#endif

#ifdef USE_INSTANCING
attribute vec4 a_BaseColorFactor;
varying vec4 v_BaseColorFactor;
#endif

#ifdef USE_INSTANCING
attribute vec4 a_NormalMatrix0;
attribute vec4 a_NormalMatrix1;
attribute vec4 a_NormalMatrix2;
attribute vec4 a_NormalMatrix3;
#endif

#ifdef HAS_NORMALS
attribute vec4 a_Normal;
#endif

#ifdef HAS_TANGENTS
attribute vec4 a_Tangent;
#endif

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
varying mat3 v_TBN;
#else
varying vec3 v_Normal;
#endif
#endif

#ifdef HAS_UV_SET1
attribute vec2 a_UV1;
#endif

#ifdef HAS_UV_SET2
attribute vec2 a_UV2;
#endif

varying vec2 v_UVCoord1;
varying vec2 v_UVCoord2;

#ifdef HAS_VERTEX_COLOR_VEC3
attribute vec3 a_Color;
varying vec3 v_Color;
#endif

#ifdef HAS_VERTEX_COLOR_VEC4
attribute vec4 a_Color;
varying vec4 v_Color;
#endif

uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;

#ifdef USE_SHADOW_MAPPING
uniform mat4 u_LightViewProjectionMatrix;
varying vec4 v_PositionLightSpace;
#endif

vec4 getPosition()
{
    vec4 pos = a_Position;

#ifdef USE_MORPHING
    pos += getTargetPosition();
#endif

#ifdef USE_SKINNING
    pos = getSkinningMatrix() * pos;
#endif

    return pos;
}

#ifdef HAS_NORMALS
vec4 getNormal()
{
    vec4 normal = a_Normal;

#ifdef USE_MORPHING
    normal += getTargetNormal();
#endif

#ifdef USE_SKINNING
    normal = getSkinningNormalMatrix() * normal;
#endif

    return normalize(normal);
}
#endif

#ifdef HAS_TANGENTS
vec4 getTangent()
{
    vec4 tangent = a_Tangent;

#ifdef USE_MORPHING
    tangent += getTargetTangent();
#endif

#ifdef USE_SKINNING
    tangent = getSkinningMatrix() * tangent;
#endif

    return normalize(tangent);
}
#endif

void main()
{
    mat4 modelMatrix = u_ModelMatrix;
    #ifdef USE_INSTANCING
        modelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
    #endif
    vec4 pos = modelMatrix * getPosition();
    v_Position = vec3(pos.xyz) / pos.w;

    mat4 normalMatrix = u_NormalMatrix;
    #ifdef USE_INSTANCING
        normalMatrix = mat4(a_NormalMatrix0, a_NormalMatrix1, a_NormalMatrix2, a_NormalMatrix3);
    #endif

    #ifdef HAS_NORMALS
    #ifdef HAS_TANGENTS
    vec4 tangent = getTangent();
    vec3 normalW = normalize(vec3(normalMatrix * vec4(getNormal().xyz, 0.0)));
    vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(tangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
    v_TBN = mat3(tangentW, bitangentW, normalW);
    #else // !HAS_TANGENTS
    v_Normal = normalize(vec3(normalMatrix * vec4(getNormal().xyz, 0.0)));
    #endif
    #endif // !HAS_NORMALS

    v_UVCoord1 = vec2(0.0, 0.0);
    v_UVCoord2 = vec2(0.0, 0.0);

    #ifdef HAS_UV_SET1
    v_UVCoord1 = a_UV1;
    #endif

    #ifdef HAS_UV_SET2
    v_UVCoord2 = a_UV2;
    #endif

    #if defined(HAS_VERTEX_COLOR_VEC3) || defined(HAS_VERTEX_COLOR_VEC4)
    v_Color = a_Color;
    #endif

    #ifdef USE_SHADOW_MAPPING
    v_PositionLightSpace = u_LightViewProjectionMatrix * pos;
    #endif

    #ifdef USE_INSTANCING
    v_BaseColorFactor = a_BaseColorFactor;
    #endif

    gl_Position = u_ViewProjectionMatrix * pos;
}
