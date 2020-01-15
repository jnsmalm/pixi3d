import { vec3 } from "gl-matrix"

export namespace Vector3 {
  export let pool: { create: () => Float32Array } | undefined

  export function create() {
    return pool ? pool.create() : new Float32Array(3)
  }

  export function from({ x = 0, y = 0, z = 0 }, out?: Float32Array): Float32Array {
    return vec3.set(out || create(), x, y, z)
  }

  Object.defineProperty(Vector3, "zero", {
    get: () => {
      return vec3.set(create(), 0, 0, 0)
    }
  })

  Object.defineProperty(Vector3, "up", {
    get: () => {
      return vec3.set(create(), 0, 1, 0)
    }
  })

  Object.defineProperty(Vector3, "right", {
    get: () => {
      return vec3.set(create(), 1, 0, 0)
    }
  })

  export function normalize(a: Float32Array, out?: Float32Array): Float32Array {
    return vec3.normalize(out || create(), a)
  }

  export function lerp(a: Float32Array, b: Float32Array, t: number, out?: Float32Array): Float32Array {
    return vec3.lerp(out || create(), a, b, t)
  }

  export function add(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return vec3.add(out || create(), a, b)
  }

  export function subtract(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return vec3.sub(out || create(), a, b)
  }

  export function cross(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return vec3.cross(out || create(), a, b)
  }
}