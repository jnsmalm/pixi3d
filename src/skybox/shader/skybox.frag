varying vec3 v_Position;

uniform samplerCube u_EnvironmentSampler;

void main() {
  gl_FragColor = vec4(textureCube(u_EnvironmentSampler, v_Position).rgb, 1.0);
}