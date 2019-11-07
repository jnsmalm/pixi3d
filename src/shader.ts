import { Transform3D } from "./transform"
import { MeshData } from "./mesh"
import { MetallicRoughnessMaterial } from "./material"

export interface Shader extends PIXI.Shader {
  material: MetallicRoughnessMaterial | undefined
  transform: Transform3D | undefined
  weights?: number[]
  createGeometry(data: MeshData): PIXI.Geometry
}