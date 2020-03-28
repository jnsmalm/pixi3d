import { vec3, mat4, quat } from "gl-matrix"

export namespace Matrix4 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(16) : mat4.create()
  }

  Object.defineProperty(Matrix4, "identity", {
    get: () => {
      return mat4.identity(create())
    }
  })

  export function targetTo(eye: vec3, target: mat4, up: vec3, out?: mat4) {
    return mat4.targetTo(out || create(), eye, target, up)
  }

  export function invert(a: mat4, out?: mat4) {
    return mat4.invert(out || create(), a)
  }

  export function transpose(a: mat4, out?: mat4) {
    return mat4.transpose(out || create(), a)
  }

  export function fromRotationTranslationScale(q: mat4, v: vec3, s: vec3, out?: mat4) {
    return mat4.fromRotationTranslationScale(out || create(), q, v, s)
  }

  export function multiply(a: mat4, b: mat4, out?: mat4) {
    return mat4.multiply(out || create(), a, b)
  }

  export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: mat4) {
    return mat4.ortho(out || create(), left, right, bottom, top, near, far)
  }

  export function perspective(fovy: number, aspect: number, near: number, far: number, out?: mat4) {
    return mat4.perspective(out || create(), fovy, aspect, near, far)
  }

  export function lookAt(eye: vec3, center: vec3, up: vec3, out?: mat4) {
    return mat4.lookAt(out || create(), eye, center, up)
  }

  export function getTranslation(mat: mat4, out?: vec3) {
    return mat4.getTranslation(out || (pool ? pool.create(3) : vec3.create()), mat)
  }

  export function getRotation(mat: mat4, out?: quat) {
    return mat4.getRotation(out || (pool ? pool.create(4) : quat.create()), mat)
  }

  export function getScaling(mat: mat4, out?: vec3) {
    return mat4.getScaling(out || (pool ? pool.create(3) : vec3.create()), mat)
  }

  export function copy(mat: mat4, out?: mat4) {
    return mat4.copy(out || create(), mat)
  }

  export function add(a: mat4, b: mat4, out?: mat4) {
    return mat4.add(out || create(), a, b)
  }

  export function subtract(a: mat4, b: mat4, out?: mat4) {
    return mat4.subtract(out || create(), a, b)
  }

  export function adjoint(a: mat4, out?: mat4) {
    return mat4.adjoint(out || create(), a)
  }

  export function determinant(a: mat4) {
    return mat4.determinant(a)
  }

  export function fromQuat(q: quat, out?: mat4) {
    return mat4.fromQuat(out || create(), q)
  }

  export function translate(m: mat4, v: vec3, out?: mat4) {
    return mat4.translate(out || create(), m, v)
  }

  export function scale(m: mat4, v: vec3, out?: mat4) {
    return mat4.scale(out || create(), m, v)
  }

  export function rotate(a: mat4, rad: number, axis: vec3, out?: mat4) {
    return mat4.rotate(out || create(), a, rad, axis)
  }
}