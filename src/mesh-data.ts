export interface TargetData {
  positions?: AttributeData,
  normals?: AttributeData,
  tangents?: AttributeData
}

export interface AttributeData {
  stride: number
  buffer: ArrayBuffer
}

export interface MeshData {
  indices?: AttributeData
  positions: AttributeData
  normals?: AttributeData
  colors?: AttributeData
  texCoords?: AttributeData
  tangents?: AttributeData
  weights?: number[]
  targets?: TargetData[]
}