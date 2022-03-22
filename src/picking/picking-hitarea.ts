import { IHitArea, Renderer } from "pixi.js"
import { PickingInteraction } from "./picking-interaction"
import { Mesh3D } from "../mesh/mesh"
import { Model } from "../model"
import { PickingId } from "./picking-id"
import { Camera } from "../camera/camera"

/**
 * Hit area which uses the shape of an object to determine interaction.
 */
export class PickingHitArea implements IHitArea {
  
  /** The id which maps to the object. */
  id = PickingId.next()

  /**
   * Creates a new hitarea using the specified object.
   * @param renderer The renderer to use.
   * @param object The model or mesh to use as the shape for hit testing.
   * @param camera The camera to use when rendering the object picking shape.
   * If not set, the main camera will be used as default.
   */
  constructor(renderer: Renderer | undefined, public object: Mesh3D | Model, public camera?: Camera) {
  }

  contains(x: number, y: number) {
    return PickingInteraction.main.containsHitArea(x, y, this)
  }

  /**
   * Creates a new hitarea using the specified object.
   * @param object The model or mesh to use as the shape for hit testing.
   */
  static fromObject(object: Mesh3D | Model) {
    return new PickingHitArea(undefined, object)
  }
}
