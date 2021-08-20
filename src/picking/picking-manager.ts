import * as PIXI from "pixi.js"

import { PickingHitArea } from "./picking-hitarea"
import { PickingMap } from "./picking-map"

/**
 * Manages the picking hit areas by keeping track on which hit areas needs to 
 * be checked for interaction. Renders the hit area meshes to a texture which
 * is then used to map a mesh to a x/y coordinate. The picking manager is 
 * registered as a renderer plugin.
 */
export class PickingManager implements PIXI.IRendererPlugin {
  private _map: PickingMap
  private _hitAreas: PickingHitArea[] = []

  /**
   * Creates a new picking manager using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: PIXI.Renderer) {
    this._map = new PickingMap(this.renderer, 128 * Math.floor(this.renderer.width / this.renderer.height), 128)

    renderer.on("postrender", () => {
      // Because of how PixiJS interaction works and the design of the picking,
      // the "hitTest" function needs to be called. Otherwise, in some 
      // circumstances; the picking is affected by in which order the interaction 
      // object was added to the heirarchy.
      this.renderer.plugins.interaction.hitTest(new PIXI.Point(0, 0))

      if (this._hitAreas.length === 0) { return }

      let width = Math.floor(this._map.height * (this.renderer.width / this.renderer.height))
      if (this._map.width !== width) {
        this._map.resize(width, this._map.height)
      }
      this._map.update(this._hitAreas); this._hitAreas = []
    })
  }

  destroy() {
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

PIXI.Renderer.registerPlugin("picking", <any>PickingManager)