attribute vec3 a_Position;

varying vec3 v_Position;

uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Projection;

void main() {
  v_Position = a_Position.xyz;

  // Converting the view to 3x3 matrix and then back to 4x4 matrix 
  // removes the translation. We do this because we want the skybox to 
  // be centered around the camera.
  gl_Position = u_Projection * mat4(mat3(u_View)) * u_World * vec4(a_Position, 1.0);
}