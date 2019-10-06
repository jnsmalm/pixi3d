export class ObservablePoint3D extends PIXI.ObservablePoint {
  _z: number

  constructor(cb: () => void, scope: any, x = 0, y = 0, z = 0) {
    super(cb, scope, x, y)
    this._z = z
  }

  get z() {
    return this._z
  }

  set z(value: number) {
    if (this._z !== value) {
      this._z = value
      this.cb.call(this.scope)
    }
  }

  clone(cb: (() => void) | null = null, scope: any) {
    return new ObservablePoint3D(
      cb || this.cb, scope || this.scope, this._x, this._y, this._z)
  }

  copyFrom(p: ObservablePoint3D) {
    if (this._x !== p.x || this._y !== p.y || this._z !== p.z) {
      this._x = p.x
      this._y = p.y
      this._z = p.z
      this.cb.call(this.scope)
    }
    return this
  }

  copyTo(p: ObservablePoint3D) {
    p.set(this._x, this._y, this._z)
    return p
  }

  equals(p: ObservablePoint3D) {
    return (p.x === this._x) && (p.y === this._y) && (p.z === this._z)
  }

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