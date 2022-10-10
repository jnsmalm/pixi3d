#version VERSION

#define FEATURES

#if defined(WEBGL1)
  #extension GL_OES_standard_derivatives : enable
#endif

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

#ifdef WEBGL2
  out vec4 FRAG_COLOR;
#endif

void main() {
  float depth = gl_FragCoord.z;
  float dx = 0.0;
  float dy = 0.0;

  #if defined(WEBGL2) || defined(GL_OES_standard_derivatives)
    dx = dFdx(depth);
    dy = dFdy(depth);
  #endif

  float moment2 = depth * depth + 0.25 * (dx * dx + dy * dy);
  FRAG_COLOR = vec4(1.0 - depth, 1.0 - moment2, 0.0, 0.0);
}