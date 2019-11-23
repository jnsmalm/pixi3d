uniform samplerCube irradianceMap;
uniform sampler2D brdfLUT;
uniform samplerCube radianceMap;
uniform float radianceLevels;

vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
} 

vec3 ibl(vec3 viewDirection, vec3 normal, vec3 F0, float metallic, float roughness, float occlusion, vec3 baseColor) {
  vec3 R = reflect(-viewDirection, normal);

  vec3 kS = fresnelSchlickRoughness(max(dot(normal, viewDirection), 0.0), F0, roughness); 
  vec3 kD = 1.0 - kS;
  kD *= 1.0 - metallic;

  vec3 irradiance = textureCube(irradianceMap, normal).rgb;
  vec3 diffuse = irradiance * baseColor.rgb;

  vec3 prefilteredColor = textureCube(radianceMap, R, roughness * radianceLevels).rgb; 
  vec2 envBRDF = texture2D(brdfLUT, vec2(max(dot(normal, viewDirection), roughness))).rg;
  vec3 specular = prefilteredColor * (kS * envBRDF.x + envBRDF.y);

  return (kD * diffuse + specular) * occlusion;
}