import { Color } from "../../color"
import { StandardMaterial } from "./standard-material"

/** Material for instanced meshes which uses the standard material. */
export class InstancedStandardMaterial {
  /** The base color of the material. */
  baseColor: Color

  /** Creates a new instanced standard material from the specified material. */
  constructor(material: StandardMaterial) {
    this.baseColor = new Color(...material.baseColor.rgba)
  }
}