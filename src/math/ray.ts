import { Point3D } from "../transform/point"

export class Ray {
  private _direction = new Point3D()
  private _origin = new Point3D()

  constructor(origin: Point3D, direction: Point3D) {
    this._origin.copyFrom(origin)
    this._direction.copyFrom(direction)
  }

  get origin() {
    return this._origin
  }

  get direction() {
    return this._direction
  }

  getPoint(distance: number, point = new Point3D()) {
    return Point3D.add(this._origin,
      Point3D.scale(this._direction, distance, point), point)
  }
}