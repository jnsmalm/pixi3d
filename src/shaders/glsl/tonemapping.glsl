const float GAMMA = 2.2;
const float INV_GAMMA = 1.0 / GAMMA;

vec4 SRGBtoLINEAR(vec4 srgbIn) {
    return vec4(pow(srgbIn.xyz, vec3(GAMMA)), srgbIn.w);
}

vec3 LINEARtoSRGB(vec3 color) {
    return pow(color, vec3(INV_GAMMA));
}

vec3 toneMap(vec3 color) {
    return LINEARtoSRGB(color / (color + vec3(1.0)));
}