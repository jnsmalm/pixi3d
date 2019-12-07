import { vec3, vec4, mat4 } from "gl-matrix"
import { ObservablePoint3D } from "./point"
import { ObservableQuaternion } from "./quaternion"

export namespace Matrix {
  const matrix = mat4.create()

  export function transposeInverse(input: any, output: any) {
    return mat4.transpose(output, mat4.invert(matrix, input))
  }

  export function invert(input: any, output: any) {
    return mat4.invert(output, input)
  }
}

export class UpdatableFloat32Array {
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

  private _position?: UpdatableFloat32Array
  private _scale?: UpdatableFloat32Array
  private _rotation?: UpdatableFloat32Array
  private _up?: UpdatableFloat32Array
  private _forward?: UpdatableFloat32Array
  private _direction?: UpdatableFloat32Array

  get position() {
    if (!this._position) {
      this._position = new UpdatableFloat32Array(this, 3, data => {
        mat4.getTranslation(data, this.array)
      })
    }
    return this._position.data
  }

  get scale() {
    if (!this._scale) {
      this._scale = new UpdatableFloat32Array(this, 3, data => {
        mat4.getScaling(data, this.array)
      })
    }
    return this._scale.data
  }

  get rotation() {
    if (!this._rotation) {
      this._rotation = new UpdatableFloat32Array(this, 4, data => {
        mat4.getRotation(data, this.array)
      })
    }
    return this._rotation.data
  }

  get up() {
    if (!this._up) {
      this._up = new UpdatableFloat32Array(this, 3, data => {
        vec3.set(data, this.array[4], this.array[5], this.array[6])
      })
    }
    return this._up.data
  }

  get forward() {
    if (!this._forward) {
      this._forward = new UpdatableFloat32Array(this, 3, data => {
        vec3.set(data, this.array[8], this.array[9], this.array[10])
      })
    }
    return this._forward.data
  }

  get direction() {
    if (!this._direction) {
      this._direction = new UpdatableFloat32Array(this, 3, data => {
        vec3.add(data, this.position, this.forward)
      })
    }
    return this._direction.data
  }

  setFromMatrix(matrix: TransformMatrix | ArrayLike<number>) {
    if (matrix instanceof TransformMatrix) {
      matrix = matrix.array
    }
    mat4.copy(this.array, matrix); this.id++
  }

  setFromRotationPositionScale(rotation: ObservableQuaternion, position: ObservablePoint3D, scale: ObservablePoint3D) {
    vec4.set(this.rotation, rotation.x, rotation.y, rotation.z, rotation.w)
    vec3.set(this.scale, scale.x, scale.y, scale.z)
    vec3.set(this.position, position.x, position.y, position.z)
    mat4.fromRotationTranslationScale(this.array, this.rotation, this.position, this.scale); this.id++
  }

  setFromMultiplication(a: TransformMatrix, b: TransformMatrix) {
    mat4.multiply(this.array, a.array, b.array); this.id++
  }
}