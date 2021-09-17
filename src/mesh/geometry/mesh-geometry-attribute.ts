export interface MeshGeometryAttribute {
    buffer: Uint32Array | Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array
    stride?: number
    componentType?: number
    min?: number[]
    max?: number[]
}