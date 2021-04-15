import { Vec3 } from "./vec3"

export class Ray {
  private _direction = new Float32Array(3)
  private _origin = new Float32Array(3)

  constructor(origin: Float32Array, direction: Float32Array) {
    Vec3.copy(origin, this._origin)
    Vec3.normalize(direction, this._direction)
  }

  get origin() {
    return this._origin
  }

  get direction() {
    return this._direction
  }

  getPoint(distance: number, point = new Float32Array(3)) {
    return Vec3.add(this._origin, Vec3.scale(
      this._direction, distance, point), point)
  }
}