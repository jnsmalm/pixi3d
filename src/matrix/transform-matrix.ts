import * as PIXI from "pixi.js"

import { ObservablePoint3D } from "../point"
import { ObservableQuaternion } from "../quaternion"
import { Matrix4 } from "../math/matrix4"
import { Vector3 } from "../math/vector3"
import { Vector4 } from "../math/vector4"
import { MatrixComponent } from "./matrix-component"

/**
 * Represents the matrix for a transform.
 */
export class TransformMatrix extends PIXI.Matrix {
  private _array: Float32Array
  private _id = 0

  constructor(array?: ArrayLike<number>) {
    super()
    if (array) {
      this._array = new Float32Array(array)
    } else {
      this._array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
  }

  applyInverse(pos: PIXI.Point, newPos?: PIXI.Point) {
    // For now, this is just to support mesh picking. PIXI expects this method 
    // to exist and to return the position with the inverse of the current 
    // transformation applied. We want the global position at all times for the 
    // picking to work. So this is a hack to make PIXI happy.
    return <PIXI.Point>pos.copyTo(newPos || new PIXI.Point())
  }

  toArray(transpose?: boolean, out?: Float32Array) {
    let _array = out
    if (!out) {
      _array = this._array
    }
    return <number[]><unknown>_array
  }

  /** Current version id. */
  get id() {
    return this._id
  }

  private _position?: MatrixComponent
  private _scaling?: MatrixComponent
  private _rotation?: MatrixComponent
  private _up?: MatrixComponent
  private _forward?: MatrixComponent
  private _direction?: MatrixComponent

  /** Position component of the matrix. */
  get position() {
    if (!this._position) {
      this._position = new MatrixComponent(this, 3, data => {
        Matrix4.getTranslation(this._array, data)
      })
    }
    return this._position.array
  }

  /** Scaling component of the matrix. */
  get scaling() {
    if (!this._scaling) {
      this._scaling = new MatrixComponent(this, 3, data => {
        Matrix4.getScaling(this._array, data)
      })
    }
    return this._scaling.array
  }

  /** Rotation component of the matrix. */
  get rotation() {
    if (!this._rotation) {
      this._rotation = new MatrixComponent(this, 4, data => {
        Matrix4.getRotation(this._array, data)
      })
    }
    return this._rotation.array
  }

  /** Up component of the matrix. */
  get up() {
    if (!this._up) {
      this._up = new MatrixComponent(this, 3, data => {
        Vector3.set(this._array[4], this._array[5], this._array[6], data)
      })
    }
    return this._up.array
  }

  /** Forward component of the matrix. */
  get forward() {
    if (!this._forward) {
      this._forward = new MatrixComponent(this, 3, data => {
        Vector3.set(this._array[8], this._array[9], this._array[10], data)
      })
    }
    return this._forward.array
  }

  /** Direction component of the matrix. */
  get direction() {
    if (!this._direction) {
      this._direction = new MatrixComponent(this, 3, data => {
        Vector3.add(this.position, this.forward, data)
      })
    }
    return this._direction.array
  }

  /**
   * Copies values from the given matrix.
   * @param matrix The matrix to copy from.
   */
  copyFrom(matrix: TransformMatrix) {
    if (matrix instanceof TransformMatrix) {
      Matrix4.copy(matrix._array, this._array); this._id++
    }
    return this
  }

  /**
   * Set values from rotation, position and scale. 
   * @param rotation Rotation to set.
   * @param position Position to set.
   * @param scaling Scale to set.
   */
  setFromRotationPositionScale(rotation: ObservableQuaternion, position: ObservablePoint3D, scaling: ObservablePoint3D) {
    Vector4.set(rotation.x, rotation.y, rotation.z, rotation.w, this.rotation)
    Vector3.set(scaling.x, scaling.y, scaling.z, this.scaling)
    Vector3.set(position.x, position.y, position.z, this.position)
    Matrix4.fromRotationTranslationScale(this.rotation, this.position, this.scaling, this._array); this._id++
  }

  /**
   * Set from multiplication result of world and local matrices.
   * @param world World transform matrix.
   * @param local Local transform matrix.
   */
  setFromMultiplyWorldLocal(world: TransformMatrix, local: TransformMatrix) {
    Matrix4.multiply(world._array, local._array, this._array); this._id++
  }
}