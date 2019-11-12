import { Container3D } from "./container"
import { Animation } from "./animation"
import { glTFParser } from "./gltf/parser"
import { MaterialFactory } from "./material"
import { Shader } from "./shader"
import { ShaderFactory } from "./shader-factory"
import { glTFLoader } from "./gltf/loader"

export interface ModelFromOptions {
  materialFactory?: MaterialFactory
  shader?: Shader
  shaderFactory?: ShaderFactory
}

export class Model3D extends Container3D {
  animations: Animation[] = []

  static from(source: string, options: ModelFromOptions = {}) {
    let resource = glTFLoader.resources[source]
    if (!resource) {
      throw Error(`PIXI3D: Could not find "${source}", was the file loaded?`)
    }
    return new glTFParser(resource, options).createModel()
  }
}