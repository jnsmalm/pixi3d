import { Transform3D } from "./transform"
import { Animation } from "./animation"
import { MetallicRoughnessMaterial } from "./material"

export interface ModelData {
  animations: Animation[]
  nodes: NodeData[]
}

export interface NodeData {
  mesh?: MeshData
  transform: Transform3D
}

export interface MeshData {
  indices?: ArrayBuffer,
  positions: ArrayBuffer,
  normals?: ArrayBuffer,
  texCoords?: ArrayBuffer
  material: MetallicRoughnessMaterial
}