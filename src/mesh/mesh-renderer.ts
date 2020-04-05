import * as PIXI from "pixi.js"

import { Mesh3D } from "./mesh"

/**
 * Renders 3d meshes in sorted order.
 */
export class Mesh3DRenderer extends PIXI.ObjectRenderer {
  private _meshes: Mesh3D[] = []

  /**
   * Creates a new mesh renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: PIXI.Renderer) {
    super(renderer)
  }

  destroy() {
    (<any>this.renderer) = undefined
  }

  /**
   * Renders all added meshes in sorted order.
   */
  flush() {
    if (!this.renderer) {
      return
    }
    this.sort()
    for (let mesh of this._meshes) {
      mesh.material.render(mesh, this.renderer)
    }
    this._meshes = []
  }

  /**
   * Sorts all added meshes by material transparency.
   */
  sort() {
    this._meshes.sort((a, b) => {
      if (a.material.transparent === b.material.transparent) {
        return 0
      }
      return a.material.transparent ? 1 : -1
    })
  }

  /**
   * Adds a mesh to be rendered.
   * @param mesh Mesh to add.
   */
  render(mesh: Mesh3D) {
    this._meshes.push(mesh)
  }
}

PIXI.Renderer.registerPlugin("mesh3d", <any>Mesh3DRenderer)