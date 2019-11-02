import { ObservablePoint3D } from "./point"
import { quat } from "gl-matrix"

const rotation = quat.create()

export class ObservableQuaternion extends ObservablePoint3D {
  _w: number

  constructor(cb: () => void, scope: any, x = 0, y = 0, z = 0, w = 1) {
    super(cb, scope, x, y, z)
    this._w = w
  }

  setEulerAngles(x: number, y: number, z: number) {
    quat.fromEuler(rotation, x, y, z)
    if (this._x !== rotation[0] || this._y !== rotation[1] || this._z !== rotation[2] || this._w !== rotation[3]) {
      this._x = rotation[0]
      this._y = rotation[1]
      this._z = rotation[2]
      this._w = rotation[3]
      this.cb.call(this.scope)
    }
  }

  get w() {
    return this._w
  }

  set w(value: number) {
    if (this._w !== value) {
      this._w = value
      this.cb.call(this.scope)
    }
  }

  clone(cb: (() => void) | null = null, scope: any) {
    return new ObservableQuaternion(
      cb || this.cb, scope || this.scope, this._x, this._y, this._z, this._w)
  }

  copyFrom(p: ObservableQuaternion) {
    if (this._x !== p.x || this._y !== p.y || this._z !== p.z || this._w !== p.w) {
      this._x = p.x
      this._y = p.y
      this._z = p.z
      this._w = p.w
      this.cb.call(this.scope)
    }
    return this
  }

  copyTo(p: ObservableQuaternion) {
    p.set(this._x, this._y, this._z, this._w)
    return p
  }

  equals(p: ObservableQuaternion) {
    return (p.x === this._x) && (p.y === this._y) && (p.z === this._z) && (p.w === this._w)
  }

  set(...xyzw: number[]): void
  set(x: number, y?: number, z?: number, w?: number) {
    const _x = x || 0
    const _y = y || ((y !== 0) ? _x : 0)
    const _z = z || ((z !== 0) ? _x : 0)
    const _w = w || ((w !== 0) ? _x : 0)
    if (this._x !== _x || this._y !== _y || this._z !== _z || this._w !== _w) {
      this._x = _x
      this._y = _y
      this._z = _z
      this._w = _w
      this.cb.call(this.scope)
    }
  }
}