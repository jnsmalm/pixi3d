import { vec4, mat4 } from "gl-matrix"

export namespace Vector4 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(4) : vec4.create()
  }

  export function from({ x = 0, y = 0, z = 0, w = 0 }, out?: vec4) {
    return vec4.set(out || create(), x, y, z, w)
  }

  export function set(x: number, y: number, z: number, w: number, out?: vec4) {
    return vec4.set(out || create(), x, y, z, w)
  }

  export function transformMat4(a: vec4, m: mat4, out?: vec4) {
    return vec4.transformMat4(out || create(), a, m)
  }
}