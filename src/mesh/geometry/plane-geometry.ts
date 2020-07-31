import { MeshGeometry3D } from "./mesh-geometry"

export namespace PlaneGeometry {
  export function create() {
    return Object.assign(new MeshGeometry3D(), {
      positions: {
        buffer: new Float32Array([-1, 0, 1, 1, 0, -1, -1, 0, -1, 1, 0, 1])
      },
      indices: {
        buffer: new Uint8Array([0, 1, 2, 0, 3, 1])
      },
      normals: {
        buffer: new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])
      },
      uvs: [{
        buffer: new Float32Array([0, 1, 1, 0, 0, 0, 1, 1])
      }]
    })
  }
}