vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

float distributionGGX(vec3 N, vec3 H, float roughness) {
  const float PI = 3.14159265359;
  
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;

  float nom = a2;
  float denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  // prevent divide by zero for roughness=0.0 and NdotH=1.0
  return nom / max(denom, 0.001);
}

float geometrySchlickGGX(float NdotV, float roughness) {
  float r = (roughness + 1.0);
  float k = (r * r) / 8.0;

  float nom   = NdotV;
  float denom = NdotV * (1.0 - k) + k;

  return nom / denom;
}

float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx2 = geometrySchlickGGX(NdotV, roughness);
  float ggx1 = geometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}

vec3 lightReflectance(vec3 position, vec3 light, vec3 color, vec3 normal, vec3 viewDirection, float roughness, float metallic, vec3 reflectance, vec3 albedo) {
  const float PI = 3.14159265359;
  
  vec3 lightDirection = normalize(light - position);
  vec3 H = normalize(viewDirection + lightDirection);
  float distance = length(light - position);
  float attenuation = 1.0 / (distance * distance);
  vec3 radiance =  color * attenuation;

  // Cook-Torrance BRDF
  float NDF = distributionGGX(normal, H, roughness);   
  float G = geometrySmith(normal, viewDirection, lightDirection, roughness);      
  vec3 F = fresnelSchlick(max(dot(H, viewDirection), 0.0), reflectance);
      
  vec3 nominator = NDF * G * F; 
  float denominator = 4.0 * max(dot(normal, viewDirection), 0.0) * max(dot(normal, lightDirection), 0.0) + 0.001; // 0.001 to prevent divide by zero.
  vec3 specular = nominator / denominator;
  
  // kS is equal to Fresnel
  vec3 kS = F;
  // for energy conservation, the diffuse and specular light can't
  // be above 1.0 (unless the surface emits light); to preserve this
  // relationship the diffuse component (kD) should equal 1.0 - kS.
  vec3 kD = vec3(1.0) - kS;
  // multiply kD by the inverse metalness such that only non-metals 
  // have diffuse lighting, or a linear blend if partly metal (pure metals
  // have no diffuse light).
  kD *= 1.0 - metallic;

  // scale light by NdotL
  float NdotL = max(dot(normal, lightDirection), 0.0);

  // add to outgoing radiance Lo
  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
  return (kD * albedo / PI + specular) * radiance * NdotL;
}