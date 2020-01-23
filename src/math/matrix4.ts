import { mat4 } from "gl-matrix"

export namespace Matrix4 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(16) : new Float32Array(16)
  }

  Object.defineProperty(Matrix4, "identity", {
    get: () => {
      return mat4.identity(create())
    }
  })

  export function targetTo(eye: Float32Array, target: Float32Array, up: Float32Array, out?: Float32Array): Float32Array {
    return mat4.targetTo(out || create(), eye, target, up)
  }

  export function invert(a: Float32Array, out?: Float32Array) {
    return mat4.invert(out || create(), a)
  }

  export function transpose(a: Float32Array, out?: Float32Array) {
    return mat4.transpose(out || create(), a)
  }

  export function fromRotationTranslationScale(q: Float32Array, v: Float32Array, s: Float32Array, out?: Float32Array) {
    return mat4.fromRotationTranslationScale(out || create(), q, v, s)
  }

  export function multiply(a: Float32Array, b: Float32Array, out?: Float32Array) {
    return mat4.multiply(out || create(), a, b)
  }

  export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: Float32Array) {
    return mat4.ortho(out || create(), left, right, bottom, top, near, far)
  }

  export function perspective(fovy: number, aspect: number, near: number, far: number, out?: Float32Array) {
    return mat4.perspective(out || create(), fovy, aspect, near, far)
  }

  export function lookAt(eye: Float32Array, center: Float32Array, up: Float32Array, out?: Float32Array) {
    return mat4.lookAt(out || create(), eye, center, up)
  }

  export function getTranslation(mat: Float32Array, out?: Float32Array) {
    return mat4.getTranslation(out || (pool ? pool.create(3) : new Float32Array(3)), mat)
  }

  export function getRotation(mat: Float32Array, out?: Float32Array) {
    return mat4.getRotation(out || (pool ? pool.create(4) : new Float32Array(4)), mat)
  }

  export function getScaling(mat: Float32Array, out?: Float32Array) {
    return mat4.getScaling(out || (pool ? pool.create(3) : new Float32Array(3)), mat)
  }

  export function copy(mat: ArrayLike<number>, out?: Float32Array): Float32Array {
    return mat4.copy(out || create(), mat)
  }

  export function add(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return mat4.add(out || create(), a, b)
  }

  export function subtract(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return mat4.subtract(out || create(), a, b)
  }

  export function adjoint(a: Float32Array, out?: Float32Array): Float32Array {
    return mat4.adjoint(out || create(), a)
  }

  export function determinant(a: Float32Array): number {
    return mat4.determinant(a)
  }

  export function fromQuat(q: Float32Array, out?: Float32Array): Float32Array {
    return mat4.fromQuat(out || create(), q)
  }

  export function translate(m: Float32Array, v: Float32Array, out?: Float32Array): Float32Array {
    return mat4.translate(out || create(), m, v)
  }

  export function scale(m: Float32Array, v: Float32Array, out?: Float32Array): Float32Array {
    return mat4.scale(out || create(), m, v)
  }

  export function rotate(a: Float32Array, rad: number, axis: Float32Array, out?: Float32Array): Float32Array {
    return mat4.rotate(out || create(), a, rad, axis)
  }
}