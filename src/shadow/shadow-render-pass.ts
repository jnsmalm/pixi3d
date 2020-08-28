import * as PIXI from "pixi.js"

import { RenderPass } from "../renderer/render-pass"
import { Mesh3D } from "../mesh/mesh"
import { MeshShader } from "../mesh/mesh-shader"
import { ShadowFilter } from "./shadow-filter"
import { ShadowCastingLight } from "./shadow-casting-light"
import { Model } from "../model"
import { StandardMaterial } from "../material/standard/standard-material"

/**
 * Pass used for rendering shadows.
 */
export class ShadowRenderPass implements RenderPass {
  private _filter: ShadowFilter
  private _shader: MeshShader
  private _state = Object.assign(new PIXI.State(), {
    depthTest: true, clockwiseFrontFace: false, culling: true, blendMode: PIXI.BLEND_MODES.NONE
  })

  /** An array of shadow casting lights. */
  lights: ShadowCastingLight[] = []

  /**
   * Creates a new shadow render pass using the specified renderer and adds it 
   * to the standard renderer.
   * @param renderer The renderer to use.
   * @param name The name for the render pass.
   */
  static addAsRenderPass(renderer: PIXI.Renderer, name = "shadow") {
    let shadowRenderPass = new ShadowRenderPass(renderer, name)
    // @ts-ignore
    renderer.plugins.mesh3d.renderPasses.splice(0, 0, shadowRenderPass)
    return shadowRenderPass
  }

  /**
   * Creates a new shadow render pass using the specified renderer.
   * @param renderer The renderer to use.
   * @param name The name for the render pass.
   */
  constructor(public renderer: PIXI.Renderer, public name = "shadow") {
    this._filter = new ShadowFilter(renderer)
    this._shader = new MeshShader(PIXI.Program.from(
      require("./shader/shadow.vert").default,
      require("./shader/shadow.frag").default
    ))
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
        this._shader.uniforms.u_World = mesh.worldTransform.toArray()
        this._shader.uniforms.u_ViewProjection = shadowCastingLight.lightViewProjection
        this._shader.render(mesh, this.renderer, this._state)
      }
      this.renderer.renderTexture.bind(undefined)
      if (shadowCastingLight.softness > 0) {
        this._filter.applyGaussianBlur(shadowCastingLight)
      }
    }
  }
}