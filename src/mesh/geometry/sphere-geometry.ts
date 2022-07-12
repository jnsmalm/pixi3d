import { Vec3 } from "../../math/vec3"
import { MeshGeometry3D } from "./mesh-geometry"

export interface SphereGeometryOptions {
  radius?: number
  segments?: number
  rings?: number
}

export namespace SphereGeometry {
  export function create(options: SphereGeometryOptions = {}) {
    const { radius = 1, segments = 32, rings = 16 } = options

    // Based on https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js

    const grid = []
    const indices = []
    const positions = []
    const uvs = []
    const normals = []

    let index = 0

    for (let iy = 0; iy <= rings; iy++) {
      const vertices = []
      const v = iy / rings

      let uOffset = 0

      if (iy == 0) {
        uOffset = 0.5 / segments
      } else if (iy == rings) {
        uOffset = - 0.5 / segments
      }
      for (let ix = 0; ix <= segments; ix++) {
        const u = ix / segments

        let x = - radius * Math.cos(u * Math.PI * 2) *
          Math.sin(v * Math.PI)
        let y = radius * Math.cos(v * Math.PI)
        let z = radius * Math.sin(u * Math.PI * 2) *
          Math.sin(v * Math.PI)

        let pos = Vec3.fromValues(x, y, z)

        positions.push(x, y, z)
        normals.push(...Vec3.normalize(pos))
        uvs.push(u + uOffset, 1 - v)

        vertices.push(index++)
      }
      grid.push(vertices)
    }

    for (let iy = 0; iy < rings; iy++) {
      for (let ix = 0; ix < segments; ix++) {
        const a = grid[iy][ix + 1]
        const b = grid[iy][ix]
        const c = grid[iy + 1][ix]
        const d = grid[iy + 1][ix + 1]
        if (iy !== 0) {
          indices.push(a, b, d)
        }
        if (iy !== rings - 1) {
          indices.push(b, c, d)
        }
      }
    }
    return Object.assign(new MeshGeometry3D(), {
      normals: {
        buffer: new Float32Array(normals)
      },
      uvs: [{
        buffer: new Float32Array(uvs)
      }],
      indices: {
        buffer: new Uint16Array(indices)
      },
      positions: {
        buffer: new Float32Array(positions)
      }
    })
  }
}