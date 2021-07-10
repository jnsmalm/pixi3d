vec4 _textureLod(sampler2D sampler, vec2 coord, float lod)
{
#ifdef WEBGL2
    return textureLod(sampler, coord, lod);
#elif GL_EXT_shader_texture_lod
    return texture2DLodEXT(sampler, coord, lod);
#endif
    return vec4(0.0);
}

vec4 _textureLod(samplerCube sampler, vec3 coord, float lod)
{
#ifdef WEBGL2
    return textureLod(sampler, coord, lod);
#elif GL_EXT_shader_texture_lod
    return textureCubeLodEXT(sampler, coord, lod);
#endif
    return vec4(0.0);
}