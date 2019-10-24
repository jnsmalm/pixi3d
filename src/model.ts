import { glTFParser } from "./gltf/parser"
import { Container3D } from "./container"
import { Shader, ShaderFactory } from "./shader"
import { Animation } from "./animation"

export class Model3D extends Container3D {
  animations: Animation[] = []

  static from(source: string, shader?: Shader, shaderFactory?: ShaderFactory) {
    return glTFParser.from(source, shader, shaderFactory).createModel()
  }
}