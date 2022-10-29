import { Container } from '@pixi/display';

import { Quaternion } from "./transform/quaternion"
import { Transform3D } from "./transform/transform"
import { Point3D } from "./transform/observable-point"

/**
 * A container represents a collection of 3D objects.
 */
export class Container3D extends Container {
  transform = new Transform3D()

  set position(value: Point3D) {
    this.transform.position.copyFrom(value)
  }

  get position(): Point3D {
    return this.transform.position
  }

  set scale(value: Point3D) {
    this.transform.scale.copyFrom(value)
  }

  get scale(): Point3D {
    return this.transform.scale
  }

  set rotationQuaternion(value: Quaternion) {
    this.transform.rotationQuaternion.copyFrom(value)
  }

  /** The quaternion rotation of the object. */
  get rotationQuaternion(): Quaternion {
    return this.transform.rotationQuaternion
  }

  /** The position of the object on the z axis relative to the local 
   * coordinates of the parent. */
  get z() {
    return this.transform.position.z
  }

  set z(value: number) {
    this.transform.position.z = value
  }

  get localTransform() {
    return this.transform.localTransform
  }

  get worldTransform() {
    return this.transform.worldTransform
  }
}