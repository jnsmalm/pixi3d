import { ObservablePoint, IPoint } from "@pixi/math"
import { Quat } from "../math/quat"

/**
 * Represents a rotation quaternion in 3D space.
 */
export class ObservableQuaternion extends ObservablePoint {
  private _array = new Float32Array(4)

  /** Array containing the x, y, z, w values. */
  get array() {
    return this._array
  }

  set array(value: Float32Array) {
    this.setFrom(value)
  }

  /**
   * Creates a new observable quaternion.
   * @param cb The callback when changed.
   * @param scope The owner of callback.
   * @param x The x component.
   * @param y The y component.
   * @param z The z component.
   * @param w The w component.
   */
  constructor(cb: () => void, scope: any, x = 0, y = 0, z = 0, w = 1) {
    super(cb, scope)
    this._array.set([x, y, z, w])
  }

  /** The x component of the quaternion. */
  get x() {
    return this._array[0]
  }

  set x(value: number) {
    if (this._array[0] !== value) {
      this._array[0] = value
      this.cb.call(this.scope)
    }
  }

  /** The y component of the quaternion. */
  get y() {
    return this._array[1]
  }

  set y(value: number) {
    if (this._array[1] !== value) {
      this._array[1] = value
      this.cb.call(this.scope)
    }
  }

  /** The z component of the quaternion. */
  get z() {
    return this._array[2]
  }

  set z(value: number) {
    if (this._array[2] !== value) {
      this._array[2] = value
      this.cb.call(this.scope)
    }
  }

  /** The w component of the quaternion. */
  get w() {
    return this._array[3]
  }

  set w(value: number) {
    if (this._array[3] !== value) {
      this._array[3] = value
      this.cb.call(this.scope)
    }
  }

  /** The euler representation of the quaternion. */
  get euler() {
    return Quat.toEuler(this.array);
  }

  /**
   * Sets the euler angles in degrees.
   * @param x The x angle.
   * @param y The y angle.
   * @param z The z angle.
   */
  setEulerAngles(x: number, y: number, z: number) {
    Quat.fromEuler(x, y, z, this._array); this.cb.call(this.scope)
  }

  /**
   * Creates a clone of this quaternion.
   * @param cb Callback when changed.
   * @param scope Owner of callback.
   */
  clone(cb = this.cb, scope = this.scope) {
    return new ObservableQuaternion(cb, scope, this.x, this.y, this.z, this.w)
  }

  /**
   * Copies x, y, z, and w from the given quaternion.
   * @param p The quaternion to copy from.
   */
  copyFrom(p: ObservableQuaternion) {
    if (this._array[0] !== p.x || this._array[1] !== p.y || this._array[2] !== p.z || this._array[3] !== p.w) {
      this._array[0] = p.x
      this._array[1] = p.y
      this._array[2] = p.z
      this._array[3] = p.w
      this.cb.call(this.scope)
    }
    return this
  }

  /**
   * Copies x, y, z and w into the given quaternion.
   * @param p The quaternion to copy to.
   */
  copyTo<T extends IPoint>(p: T) {
    if (p instanceof ObservableQuaternion) {
      p.set(this.x, this.y, this.z, this.w)
    }
    return <T>p
  }

  /**
   * Returns true if the given quaternion is equal to this quaternion.
   * @param p The quaternion to check.
   */
  equals(p: ObservableQuaternion) {
    return p.x === this.x && p.y === this.y && p.z === this.z && p.w === this.w
  }

  /**
   * Sets the quaternion to new x, y, z and w components.
   * @param x X component to set.
   * @param y Y component to set.
   * @param z Z component to set.
   * @param w W component to set.
   */
  set(x: number, y = x, z = x, w = x) {
    if (this._array[0] !== x || this._array[1] !== y || this._array[2] !== z || this._array[3] !== w) {
      this._array[0] = x
      this._array[1] = y
      this._array[2] = z
      this._array[3] = w
      this.cb.call(this.scope)
    }
    return this
  }

  /**
   * Sets the quaternion to a new x, y, z and w components.
   * @param array The array containing x, y, z and w, expected length is 4.
   */
  setFrom(array: ArrayLike<number>) {
    this.set(array[0], array[1], array[2], array[3]); return this
  }
}