import { MeshData } from "./mesh"
import { Transform3D } from "./transform"

export interface Shader extends PIXI.Shader {
  transform: Transform3D | undefined
  createGeometry(data: MeshData): PIXI.Geometry
}