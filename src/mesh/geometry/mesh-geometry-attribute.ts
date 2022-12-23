/**
 * Represents an attribute for mesh geometry.
 */
export interface MeshGeometryAttribute {
    /**
     * The buffer data.
     */
    buffer: Uint32Array | Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array
    /**
     * The minimum value of each component in this attribute.
     */
    min?: number[]
    /**
     * The maximum value of each component in this attribute.
     */
    max?: number[]
    /**
     * The datatype of components in this attribute.
     */
    componentType?: number
    /**
     * The stride, in bytes, between attributes. When this is not defined, data
     * is tightly packed. When two or more attributes use the same buffer, this
     * field must be defined.
     */
    stride?: number
    /**
     * The number of elements in this attribute.
     */
    componentCount?: number
}