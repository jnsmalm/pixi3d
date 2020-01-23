import { ObservablePoint3D } from "./point"
import { ObservableQuaternion } from "./quaternion"
import { Matrix4 } from "./math/matrix4"
import { Vector3 } from "./math/vector3"
import { Vector4 } from "./math/vector4"

export class ObservingFloat32Array {
  private _array: Float32Array

  // Initialize with random value to make sure it gets updated at least once.
  id = Math.random()

  constructor(private parent: { id: number }, length: number, private update: (data: Float32Array) => void) {
    this._array = new Float32Array(length)
  }

  get data() {
    if (this.id !== this.parent.id) {
      this.update(this._array); this.id = this.parent.id
    }
    return this._array
  }
}

export class TransformMatrix {
  array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  id = 0

  private _position?: ObservingFloat32Array
  private _scale?: ObservingFloat32Array
  private _rotation?: ObservingFloat32Array
  private _up?: ObservingFloat32Array
  private _forward?: ObservingFloat32Array
  private _direction?: ObservingFloat32Array

  get position() {
    if (!this._position) {
      this._position = new ObservingFloat32Array(this, 3, data => {
        Matrix4.getTranslation(this.array, data)
      })
    }
    return this._position.data
  }

  get scale() {
    if (!this._scale) {
      this._scale = new ObservingFloat32Array(this, 3, data => {
        Matrix4.getScaling(this.array, data)
      })
    }
    return this._scale.data
  }

  get rotation() {
    if (!this._rotation) {
      this._rotation = new ObservingFloat32Array(this, 4, data => {
        Matrix4.getRotation(this.array, data)
      })
    }
    return this._rotation.data
  }

  get up() {
    if (!this._up) {
      this._up = new ObservingFloat32Array(this, 3, data => {
        Vector3.set(this.array[4], this.array[5], this.array[6], data)
      })
    }
    return this._up.data
  }

  get forward() {
    if (!this._forward) {
      this._forward = new ObservingFloat32Array(this, 3, data => {
        Vector3.set(this.array[8], this.array[9], this.array[10], data)
      })
    }
    return this._forward.data
  }

  get direction() {
    if (!this._direction) {
      this._direction = new ObservingFloat32Array(this, 3, data => {
        Vector3.add(this.position, this.forward, data)
      })
    }
    return this._direction.data
  }

  setFromMatrix(matrix: TransformMatrix | ArrayLike<number>) {
    if (matrix instanceof TransformMatrix) {
      matrix = matrix.array
    }
    Matrix4.copy(matrix, this.array); this.id++
  }

  setFromRotationPositionScale(rotation: ObservableQuaternion, position: ObservablePoint3D, scale: ObservablePoint3D) {
    Vector4.set(rotation.x, rotation.y, rotation.z, rotation.w, this.rotation)
    Vector3.set(scale.x, scale.y, scale.z, this.scale)
    Vector3.set(position.x, position.y, position.z, this.position)
    Matrix4.fromRotationTranslationScale(this.rotation, this.position, this.scale, this.array); this.id++
  }

  setFromMultiplication(a: TransformMatrix, b: TransformMatrix) {
    Matrix4.multiply(a.array, b.array, this.array); this.id++
  }
}