import { Matrix } from "pixi.js"
import { ObservablePoint3D } from "./observable-point"
import { ObservableQuaternion } from "./observable-quaternion"
import { Mat4 } from "../math/mat4"
import { Vec3 } from "../math/vec3"
import { Vec4 } from "../math/vec4"
import { MatrixComponent } from "./matrix-component"
import { Quat } from "../math/quat"
import { TransformId } from "./transform-id"

/**
 * Represents a 4x4 matrix.
 */
export class Matrix4 extends Matrix implements TransformId {
  private _transformId = 0
  private _position?: MatrixComponent
  private _scaling?: MatrixComponent
  private _rotation?: MatrixComponent
  private _up?: MatrixComponent
  private _down?: MatrixComponent
  private _forward?: MatrixComponent
  private _left?: MatrixComponent
  private _right?: MatrixComponent
  private _backward?: MatrixComponent

  get transformId() {
    return this._transformId
  }

  /** The array containing the matrix data. */
  public array: Float32Array

  /**
   * Creates a new transform matrix using the specified matrix array.
   * @param array The matrix array, expected length is 16. If empty, an identity 
   * matrix is used by default.
   */
  constructor(array?: ArrayLike<number>) {
    super()
    if (array) {
      this.array = new Float32Array(array)
    } else {
      this.array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
  }

  toArray(transpose: boolean, out?: Float32Array) {
    if (transpose) {
      return Mat4.transpose(this.array, out)
    }
    return out ? Mat4.copy(this.array, out) : this.array
  }

  /** Returns the position component of the matrix. */
  get position() {
    if (!this._position) {
      this._position = new MatrixComponent(this, 3, data => {
        Mat4.getTranslation(this.array, data)
      })
    }
    return this._position.array
  }

  /** Returns the scaling component of the matrix. */
  get scaling() {
    if (!this._scaling) {
      this._scaling = new MatrixComponent(this, 3, data => {
        Mat4.getScaling(this.array, data)
      })
    }
    return this._scaling.array
  }

  /** Returns the rotation quaternion of the matrix. */
  get rotation() {
    if (!this._rotation) {
      let matrix = new Float32Array(16)
      this._rotation = new MatrixComponent(this, 4, data => {
        // To extract a correct rotation, the scaling component must be eliminated.
        for (let col of [0, 1, 2]) {
          matrix[col + 0] = this.array[col + 0] / this.scaling[0]
          matrix[col + 4] = this.array[col + 4] / this.scaling[1]
          matrix[col + 8] = this.array[col + 8] / this.scaling[2]
        }
        Quat.normalize(Mat4.getRotation(matrix, data), data)
      })
    }
    return this._rotation.array
  }

  /** Returns the up vector of the matrix. */
  get up() {
    if (!this._up) {
      this._up = new MatrixComponent(this, 3, data => {
        Vec3.normalize(Vec3.set(this.array[4], this.array[5], this.array[6], data), data)
      })
    }
    return this._up.array
  }

  /** Returns the down vector of the matrix. */
  get down() {
    if (!this._down) {
      this._down = new MatrixComponent(this, 3, data => {
        Vec3.negate(this.up, data)
      })
    }
    return this._down.array
  }

  /** Returns the left vector of the matrix. */
  get right() {
    if (!this._right) {
      this._right = new MatrixComponent(this, 3, data => {
        Vec3.negate(this.left, data)
      })
    }
    return this._right.array
  }

  /** Returns the right vector of the matrix. */
  get left() {
    if (!this._left) {
      this._left = new MatrixComponent(this, 3, data => {
        Vec3.normalize(Vec3.cross(this.up, this.forward, data), data)
      })
    }
    return this._left.array
  }

  /** Returns the forward vector of the matrix. */
  get forward() {
    if (!this._forward) {
      this._forward = new MatrixComponent(this, 3, data => {
        Vec3.normalize(Vec3.set(this.array[8], this.array[9], this.array[10], data), data)
      })
    }
    return this._forward.array
  }

  /** Returns the backward vector of the matrix. */
  get backward() {
    if (!this._backward) {
      this._backward = new MatrixComponent(this, 3, data => {
        Vec3.negate(this.forward, data)
      })
    }
    return this._backward.array
  }

  copyFrom(matrix: Matrix4) {
    if (matrix instanceof Matrix4) {
      Mat4.copy(matrix.array, this.array); this._transformId++
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
    Mat4.fromRotationTranslationScale(this.rotation, this.position, this.scaling, this.array); this._transformId++
  }

  /**
   * Multiplies this matrix with another matrix.
   * @param matrix The matrix to multiply with.
   */
  multiply(matrix: Matrix4) {
    Mat4.multiply(matrix.array, this.array, this.array); this._transformId++
  }
}