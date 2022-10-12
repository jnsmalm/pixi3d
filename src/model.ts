import { glTFParser } from "./gltf/gltf-parser"
import { glTFAsset } from "./gltf/gltf-asset"
import { MaterialFactory } from "./material/material-factory"
import { Mesh3D } from "./mesh/mesh"
import { Animation } from "./animation"
import { Container3D } from "./container"
import { InstancedModel } from "./instanced-model"
import { AABB } from "./math/aabb"

/**
 * Represents a model which has been loaded from a file. Contains a hierarchy of meshes and animations.
 */
export class Model extends Container3D {
  /** The animations included in the model. */
  animations: Animation[] = []

  /**
   * The meshes included in the model. Note that this array and the actual 
   * childen are not automatically synchronized after the model has been loaded.
   */
  meshes: Mesh3D[] = []


  setMeshInstancesOnly(value: boolean) {
    this.meshes.forEach((mesh) => mesh.instanceOnly = value);
  }

  /**
   * Creates a new model from a source.
   * @param source The source to create the model from.
   * @param materialFactory The factory to use for creating materials.
   */
  static from(source: glTFAsset, materialFactory?: MaterialFactory) {
    return glTFParser.createModel(source, materialFactory)
  }

  /**
   * Creates a new instance of this model.
   */
  createInstance() {
    return new InstancedModel(this)
  }

  /**
   * Calculates and returns a axis-aligned bounding box of the model in world
   * space. The bounding box will encapsulate the meshes included in the model.
   */
  getBoundingBox() {
    this.updateTransform()

    let aabb = new AABB()
    let mesh = this.meshes[0].getBoundingBox()
    if (mesh) {
      aabb.min = mesh.min
      aabb.max = mesh.max
    }
    for (let i = 1; i < this.meshes.length; i++) {
      let mesh = this.meshes[i].getBoundingBox()
      if (mesh) {
        aabb.encapsulate(mesh.min)
        aabb.encapsulate(mesh.max)
      }
    }
    return aabb
  }
}