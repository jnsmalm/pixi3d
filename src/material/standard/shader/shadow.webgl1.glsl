#ifdef USE_SHADOW_MAPPING
varying vec4 v_PositionLightSpace;
#endif

float linstep(float low, float high, float v)
{
    return clamp((v-low) / (high-low), 0.0, 1.0);
}

#ifdef USE_SHADOW_MAPPING
float getShadowContribution()
{
    vec3 coords = v_PositionLightSpace.xyz / v_PositionLightSpace.w * 0.5 + 0.5;
    if (coords.z < 0.01 || coords.z > 0.99 || coords.x < 0.01 || coords.x > 0.99 || coords.y < 0.01 || coords.y > 0.99) {
        return 1.0;
    }
    vec2 moments = vec2(1.0) - texture2D(u_ShadowSampler, coords.xy).xy;
    float p = step(coords.z, moments.x);
    float variance = max(moments.y - moments.x * moments.x, 0.00002);
    float d = coords.z - moments.x;
    float pMax = linstep(0.2, 1.0, variance / (variance + d*d));
    return min(max(p, pMax), 1.0);
}
#endif