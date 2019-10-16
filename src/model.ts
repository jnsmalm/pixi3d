import { glTFParser } from "./gltf/parser"
import { Mesh3D } from "./mesh"
import { Container3D } from "./container"
import { Shader } from "./shader"
import { Animation, AnimationType, TranslationAnimator, ScaleAnimator, RotationAnimator } from "./animation"
import { BasicShader } from "./shaders/basic"

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

  static from(source: string, shader: Shader) {
    let data = glTFParser.from(source).getModelData()
    let nodes: Container3D[] = []

    for (let node of data.nodes) {
      let container = new Container3D()
      container.transform.setFromTransform(node.transform)
      if (node.mesh) {
        if (!shader) {
          shader = BasicShader.from(node.mesh)
        }
        container.addChild(new Mesh3D(shader.createGeometry(node.mesh), shader))
      }
      nodes.push(container)
    }
    return new Model3D(nodes, data.animations)
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