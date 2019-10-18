import { glTFParser } from "./gltf/parser"
import { Container3D } from "./container"
import { Shader, ShaderFactory } from "./shader"
import { Animation } from "./animation"

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
}