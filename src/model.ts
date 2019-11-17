import { Container3D } from "./container"
import { Animation } from "./animation"
import { glTFParser } from "./gltf/parser"
import { Shader } from "./shader"
import { ShaderFactory } from "./shader-factory"
import { glTFLoader } from "./gltf/loader"
import { Mesh3D } from "./mesh"

export interface ModelFromOptions {
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

  getChildByName(name: string, node = this): Container3D | Mesh3D | undefined {
    for (let child of node.children) {
      if (child.name === name) {
        return child
      }
    }
    for (let child of node.children) {
      return this.getChildByName(name, child)
    }
  }
}