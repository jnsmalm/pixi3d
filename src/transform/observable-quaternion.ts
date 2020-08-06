import * as PIXI from "pixi.js"

import { Quat } from "../math/quat"
import { ObservablePoint3D } from "./observable-point"

const quat = new Float32Array(4)

/**
 * Represents a rotation quaternion in 3D space.
 */
export class ObservableQuaternion extends ObservablePoint3D {
  _w: number

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
    super(cb, scope, x, y, z)
    this._w = w
  }

  /**
   * Sets the euler angles in degrees.
   * @param x The x angle.
   * @param y The y angle.
   * @param z The z angle.
   */
  setEulerAngles(x: number, y: number, z: number) {
    Quat.fromEuler(x, y, z, quat)
    this.set(quat[0], quat[1], quat[2], quat[3])
  }

  /** W component of the quaternion. */
  get w() {
    return this._w
  }

  set w(value: number) {
    if (this._w !== value) {
      this._w = value
      this.cb.call(this.scope)
    }
  }

  /**
   * Creates a clone of this quaternion.
   * @param cb Callback when changed.
   * @param scope Owner of callback.
   */
  clone(cb?: (...params: any[]) => any, scope?: any) {
    return new ObservableQuaternion(
      cb || this.cb, scope || this.scope, this.x, this.y, this.z, this.w)
  }

  /**
   * Copies x, y, z, and w from the given quaternion.
   * @param p The quaternion to copy from.
   */
  copyFrom(p: PIXI.IPoint) {
    super.copyFrom(p)
    if (p instanceof ObservableQuaternion) {
      this.w = p.w
    }
    return this
  }

  /**
   * Copies x, y, z and w into the given quaternion.
   * @param p The quaternion to copy to.
   */
  copyTo(p: PIXI.IPoint) {
    if (p instanceof ObservableQuaternion) {
      p.set(this.x, this.y, this.z, this.w)
    }
    return p
  }

  /**
   * Returns true if the given quaternion is equal to this quaternion.
   * @param p The quaternion to check.
   */
  equals(p: PIXI.IPoint) {
    if (p instanceof ObservableQuaternion) {
      return super.equals(p) && (p.w === this.w)
    }
    return false
  }

  /**
   * Sets the quaternion to new x, y, z and w components.
   * @param x X component to set.
   * @param y Y component to set.
   * @param z Z component to set.
   * @param w W component to set.
   */
  set(x: number, y?: number, z?: number, w?: number) {
    super.set(x, y, z)
    const _w = w || ((w !== 0) ? x : 0)
    if (this._w !== _w) {
      this._w = _w
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