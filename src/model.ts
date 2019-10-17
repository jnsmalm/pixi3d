import { glTFParser } from "./gltf/parser"
import { Container3D } from "./container"
import { Shader, ShaderFactory } from "./shader"
import { Animation, AnimationType, TranslationAnimator, ScaleAnimator, RotationAnimator } from "./animation"

export class Model3D extends Container3D {
  animations: Animation[] = []

  constructor(public nodes: Container3D[], animations?: Animation[]) {
    super()
    for (let node of nodes) {
      this.addChild(node)
    }
    if (animations) {
      this.animations.push(...animations)
    }
  }

  static from(source: string, shader?: Shader, shaderFactory?: ShaderFactory) {
    return glTFParser.from(source, shader, shaderFactory).createModel()
  }

  createAnimator(animation: Animation | string) {
    if (typeof animation === "string") {
      this.animations.forEach((value) => {
        if (value.name === animation) {
          animation = value
        }
      })
      if (typeof animation === "string") {
        throw new Error(`PIXI3D: Animation "${animation}" does not exist.`)
      }
    }
    let transform = this.nodes[animation.node].transform
    switch (animation.type) {
      case AnimationType.translation:
        return new TranslationAnimator(transform, animation)
      case AnimationType.scale:
        return new ScaleAnimator(transform, animation)
      case AnimationType.rotation:
        return new RotationAnimator(transform, animation)
    }
    throw new Error(`PIXI3D: Unknown animation type "${animation.type}".`)
  }
}