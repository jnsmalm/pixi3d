import { Container3D } from "../container"
import { LightType } from "./light-type"

export class Light extends Container3D {
  type = LightType.point
  direction = [0, 0, -1]
  color = [1, 1, 1]
  range = 10
  padding = [0, 0]
  intensity = 10
  innerConeAngle = 0
  outerConeAngle = Math.PI / 4

  get worldPosition() {
    // Make sure the transform has been updated in the case where the light is
    // not part of the stage hierarchy.
    if (!this.parent) {
      this.transform.updateTransform()
    }
    return this.transform.worldTransform.position
  }
}