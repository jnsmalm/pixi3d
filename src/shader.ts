import { Transform3D } from "./transform"
import { Material } from "./material"
import { MeshGeometryData } from "./mesh"

export interface Shader extends PIXI.Shader {
  material?: Material
  transform?: Transform3D
  weights?: number[]
  createGeometry(data: MeshGeometryData): PIXI.Geometry
}