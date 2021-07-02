vec3 _dFdx(vec3 coord)
{
#if defined(WEBGL2) || defined(GL_OES_standard_derivatives)
    return dFdx(coord);
#endif
    return vec3(0.0);
}

vec3 _dFdy(vec3 coord)
{
#if defined(WEBGL2) || defined(GL_OES_standard_derivatives)
    return dFdy(coord);
#endif
    return vec3(0.0);
}