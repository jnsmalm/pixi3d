import * as PIXI from "pixi.js"

import { RenderPass } from "./render-pass"
import { Mesh3D } from "../mesh/mesh"
import { StandardPipeline } from "./standard-pipeline"

/**
 * Pass used for rendering materials.
 */
export class MaterialRenderPass implements RenderPass {
  private _renderTexture?: PIXI.RenderTexture

  private _transparent = [
    Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: true, depthTest: true
    }),
    Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: false, depthTest: true
    })
  ]

  private _default = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  private _doubleSided = Object.assign(new PIXI.State(), {
    culling: false, clockwiseFrontFace: true, depthTest: true
  })

  /** The color (r,g,b,a) used for clearing the render texture. If this value is empty, the render texture will not be cleared. */
  clearColor? = [0, 0, 0, 0]

  /** The texture used when rendering to a texture. */
  get renderTexture() {
    return this._renderTexture
  }

  set renderTexture(value: PIXI.RenderTexture | undefined) {
    this._renderTexture = value
  }

  /**
   * Creates a new material render pass.
   * @param renderer The renderer to use.
   * @param name The name of the render pass.
   */
  constructor(public renderer: PIXI.Renderer, public name: string) {
  }

  /**
   * Creates a new material render pass using the specified renderer and adds it 
   * to the standard pipeline.
   * @param renderer The renderer to use.
   * @param name The name for the render pass.
   */
  static addAsRenderPass(renderer: PIXI.Renderer, name: string) {
    let materialRenderPass = new MaterialRenderPass(renderer, name)
    let pipeline = StandardPipeline.from(renderer)
    pipeline.renderPasses.push(materialRenderPass)
    return materialRenderPass
  }

  clear() {
    if (this._renderTexture && this.clearColor) {
      this.renderer.renderTexture.bind(this._renderTexture)
      this.renderer.renderTexture.clear(this.clearColor)
      this.renderer.renderTexture.bind(undefined)
    }
  }

  render(meshes: Mesh3D[]) {
    if (this._renderTexture) {
      this.renderer.renderTexture.bind(this._renderTexture)
    }
    for (let mesh of meshes) {
      if (!mesh.material) { return }
      if (mesh.material.doubleSided && !mesh.material.transparent) {
        mesh.material.render(mesh, this.renderer, this._doubleSided)
      } else if (mesh.material.doubleSided) {
        mesh.material.render(mesh, this.renderer, this._transparent[0])
        mesh.material.render(mesh, this.renderer, this._transparent[1])
      } else {
        mesh.material.render(mesh, this.renderer, this._default)
      }
    }
    if (this._renderTexture) {
      this.renderer.renderTexture.bind(undefined)
    }
  }
}