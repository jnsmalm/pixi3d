import { mat3 } from "gl-matrix"

export class Mat3 {
  static multiply(a: Float32Array, b: Float32Array, out: Float32Array) {
    return <Float32Array>mat3.multiply(out, a, b)
  }
}