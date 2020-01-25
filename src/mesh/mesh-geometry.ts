export interface MeshMorphTarget {
  positions?: MeshAttribute,
  normals?: MeshAttribute,
  tangents?: MeshAttribute
}

export interface MeshAttribute {
  stride: number
  buffer: ArrayBuffer
}

export interface MeshGeometryData {
  indices?: MeshAttribute
  positions: MeshAttribute
  normals?: MeshAttribute
  texCoords?: MeshAttribute
  tangents?: MeshAttribute
  weights?: number[]
  morphTargets?: MeshMorphTarget[]
}