varying vec2 v_UV1;

uniform float u_AnimationTime;
uniform vec3 u_WaterColor;
uniform float u_Transparency;

// Size (x/y) of the view we are rendering to.
uniform vec2 u_ViewSize;

uniform sampler2D u_WaterDUDV;
uniform sampler2D u_Scene;
uniform sampler2D u_SceneDepth;

void main() {
  float transparency = u_Transparency;
  
  // The water du/dv map is used to be able to distort the pixels of the scene 
  // and create a water rippling effect. The uv coordinates are being offset by 
  // an direction and animation time.
  vec2 waterDUDV = texture2D(u_WaterDUDV, v_UV1 + vec2(0.3, 0.1) * u_AnimationTime).rg * 2.0 - 1.0;

  // Scene uv coordinates are used to be able to read the pixels from the 
  // rendered scene which is not water.
  vec2 sceneUV = gl_FragCoord.xy / u_ViewSize;
  vec2 sceneOffsetUV = sceneUV + waterDUDV * 0.007;
  
  // Scene depth is being used to be able to determine if an object is viewed 
  // through water or not.
  float sceneDepth = texture2D(u_SceneDepth, sceneUV).r;
  float sceneOffsetDepth = texture2D(u_SceneDepth, sceneOffsetUV).r;

  vec4 sceneColor = texture2D(u_Scene, sceneUV);

  if (sceneDepth < gl_FragCoord.z) {
    // Object is not viewed through water and should not have any transparency
    // at all.
    transparency = 1.0;
  } 
  else if (sceneOffsetDepth > gl_FragCoord.z) {
    // Object is viewed through water, read color from scene with the rippling 
    // animation offset.
    sceneColor = texture2D(u_Scene, sceneOffsetUV);
  }
  
  vec4 waterColor = vec4(u_WaterColor, 1.0);
  if (sceneColor.a < 1.0) {
    // Color does not contain any part of any object, just use water color in 
    // this case. This works because there should not be any transparent pixels 
    // in the scene (no anti aliasing used).
    transparency = 0.0;
  }
  
  // Finally, mix the color from the scene and the color from water.
  gl_FragColor = mix(waterColor, sceneColor, transparency);
}