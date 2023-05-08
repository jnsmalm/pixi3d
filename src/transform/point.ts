import { ObservablePoint, IPoint } from "@pixi/math"
import { Vec3 } from "../math/vec3"
import { Matrix4x4 } from "./matrix"
import { Quaternion } from "./quaternion"

const temp = new Float32Array(3)

/**
 * Represents a point in 3D space.
 */
export class Point3D extends ObservablePoint implements IPoint3DData {
  private _array = new Float32Array(3)

  /** Array containing the x, y, z values. */
  get array() {
    return this._array
  }

  set array(value: Float32Array) {
    this.setFrom(value)
  }

  /**
   * Creates a new observable point.
   * @param x The position on the x axis.
   * @param y The position on the y axis.
   * @param z The position on the z axis.
   * @param cb The callback when changed.
   * @param scope The owner of callback.
   */
  constructor(x = 0, y = 0, z = 0, cb: () => void = () => { }, scope: any = undefined) {
    super(cb, scope)
    this._array.set([x, y, z])
  }

  /**
   * Position on the x axis relative to the local coordinates of the parent.
   */
  get x() {
    return this._array[0]
  }

  set x(value: number) {
    if (this._array[0] !== value) {
      this._array[0] = value
      this.cb.call(this.scope)
    }
  }

  /**
   * Position on the y axis relative to the local coordinates of the parent.
   */
  get y() {
    return this._array[1]
  }

  set y(value: number) {
    if (this._array[1] !== value) {
      this._array[1] = value
      this.cb.call(this.scope)
    }
  }

  /**
   * Position on the z axis relative to the local coordinates of the parent.
   */
  get z() {
    return this._array[2]
  }

  set z(value: number) {
    if (this._array[2] !== value) {
      this._array[2] = value
      this.cb.call(this.scope)
    }
  }

  clone(cb = this.cb, scope = this.scope) {
    return new Point3D(this.x, this.y, this.z, cb, scope)
  }

  copyFrom(p: IPoint3DData) {
    if (this._array[0] !== p.x || this._array[1] !== p.y || this._array[2] !== p.z) {
      this._array[0] = p.x
      this._array[1] = p.y
      this._array[2] = p.z
      this.cb.call(this.scope)
    }
    return this
  }

  copyTo<T extends IPoint>(p: T) {
    if (p instanceof Point3D) {
      p.set(this.x, this.y, this.z)
    }
    return <T>p
  }

  equals(p: Point3D): boolean {
    return p.x === this.x && p.y === this.y && p.z === this.z
  }

  /**
   * Sets the point to a new x, y and z position.
   * @param x The position on the x axis.
   * @param y The position on the y axis.
   * @param z The position on the z axis.
   */
  set(x: number, y = x, z = x) {
    if (this._array[0] !== x || this._array[1] !== y || this._array[2] !== z) {
      this._array[0] = x
      this._array[1] = y
      this._array[2] = z
      this.cb.call(this.scope)
    }
    return this
  }

  /**
   * Sets the point to a new x, y and z position.
   * @param array The array containing x, y and z, expected length is 3.
   */
  setFrom(array: ArrayLike<number>) {
    this.set(array[0], array[1], array[2]); return this
  }

  /**
   * Normalize the point.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  normalize(out = new Point3D()) {
    return out.setFrom(Vec3.normalize(this._array, temp))
  }

  /** Calculates the length of the point. */
  get magnitude() {
    return Vec3.magnitude(this._array)
  }

  /**
   * Calculates the dot product of two points.
   * @param a The first point.
   * @param b The second point.
   */
  static dot(a: Point3D, b: Point3D) {
    return Vec3.dot(a._array, b._array)
  }

  /**
   * Adds two points.
   * @param a The first point.
   * @param b The second point.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static add(a: Point3D, b: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.add(a._array, b._array, temp))
  }

  /**
   * Subtracts the second point from the first point.
   * @param a The first point.
   * @param b The second point.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static subtract(a: Point3D, b: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.subtract(a._array, b._array, temp))
  }

  /**
   * Computes the cross product of two points.
   * @param a The first point.
   * @param b The second point.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static cross(a: Point3D, b: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.cross(a._array, b._array, temp))
  }

  /**
   * Inverts of the components of a point.
   * @param a The point to invert.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static inverse(a: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.inverse(a._array, temp))
  }

  /**
   * Calculates the euclidian distance between two points.
   * @param a The first point.
   * @param b The second point.
   */
  static distance(a: Point3D, b: Point3D) {
    return Vec3.distance(a._array, b._array)
  }

  /**
   * Calculates the squared euclidian distance between two points.
   * @param a The first point.
   * @param b The second point.
   */
  static squaredDistance(a: Point3D, b: Point3D) {
    return Vec3.squaredDistance(a._array, b._array)
  }

  /**
   * Multiplies two points.
   * @param a The first point.
   * @param b The second point.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static multiply(a: Point3D, b: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.multiply(a._array, b._array, temp))
  }

  /**
   * Negates the components of a point.
   * @param a The point to negate.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static negate(a: Point3D, out = new Point3D()) {
    return out.setFrom(Vec3.negate(a._array, temp))
  }

  /**
   * Transforms a point with a matrix or quaternion.
   * @param a The point to transform.
   * @param m The matrix or quaternion to transform with.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static transform(a: Point3D, m: Matrix4x4 | Quaternion, out = new Point3D()) {
    if (m instanceof Matrix4x4) {
      return out.setFrom(Vec3.transformMat4(a._array, m.array, temp))
    }
    return out.setFrom(Vec3.transformQuat(a._array, m.array, temp))
  }

  /**
   * Performs a linear interpolation between two points.
   * @param a The first point.
   * @param b The second point.
   * @param t The interpolation amount, in the range [0-1], between the two inputs.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static lerp(a: Point3D, b: Point3D, t: number, out = new Point3D()) {
    return out.setFrom(Vec3.lerp(a._array, b._array, t, temp))
  }

  /**
   * Scales a point by a scalar number.
   * @param a The point to scale.
   * @param b The amount to scale the point by.
   * @param out The receiving point. If not supplied, a new point will be created.
   */
  static scale(a: Point3D, b: number, out = new Point3D()) {
    return out.setFrom(Vec3.scale(a._array, b, temp))
  }
}

export interface IPoint3DData {
  x: number;
  y: number;
  z: number;
}
