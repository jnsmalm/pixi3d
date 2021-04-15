import { mat3 } from "gl-matrix"

export namespace Mat3 {
  export function multiply(a: Float32Array, b: Float32Array, out: Float32Array) {
    return <Float32Array>mat3.multiply(out, a, b)
  }
}