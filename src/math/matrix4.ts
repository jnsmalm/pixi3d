import { mat4 } from "gl-matrix"

export namespace Matrix4 {
  export let pool: { create: () => Float32Array } | undefined

  export function create() {
    return pool ? pool.create() : new Float32Array(16)
  }

  Object.defineProperty(Matrix4, "identity", {
    get: () => {
      return mat4.identity(create())
    }
  })

  export function targetTo(eye: Float32Array, target: Float32Array, up: Float32Array, out?: Float32Array): Float32Array {
    return mat4.targetTo(out || create(), eye, target, up)
  }
}