mat3 TBN(vec3 normal, vec4 tangent, mat4 world) {
  vec3 bitangent = cross(normal, tangent.xyz) * tangent.w;
  vec3 t = normalize(vec3(world * tangent));
  vec3 b = normalize(vec3(world * vec4(bitangent, 0.0)));
  vec3 n = normalize(vec3(world * vec4(normal, 0.0)));
  return mat3(t, b, n);
}