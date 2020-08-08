import * as PIXI from "pixi.js"

import { ObservablePoint3D } from "./observable-point"
import { ObservableQuaternion } from "./observable-quaternion"
import { Mat4 } from "../math/mat4"
import { Vec3 } from "../math/vec3"
import { Vec4 } from "../math/vec4"
import { MatrixComponent } from "./matrix-component"

/**
 * Represents the matrix for a transform.
 */
export class TransformMatrix extends PIXI.Matrix {
  private _id = 0
  private _position?: MatrixComponent
  private _scaling?: MatrixComponent
  private _rotation?: MatrixComponent
  private _up?: MatrixComponent
  private _forward?: MatrixComponent
  private _array: Float32Array

  /**
   * Creates a new transform matrix using the specified matrix array.
   * @param array The matrix array, expected length is 16. If empty, an identity 
   * matrix is used as default.
   */
  constructor(array?: ArrayLike<number>) {
    super()
    if (array) {
      this._array = new Float32Array(array)
    } else {
      this._array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
  }

  toArray(transpose?: boolean, out?: Float32Array) {
    let _array = out
    if (!out) {
      _array = this._array
    }
    return <number[]><unknown>_array
  }

  /** Returns the current version id. */
  get id() {
    return this._id
  }

  /** Returns the position component of the matrix. */
  get position() {
    if (!this._position) {
      this._position = new MatrixComponent(this, 3, data => {
        Mat4.getTranslation(this._array, data)
      })
    }
    return this._position.array
  }

  /** Returns the scaling component of the matrix. */
  get scaling() {
    if (!this._scaling) {
      this._scaling = new MatrixComponent(this, 3, data => {
        Mat4.getScaling(this._array, data)
      })
    }
    return this._scaling.array
  }

  /** Returns the rotation quaternion of the matrix. */
  get rotation() {
    if (!this._rotation) {
      this._rotation = new MatrixComponent(this, 4, data => {
        Mat4.getRotation(this._array, data)
      })
    }
    return this._rotation.array
  }

  /** Returns the up vector of the matrix. */
  get up() {
    if (!this._up) {
      this._up = new MatrixComponent(this, 3, data => {
        Vec3.normalize(Vec3.set(this._array[4], this._array[5], this._array[6], data), data)
      })
    }
    return this._up.array
  }

  /** Returns the forward vector of the matrix. */
  get forward() {
    if (!this._forward) {
      this._forward = new MatrixComponent(this, 3, data => {
        Vec3.normalize(Vec3.set(this._array[8], this._array[9], this._array[10], data), data)
      })
    }
    return this._forward.array
  }

  copyFrom(matrix: TransformMatrix) {
    if (matrix instanceof TransformMatrix) {
      Mat4.copy(matrix._array, this._array); this._id++
    }
    return this
  }

  /**
   * Sets the rotation, position and scale components. 
   * @param rotation The rotation to set.
   * @param position The position to set.
   * @param scaling The scale to set.
   */
  setFromRotationPositionScale(rotation: ObservableQuaternion, position: ObservablePoint3D, scaling: ObservablePoint3D) {
    Vec4.set(rotation.x, rotation.y, rotation.z, rotation.w, this.rotation)
    Vec3.set(scaling.x, scaling.y, scaling.z, this.scaling)
    Vec3.set(position.x, position.y, position.z, this.position)
    Mat4.fromRotationTranslationScale(this.rotation, this.position, this.scaling, this._array); this._id++
  }

  /**
   * Sets the multiplication result of world and local matrices.
   * @param world World transform matrix.
   * @param local Local transform matrix.
   */
  setFromMultiplyWorldLocal(world: TransformMatrix, local: TransformMatrix) {
    Mat4.multiply(world._array, local._array, this._array); this._id++
  }
}