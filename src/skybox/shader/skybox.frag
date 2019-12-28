varying vec3 v_Position;

uniform samplerCube u_Texture;

void main() {
  gl_FragColor = vec4(textureCube(u_Texture, v_Position).rgb, 1.0);
}