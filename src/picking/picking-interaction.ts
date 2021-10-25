import { IRendererPlugin, Renderer, Point, Ticker, UPDATE_PRIORITY } from "pixi.js"
import { PickingMap } from "./picking-map"
import { PickingHitArea } from "./picking-hitarea"

/**
 * Manages the picking hit areas by keeping track on which hit areas needs to 
 * be checked for interaction. Renders the hit area meshes to a texture which
 * is then used to map a mesh to a x/y coordinate. The picking manager is 
 * registered as a renderer plugin.
 */
export class PickingInteraction implements IRendererPlugin {
  private _map: PickingMap
  private _hitAreas: PickingHitArea[] = []

  /**
   * Creates a new picking manager using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: Renderer) {
    this._map = new PickingMap(this.renderer, 128)
    Ticker.shared.add(this._update, this, UPDATE_PRIORITY.LOW)
  }

  private _update() {
    if (!this.renderer.plugins) {
      return
    }
    // Because of how PixiJS interaction works and the design of the picking,
    // the "hitTest" function needs to be called. Otherwise, in some 
    // circumstances; the picking is affected by in which order the interaction 
    // object was added to the heirarchy.
    this.renderer.plugins.interaction.hitTest(new Point(0, 0))
    if (this._hitAreas.length > 0) {
      this._map.resizeToAspect()
      this._map.update(this._hitAreas); this._hitAreas = []
    }
  }

  destroy() {
    Ticker.shared.remove(this._update, this)
  }

  /**
   * Hit tests a area using the specified x/y coordinates.
   * @param x The x coordinate.
   * @param y The y coordinate.
   * @param hitArea The hit area to test.
   */
  containsHitArea(x: number, y: number, hitArea: PickingHitArea) {
    if (this._hitAreas.indexOf(hitArea) < 0) {
      this._hitAreas.push(hitArea)
    }
    return this._map.containsId(x, y, hitArea.id)
  }
}

Renderer.registerPlugin("picking", PickingInteraction)