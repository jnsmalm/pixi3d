varying vec3 v_position;

uniform samplerCube cubemap;

void main() {
  gl_FragColor = vec4(textureCube(cubemap, v_position).rgb, 1.0);
}