export interface MeshVertexMorphTarget {
  positions?: MeshVertexAttribute,
  normals?: MeshVertexAttribute,
  tangents?: MeshVertexAttribute
}

export interface MeshVertexAttribute {
  stride: number
  buffer: ArrayBuffer
}

export interface MeshVertexData {
  indices?: MeshVertexAttribute
  positions?: MeshVertexAttribute
  normals?: MeshVertexAttribute
  uvs?: MeshVertexAttribute[]
  tangents?: MeshVertexAttribute
  weights?: number[]
  morphTargets?: MeshVertexMorphTarget[]
}