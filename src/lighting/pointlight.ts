import { Transform3D } from "../transform"

export class PointLight extends PIXI.DisplayObject {
  transform = new Transform3D()

  constructor(x = 0, y = 0, z = 0, public color = [1, 1, 1]) {
    super()
    this.position.set(x, y, z)
  }

  get position() {
    return this.transform.position
  }

  get worldPosition() {
    // Make sure the transform has been updated in the case where the light is
    // not part of the stage hierarchy.
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    return this.transform.worldTransform.position
  }
}