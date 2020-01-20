import { vec3 } from "gl-matrix"

export namespace Vector3 {
  export let pool: { create: () => Float32Array } | undefined

  export function create() {
    return pool ? pool.create() : new Float32Array(3)
  }

  export function from({ x = 0, y = 0, z = 0 }, out?: Float32Array): Float32Array {
    return vec3.set(out || create(), x, y, z)
  }

  export function copy(a: Float32Array, out?: Float32Array): Float32Array {
    return vec3.copy(out || create(), a)
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

  Object.defineProperty(Vector3, "down", {
    get: () => {
      return vec3.set(create(), 0, -1, 0)
    }
  })

  Object.defineProperty(Vector3, "left", {
    get: () => {
      return vec3.set(create(), -1, 0, 0)
    }
  })

  Object.defineProperty(Vector3, "right", {
    get: () => {
      return vec3.set(create(), 1, 0, 0)
    }
  })

  Object.defineProperty(Vector3, "forward", {
    get: () => {
      return vec3.set(create(), 0, 0, 1)
    }
  })

  Object.defineProperty(Vector3, "back", {
    get: () => {
      return vec3.set(create(), 0, 0, -1)
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

  export function multiply(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return vec3.mul(out || create(), a, b)
  }

  export function dot(a: Float32Array, b: Float32Array): number {
    return vec3.dot(a, b)
  }

  export function length(a: Float32Array): number {
    return vec3.length(a)
  }

  export function cross(a: Float32Array, b: Float32Array, out?: Float32Array): Float32Array {
    return vec3.cross(out || create(), a, b)
  }

  export function negate(a: Float32Array, out?: Float32Array): Float32Array {
    return vec3.negate(out || create(), a)
  }

  export function transformQuat(a: Float32Array, q: Float32Array, out?: Float32Array): Float32Array {
    return vec3.transformQuat(out || create(), a, q)
  }

  export function transformMat3(a: Float32Array, m: Float32Array, out?: Float32Array): Float32Array {
    return vec3.transformMat3(out || create(), a, m)
  }

  export function transformMat4(a: Float32Array, m: Float32Array, out?: Float32Array): Float32Array {
    return vec3.transformMat4(out || create(), a, m)
  }

  export function scale(a: Float32Array, b: number, out?: Float32Array): Float32Array {
    return vec3.scale(out || create(), a, b)
  }
}