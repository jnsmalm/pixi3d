import { MeshGeometryAttribute } from "./mesh-geometry-attribute"

/**
 * Represents a geometry morph target.
 */
export interface MeshGeometryTarget {
    positions?: MeshGeometryAttribute
    normals?: MeshGeometryAttribute
    tangents?: MeshGeometryAttribute
}