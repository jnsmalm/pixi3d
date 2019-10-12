import { Mesh3D } from "./mesh"
import { glTFParser } from "./gltf/parser"
import { Container3D } from "./container"
import { Shader } from "./shader"
import { BasicShader } from "./shaders/basic"
import { Transform3D } from "./transform"

interface BaseMesh {
  transform: Transform3D
  geometry: PIXI.Geometry
}

export class Model3D extends Container3D {
  constructor(public nodes: Container3D[]) {
    super()
    for (let node of nodes) {
      this.addChild(node)
    }
  }

  static baseMesh: { [source: string]: BaseMesh[] } = {}

  static from(source: string, shader: Shader = new BasicShader()) {
    let baseMesh = Model3D.baseMesh[source]
    if (!baseMesh) {
      baseMesh = Model3D.baseMesh[source] = []
      let parser = glTFParser.from(source)
      for (let data of parser.getMeshData()) {
        baseMesh.push({
          geometry: shader.createGeometry(data),
          transform: data.transform
        })
      }
    }
    let nodes: Container3D[] = []
    for (let baseMesh of Model3D.baseMesh[source]) {
      let mesh = new Mesh3D(baseMesh.geometry, shader)
      mesh.transform.setFromTransform(baseMesh.transform)
      nodes.push(mesh)
    }
    return new Model3D(nodes)
  }
}