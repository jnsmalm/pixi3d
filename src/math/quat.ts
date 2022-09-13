import { quat, } from "gl-matrix"
import { RAD_TO_DEG } from "@pixi/math"
const HALF_PI = Math.PI * 0.5;

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
    const sqx = Math.pow(x, 2);
    const sqy = Math.pow(y, 2);
    const sqz = Math.pow(z, 2);
    const sqw = Math.pow(w, 2);
    const magnitude = sqx + sqy + sqz + sqw;
    const test = x * y + z * w;
    if (test > 0.499 * magnitude) { // singularity at north pole
      out[0] = 0;
      out[1] = 2 * Math.atan2(x, w) * RAD_TO_DEG;
      out[2] = HALF_PI * RAD_TO_DEG;
      return out;
    }
    if (test < -0.499 * magnitude) { // singularity at south pole
      out[0] = 0;
      out[1] = -2 * Math.atan2(x, w) * RAD_TO_DEG;
      out[2] = -HALF_PI * RAD_TO_DEG;
      return out;
    }
    const bank = Math.atan2(2 * x * w - 2 * y * z, -sqx + sqy - sqz + sqw);
    const heading = Math.atan2(2 * y * w - 2 * x * z, sqx - sqy - sqz + sqw);
    const attitude = Math.asin(2 * test / magnitude);
    out[0] = bank * RAD_TO_DEG;
    out[1] = heading * RAD_TO_DEG;
    out[2] = attitude * RAD_TO_DEG;

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
  static rotationTo(from: Float32Array, to: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>quat.rotationTo(out, from, to);
  }
}