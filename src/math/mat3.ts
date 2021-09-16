import { mat3 } from "gl-matrix"

export class Mat3 {
  static multiply(a: Float32Array, b: Float32Array, out = new Float32Array(9)) {
    return <Float32Array>mat3.multiply(out, a, b)
  }
}