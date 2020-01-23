import { mat3 } from "gl-matrix"

export namespace Matrix3 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(9) : new Float32Array(9)
  }

  export function fromMat4(a: Float32Array, out?: Float32Array): Float32Array {
    return mat3.fromMat4(out || create(), a)
  }
}