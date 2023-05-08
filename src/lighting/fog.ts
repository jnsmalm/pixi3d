import { Color } from "../color"

export class Fog {
  constructor(public near = 5, public far = 50, public color = new Color(1, 1, 1)) {
  }
}