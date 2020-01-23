import { Matrix3 } from "./matrix3"
import { Matrix4 } from "./matrix4"
import { Quaternion } from "./quaternion"
import { Vector2 } from "./vector2"
import { Vector3 } from "./vector3"

class Float32ArrayPool {
  sizes: { index: number, items: Float32Array[] }[] = []

  create(size: number) {
    let pool = this.sizes[size]
    if (!pool) {
      pool = this.sizes[size] = { index: 0, items: [] }
    }
    if (pool.index >= pool.items.length) {
      pool.items.push(new Float32Array(size))
    }
    return pool.items[pool.index++]
  }

  reset() {
    this.sizes.forEach((value) => { value.index = 0 })
  }
}

const pool = new Float32ArrayPool()

export namespace MatrixPool {
  let _enabled = false

  let _objects = [
    Matrix3, Matrix4, Quaternion, Vector2, Vector3,
  ]

  function pooling(enable: boolean) {
    pool.reset()
    _objects.forEach((value) => {
      value.pool = enable ? pool : undefined
    })
    _enabled = enable
  }

  export function scope(math: () => void) {
    if (_enabled) {
      math(); return
    }
    pooling(true); math(); pooling(false);
  }
}