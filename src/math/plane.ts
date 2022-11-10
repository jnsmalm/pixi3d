import { Point3D } from "../transform/point";
import { Ray } from "./ray"

function approximately(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

const EPSILON = 0.000001

export class Plane {
  private _normal = new Point3D()

  constructor(normal: Point3D, public distance: number) {
    this._normal = normal.normalize(this._normal)
  }

  get normal() {
    return this._normal
  }

  rayCast(ray: Ray) {
    const vdot = Point3D.dot(ray.direction, this.normal)
    if (approximately(vdot, 0)) {
      return 0
    }
    const ndot = -Point3D.dot(ray.origin, this.normal) - this.distance
    return ndot / vdot
  }
}