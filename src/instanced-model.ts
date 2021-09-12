import { Container3D } from "./container"
import { InstancedMesh3D } from "./mesh/instanced-mesh"
import { Model } from "./model"
import { Mesh3D } from "./mesh/mesh"

function clone(node: Container3D, parent: Container3D, meshes: InstancedMesh3D[]) {
  for (let child of node.children) {
    if (child instanceof Mesh3D) {
      const mesh = child.createInstance()
      mesh.name = child.name
      meshes.push(parent.addChild(mesh))
    }
    else if (child instanceof Container3D) {
      const copy = parent.addChild(new Container3D())
      copy.name = node.name
      copy.position = child.position
      copy.scale = child.scale
      copy.rotationQuaternion = child.rotationQuaternion
      clone(child, copy, meshes)
    }
  }
}

/**
 * Represents an instance of a model.
 */
export class InstancedModel extends Container3D {
  /** The meshes included in the model. */
  meshes: InstancedMesh3D[] = []

  /**
   * Creates a new model instance from the specified model.
   * @param model The model to create instance from.
   */
  constructor(model: Model) {
    super()
    clone(model, this, this.meshes)
  }
}