import { MeshData } from "./mesh"

export interface Shader extends PIXI.Shader {
  worldTransform: Float32Array
  createGeometry(data: MeshData): PIXI.Geometry
}