import { Material } from "./material"
import { MeshGeometryData, Mesh3D } from "./mesh"

export interface Shader extends PIXI.Shader {
  updateUniforms(mesh: Mesh3D): void
  createGeometry(data: MeshGeometryData): PIXI.Geometry
  createMaterial?(material?: Material): Material
}