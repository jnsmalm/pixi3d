#version VERSION

#define FEATURES

VERT_IN vec4 a_Position;
VERT_OUT vec3 v_Position;

#ifdef USE_INSTANCING
VERT_IN vec4 a_InstanceColor;
VERT_OUT vec4 v_InstanceColor;
#endif

#ifdef HAS_TEXTURE
#ifdef USE_INSTANCING
VERT_IN vec3 a_UVTransform0;
VERT_IN vec3 a_UVTransform1;
VERT_IN vec3 a_UVTransform2;
#else
uniform mat3 u_UVTransform;
#endif
VERT_OUT mat3 v_UVTransform;
#endif

VERT_IN vec2 a_UV1;
VERT_OUT vec2 v_UVCoord;

#ifdef HAS_VERTEX_COLOR_VEC3
VERT_IN vec3 a_Color;
VERT_OUT vec3 v_Color;
#endif

#ifdef HAS_VERTEX_COLOR_VEC4
VERT_IN vec4 a_Color;
VERT_OUT vec4 v_Color;
#endif

uniform mat4 u_ViewMatrix;
uniform int u_Billboard;
uniform mat4 u_ProjectionMatrix;
#ifdef USE_INSTANCING
VERT_IN vec4 a_ModelMatrix0;
VERT_IN vec4 a_ModelMatrix1;
VERT_IN vec4 a_ModelMatrix2;
VERT_IN vec4 a_ModelMatrix3;
#else
uniform mat4 u_ModelMatrix;
#endif
uniform mat4 u_NormalMatrix;
uniform float u_PixelsPerUnit;

#ifdef HAS_TEXTURE
#ifdef USE_INSTANCING
VERT_IN vec2 a_TexSize;
#else
uniform vec2 u_TexSize;
#endif
#endif

#ifdef USE_INSTANCING
VERT_IN vec3 a_Origin;
#else
uniform vec3 u_Origin;
#endif

mat4 getPixelScalingMat(vec2 textureSize, float pixelsPerUnit)
{
return mat4(textureSize.x / pixelsPerUnit, 0, 0, 0, 0, textureSize.y / pixelsPerUnit, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
}

void main()
{
v_UVCoord = a_UV1;
#ifdef USE_INSTANCING
vec3 origin = a_Origin;
mat4 modelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
v_InstanceColor = a_InstanceColor;
#else
vec3 origin = u_Origin;
mat4 modelMatrix = u_ModelMatrix;
#endif

#ifdef HAS_TEXTURE
#ifdef USE_INSTANCING
vec2 texSize = a_TexSize;
mat3 uvTransform = mat3(a_UVTransform0, a_UVTransform1, a_UVTransform2);
#else
mat3 uvTransform = u_UVTransform;
vec2 texSize = u_TexSize;
#endif
#endif

vec4 offsetPos = vec4(a_Position.x + (origin.x - 0.5), a_Position.y + (origin.y - 0.5), a_Position.z, a_Position.w);

#ifdef HAS_TEXTURE
mat4 pixelScalingMat = getPixelScalingMat(texSize, u_PixelsPerUnit);
offsetPos = pixelScalingMat * offsetPos;
vec3 uvw = uvTransform * vec3(v_UVCoord, 1.0);
v_UVCoord = uvw.xy;
#endif

    #if defined(HAS_VERTEX_COLOR_VEC3) || defined(HAS_VERTEX_COLOR_VEC4)
v_Color = a_Color;
    #endif

mat4 viewMatrix = u_ViewMatrix;
if (u_Billboard == 0)
{
vec3 cameraRight = vec3(viewMatrix[0].x, viewMatrix[1].x, viewMatrix[2].x);
vec3 cameraUp = vec3(viewMatrix[0].y, viewMatrix[1].y, viewMatrix[2].y);
offsetPos.xyz = (offsetPos.x * cameraRight) + (offsetPos.y * cameraUp);
}
else if (u_Billboard == 1)
{
vec3 upVector = vec3(modelMatrix[0].y, modelMatrix[1].y, modelMatrix[2].y);
vec3 forwardVector = vec3(- viewMatrix[0].z, - viewMatrix[1].z, - viewMatrix[2].z); // camera forward
vec3 rightVector = normalize(cross(forwardVector, upVector));
offsetPos.xyz = (offsetPos.x * rightVector) + vec3(0, offsetPos.y, 0);
}
vec4 pos = modelMatrix * offsetPos;

gl_Position = u_ProjectionMatrix * viewMatrix * pos;
}
