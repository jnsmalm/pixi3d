import * as PIXI from "pixi.js"

import { MaterialRenderPass } from "./material-render-pass"
import { Mesh3D } from "../mesh/mesh"
import { ShadowRenderPass } from "../shadow/shadow-render-pass"
import { PostProcessingSprite, PostProcessingSpriteOptions } from "./post-processing-sprite"
import { Model } from "../model"
import { ShadowCastingLight } from "../shadow/shadow-casting-light"
import { RenderPass } from "./render-pass"
import { StandardMaterial } from "../material/standard/standard-material"

/**
 * The standard pipeline renders meshes using the specified render passes. The 
 * standard pipeline is created and used by default.
 */
export class StandardPipeline extends PIXI.ObjectRenderer {
  private _renderPasses: RenderPass[] = []
  private _meshes: Mesh3D[] = []
  private _materialPass: MaterialRenderPass
  private _shadowPass: ShadowRenderPass

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

    this._shadowPass = this.addRenderPass(new ShadowRenderPass(renderer, "shadow"))
    this._materialPass = this.addRenderPass(new MaterialRenderPass(renderer, "material"))

    renderer.on("prerender", () => {
      for (let pass of this._renderPasses) {
        if (pass.clear) { pass.clear() }
      }
    })
  }

  /**
   * Adds a render pass.
   * @param renderPass The pass to add.
   */
  addRenderPass<T extends RenderPass>(renderPass: T) {
    if (this._renderPasses.indexOf(renderPass) < 0) {
      this._renderPasses.push(renderPass)
    }
    return renderPass
  }

  /**
   * Removes a render pass.
   * @param renderPass The pass to remove.
   */
  removeRenderPass(renderPass: RenderPass) {
    const index = this._renderPasses.indexOf(renderPass)
    if (index >= 0) {
      this._renderPasses.splice(index, 1)
    }
  }

  /**
   * Creates a new post processing sprite and uses that to render to it's 
   * texture.
   * @param options The options when creating the sprite.
   */
  createPostProcessingSprite(options?: PostProcessingSpriteOptions) {
    const sprite =
      new PostProcessingSprite(this.renderer, options)
    this._materialPass.renderTexture = sprite.renderTexture
    return sprite
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
    for (let pass of this._renderPasses) {
      pass.render(this._meshes.filter(mesh => mesh.renderPasses.indexOf(pass.name) >= 0))
    }
    this._meshes = []
  }

  /**
   * Sorts the meshes by rendering order.
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

  /** The pass used for rendering shadows. */
  get shadowPass() {
    return this._shadowPass
  }

  /** The pass used for rendering materials. */
  get materialPass() {
    return this._materialPass
  }

  /**
   * Enables shadows for the specified object. Adds the render pass to the 
   * specified object and enables the standard material to use the casting light.
   * @param object The mesh or model to enable shadows for.
   * @param light The shadow casting light to associate with the 
   * object when using the standard material.
   */
  enableShadows(object: Mesh3D | Model, light?: ShadowCastingLight) {
    let meshes = object instanceof Model ? object.meshes : [object]
    for (let mesh of meshes) {
      if (light && mesh.material instanceof StandardMaterial) {
        mesh.material.shadowCastingLight = light
      }
      mesh.renderPasses.push(this._shadowPass.name)
    }
    if (light) {
      this._shadowPass.addShadowCastingLight(light)
    }
  }

  /**
   * Disables shadows for the specified object.
   * @param object The mesh or model to disable shadows for.
   */
  disableShadows(object: Mesh3D | Model) {
    let meshes = object instanceof Model ? object.meshes : [object]
    for (let mesh of meshes) {
      if (mesh.material instanceof StandardMaterial) {
        mesh.material.shadowCastingLight = undefined
      }
      const index = mesh.renderPasses.indexOf(this._shadowPass.name)
      if (index >= 0) {
        mesh.renderPasses.splice(index, 1)
      }
    }
  }
}

PIXI.Renderer.registerPlugin("pipeline", <any>StandardPipeline)