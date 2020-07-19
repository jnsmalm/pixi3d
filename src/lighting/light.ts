import { Container3D } from "../container"
import { LightType } from "./light-type"

export class Light extends Container3D {
  /** The type of the light. */
  type = LightType.point

  /** The direction of the light (only applicable when type is directional or spot). */
  direction = [0, 0, -1]

  /** The color of the light. */
  color = [1, 1, 1]

  /** The range of the light. */
  range = 10

  /** The intensity of the light. */
  intensity = 10

  /** The inner cone angle specified in radians. */
  innerConeAngle = 0

  /** The outer cone angle specified in radians. */
  outerConeAngle = Math.PI / 4
}