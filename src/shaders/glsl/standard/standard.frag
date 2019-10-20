precision mediump float;

#define ATTRIBUTE_NORMAL 0
#define ATTRIBUTE_TEXCOORD 0

#if (ATTRIBUTE_NORMAL == 1)
  varying vec3 v_normal;
#endif
#if (ATTRIBUTE_TEXCOORD == 1)
  varying vec2 v_texCoord;
#endif

uniform vec3 directionalLight;
uniform vec4 baseColor;
uniform sampler2D baseColorTexture;

void main() {
  gl_FragColor = baseColor;
  #if (ATTRIBUTE_TEXCOORD == 1)
    gl_FragColor *= texture2D(baseColorTexture, v_texCoord);
  #endif
  #if (ATTRIBUTE_NORMAL == 1)
    vec3 normal = normalize(v_normal);
    float light = max(0.0, dot(normal, normalize(directionalLight)));
    gl_FragColor.rgb *= light;
  #endif
}