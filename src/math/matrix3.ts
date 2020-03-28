import { mat3, mat4 } from "gl-matrix"

export namespace Matrix3 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(9) : mat3.create()
  }

  export function fromMat4(a: mat4, out?: mat3) {
    return mat3.fromMat4(out || create(), a)
  }
}