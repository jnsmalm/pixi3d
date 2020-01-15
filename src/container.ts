import { Transform3D } from "./transform"
import { ObservableQuaternion } from "./quaternion"

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

  get scale() {
    return this.transform.scale
  }

  set rotation(value: ObservableQuaternion | Float32Array) {
    this.transform.rotation.copyFrom(value)
  }

  get rotation(): ObservableQuaternion | Float32Array {
    return this.transform.rotation
  }
}