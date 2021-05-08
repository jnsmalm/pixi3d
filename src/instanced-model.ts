import { Container3D } from "./container"
import { InstancedMesh3D } from "./mesh/instanced-mesh"

export class InstancedModel extends Container3D {
  constructor(readonly meshes: InstancedMesh3D[]) {
    super()
    for (let mesh of meshes) {
      this.addChild(mesh)
    }
  }
}