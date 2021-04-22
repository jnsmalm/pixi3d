import { Color } from "../color"
import { Container3D } from "../container"
import { LightType } from "./light-type"

export class Light extends Container3D {
  /** The type of the light. */
  type = LightType.point

  /** The color of the light. */
  color = new Color(1, 1, 1)

  /** The range of the light. */
  range = 10

  /** The intensity of the light. */
  intensity = 10

  /** The inner cone angle specified in degrees. */
  innerConeAngle = 0

  /** The outer cone angle specified in degrees. */
  outerConeAngle = 45
}