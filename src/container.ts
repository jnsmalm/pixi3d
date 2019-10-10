import { Transform3D } from "./transform"

export class Container3D extends PIXI.Container {
  transform = new Transform3D()

  get z() {
    return this.transform.position.z
  }

  set z(value: number) {
    this.transform.position.z = value
  }
}