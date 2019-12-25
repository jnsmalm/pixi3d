attribute vec3 position;
varying vec3 v_position;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

void main() {
  v_position = position.xyz;

  // Converting the view to 3x3 matrix and then back to 4x4 matrix 
  // removes the translation. We do this because we want the skybox to 
  // be centered around the camera.
  gl_Position = projection * mat4(mat3(view)) * world * vec4(position, 1.0);
}