import { Container3D } from "./container"
import { Animation } from "./animation"
import { glTFParser } from "./gltf/parser"
import { glTFLoader } from "./gltf/loader"
import { Mesh3D } from "./mesh/mesh"
import { glTFResource } from "./gltf/gltf-resource"
import { MaterialFactory } from "./material"

/**
 * Represents a 3D model loaded from a source. The model consists of a 
 * hierarchy of meshes and animations.
 */
export class Model3D extends Container3D {

  /** Animations for the model. */
  animations: Animation[] = []

  /**
   * Creates a new model from a source.
   * @param source Source to create the model from.
   * @param materialFactory Factory from which to create the material for the
   * meshes of the model.
   */
  static from(source: glTFResource | string, materialFactory?: MaterialFactory) {
    let resource: glTFResource
    if (typeof source === "string") {
      resource = glTFLoader.resources[source]
      if (!resource) {
        throw Error(`PIXI3D: Could not find "${source}", was the file loaded?`)
      }
    } else {
      resource = source
    }
    return new glTFParser(resource, materialFactory).createModel()
  }

  /**
   * Gets an animation by it's name.
   * @param name Name of the animation.
   */
  getAnimationByName(name: string): Animation | undefined {
    for (let animation of this.animations) {
      if (animation.name === name) {
        return animation
      }
    }
  }

  /**
   * Gets a mesh by it's name.
   * @param name Name of the mesh.
   */
  getMeshByName(name: string, container = this): Mesh3D | undefined {
    for (let child of container.children) {
      if (child.name === name && child instanceof Mesh3D) {
        return child
      }
    }
    for (let child of container.children) {
      let result = this.getMeshByName(name, child)
      if (result) {
        return result
      }
    }
  }

  /**
   * Gets a child by it's name.
   * @param name Name of the child.
   */
  getChildByName(name: string, container = this): Container3D | undefined {
    for (let child of container.children) {
      if (child.name === name) {
        return child
      }
    }
    for (let child of container.children) {
      let result = this.getChildByName(name, child)
      if (result) {
        return result
      }
    }
  }
}