import { Matrix3 } from "./matrix3"
import { Matrix4 } from "./matrix4"
import { Quaternion } from "./quaternion"
import { Vector2 } from "./vector2"
import { Vector3 } from "./vector3"

class Float32ArrayPool {
  items: Float32Array[] = []
  index = 0

  constructor(public size: number) { }

  create() {
    if (this.index >= this.items.length) {
      this.items.push(new Float32Array(this.size))
    }
    return this.items[this.index++]
  }

  reset() {
    this.index = 0; return this
  }
}

export namespace MatrixPool {
  let _enabled = false

  let _pools = [
    { object: Matrix3, pool: new Float32ArrayPool(9) },
    { object: Matrix4, pool: new Float32ArrayPool(16) },
    { object: Quaternion, pool: new Float32ArrayPool(4) },
    { object: Vector2, pool: new Float32ArrayPool(2) },
    { object: Vector3, pool: new Float32ArrayPool(3) },
  ]

  function pooling(enable: boolean) {
    _pools.forEach((value) => {
      value.object.pool = enable ? value.pool.reset() : undefined
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