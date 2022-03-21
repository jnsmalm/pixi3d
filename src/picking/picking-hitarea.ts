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
  private _picking: PickingInteraction

  /** The id which maps to the object. */
  id = PickingId.next()

  /**
   * Creates a new hitarea using the specified object.
   * @param renderer The renderer to use.
   * @param object The model or mesh to use as the shape for hit testing.
   * @param camera The camera to use when rendering the object picking shape.
   * If not set, the main camera will be used as default.
   */
  constructor(renderer: Renderer, public object: Mesh3D | Model, public camera?: Camera) {
    this._picking = renderer.plugins.picking
  }

  contains(x: number, y: number) {
    return this._picking.containsHitArea(x, y, this)
  }

  /**
   * Creates a new hitarea using the specified object with camera's main renderer
   * @param object
   */
  static fromObject(object: Mesh3D | Model): PickingHitArea {
    return new PickingHitArea(Camera.main.renderer, object)
  }
}
