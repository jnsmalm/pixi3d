vec4 encodeRGBE(vec3 rgb) {
  vec4 vEncoded;
  float maxComponent = max(max(rgb.r, rgb.g), rgb.b);
  float fExp = ceil(log2(maxComponent));
  vEncoded.rgb = rgb / exp2(fExp);
  vEncoded.a = (fExp + 128.0) / 255.0;
  return vEncoded;
}

vec3 decodeRGBE(vec4 rgbe) {
  vec3 vDecoded;
  float fExp = rgbe.a * 255.0 - 128.0;
  vDecoded = rgbe.rgb * exp2(fExp);
  return vDecoded;
}