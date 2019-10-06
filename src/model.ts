import { Mesh3D, BaseMesh } from "./mesh"
import { glTFParser } from "./gltf/parser"
import { GeometryFactory, BasicGeometryFactory } from "./geometry"
import { BasicShader } from "./shaders/basic"
import { Container3D } from "./container"

export class Model3D extends Container3D {
  constructor(public meshes: Mesh3D[]) {
    super()
    for (let mesh of meshes) {
      this.addChild(mesh)
    }
  }

  static baseMeshCache: { [source: string]: BaseMesh[] } = {}
  static geometryFactory: GeometryFactory = new BasicGeometryFactory()
  static shader: PIXI.Shader = new BasicShader()

  static from(source: string, shader?: PIXI.Shader, geometryFactory?: GeometryFactory) {
    if (!geometryFactory) {
      geometryFactory = Model3D.geometryFactory
    }
    if (!shader) {
      shader = Model3D.shader
    }
    if (!Model3D.baseMeshCache[source]) {
      Model3D.baseMeshCache[source] = []
      let parser = glTFParser.from(source)
      for (let data of parser.getMeshData()) {
        Model3D.baseMeshCache[source].push({
          geometry: geometryFactory.create(data),
          shader: shader
        })
      }
    }
    let meshes: Mesh3D[] = []
    for (let baseMesh of Model3D.baseMeshCache[source]) {
      meshes.push(new Mesh3D(baseMesh))
    }
    return new Model3D(meshes)
  }
}