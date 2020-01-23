import { vec2 } from "gl-matrix"

export namespace Vector2 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(2) : new Float32Array(2)
  }

  export function from({ x = 0, y = 0 }, out?: Float32Array): Float32Array {
    return vec2.set(out || create(), x, y)
  }
}