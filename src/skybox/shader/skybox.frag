varying vec3 v_Position;

uniform samplerCube u_EnvironmentSampler;
uniform bool u_RGBE;
uniform float u_Exposure;

const float GAMMA = 2.2;
const float INV_GAMMA = 1.0 / GAMMA;

// linear to sRGB approximation
// see http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html
vec3 linearToSRGB(vec3 color)
{
    return pow(color, vec3(INV_GAMMA));
}

vec3 decodeRGBE(vec4 rgbe) {
  vec3 vDecoded;
  float fExp = rgbe.a * 255.0 - 128.0;
  vDecoded = rgbe.rgb * exp2(fExp);
  return vDecoded;
}

void main() {
  vec4 color = textureCube(u_EnvironmentSampler, v_Position);
  if (u_RGBE) {
    color = vec4(decodeRGBE(color), 1.0);
  }
  gl_FragColor = vec4(linearToSRGB(color.rgb * u_Exposure), 1.0);
}