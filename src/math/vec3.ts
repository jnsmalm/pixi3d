import { vec3 } from "gl-matrix"

export class Vec3 {
  static set(x: number, y: number, z: number, out = new Float32Array(3)) {
    return <Float32Array>vec3.set(out, x, y, z)
  }
  static fromValues(x: number, y: number, z: number) {
    return <Float32Array>vec3.fromValues(x, y, z)
  }
  static create() {
    return <Float32Array>vec3.create()
  }
  static add(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.add(out, a, b)
  }
  static transformQuat(a: Float32Array, q: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.transformQuat(out, a, q)
  }
  static subtract(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.subtract(out, a, b)
  }
  static scale(a: Float32Array, b: number, out = new Float32Array(3)) {
    return <Float32Array>vec3.scale(out, a, b)
  }
  static dot(a: Float32Array, b: Float32Array) {
    return vec3.dot(a, b)
  }
  static normalize(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.normalize(out, a)
  }
  static cross(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.cross(out, a, b)
  }
  static transformMat4(a: Float32Array, m: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.transformMat4(out, a, m)
  }
  static copy(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.copy(out, a)
  }
  static magnitude(a: Float32Array) {
    return vec3.length(a)
  }
  static squaredMagnitude(a: Float32Array) {
    return vec3.squaredLength(a)
  }
  static inverse(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.inverse(out, a)
  }
  static negate(a: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.negate(out, a)
  }
  static multiply(a: Float32Array, b: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>vec3.multiply(out, a, b)
  }
  static distance(a: Float32Array, b: Float32Array) {
    return vec3.distance(a, b)
  }
  static squaredDistance(a: Float32Array, b: Float32Array) {
    return vec3.squaredDistance(a, b)
  }
  static lerp(a: Float32Array, b: Float32Array, t: number, out = new Float32Array(3)) {
    return vec3.lerp(out, a, b, t)
  }
}