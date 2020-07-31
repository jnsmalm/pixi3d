import { MeshGeometryAttribute } from "./mesh-geometry-attribute"

export interface MeshGeometryTarget {
    positions?: MeshGeometryAttribute
    normals?: MeshGeometryAttribute
    tangents?: MeshGeometryAttribute
}