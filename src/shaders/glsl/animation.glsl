#ifdef HAS_TARGET_POSITION0
    attribute vec3 targetPosition0;
#endif
#ifdef HAS_TARGET_POSITION1
    attribute vec3 targetPosition1;
#endif
#ifdef HAS_TARGET_POSITION2
    attribute vec3 targetPosition2;
#endif
#ifdef HAS_TARGET_POSITION3
    attribute vec3 targetPosition3;
#endif

#ifdef HAS_TARGET_NORMAL0
    attribute vec3 targetNormal0;
#endif
#ifdef HAS_TARGET_NORMAL1
    attribute vec3 targetNormal1;
#endif

#ifdef HAS_TARGET_TANGENT0
    attribute vec3 targetTangent0;
#endif
#ifdef HAS_TARGET_TANGENT1
    attribute vec3 targetTangent1;
#endif

#ifdef USE_MORPHING
    uniform float morphWeights[4];
#endif

vec3 getTargetPosition() {
    vec3 position = vec3(0.0);
    #ifdef HAS_TARGET_POSITION0
        position += morphWeights[0] * targetPosition0;
    #endif
    #ifdef HAS_TARGET_POSITION1
        position += morphWeights[1] * targetPosition1;
    #endif
    #ifdef HAS_TARGET_POSITION2
        position += morphWeights[2] * targetPosition1;
    #endif
    #ifdef HAS_TARGET_POSITION3
        position += morphWeights[3] * targetPosition1;
    #endif
    return position;
}

vec3 getTargetNormal() {
    vec3 normal = vec3(0.0);
    #ifdef HAS_TARGET_NORMAL0
        normal += morphWeights[0] * targetNormal0;
    #endif
    #ifdef HAS_TARGET_NORMAL1
        normal += morphWeights[1] * targetNormal1;
    #endif
    return normal;
}

vec4 getTargetTangent() {
    vec4 tangent = vec4(0.0);
    #ifdef HAS_TARGET_NORMAL0
        tangent.xyz += morphWeights[0] * targetTangent0;
    #endif
    #ifdef HAS_TARGET_NORMAL1
        tangent.xyz += morphWeights[1] * targetTangent1;
    #endif
    return tangent;
}
