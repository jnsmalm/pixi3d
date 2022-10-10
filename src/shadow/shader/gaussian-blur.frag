#version VERSION

#define FEATURES

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

#ifdef WEBGL2
  out vec4 FRAG_COLOR;
#endif

FRAG_IN vec2 v_UV1;

uniform vec2 u_BlurScale;
uniform sampler2D u_FilterSampler;

void main() {
  vec4 color = vec4(0.0);

  color += texture2D(u_FilterSampler, v_UV1 + (vec2(-3.0) * u_BlurScale.xy)) * (1.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(-2.0) * u_BlurScale.xy)) * (6.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(-1.0) * u_BlurScale.xy)) * (15.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(+0.0) * u_BlurScale.xy)) * (20.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(+1.0) * u_BlurScale.xy)) * (15.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(+2.0) * u_BlurScale.xy)) * (6.0/64.0);
  color += texture2D(u_FilterSampler, v_UV1 + (vec2(+3.0) * u_BlurScale.xy)) * (1.0/64.0);

  FRAG_COLOR = color;
}