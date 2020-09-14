import * as PIXI from "pixi.js"

import { MaterialRenderPass } from "./material-render-pass"
import { Mesh3D } from "../mesh/mesh"
import { RenderPass } from "./render-pass"
import { ShadowRenderPass } from "../shadow/shadow-render-pass"

/**
 * The standard pipeline renders meshes using the specified render passes. The 
 * standard pipeline is created and used by default.
 */
export class StandardPipeline extends PIXI.ObjectRenderer {
  private _materialRenderPass: MaterialRenderPass
  private _meshes: Mesh3D[] = []
  private _shadowRenderPass: ShadowRenderPass

  /** The pass used for rendering shadows. */
  get shadowRenderPass() {
    return this._shadowRenderPass
  }

  /** The pass used for rendering materials. */
  get materialRenderPass() {
    return this._materialRenderPass
  }

  /** The passes used for rendering the meshes. */
  renderPasses: RenderPass[]

  /**
   * Returns the standard pipeline from the specified renderer.
   * @param renderer The renderer to use.
   */
  static from(renderer: PIXI.Renderer) {
    return <StandardPipeline>(<any>renderer.plugins).pipeline
  }

  /**
   * Creates a new standard pipeline using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: PIXI.Renderer) {
    super(renderer)

    this._shadowRenderPass = new ShadowRenderPass(renderer, "shadow")
    this._materialRenderPass = new MaterialRenderPass(renderer, "material")

    this.renderPasses = [this._shadowRenderPass, this._materialRenderPass]
    renderer.on("prerender", () => {
      for (let pass of this.renderPasses) {
        if (pass.clear) { pass.clear() }
      }
    })
  }

  /**
   * Adds a mesh to be rendered.
   * @param mesh Mesh to add.
   */
  render(mesh: Mesh3D) {
    this._meshes.push(mesh)
  }

  /**
   * Renders the added meshes using the specified render passes.
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
   * Sorts the meshes for rendering order.
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
}

PIXI.Renderer.registerPlugin("pipeline", <any>StandardPipeline)