#version VERSION

#define FEATURES

attribute vec3 a_Position;

#ifdef USE_SKINNING
  attribute vec4 a_Joint1;
  attribute vec4 a_Weight1;
#endif

uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;

#ifdef USE_SKINNING
  #ifdef USE_SKINNING_TEXTURE
    uniform sampler2D u_jointMatrixSampler;
  #else
    uniform mat4 u_jointMatrix[MAX_JOINT_COUNT];
  #endif
#endif

#ifdef USE_INSTANCING
  VERT_IN vec4 a_ModelMatrix0;
  VERT_IN vec4 a_ModelMatrix1;
  VERT_IN vec4 a_ModelMatrix2;
  VERT_IN vec4 a_ModelMatrix3;
#endif

// these offsets assume the texture is 4 pixels across
#define ROW0_U ((0.5 + 0.0) / 4.0)
#define ROW1_U ((0.5 + 1.0) / 4.0)
#define ROW2_U ((0.5 + 2.0) / 4.0)
#define ROW3_U ((0.5 + 3.0) / 4.0)

#ifdef USE_SKINNING
mat4 getJointMatrix(float boneNdx) {
  #ifdef USE_SKINNING_TEXTURE
    float v = (boneNdx + 0.5) / float(MAX_JOINT_COUNT);
    return mat4(texture2D(u_jointMatrixSampler, vec2(ROW0_U, v)), texture2D(u_jointMatrixSampler, vec2(ROW1_U, v)), texture2D(u_jointMatrixSampler, vec2(ROW2_U, v)), texture2D(u_jointMatrixSampler, vec2(ROW3_U, v)));
  #else
    return u_jointMatrix[int(boneNdx)];
  #endif
}

mat4 getSkinningMatrix() {
  mat4 skin = mat4(0);
  skin += a_Weight1.x * getJointMatrix(a_Joint1.x) +
    a_Weight1.y * getJointMatrix(a_Joint1.y) +
    a_Weight1.z * getJointMatrix(a_Joint1.z) +
    a_Weight1.w * getJointMatrix(a_Joint1.w);
  return skin;
}
#endif

void main() {
  mat4 modelMatrix = u_ModelMatrix;
  #ifdef USE_INSTANCING
    modelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
  #endif

  vec4 pos = vec4(a_Position, 1.0);
  #ifdef USE_SKINNING
    pos = getSkinningMatrix() * pos;
  #endif
  gl_Position = u_ViewProjectionMatrix * modelMatrix * pos;
}