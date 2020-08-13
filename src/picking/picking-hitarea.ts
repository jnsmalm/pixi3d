import { PickingManager } from "./picking-manager"
import { Mesh3D } from "../mesh/mesh"
import { Model } from "../model"
import { PickingId } from "./picking-id"

/**
 * Hit area which uses the shape of a mesh to determine interaction. Only works 
 * correctly when the specified mesh is rendered using the main camera.
 */
export class PickingHitArea implements PIXI.IHitArea {
  private _manager: PickingManager

  /** The id which maps to the mesh. */
  id = PickingId.next()

  /**
   * Creates a new hitarea using the specified mesh.
   * @param renderer The renderer which has the picking manager plugin.
   * @param object The model or mesh to test for interaction.
   */
  constructor(renderer: PIXI.Renderer, public object: Mesh3D | Model) {
    this._manager = (<any>renderer.plugins).picking
  }

  contains(x: number, y: number) {
    return this._manager.containsHitArea(x, y, this)
  }
}