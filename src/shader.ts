import { MeshData } from "./mesh"

export interface Shader extends PIXI.Shader {
  createGeometry(data: MeshData): PIXI.Geometry
}