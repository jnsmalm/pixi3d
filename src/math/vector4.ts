import { vec4 } from "gl-matrix"

export namespace Vector4 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(4) : new Float32Array(4)
  }

  export function from({ x = 0, y = 0, z = 0, w = 0 }, out?: Float32Array): Float32Array {
    return vec4.set(out || create(), x, y, z, w)
  }

  export function set(x: number, y: number, z: number, w: number, out?: Float32Array): Float32Array {
    return vec4.set(out || create(), x, y, z, w)
  }

  export function transformMat4(a: Float32Array, m: Float32Array, out?: Float32Array): Float32Array {
    return vec4.transformMat4(out || create(), a, m)
  }
}