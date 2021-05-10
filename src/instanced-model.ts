import * as PIXI from "pixi.js"

import { InstancedMesh3D } from "./mesh/instanced-mesh"
import { Container3D } from "./container"

export class InstancedModel extends Container3D {
  constructor(readonly meshes: InstancedMesh3D[]) {
    super()
    for (let mesh of meshes) {
      this.addChild(mesh)
    }
  }

  destroy(options: boolean | PIXI.IDestroyOptions | undefined) {
    super.destroy(options)
    for (let mesh of this.meshes) {
      mesh.destroy(options)
    }
  }
}