import { ObservablePoint3D } from "../point"
import { ObservableQuaternion } from "../quaternion"
import { Matrix4 } from "../math/matrix4"
import { Vector3 } from "../math/vector3"
import { Vector4 } from "../math/vector4"
import { MatrixComponent } from "./matrix-component"

/**
 * Represents the matrix for a transform.
 */
export class TransformMatrix {
  private _array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  private _id = 0

  get array() {
    return this._array
  }

  /** Current version id. */
  get id() {
    return this._id
  }

  private _position?: MatrixComponent
  private _scale?: MatrixComponent
  private _rotation?: MatrixComponent
  private _up?: MatrixComponent
  private _forward?: MatrixComponent
  private _direction?: MatrixComponent

  /** Position component of the matrix. */
  get position() {
    if (!this._position) {
      this._position = new MatrixComponent(this, 3, data => {
        Matrix4.getTranslation(this.array, data)
      })
    }
    return this._position.array
  }

  /** Scale component of the matrix. */
  get scale() {
    if (!this._scale) {
      this._scale = new MatrixComponent(this, 3, data => {
        Matrix4.getScaling(this.array, data)
      })
    }
    return this._scale.array
  }

  /** Rotation component of the matrix. */
  get rotation() {
    if (!this._rotation) {
      this._rotation = new MatrixComponent(this, 4, data => {
        Matrix4.getRotation(this.array, data)
      })
    }
    return this._rotation.array
  }

  /** Up component of the matrix. */
  get up() {
    if (!this._up) {
      this._up = new MatrixComponent(this, 3, data => {
        Vector3.set(this.array[4], this.array[5], this.array[6], data)
      })
    }
    return this._up.array
  }

  /** Forward component of the matrix. */
  get forward() {
    if (!this._forward) {
      this._forward = new MatrixComponent(this, 3, data => {
        Vector3.set(this.array[8], this.array[9], this.array[10], data)
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
  copyFrom(matrix: TransformMatrix | Float32Array) {
    if (matrix instanceof TransformMatrix) {
      matrix = matrix.array
    }
    Matrix4.copy(matrix, this.array); this._id++
  }

  /**
   * Set values from rotation, position and scale. 
   * @param rotation Rotation to set.
   * @param position Position to set.
   * @param scale Scale to set.
   */
  setFromRotationPositionScale(rotation: ObservableQuaternion, position: ObservablePoint3D, scale: ObservablePoint3D) {
    Vector4.set(rotation.x, rotation.y, rotation.z, rotation.w, this.rotation)
    Vector3.set(scale.x, scale.y, scale.z, this.scale)
    Vector3.set(position.x, position.y, position.z, this.position)
    Matrix4.fromRotationTranslationScale(this.rotation, this.position, this.scale, this.array); this._id++
  }

  /**
   * Set from multiplication result of world and local matrices.
   * @param world World transform matrix.
   * @param local Local transform matrix.
   */
  setFromMultiplyWorldLocal(world: TransformMatrix, local: TransformMatrix) {
    Matrix4.multiply(world.array, local.array, this.array); this._id++
  }
}