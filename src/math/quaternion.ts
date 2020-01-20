import { quat } from "gl-matrix"

export namespace Quaternion {
  export let pool: { create: () => Float32Array } | undefined

  export function create() {
    return pool ? pool.create() : new Float32Array(4)
  }

  export function from({ x = 0, y = 0, z = 0, w = 0 }, out?: Float32Array): Float32Array {
    return quat.set(out || create(), x, y, z, w)
  }

  Object.defineProperty(Quaternion, "identity", {
    get: () => {
      return quat.identity(create())
    }
  })

  export function fromMat3(a: Float32Array, out?: Float32Array): Float32Array {
    return quat.fromMat3(out || create(), a)
  }

  export function normalize(a: Float32Array, out?: Float32Array): Float32Array {
    return quat.normalize(out || create(), a)
  }

  export function fromEuler(x: number, y: number, z: number, out?: Float32Array): Float32Array {
    return quat.fromEuler(out || create(), x, y, z)
  }
}