import * as PIXI from "pixi.js"

import { RenderPass } from "../pipeline/render-pass"
import { Mesh3D } from "../mesh/mesh"
import { ShadowFilter } from "./shadow-filter"
import { ShadowCastingLight } from "./shadow-casting-light"
import { Model } from "../model"
import { StandardMaterial } from "../material/standard/standard-material"
import { ShadowRenderer } from "./shadow-renderer"

/**
 * Pass used for rendering shadows.
 */
export class ShadowRenderPass implements RenderPass {
  private _filter: ShadowFilter
  private _shadow: ShadowRenderer

  /** An array of shadow casting lights. */
  lights: ShadowCastingLight[] = []

  /**
   * Creates a new shadow render pass using the specified renderer.
   * @param renderer The renderer to use.
   * @param name The name for the render pass.
   */
  constructor(public renderer: PIXI.Renderer, public name = "shadow") {
    this._filter = new ShadowFilter(renderer)
    this._shadow = new ShadowRenderer(renderer)
  }

  /**
   * Enables shadows for the specified object. Adds the render pass to the 
   * specified object and enables the standard material to use the casting light.
   * @param object The mesh or model to enable shadows for.
   * @param shadowCastingLight The shadow casting light to associate with the 
   * object when using the standard material.
   */
  enableShadows(object: Mesh3D | Model, shadowCastingLight?: ShadowCastingLight) {
    let meshes = object instanceof Model ? object.meshes : [object]
    for (let mesh of meshes) {
      if (shadowCastingLight) {
        if (mesh.material instanceof StandardMaterial) {
          mesh.material.shadowCastingLight = shadowCastingLight
        }
      }
      mesh.renderPasses.push(this.name)
    }
  }

  clear() {
    for (let shadowCastingLight of this.lights) {
      shadowCastingLight.clear()
    }
  }

  render(meshes: Mesh3D[]) {
    for (let shadowCastingLight of this.lights) {
      this.renderer.renderTexture.bind(shadowCastingLight.shadowTexture)
      shadowCastingLight.updateLightViewProjection()
      for (let mesh of meshes) {
        this._shadow.render(mesh, shadowCastingLight)
      }
      this.renderer.renderTexture.bind(undefined)
      if (shadowCastingLight.softness > 0) {
        this._filter.applyGaussianBlur(shadowCastingLight)
      }
    }
  }
}