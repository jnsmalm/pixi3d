import { Matrix } from "@pixi/math"
import { Point3D } from "./observable-point"
import { Quaternion } from "./quaternion"
import { Mat4 } from "../math/mat4"
import { Vec3 } from "../math/vec3"
import { MatrixComponent } from "./matrix-component"
import { Quat } from "../math/quat"
import { TransformId } from "./transform-id"

const temp = new Float32Array(16)

/**
 * Represents a 4x4 matrix.
 */
export class Matrix4x4 extends Matrix implements TransformId {
  private _transformId = 0
  private _position?: MatrixComponent<Point3D>
  private _scaling?: MatrixComponent<Point3D>
  private _rotation?: MatrixComponent<Quaternion>
  private _up?: MatrixComponent<Point3D>
  private _down?: MatrixComponent<Point3D>
  private _forward?: MatrixComponent<Point3D>
  private _left?: MatrixComponent<Point3D>
  private _right?: MatrixComponent<Point3D>
  private _backward?: MatrixComponent<Point3D>

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
      this._position = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Mat4.getTranslation(this.array, data.array)
      })
    }
    return this._position.data
  }

  /** Returns the scaling component of the matrix. */
  get scaling() {
    if (!this._scaling) {
      this._scaling = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Mat4.getScaling(this.array, data.array)
      })
    }
    return this._scaling.data
  }

  /** Returns the normalized rotation quaternion of the matrix. */
  get rotation() {
    if (!this._rotation) {
      let matrix = new Float32Array(16)
      this._rotation = new MatrixComponent<Quaternion>(this, new Quaternion(), data => {
        // To extract a correct rotation, the scaling component must be eliminated.
        for (let col of [0, 1, 2]) {
          matrix[col + 0] = this.array[col + 0] / this.scaling.x
          matrix[col + 4] = this.array[col + 4] / this.scaling.y
          matrix[col + 8] = this.array[col + 8] / this.scaling.z
        }
        Quat.normalize(Mat4.getRotation(matrix, data.array), data.array)
      })
    }
    return this._rotation.data
  }

  /** Returns the normalized up vector of the matrix. */
  get up() {
    if (!this._up) {
      this._up = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.normalize(Vec3.set(
          this.array[4], this.array[5], this.array[6], data.array), data.array)
      })
    }
    return this._up.data
  }

  /** Returns the normalized down vector of the matrix. */
  get down() {
    if (!this._down) {
      this._down = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.negate(this.up.array, data.array)
      })
    }
    return this._down.data
  }

  /** Returns the normalized left vector of the matrix. */
  get right() {
    if (!this._right) {
      this._right = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.negate(this.left.array, data.array)
      })
    }
    return this._right.data
  }

  /** Returns the normalized right vector of the matrix. */
  get left() {
    if (!this._left) {
      this._left = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.normalize(
          Vec3.cross(this.up.array, this.forward.array, data.array), data.array)
      })
    }
    return this._left.data
  }

  /** Returns the normalized forward vector of the matrix. */
  get forward() {
    if (!this._forward) {
      this._forward = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.normalize(Vec3.set(
          this.array[8], this.array[9], this.array[10], data.array), data.array)
      })
    }
    return this._forward.data
  }

  /** Returns the normalized backward vector of the matrix. */
  get backward() {
    if (!this._backward) {
      this._backward = new MatrixComponent<Point3D>(this, new Point3D(), data => {
        Vec3.negate(this.forward.array, data.array)
      })
    }
    return this._backward.data
  }

  copyFrom(matrix: Matrix4x4) {
    if (matrix instanceof Matrix4x4) {
      Mat4.copy(matrix.array, this.array); this._transformId++
    }
    return this
  }

  /**
   * Sets the matrix to the contents of the specified array.
   * @param array The array.
   */
  setFrom(array: ArrayLike<number>) {
    Mat4.copy(<Float32Array>array, this.array); this._transformId++; return this
  }

  /**
   * Sets the rotation, position and scale components. 
   * @param rotation The rotation to set.
   * @param position The position to set.
   * @param scaling The scale to set.
   */
  setFromRotationPositionScale(rotation: Quaternion, position: Point3D, scaling: Point3D) {
    Mat4.fromRotationTranslationScale(
      rotation.array, position.array, scaling.array, this.array);
    this._transformId++
  }

  /**
   * Multiplies this matrix with another matrix.
   * @param matrix The matrix to multiply with.
   */
  multiply(matrix: Matrix4x4) {
    Mat4.multiply(matrix.array, this.array, this.array); this._transformId++
  }

  /**
   * Translate a matrix by the given vector.
   * @param mat The matrix to translate.
   * @param v The vector to translate by.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static translate(mat: Matrix4x4, v: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.translate(mat.array, v.array, temp))
  }

  /**
   * Calculates a matrix from the given quaternion.
   * @param q The quaternion to create matrix from.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static fromQuaternion(q: Quaternion, out = new Matrix4x4()) {
    return out.setFrom(Mat4.fromQuat(q.array, temp))
  }

  /**
   * Creates a matrix from a quaternion rotation, point translation and point scale.
   * @param q The rotation quaternion.
   * @param v The translation point.
   * @param s The scale point.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static fromRotationTranslationScale(q: Quaternion, v: Point3D, s: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.fromRotationTranslationScale(q.array, v.array, s.array, temp))
  }

  /**
   * Creates a matrix from a given angle around a given axis.
   * @param rad The angle in radians to rotate the matrix by.
   * @param axis The axis to rotate around.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static fromRotation(rad: number, axis: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.fromRotation(rad, axis.array, temp))
  }

  /**
   * Creates a matrix from a scaling point.
   * @param v The scaling point.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static fromScaling(v: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.fromScaling(v.array, temp))
  }

  /**
   * Creates a matrix from a scaling point.
   * @param v The translation point.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static fromTranslation(v: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.fromTranslation(v.array, temp))
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis. If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   * @param eye The position of the viewer.
   * @param center The point the viewer is looking at.
   * @param up The vector pointing up.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static lookAt(eye: Point3D, center: Point3D, up: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.lookAt(eye.array, center.array, up.array, temp))
  }

  /**
   * Set a matrix to the identity matrix.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static identity(out = new Matrix4x4()) {
    return out.setFrom(Mat4.identity(temp))
  }

  /**
   * 
   * @param fovy The vertical field of view in radians.
   * @param aspect The aspect ratio, typically viewport width/height.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   * @returns 
   */
  static perspective(fovy: number, aspect: number, near: number, far: number, out = new Matrix4x4()) {
    return out.setFrom(Mat4.perspective(fovy, aspect, near, far, temp))
  }

  /**
   * 
   * @param left The left bound of the frustum.
   * @param right The right bound of the frustum.
   * @param bottom The bottom bound of the frustum.
   * @param top The top bound of the frustum.
   * @param near The near bound of the frustum.
   * @param far The far bound of the frustum.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out = new Matrix4x4()) {
    return out.setFrom(Mat4.ortho(left, right, bottom, top, near, far, temp))
  }

  /**
   * Inverts a matrix.
   * @param a The source matrix to invert.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static invert(a: Matrix4x4, out = new Matrix4x4()) {
    return out.setFrom(Mat4.invert(a.array, temp))
  }

  /**
   * Transpose the values of a matrix
   * @param a The source matrix to transpose.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static transpose(a: Matrix4x4, out = new Matrix4x4()) {
    return out.setFrom(Mat4.transpose(a.array, temp))
  }

  /**
   * Generates a matrix that makes something look at something else.
   * @param eye The position of the viewer.
   * @param target The point the viewer is looking at.
   * @param up The vector pointing up.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static targetTo(eye: Point3D, target: Point3D, up: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.targetTo(eye.array, target.array, up.array, temp))
  }

  /**
   * Rotates a matrix by the given angle around the x-axis.
   * @param a The matrix to rotate.
   * @param rad The angle in radians to rotate the matrix by.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static rotateX(a: Matrix4x4, rad: number, out = new Matrix4x4()) {
    return out.setFrom(Mat4.rotateX(a.array, rad, temp))
  }

  /**
   * Rotates a matrix by the given angle around the y-axis.
   * @param a The matrix to rotate.
   * @param rad The angle in radians to rotate the matrix by.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static rotateY(a: Matrix4x4, rad: number, out = new Matrix4x4()) {
    return out.setFrom(Mat4.rotateY(a.array, rad, temp))
  }

  /**
   * Rotates a matrix by the given angle around the z-axis.
   * @param a The matrix to rotate.
   * @param rad The angle in radians to rotate the matrix by.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static rotateZ(a: Matrix4x4, rad: number, out = new Matrix4x4()) {
    return out.setFrom(Mat4.rotateZ(a.array, rad, temp))
  }

  /**
   * Rotates a matrix by the given angle around the given axis.
   * @param a The matrix to rotate.
   * @param rad The angle in radians to rotate the matrix by.
   * @param axis The axis to rotate around.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static rotate(a: Matrix4x4, rad: number, axis: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.rotate(a.array, rad, axis.array, temp))
  }

  /**
   * Scales the matrix by the dimensions in the given point.
   * @param a The matrix to scale.
   * @param v The point vector to scale the matrix by.
   * @param out The receiving matrix. If not supplied, a new matrix will be created.
   */
  static scale(a: Matrix4x4, v: Point3D, out = new Matrix4x4()) {
    return out.setFrom(Mat4.scale(a.array, v.array, temp))
  }
}