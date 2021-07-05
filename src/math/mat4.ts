import { mat4 } from "gl-matrix"

export class Mat4 {
  static getTranslation(mat: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>mat4.getTranslation(out, mat)
  }
  static create() {
    return <Float32Array>mat4.create()
  }
  static getScaling(mat: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>mat4.getScaling(out, mat)
  }
  static getRotation(mat: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>mat4.getRotation(out, mat)
  }
  static copy(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.copy(out, a)
  }
  static fromQuat(q: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromQuat(out, q)
  }
  static fromRotationTranslationScale(q: Float32Array, v: Float32Array, s: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromRotationTranslationScale(out, q, v, s)
  }
  static fromRotation(rad: number, axis: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromRotation(out, rad, axis)
  }
  static fromScaling(v: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromScaling(out, v)
  }
  static fromTranslation(v: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromTranslation(out, v)
  }
  static multiply(a: Float32Array, b: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.multiply(out, a, b)
  }
  static lookAt(eye: Float32Array, center: Float32Array, up: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.lookAt(out, eye, center, up)
  }
  static identity(out = new Float32Array(16)) {
    return <Float32Array>mat4.identity(out)
  }
  static perspective(fovy: number, aspect: number, near: number, far: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.perspective(out, fovy, aspect, near, far)
  }
  static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.ortho(out, left, right, bottom, top, near, far)
  }
  static invert(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.invert(out, a)
  }
  static transpose(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.transpose(out, a)
  }
  static targetTo(eye: Float32Array, target: Float32Array, up: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.targetTo(out, eye, target, up)
  }
  static rotateX(a: Float32Array, rad: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.rotateX(out, a, rad)
  }
  static rotateY(a: Float32Array, rad: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.rotateY(out, a, rad)
  }
  static rotateZ(a: Float32Array, rad: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.rotateZ(out, a, rad)
  }
  static rotate(a: Float32Array, rad: number, axis: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.rotate(out, a, rad, axis)
  }
}