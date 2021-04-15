import { vec3 } from "gl-matrix"

export namespace Vec3 {
  export function set(x: number, y: number, z: number, out = new Float32Array(3)) {
    return <Float32Array>vec3.set(out, x, y, z)
  }
  export function fromValues(x: number, y: number, z: number) {
    return <Float32Array>vec3.fromValues(x, y, z)
  }
  export function create() {
    return <Float32Array>vec3.create()
  }
  export function add(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.add(out, a, b)
  }
  export function transformQuat(a: Float32Array, q: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.transformQuat(out, a, q)
  }
  export function subtract(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.subtract(out, a, b)
  }
  export function scale(a: Float32Array, b: number, out = new Float32Array(3)) {
    return <Float32Array>vec3.scale(out, a, b)
  }
  export function dot(a: Float32Array, b: Float32Array) {
    return vec3.dot(a, b)
  }
  export function normalize(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.normalize(out, a)
  }
  export function cross(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.cross(out, a, b)
  }
  export function transformMat4(a: Float32Array, m: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.transformMat4(out, a, m)
  }
  export function copy(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.copy(out, a)
  }
  export function multiply(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.multiply(out, a, b)
  }
}