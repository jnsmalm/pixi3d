import { Transform3D } from "./transform"
import { Material } from "./material"
import { MeshData } from "./mesh-data"

export interface Shader extends PIXI.Shader {
  material?: Material
  transform?: Transform3D
  weights?: number[]
  createGeometry(data: MeshData): PIXI.Geometry
}