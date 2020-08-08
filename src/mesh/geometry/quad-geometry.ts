import { MeshGeometry3D } from "./mesh-geometry"

export namespace QuadGeometry {
  export function create() {
    return Object.assign(new MeshGeometry3D(), {
      positions: {
        buffer: new Float32Array([-1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 1, 0])
      },
      indices: {
        buffer: new Uint8Array([0, 2, 1, 0, 1, 3])
      },
      normals: {
        buffer: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])
      },
      uvs: [{
        buffer: new Float32Array([0, 0, 1, 1, 0, 1, 1, 0])
      }]
    })
  }
}