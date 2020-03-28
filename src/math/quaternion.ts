import { quat, mat3 } from "gl-matrix"

export namespace Quaternion {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(4) : quat.create()
  }

  export function from({ x = 0, y = 0, z = 0, w = 0 }, out?: quat) {
    return quat.set(out || create(), x, y, z, w)
  }

  export function set(x: number, y: number, z: number, w: number, out?: quat) {
    return quat.set(out || create(), x, y, z, w)
  }

  Object.defineProperty(Quaternion, "identity", {
    get: () => {
      return quat.identity(create())
    }
  })

  export function fromMat3(m: mat3, out?: quat) {
    return quat.fromMat3(out || create(), m)
  }

  export function normalize(a: quat, out?: quat) {
    return quat.normalize(out || create(), a)
  }

  export function fromEuler(x: number, y: number, z: number, out?: quat) {
    return quat.fromEuler(out || create(), x, y, z)
  }

  export function lerp(a: quat, b: quat, t: number, out?: quat) {
    return quat.lerp(out || create(), a, b, t)
  }

  export function slerp(a: quat, b: quat, t: number, out?: quat) {
    return quat.slerp(out || create(), a, b, t)
  }

  export function rotationTo(a: quat, b: quat, out?: quat) {
    return quat.rotationTo(out || create(), a, b)
  }

  export function add(a: quat, b: quat, out?: quat) {
    return quat.add(out || create(), a, b)
  }

  export function multiply(a: quat, b: quat, out?: quat) {
    return quat.multiply(out || create(), a, b)
  }

  export function getAngle(a: quat, b: quat) {
    return quat.getAngle(a, b)
  }

  export function calculateW(a: quat, out?: quat) {
    return quat.calculateW(out || create(), a)
  }

  export function rotateX(a: quat, rad: number, out?: quat) {
    return quat.rotateX(out || create(), a, rad)
  }

  export function rotateY(a: quat, rad: number, out?: quat) {
    return quat.rotateY(out || create(), a, rad)
  }

  export function rotateZ(a: quat, rad: number, out?: quat) {
    return quat.rotateZ(out || create(), a, rad)
  }

  export function scale(a: quat, b: number, out?: quat) {
    return quat.scale(out || create(), a, b)
  }



}