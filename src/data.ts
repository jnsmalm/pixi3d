import { Transform3D } from "./transform"
import { Animation } from "./animation"

export interface ModelData {
  nodes: NodeData[]
  animations: Animation[]
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
}