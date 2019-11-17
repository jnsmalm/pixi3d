import { Transform3D } from "./transform"

export class Container3D extends PIXI.Container {
  constructor(public name?: string, public transform = new Transform3D()) {
    super()
  }

  get z() {
    return this.transform.position.z
  }

  set z(value: number) {
    this.transform.position.z = value
  }
}