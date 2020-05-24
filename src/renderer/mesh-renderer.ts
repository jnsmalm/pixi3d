import * as PIXI from "pixi.js"

import { Mesh3D } from "../mesh/mesh"
import { MaterialRenderPass } from "./material-renderpass"
import { MeshRenderPass } from "./mesh-renderpass"

/**
 * Renders 3d meshes using the specified render passes.
 */
export class MeshRenderer extends PIXI.ObjectRenderer {
  private _meshes: Mesh3D[] = []

  /** Passes used when rendering meshes. */
  renderPasses: MeshRenderPass[]

  /**
   * Creates a new standard renderer.
   * @param renderer Renderer to use.
   */
  constructor(public renderer: PIXI.Renderer) {
    super(renderer)

    renderer.on("prerender", () => {
      for (let pass of this.renderPasses) {
        if (pass.clear) {
          pass.clear()
        }
      }
    })

    this.renderPasses = [new MaterialRenderPass(renderer, "standard")]
  }

  /**
   * Renders added meshes using specified render passes.
   */
  flush() {
    this.sort()
    for (let pass of this.renderPasses) {
      pass.render(this._meshes.filter((mesh) => {
        return mesh.renderPasses.indexOf(pass.name) >= 0
      }))
    }
    this._meshes = []
  }

  /**
   * Sorts all added meshes by material transparency.
   */
  sort() {
    this._meshes.sort((a, b) => {
      if (!a.material || !b.material) {
        return 0
      }
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

PIXI.Renderer.registerPlugin("mesh3d", <any>MeshRenderer)