import { Ray } from "./ray"
import { Vec3 } from "./vec3"

function approximately(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

const EPSILON = 0.000001

export class Plane {
  private _normal = new Float32Array(3)

  constructor(normal: Float32Array, public distance: number) {
    Vec3.normalize(normal, this._normal)
  }

  get normal() {
    return this._normal
  }

  rayCast(ray: Ray) {
    const vdot = Vec3.dot(ray.direction, this.normal)
    if (approximately(vdot, 0)) {
      return 0
    }
    const ndot = -Vec3.dot(ray.origin, this.normal) - this.distance
    return ndot / vdot
  }
}