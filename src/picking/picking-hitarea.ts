import * as PIXI from "pixi.js"

import { PickingManager } from "./picking-manager"
import { Mesh3D } from "../mesh/mesh"
import { Model } from "../model"
import { PickingId } from "./picking-id"
import { Camera } from "../camera/camera"

/**
 * Hit area which uses the shape of an object to determine interaction.
 */
export class PickingHitArea implements PIXI.IHitArea {
  private _manager: PickingManager

  /** The id which maps to the object. */
  id = PickingId.next()

  /**
   * Creates a new hitarea using the specified object.
   * @param renderer The renderer to use.
   * @param object The model or mesh to test for interaction.
   * @param camera The camera to use when rendering the object.
   */
  constructor(renderer: PIXI.Renderer, public object: Mesh3D | Model, public camera?: Camera) {
    this._manager = (<any>renderer.plugins).picking
  }

  contains(x: number, y: number) {
    return this._manager.containsHitArea(x, y, this)
  }
}