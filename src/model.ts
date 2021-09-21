import { glTFParser } from "./gltf/gltf-parser"
import { glTFAsset } from "./gltf/gltf-asset"
import { MaterialFactory } from "./material/material-factory"
import { Mesh3D } from "./mesh/mesh"
import { Animation } from "./animation"
import { Container3D } from "./container"
import { InstancedModel } from "./instanced-model"

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
}