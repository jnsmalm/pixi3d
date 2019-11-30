precision mediump float;

#define INSERT

#import <lighting.glsl>
#import <tonemapping.glsl>
#import <ibl.glsl>
#import <textures.glsl>

varying vec3 v_position;

#ifdef HAS_NORMAL
  varying vec3 v_normal;
#endif
#ifdef HAS_TANGENT
  varying mat3 v_TBN;
#endif

uniform vec3 viewPosition;
uniform vec4 baseColor;
uniform float metallic;
uniform float roughness;

uniform vec3 lightPositions[4];
uniform vec3 lightColors[4];

uniform float alphaMaskCutoff;

void main() {
  vec4 baseColor = baseColor * SRGBtoLINEAR(baseColorFromMap());
  #ifdef ALPHAMODE_BLEND
    baseColor.rgb *= baseColor.a;
  #endif
  #ifdef ALPHAMODE_MASK
    if (baseColor.a < alphaMaskCutoff) {
      discard;
    }
    baseColor.a = 1.0;
  #endif
  #ifdef ALPHAMODE_OPAQUE
    baseColor.a = 1.0;
  #endif
  #ifndef HAS_NORMAL
    // When we don't have a normal, there is no need to continue with lighting 
    // calculations. Just use base color.
    gl_FragColor = vec4(LINEARtoSRGB(baseColor.rgb) * baseColor.a, baseColor.a);
    return;
  #endif

  // This normal value will never be used but needs to be initialized for the
  // compiler to be happy.
  vec3 normal = vec3(0.0);
  #ifdef HAS_NORMAL
    normal = normalize(v_normal);
  #endif
  #ifdef HAS_NORMAL_MAP
  #ifdef HAS_TANGENT
    normal = normalize(v_TBN * normalFromMap());
  #endif
  #endif

  float metallic = metallic * SRGBtoLINEAR(metallicFromMap());
  float roughness = roughness * SRGBtoLINEAR(roughnessFromMap());
  float occlusion = SRGBtoLINEAR(occlusionFromMap());

  vec3 viewDirection = normalize(viewPosition - v_position);

  // Calculate reflectance at normal incidence; if dia-electric (like plastic) 
  // use F0 of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
  vec3 f0 = mix(vec3(0.04), baseColor.rgb, metallic); 

  vec3 color = vec3(0.0);
  for(int i = 0; i < 4; ++i) {
    color += lightReflectance(v_position, lightPositions[i], lightColors[i], 
      normal, viewDirection, roughness, metallic, f0, baseColor.rgb);
  }
  #ifdef USE_IBL
    color += ibl(viewDirection, normal, f0, metallic, roughness, occlusion, baseColor.rgb);
  #endif
  #ifdef EMISSIVE_MAP
    color += SRGBtoLINEAR(emissiveFromMap()).rgb;
  #endif

  gl_FragColor = vec4(toneMap(color) * baseColor.a, baseColor.a);
}