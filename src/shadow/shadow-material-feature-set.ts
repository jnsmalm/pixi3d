import { Renderer } from "@pixi/core"

export namespace ShadowMaterialFeatureSet {
  export function build(renderer: Renderer, features: string[] = []) {
    if (renderer.context.webGLVersion === 1) {
      features.push("WEBGL1 1")
    }
    if (renderer.context.webGLVersion === 2) {
      features.push("WEBGL2 1")
    }
    return features
  }
}