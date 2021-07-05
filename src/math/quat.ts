import { quat } from "gl-matrix"

export class Quat {
  static set(x: number, y: number, z: number, w: number, out = new Float32Array(4)) {
    return <Float32Array>quat.set(out, x, y, z, w)
  }
  static fromValues(x: number, y: number, z: number, w: number) {
    return <Float32Array>quat.fromValues(x, y, z, w)
  }
  static create() {
    return <Float32Array>quat.create()
  }
  static normalize(a: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>quat.normalize(out, a)
  }
  static slerp(a: Float32Array, b: Float32Array, t: number, out = new Float32Array(4)) {
    return <Float32Array>quat.slerp(out, a, b, t)
  }
  static fromEuler(x: number, y: number, z: number, out = new Float32Array(4)) {
    return <Float32Array>quat.fromEuler(out, x, y, z)
  }
  static conjugate(a: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>quat.conjugate(out, a)
  }
  static rotateX(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateX(out, a, rad)
  }
  static rotateY(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateY(out, a, rad)
  }
  static rotateZ(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateZ(out, a, rad)
  }
}