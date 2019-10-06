import { Mesh3D } from "./mesh"
import { glTFParser } from "./gltf/parser"
import { Container3D } from "./container"
import { Shader } from "./shader"

export class Model3D extends Container3D {
  constructor(public meshes: Mesh3D[]) {
    super()
    for (let mesh of meshes) {
      this.addChild(mesh)
    }
  }

  static geometry: { [source: string]: PIXI.Geometry[] } = {}

  static from(source: string, shader: Shader) {
    let geometry = Model3D.geometry[source]
    if (!geometry) {
      geometry = Model3D.geometry[source] = []
      let parser = glTFParser.from(source)
      for (let data of parser.getMeshData()) {
        geometry.push(shader.createGeometry(data))
      }
    }
    let meshes: Mesh3D[] = []
    for (let geometry of Model3D.geometry[source]) {
      meshes.push(new Mesh3D(geometry, shader))
    }
    return new Model3D(meshes)
  }
}