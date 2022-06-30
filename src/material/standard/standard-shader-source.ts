import { Renderer } from "@pixi/core"

export namespace StandardShaderSource {
  export function build(source: string, features: string[], renderer: Renderer) {
    if (renderer.context.webGLVersion === 1) {
      source = source.replace(/VERSION/, "100")
        .replace(/VERT_IN/g, "attribute")
        .replace(/VERT_OUT/g, "varying")
        .replace(/FRAG_COLOR/g, "gl_FragColor")
        .replace(/FRAG_IN/g, "varying")
    }
    if (renderer.context.webGLVersion === 2) {
      source = source.replace(/VERSION/, "300 es")
        .replace(/VERT_IN/g, "in")
        .replace(/VERT_OUT/g, "out")
        .replace(/FRAG_COLOR/g, "g_finalColor")
        .replace(/FRAG_IN/g, "in")
    }
    return source.replace(/#define FEATURES/,
      features.map(value => `#define ${value}`).join("\n"))
  }
}