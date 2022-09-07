import { quat, } from "gl-matrix"
import { RAD_TO_DEG } from "@pixi/math"

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
  static toEuler(q: Float32Array, out = new Float32Array(3)) {
    const x = q[0], y = q[1], z = q[2], w = q[3];
    const t0 = 2 * (w * x + y * z)
    const t1 = 1 - 2 * (x * x + y * y)
    const rollX = Math.atan2(t0, t1) * RAD_TO_DEG;

    let t2 = Math.min(1, Math.max(-1, 2 * (w * y - z * x)))
    const pitchY = Math.asin(t2) * RAD_TO_DEG;

    const t3 = 2 * (w * z + x * y)
    const t4 = 1 - 2 * (y * y + z * z)
    const yawZ = Math.atan2(t3, t4) * RAD_TO_DEG;

    out[0] = rollX;
    out[1] = pitchY;
    out[2] = yawZ;
    return out;
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