import { IDestroyOptions } from "pixi.js"
import { Container3D } from "../container"
import { Mesh3D } from "./mesh"

export class InstancedMesh3D extends Container3D {
  constructor(readonly mesh: Mesh3D, readonly material: unknown) {
    super()
  }

  destroy(options: boolean | IDestroyOptions | undefined) {
    super.destroy(options)
    this.mesh.removeInstance(this)
  }
}