import { Color } from "../../color"
import { StandardMaterial } from "./standard-material"

export class InstancedStandardMaterial {
  baseColor: Color

  constructor(material: StandardMaterial) {
    this.baseColor = new Color(...material.baseColor.rgba)
  }
}