import { quat } from "gl-matrix"

export namespace Quaternion {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(4) : new Float32Array(4)
  }

  export function from({ x = 0, y = 0, z = 0, w = 0 }, out?: Float32Array): Float32Array {
    return quat.set(out || create(), x, y, z, w)
  }

  export function set(x: number, y: number, z: number, w: number, out?: Float32Array): Float32Array {
    return quat.set(out || create(), x, y, z, w)
  }

  Object.defineProperty(Quaternion, "identity", {
    get: () => {
      return quat.identity(create())
    }
  })

  export function fromMat3(a: Float32Array, out?: Float32Array): Float32Array {
    return quat.fromMat3(out || create(), a)
  }

  export function normalize(a: Float32Array, out?: Float32Array): Float32Array {
    return quat.normalize(out || create(), a)
  }

  export function fromEuler(x: number, y: number, z: number, out?: Float32Array): Float32Array {
    return quat.fromEuler(out || create(), x, y, z)
  }

  export function lerp(a: Float32Array, b: Float32Array, t: number, out?: Float32Array): Float32Array {
    return quat.lerp(out || create(), a, b, t)
  }

  export function slerp(a: Float32Array, b: Float32Array, t: number, out?: Float32Array): Float32Array {
    return quat.slerp(out || create(), a, b, t)
  }

  export function rotationTo(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return quat.rotationTo(out || create(), a, b)
  }

  export function add(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return quat.add(out || create(), a, b)
  }

  export function multiply(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return quat.multiply(out || create(), a, b)
  }

  export function getAngle(a: Float32Array, b: Float32Array): Float32Array {
    return quat.getAngle(a, b)
  }

  export function calculateW(a: Float32Array, out?: Float32Array): number {
    return quat.calculateW(out || create(), a)
  }

  export function rotateX(a: Float32Array, rad: number, out?: Float32Array): Float32Array {
    return quat.rotateX(out || create(), a, rad)
  }

  export function rotateY(a: Float32Array, rad: number, out?: Float32Array): Float32Array {
    return quat.rotateY(out || create(), a, rad)
  }

  export function rotateZ(a: Float32Array, rad: number, out?: Float32Array): Float32Array {
    return quat.rotateZ(out || create(), a, rad)
  }

  export function scale(a: Float32Array, b: number, out?: Float32Array): Float32Array {
    return quat.scale(out || create(), a, b)
  }



}