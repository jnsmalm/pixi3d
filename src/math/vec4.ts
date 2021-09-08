import { vec4 } from "gl-matrix"

export class Vec4 {
  static set(x: number, y: number, z: number, w: number, out = new Float32Array(4)) {
    return <Float32Array>vec4.set(out, x, y, z, w)
  }
  static transformMat4(a: Float32Array, m: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>vec4.transformMat4(out, a, m)
  }
  static fromValues(x: number, y: number, z: number, w: number) {
    return <Float32Array>vec4.fromValues(x, y, z, w)
  }
}