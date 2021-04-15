import { quat } from "gl-matrix"

export namespace Quat {
  export function set(x: number, y: number, z: number, w: number, out = new Float32Array(4)) {
    return <Float32Array>quat.set(out, x, y, z, w)
  }
  export function fromValues(x: number, y: number, z: number, w: number) {
    return <Float32Array>quat.fromValues(x, y, z, w)
  }
  export function create() {
    return <Float32Array>quat.create()
  }
  export function normalize(a: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>quat.normalize(out, a)
  }
  export function slerp(a: Float32Array, b: Float32Array, t: number, out = new Float32Array(4)) {
    return <Float32Array>quat.slerp(out, a, b, t)
  }
  export function fromEuler(x: number, y: number, z: number, out = new Float32Array(4)) {
    return <Float32Array>quat.fromEuler(out, x, y, z)
  }
  export function conjugate(a: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>quat.conjugate(out, a)
  }
  export function rotateX(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateX(out, a, rad)
  }
  export function rotateY(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateY(out, a, rad)
  }
  export function rotateZ(a: Float32Array, rad: number, out = new Float32Array(4)) {
    return <Float32Array>quat.rotateZ(out, a, rad)
  }
}