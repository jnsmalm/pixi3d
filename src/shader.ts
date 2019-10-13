import { Transform3D } from "./transform"
import { MeshData } from "./data"

export interface Shader extends PIXI.Shader {
  transform: Transform3D | undefined
  createGeometry(data: MeshData): PIXI.Geometry
}