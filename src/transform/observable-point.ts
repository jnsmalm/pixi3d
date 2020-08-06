import * as PIXI from "pixi.js"

/**
 * Represents a point in 3D space.
 */
export class ObservablePoint3D extends PIXI.ObservablePoint {
  private _z: number

  /**
   * Creates a new observable point.
   * @param cb The callback when changed.
   * @param scope The owner of callback.
   * @param x The position on the x axis.
   * @param y The position on the y axis.
   * @param z The position on the z axis.
   */
  constructor(protected cb: () => void, protected scope: any, x = 0, y = 0, z = 0) {
    super(cb, scope, x, y)
    this._z = z
  }

  /**
   * Position on the z axis relative to the local coordinates of the parent.
   */
  get z() {
    return this._z
  }

  set z(value: number) {
    if (this._z !== value) {
      this._z = value
      this.cb.call(this.scope)
    }
  }

  clone(cb?: (...params: any[]) => any, scope?: any) {
    return new ObservablePoint3D(
      cb || this.cb, scope || this.scope, this.x, this.y, this._z)
  }

  copyFrom(p: PIXI.IPoint) {
    super.copyFrom(p)
    if (p instanceof ObservablePoint3D) {
      this.z = p.z
    }
    return this
  }

  copyTo(p: PIXI.IPoint) {
    if (p instanceof ObservablePoint3D) {
      p.set(this.x, this.y, this.z)
    }
    return p
  }

  equals(p: PIXI.IPoint): boolean {
    if (p instanceof ObservablePoint3D) {
      return super.equals(p) && (p.z === this.z)
    }
    return false
  }

  /**
   * Sets the point to a new x, y and z position.
   * @param x The position on the x axis.
   * @param y The position on the y axis.
   * @param z The position on the z axis.
   */
  set(x: number, y?: number, z?: number) {
    super.set(x, y)
    const _z = z || ((z !== 0) ? x : 0)
    if (this._z !== _z) {
      this._z = _z
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
}