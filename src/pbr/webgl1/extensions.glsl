vec3 _dFdx(vec3 coord)
{
#ifdef GL_OES_standard_derivatives
    return dFdx(coord);
#endif
    return vec3(0.0);
}

vec3 _dFdy(vec3 coord)
{
#ifdef GL_OES_standard_derivatives
    return dFdy(coord);
#endif
    return vec3(0.0);
}

vec4 _textureCubeLodEXT(samplerCube sampler, vec3 coord, float lod)
{
#ifdef GL_EXT_shader_texture_lod
    return textureCubeLodEXT(sampler, coord, lod);
#endif
    return vec4(0.0);
}