import { Vec3 } from "../../math/vec3"
import { MeshGeometry3D } from "./mesh-geometry"

export interface CylinderGeometryOptions {
  /** The radius of the top of the cylinder. Default is 1. */
  radiusTop?: number
  /** The radius of the bottom of the cylinder. Default is 1. */
  radiusBottom?: number
  /** The height of the cylinder. Default is 1. */
  height?: number
  /** The number of segmented faces around the circumference of the cylinder. Default is 32. */
  radialSegments?: number
  /** The number of rows of faces along the height of the cylinder. Default is 1. */
  heightSegments?: number
  /** A boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped. */
  openEnded?: boolean
  /** Start angle for first segment, default = 0 (three o'clock position). */
  thetaStart?: number
  /** The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder. */
  thetaLength?: number
}

export class CylinderGeometry {
  static create(options: CylinderGeometryOptions = {}) {
    // Based on https://github.com/mrdoob/three.js/blob/master/src/geometries/CylinderGeometry.js

    const radiusTop = options?.radiusTop ?? 1
    const radiusBottom = options?.radiusBottom ?? 1
    const height = options?.height ?? 1
    const radialSegments = Math.floor(options?.radialSegments ?? 32)
    const heightSegments = Math.floor(options?.heightSegments ?? 1)
    const openEnded = options?.openEnded ?? false
    const thetaStart = options?.thetaStart ?? 0
    const thetaLength = options?.thetaLength ?? Math.PI * 2

    const indices: number[] = []
    const positions: number[] = []
    const uvs: number[] = []
    const normals: number[] = []

    let index = 0
    const indexArray: number[][] = []
    const halfHeight = height / 2

    const generateTorso = (): void => {
      const slope = (radiusBottom - radiusTop) / height
      for (let y = 0; y <= heightSegments; y += 1) {
        const indexRow = []
        const v = y / heightSegments
        const radius = v * (radiusBottom - radiusTop) + radiusTop
        for (let x = 0; x <= radialSegments; x += 1) {
          const u = x / radialSegments
          const theta = u * thetaLength + thetaStart
          const sinTheta = Math.sin(theta)
          const cosTheta = Math.cos(theta)

          const vertexX = radius * sinTheta
          const vertexY = -v * height + halfHeight
          const vertexZ = radius * cosTheta
          positions.push(vertexX, vertexY, vertexZ)

          const normalX = sinTheta
          const normalY = slope
          const normalZ = cosTheta
          const normal = Vec3.normalize(
            Vec3.fromValues(normalX, normalY, normalZ)
          )
          normals.push(normal[0], normal[1], normal[2])

          uvs.push(u, 1 - v)

          indexRow.push(index)
          index += 1
        }

        indexArray.push(indexRow)
      }

      for (let x = 0; x < radialSegments; x += 1) {
        for (let y = 0; y < heightSegments; y += 1) {
          const a = indexArray[y][x]
          const b = indexArray[y + 1][x]
          const c = indexArray[y + 1][x + 1]
          const d = indexArray[y][x + 1]
          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }
    }

    const generateCap = (top: boolean): void => {
      const centerIndexStart = index
      
      const radius = top === true ? radiusTop : radiusBottom
      const sign = top === true ? 1 : -1

      for (let x = 1; x <= radialSegments; x += 1) {
        positions.push(0, halfHeight * sign, 0)

        normals.push(0, sign, 0)

        uvs.push(0.5, 0.5)

        index += 1
      }

      const centerIndexEnd = index

      for (let x = 0; x <= radialSegments; x += 1) {
        const u = x / radialSegments
        const theta = u * thetaLength + thetaStart
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        const vertexX = radius * sinTheta
        const vertexY = halfHeight * sign
        const vertexZ = radius * cosTheta
        positions.push(vertexX, vertexY, vertexZ)

        normals.push(0, sign, 0)

        const uvX = cosTheta * 0.5 + 0.5
        const uvY = sinTheta * 0.5 * sign + 0.5
        uvs.push(uvX, uvY)

        index += 1
      }

      for (let x = 0; x < radialSegments; x += 1) {
        const c = centerIndexStart + x
        const i = centerIndexEnd + x
        if (top === true) {
          indices.push(i, i + 1, c)
        } else {
          indices.push(i + 1, i, c)
        }
      }
    }

    generateTorso()
    
    if (openEnded === false) {
      if (radiusTop > 0) generateCap(true)
      if (radiusBottom > 0) generateCap(false)
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
