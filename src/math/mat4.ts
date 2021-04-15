import { mat4 } from "gl-matrix"

export namespace Mat4 {
  export function getTranslation(mat: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>mat4.getTranslation(out, mat)
  }
  export function create() {
    return <Float32Array>mat4.create()
  }
  export function getScaling(mat: Float32Array, out = new Float32Array(3)) {
    return <Float32Array>mat4.getScaling(out, mat)
  }
  export function getRotation(mat: Float32Array, out = new Float32Array(4)) {
    return <Float32Array>mat4.getRotation(out, mat)
  }
  export function copy(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.copy(out, a)
  }
  export function fromRotationTranslationScale(q: Float32Array, v: Float32Array, s: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromRotationTranslationScale(out, q, v, s)
  }
  export function multiply(a: Float32Array, b: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.multiply(out, a, b)
  }
  export function lookAt(eye: Float32Array, center: Float32Array, up: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.lookAt(out, eye, center, up)
  }
  export function identity(out = new Float32Array(16)) {
    return <Float32Array>mat4.identity(out)
  }
  export function perspective(fovy: number, aspect: number, near: number, far: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.perspective(out, fovy, aspect, near, far)
  }
  export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out = new Float32Array(16)) {
    return <Float32Array>mat4.ortho(out, left, right, bottom, top, near, far)
  }
  export function invert(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.invert(out, a)
  }
  export function transpose(a: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.transpose(out, a)
  }
  export function fromScaling(v: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromScaling(out, v)
  }
  export function fromTranslation(v: Float32Array, out = new Float32Array(16)) {
    return <Float32Array>mat4.fromTranslation(out, v)
  }
}