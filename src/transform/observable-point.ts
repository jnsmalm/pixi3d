import * as PIXI from "pixi.js"

/**
 * Represents a point in 3D space.
 */
export class ObservablePoint3D extends PIXI.ObservablePoint {
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
   * @param cb The callback when changed.
   * @param scope The owner of callback.
   * @param x The position on the x axis.
   * @param y The position on the y axis.
   * @param z The position on the z axis.
   */
  constructor(cb: () => void, scope: any, x = 0, y = 0, z = 0) {
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
    return new ObservablePoint3D(cb, scope, this.x, this.y, this.z)
  }

  copyFrom(p: ObservablePoint3D) {
    if (this._array[0] !== p.x || this._array[1] !== p.y || this._array[2] !== p.z) {
      this._array[0] = p.x
      this._array[1] = p.y
      this._array[2] = p.z
      this.cb.call(this.scope)
    }
    return this
  }

  copyTo<T extends PIXI.IPoint>(p: T) {
    if (p instanceof ObservablePoint3D) {
      p.set(this.x, this.y, this.z)
    }
    return <T>p
  }

  equals(p: ObservablePoint3D): boolean {
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
}