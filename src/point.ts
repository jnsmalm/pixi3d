import * as PIXI from "pixi.js"

/**
 * Represents a position in 3D space.
 */
export class ObservablePoint3D extends PIXI.ObservablePoint {
  private _z: number

  /**
   * Creates a new point.
   * @param cb Callback when changed.
   * @param scope Owner of callback.
   * @param x Position on the x axis.
   * @param y Position on the y axis.
   * @param z Position on the z axis.
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

  /**
   * Creates a clone of this point.
   * @param cb Callback when changed.
   * @param scope Owner of callback.
   */
  clone(cb?: (...params: any[]) => any, scope?: any) {
    return new ObservablePoint3D(
      cb || this.cb, scope || this.scope, this.x, this.y, this._z)
  }

  /**
   * Copies x, y and z from the given point.
   * @param p The point to copy from.
   */
  copyFrom(p: PIXI.IPoint) {
    super.copyFrom(p)
    if (p instanceof ObservablePoint3D) {
      this.z = p.z
    }
    return this
  }

  /**
   * Copies x, y and z into the given point.
   * @param p The point to copy to.
   */
  copyTo(p: PIXI.IPoint) {
    if (p instanceof ObservablePoint3D) {
      p.set(this.x, this.y, this.z)
    }
    return p
  }

  /**
   * Returns true if the given point is equal to this point.
   * @param p The point to check.
   */
  equals(p: PIXI.IPoint): boolean {
    if (p instanceof ObservablePoint3D) {
      return super.equals(p) && (p.z === this.z)
    }
    return false
  }

  /**
   * Sets the point to a new x, y and z position.
   * @param x Position on the x axis.
   * @param y Position on the y axis.
   * @param z Position on the z axis.
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
}