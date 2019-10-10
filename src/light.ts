import { Transform3D } from "./transform"

export class DirectionalLight {
  transform = new Transform3D()

  constructor() {
    this.transform.position.z = 5
  }

  get position() {
    return this.transform.position
  }
}