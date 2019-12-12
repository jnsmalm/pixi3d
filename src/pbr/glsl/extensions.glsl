vec3 _dFdx(vec3 coord)
{
#ifndef PIXI_EXTRACT_DATA_ON
    return dFdx(coord);
#endif
    return vec3(0.0);
}

vec3 _dFdy(vec3 coord)
{
#ifndef PIXI_EXTRACT_DATA_ON
    return dFdy(coord);
#endif
    return vec3(0.0);
}

vec4 _textureCubeLodEXT(samplerCube sampler, vec3 coord, float lod)
{
#ifndef PIXI_EXTRACT_DATA_ON
    #ifdef WEBGL1
    return textureCubeLodEXT(sampler, coord, lod);
    #endif
    #ifdef WEBGL2
    return textureCube(sampler, coord, lod);
    #endif
#else
    return vec4(0.0);
#endif
}