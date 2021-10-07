#ifdef HAS_TARGET_POSITION0
VERT_IN vec3 a_Target_Position0;
#endif

#ifdef HAS_TARGET_POSITION1
VERT_IN vec3 a_Target_Position1;
#endif

#ifdef HAS_TARGET_POSITION2
VERT_IN vec3 a_Target_Position2;
#endif

#ifdef HAS_TARGET_POSITION3
VERT_IN vec3 a_Target_Position3;
#endif

#ifdef HAS_TARGET_POSITION4
VERT_IN vec3 a_Target_Position4;
#endif

#ifdef HAS_TARGET_POSITION5
VERT_IN vec3 a_Target_Position5;
#endif

#ifdef HAS_TARGET_POSITION6
VERT_IN vec3 a_Target_Position6;
#endif

#ifdef HAS_TARGET_POSITION7
VERT_IN vec3 a_Target_Position7;
#endif

#ifdef HAS_TARGET_NORMAL0
VERT_IN vec3 a_Target_Normal0;
#endif

#ifdef HAS_TARGET_NORMAL1
VERT_IN vec3 a_Target_Normal1;
#endif

#ifdef HAS_TARGET_NORMAL2
VERT_IN vec3 a_Target_Normal2;
#endif

#ifdef HAS_TARGET_NORMAL3
VERT_IN vec3 a_Target_Normal3;
#endif

#ifdef HAS_TARGET_TANGENT0
VERT_IN vec3 a_Target_Tangent0;
#endif

#ifdef HAS_TARGET_TANGENT1
VERT_IN vec3 a_Target_Tangent1;
#endif

#ifdef HAS_TARGET_TANGENT2
VERT_IN vec3 a_Target_Tangent2;
#endif

#ifdef HAS_TARGET_TANGENT3
VERT_IN vec3 a_Target_Tangent3;
#endif

#ifdef USE_MORPHING
uniform float u_morphWeights[WEIGHT_COUNT];
#endif

#ifdef HAS_JOINT_SET1
VERT_IN vec4 a_Joint1;
#endif

#ifdef HAS_JOINT_SET2
VERT_IN vec4 a_Joint2;
#endif

#ifdef HAS_WEIGHT_SET1
VERT_IN vec4 a_Weight1;
#endif

#ifdef HAS_WEIGHT_SET2
VERT_IN vec4 a_Weight2;
#endif

#ifdef USE_SKINNING
#ifdef USE_SKINNING_TEXTURE
uniform sampler2D u_jointMatrixSampler;
uniform sampler2D u_jointNormalMatrixSampler;
#else
uniform mat4 u_jointMatrix[JOINT_COUNT];
uniform mat4 u_jointNormalMatrix[JOINT_COUNT];
#endif
#endif

// these offsets assume the texture is 4 pixels across
#define ROW0_U ((0.5 + 0.0) / 4.0)
#define ROW1_U ((0.5 + 1.0) / 4.0)
#define ROW2_U ((0.5 + 2.0) / 4.0)
#define ROW3_U ((0.5 + 3.0) / 4.0)

#ifdef USE_SKINNING
mat4 getJointMatrix(float boneNdx) {
    #ifdef USE_SKINNING_TEXTURE
    float v = (boneNdx + 0.5) / float(JOINT_COUNT);
    return mat4(
        _texture(u_jointMatrixSampler, vec2(ROW0_U, v)),
        _texture(u_jointMatrixSampler, vec2(ROW1_U, v)),
        _texture(u_jointMatrixSampler, vec2(ROW2_U, v)),
        _texture(u_jointMatrixSampler, vec2(ROW3_U, v))
    );
    #else
    return u_jointMatrix[int(boneNdx)];
    #endif
}

mat4 getJointNormalMatrix(float boneNdx) {
    #ifdef USE_SKINNING_TEXTURE
    float v = (boneNdx + 0.5) / float(JOINT_COUNT);
    return mat4(
        _texture(u_jointNormalMatrixSampler, vec2(ROW0_U, v)),
        _texture(u_jointNormalMatrixSampler, vec2(ROW1_U, v)),
        _texture(u_jointNormalMatrixSampler, vec2(ROW2_U, v)),
        _texture(u_jointNormalMatrixSampler, vec2(ROW3_U, v))
    );
    #else
    return u_jointNormalMatrix[int(boneNdx)];
    #endif
}

mat4 getSkinningMatrix()
{
    mat4 skin = mat4(0);

    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)
    skin +=
        a_Weight1.x * getJointMatrix(a_Joint1.x) +
        a_Weight1.y * getJointMatrix(a_Joint1.y) +
        a_Weight1.z * getJointMatrix(a_Joint1.z) +
        a_Weight1.w * getJointMatrix(a_Joint1.w);
    #endif

    return skin;
}

mat4 getSkinningNormalMatrix()
{
    mat4 skin = mat4(0);

    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)
    skin +=
        a_Weight1.x * getJointNormalMatrix(a_Joint1.x) +
        a_Weight1.y * getJointNormalMatrix(a_Joint1.y) +
        a_Weight1.z * getJointNormalMatrix(a_Joint1.z) +
        a_Weight1.w * getJointNormalMatrix(a_Joint1.w);
    #endif

    return skin;
}
#endif // !USE_SKINNING

#ifdef USE_MORPHING
vec4 getTargetPosition()
{
    vec4 pos = vec4(0);

#ifdef HAS_TARGET_POSITION0
    pos.xyz += u_morphWeights[0] * a_Target_Position0;
#endif

#ifdef HAS_TARGET_POSITION1
    pos.xyz += u_morphWeights[1] * a_Target_Position1;
#endif

#ifdef HAS_TARGET_POSITION2
    pos.xyz += u_morphWeights[2] * a_Target_Position2;
#endif

#ifdef HAS_TARGET_POSITION3
    pos.xyz += u_morphWeights[3] * a_Target_Position3;
#endif

#ifdef HAS_TARGET_POSITION4
    pos.xyz += u_morphWeights[4] * a_Target_Position4;
#endif

    return pos;
}

vec4 getTargetNormal()
{
    vec4 normal = vec4(0);

#ifdef HAS_TARGET_NORMAL0
    normal.xyz += u_morphWeights[0] * a_Target_Normal0;
#endif

#ifdef HAS_TARGET_NORMAL1
    normal.xyz += u_morphWeights[1] * a_Target_Normal1;
#endif

#ifdef HAS_TARGET_NORMAL2
    normal.xyz += u_morphWeights[2] * a_Target_Normal2;
#endif

#ifdef HAS_TARGET_NORMAL3
    normal.xyz += u_morphWeights[3] * a_Target_Normal3;
#endif

#ifdef HAS_TARGET_NORMAL4
    normal.xyz += u_morphWeights[4] * a_Target_Normal4;
#endif

    return normal;
}

vec4 getTargetTangent()
{
    vec4 tangent = vec4(0);

#ifdef HAS_TARGET_TANGENT0
    tangent.xyz += u_morphWeights[0] * a_Target_Tangent0;
#endif

#ifdef HAS_TARGET_TANGENT1
    tangent.xyz += u_morphWeights[1] * a_Target_Tangent1;
#endif

#ifdef HAS_TARGET_TANGENT2
    tangent.xyz += u_morphWeights[2] * a_Target_Tangent2;
#endif

#ifdef HAS_TARGET_TANGENT3
    tangent.xyz += u_morphWeights[3] * a_Target_Tangent3;
#endif

#ifdef HAS_TARGET_TANGENT4
    tangent.xyz += u_morphWeights[4] * a_Target_Tangent4;
#endif

    return tangent;
}

#endif // !USE_MORPHING
