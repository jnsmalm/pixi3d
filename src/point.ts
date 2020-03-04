/**
 * Represents a position in 3D space.
 */
export class ObservablePoint3D {
  _x: number
  _y: number
  _z: number

  /**
   * Creates a new point.
   * @param cb Callback when changed.
   * @param scope Owner of callback.
   * @param x Position on the x axis.
   * @param y Position on the y axis.
   * @param z Position on the z axis.
   */
  constructor(protected cb: () => void, protected scope: any, x = 0, y = 0, z = 0) {
    this._x = x
    this._y = y
    this._z = z
  }

  /**
   * Position on the x axis relative to the local coordinates of the parent.
   */
  get x() {
    return this._x
  }

  set x(value: number) {
    if (this._x !== value) {
      this._x = value
      this.cb.call(this.scope)
    }
  }

  /**
   * Position on the y axis relative to the local coordinates of the parent.
   */
  get y() {
    return this._y
  }

  set y(value: number) {
    if (this._y !== value) {
      this._y = value
      this.cb.call(this.scope)
    }
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
  clone(cb: (() => void) | null = null, scope: any) {
    return new ObservablePoint3D(
      cb || this.cb, scope || this.scope, this._x, this._y, this._z)
  }

  /**
   * Copies x, y and z from the given point.
   * @param p The point to copy from.
   */
  copyFrom(p: { x: number, y: number, z: number } | Float32Array) {
    if (ArrayBuffer.isView(p)) {
      p = { x: p[0], y: p[1], z: p[2] }
    }
    if (this._x !== p.x || this._y !== p.y || this._z !== p.z) {
      this._x = p.x
      this._y = p.y
      this._z = p.z
      this.cb.call(this.scope)
    }
    return this
  }

  /**
   * Copies x, y and z into the given point.
   * @param p The point to copy to.
   */
  copyTo(p: ObservablePoint3D) {
    p.set(this._x, this._y, this._z)
    return p
  }

  /**
   * Returns true if the given point is equal to this point.
   * @param p The point to check.
   */
  equals(p: ObservablePoint3D) {
    return (p.x === this._x) && (p.y === this._y) && (p.z === this._z)
  }

  set(...xyz: number[]): void

  /**
   * Sets the point to a new x, y and z position.
   * @param x Position on the x axis.
   * @param y Position on the y axis.
   * @param z Position on the z axis.
   */
  set(x: number, y?: number, z?: number) {
    const _x = x || 0
    const _y = y || ((y !== 0) ? _x : 0)
    const _z = z || ((z !== 0) ? _x : 0)
    if (this._x !== _x || this._y !== _y || this._z !== _z) {
      this._x = _x
      this._y = _y
      this._z = _z
      this.cb.call(this.scope)
    }
  }
}