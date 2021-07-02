vec4 _texture(sampler2D sampler, vec2 coord)
{
#ifdef WEBGL2
    return texture(sampler, coord);
#else
    return texture2D(sampler, coord);
#endif
}

vec4 _texture(samplerCube sampler, vec3 coord)
{
#ifdef WEBGL2
    return texture(sampler, coord);
#else
    return textureCube(sampler, coord);
#endif
}