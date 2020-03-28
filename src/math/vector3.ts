import { vec3, quat, mat3, mat4 } from "gl-matrix"

export namespace Vector3 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(3) : vec3.create()
  }

  export function from({ x = 0, y = 0, z = 0 }, out?: vec3) {
    return vec3.set(out || create(), x, y, z)
  }

  export function set(x: number, y: number, z: number, out?: vec3) {
    return vec3.set(out || create(), x, y, z)
  }

  export function copy(a: vec3, out?: vec3) {
    return vec3.copy(out || create(), a)
  }

  export function distance(a: vec3, b: vec3) {
    return vec3.distance(a, b)
  }

  export function squaredDistance(a: vec3, b: vec3) {
    return vec3.squaredDistance(a, b)
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

  export function normalize(a: vec3, out?: vec3) {
    return vec3.normalize(out || create(), a)
  }

  export function lerp(a: vec3, b: vec3, t: number, out?: vec3) {
    return vec3.lerp(out || create(), a, b, t)
  }

  export function add(a: vec3, b: vec3, out?: vec3) {
    return vec3.add(out || create(), a, b)
  }

  export function subtract(a: vec3, b: vec3, out?: vec3) {
    return vec3.sub(out || create(), a, b)
  }

  export function multiply(a: vec3, b: vec3, out?: vec3) {
    return vec3.mul(out || create(), a, b)
  }

  export function divide(a: vec3, b: vec3, out?: vec3) {
    return vec3.divide(out || create(), a, b)
  }

  export function dot(a: vec3, b: vec3) {
    return vec3.dot(a, b)
  }

  export function length(a: vec3) {
    return vec3.length(a)
  }

  export function squaredLength(a: vec3) {
    return vec3.squaredLength(a)
  }

  export function inverse(a: vec3, out?: vec3) {
    return vec3.inverse(out || create(), a)
  }

  export function cross(a: vec3, b: vec3, out?: vec3) {
    return vec3.cross(out || create(), a, b)
  }

  export function negate(a: vec3, out?: vec3): vec3 {
    return vec3.negate(out || create(), a)
  }

  export function transformQuat(a: vec3, q: quat, out?: vec3) {
    return vec3.transformQuat(out || create(), a, q)
  }

  export function transformMat3(a: vec3, m: mat3, out?: vec3) {
    return vec3.transformMat3(out || create(), a, m)
  }

  export function transformMat4(a: vec3, m: mat4, out?: vec3) {
    return vec3.transformMat4(out || create(), a, m)
  }

  export function scale(a: vec3, b: number, out?: vec3) {
    return vec3.scale(out || create(), a, b)
  }
}