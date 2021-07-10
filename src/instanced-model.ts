import * as PIXI from "pixi.js"

import { InstancedMesh3D } from "./mesh/instanced-mesh"
import { Container3D } from "./container"
import { Model } from "./model"
import { Mesh3D } from "./mesh/mesh"

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

  static from(model: Model) {
    const meshes: InstancedMesh3D[] = []
    const cloneChildren = <T extends Container3D>(node: Container3D, parent: T) => {
      for (let child of node.children) {
        if (child instanceof Mesh3D) {
          const mesh = child.createInstance()
          mesh.name = child.name
          meshes.push(parent.addChild(mesh))
        }
        else if (child instanceof Container3D) {
          const copy = new Container3D()
          copy.name = node.name
          copy.position = child.position
          copy.scale = child.scale
          copy.rotationQuaternion = child.rotationQuaternion
          parent.addChild(copy)
          cloneChildren(child, copy)
        }
      }
      return parent
    }
    return cloneChildren(model, new InstancedModel(meshes))
  }
}