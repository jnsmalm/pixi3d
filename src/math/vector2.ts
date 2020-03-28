import { vec2 } from "gl-matrix"

export namespace Vector2 {
  export let pool: { create: (size: number) => Float32Array } | undefined

  export function create() {
    return pool ? pool.create(2) : vec2.create()
  }

  export function from({ x = 0, y = 0 }, out?: vec2) {
    return vec2.set(out || create(), x, y)
  }
}