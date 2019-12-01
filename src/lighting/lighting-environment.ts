import { PointLight } from "./pointlight"
import { ImageBasedLighting } from "./ibl"

export class LightingEnvironment {
  lights: PointLight[] = []

  constructor(public ibl?: ImageBasedLighting) { }

  static main = new LightingEnvironment()

  createPointLight(x = 0, y = 0, z = 0, color = [1, 1, 1]) {
    this.lights.push(new PointLight(x, y, z, color))
    return this.lights[this.lights.length - 1]
  }
}