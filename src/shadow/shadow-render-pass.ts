import { Renderer } from "@pixi/core"
import { RenderPass } from "../pipeline/render-pass"
import { Mesh3D } from "../mesh/mesh"
import { ShadowFilter } from "./shadow-filter"
import { ShadowCastingLight } from "./shadow-casting-light"
import { ShadowRenderer } from "./shadow-renderer"

/**
 * Pass used for rendering shadows.
 */
export class ShadowRenderPass implements RenderPass {
  private _lights: ShadowCastingLight[] = []
  private _filter: ShadowFilter
  private _shadow: ShadowRenderer

  /**
   * Creates a new shadow render pass using the specified renderer.
   * @param renderer The renderer to use.
   * @param name The name for the render pass.
   */
  constructor(public renderer: Renderer, public name = "shadow") {
    this._filter = new ShadowFilter(renderer)
    this._shadow = new ShadowRenderer(renderer)
  }

  /**
   * Adds a shadow casting light.
   * @param shadowCastingLight The light to add.
   */
  addShadowCastingLight(shadowCastingLight: ShadowCastingLight) {
    if (this._lights.indexOf(shadowCastingLight) < 0) {
      this._lights.push(shadowCastingLight)
    }
  }

  /**
   * Removes a shadow casting light.
   * @param shadowCastingLight The light to remove.
   */
  removeShadowCastingLight(shadowCastingLight: ShadowCastingLight) {
    const index = this._lights.indexOf(shadowCastingLight)
    if (index >= 0) {
      this._lights.splice(index, 1)
    }
  }

  clear() {
    for (let shadowCastingLight of this._lights) {
      shadowCastingLight.clear()
    }
  }

  render(meshes: Mesh3D[]) {
    if (meshes.length === 0 || this._lights.length === 0) {
      return
    }
    const current = this.renderer.renderTexture.current
    for (let shadowCastingLight of this._lights) {
      this.renderer.renderTexture.bind(shadowCastingLight.shadowTexture)
      shadowCastingLight.updateLightViewProjection()
      for (let mesh of meshes) {
        this._shadow.render(mesh, shadowCastingLight)
      }
      if (shadowCastingLight.softness > 0) {
        this._filter.applyGaussianBlur(shadowCastingLight)
      }
    }
    this.renderer.renderTexture.bind(current || undefined)
  }
}