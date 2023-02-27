import { Vec3 } from "../../math/vec3"
import { MeshGeometry3D } from "./mesh-geometry"

export interface CircleGeometryOptions {
  /** The radius of the top of the circle. Default is 1. */
  radius?: number
  /** The number of segmented faces around the circumference of the cylinder. Default is 32. */
  segments?: number
  /** Start angle for first segment, default = 0 (three o'clock position). */
  thetaStart?: number
  /** The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder. */
  thetaLength?: number
}

export class CircleGeometry {
  static create(options: CircleGeometryOptions = {}): MeshGeometry3D {
    // Based on https://github.com/mrdoob/three.js/blob/master/src/geometries/CircleGeometry.js

    const radius = options?.radius ?? 1
    const segments = Math.max(3, Math.floor(options?.segments ?? 32))
    const thetaStart = options?.thetaStart ?? 0
    const thetaLength = options?.thetaLength ?? Math.PI * 2

    const indices = []
    const positions = []
    const normals = []
    const uvs = []

    const vertex = Vec3.create()
    const uv = Vec3.create()

    positions.push(0, 0, 0)
    normals.push(0, 0, 1)
    uvs.push(0.5, 0.5)

    for (let s = 0, i = 3; s <= segments; s += 1, i += 3) {
      const segment = thetaStart + (s / segments) * thetaLength
      vertex[0] = radius * Math.cos(segment)
      vertex[1] = radius * Math.sin(segment)
      positions.push(vertex[0], vertex[1], vertex[2])

      normals.push(0, 0, 1)

      uv[0] = (positions[i] / radius + 1) / 2
      uv[1] = (positions[i + 1] / radius + 1) / 2
      uvs.push(uv[0], uv[1])
    }

    for (let i = 1; i <= segments; i += 1) {
      indices.push(i, i + 1, 0)
    }

    return Object.assign(new MeshGeometry3D(), {
      normals: {
        buffer: new Float32Array(normals),
      },
      uvs: [
        {
          buffer: new Float32Array(uvs),
        },
      ],
      indices: {
        buffer: new Uint16Array(indices),
      },
      positions: {
        buffer: new Float32Array(positions),
      },
    })
  }
}
