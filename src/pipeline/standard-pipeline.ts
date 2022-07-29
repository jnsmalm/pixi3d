import { ObjectRenderer, Renderer } from "@pixi/core"
import { MaterialRenderPass } from "./material-render-pass"
import { Mesh3D } from "../mesh/mesh"
import { ShadowRenderPass } from "../shadow/shadow-render-pass"
import { PostProcessingSprite, PostProcessingSpriteOptions } from "../sprite/post-processing-sprite"
import { Model } from "../model"
import { ShadowCastingLight } from "../shadow/shadow-casting-light"
import { RenderPass } from "./render-pass"
import { StandardMaterial } from "../material/standard/standard-material"
import { MaterialRenderSortType } from "../material/material-render-sort-type"
import { Compatibility } from "../compatibility/compatibility"
import { SpriteBatchRenderer } from "../sprite/sprite-batch-renderer"
import { ProjectionSprite } from "../sprite/projection-sprite"

/**
 * The standard pipeline renders meshes using the set render passes. It's
 * created and used by default.
 */
export class StandardPipeline extends ObjectRenderer {
  protected _spriteRenderer: SpriteBatchRenderer
  protected _meshes: Mesh3D[] = []
  protected _sprites: ProjectionSprite[] = []

  /** The pass used for rendering materials. */
  materialPass = new MaterialRenderPass(this.renderer, "material")

  /** The pass used for rendering shadows. */
  shadowPass = new ShadowRenderPass(this.renderer, "shadow")

  /** The array of render passes. Each mesh will be rendered with these passes (if it has been enabled on that mesh). */
  renderPasses: RenderPass[] = [
    this.shadowPass, this.materialPass,
  ]

  /**
   * Creates a new standard pipeline using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: Renderer) {
    super(renderer)

    renderer.on("prerender", () => {
      for (let pass of this.renderPasses) {
        if (pass.clear) { pass.clear() }
      }
    })

    this._spriteRenderer = new SpriteBatchRenderer(renderer)
  }

  /**
   * Creates a new post processing sprite and sets the material pass to render
   * to it's texture.
   * @param options The options when creating the sprite.
   */
  createPostProcessingSprite(options?: PostProcessingSpriteOptions) {
    const sprite =
      new PostProcessingSprite(this.renderer, options)
    this.materialPass.renderTexture = sprite.renderTexture
    return sprite
  }

  /**
   * Adds an object to be rendered.
   * @param object The object to render.
   */
  render(object: Mesh3D | ProjectionSprite) {
    if (object.isSprite) {
      this._sprites.push(<ProjectionSprite>object)
    } else {
      this._meshes.push(<Mesh3D>object)
    }
  }

  /**
   * Renders the added meshes using the specified render passes.
   */
  flush() {
    this.sort()
    for (let pass of this.renderPasses) {
      pass.render(this._meshes.filter(mesh => mesh.isRenderPassEnabled(pass.name)))
    }
    this._meshes = []

    if (this._sprites.length > 0) {
      this._spriteRenderer.start()
      for (let sprite of this._sprites) {
        // @ts-ignore
        this._spriteRenderer.render(sprite)
      }
      this._spriteRenderer.stop()
      this._sprites = []
    }
  }

  /**
   * Sorts the meshes by rendering order.
   */
  sort() {
    this._meshes.sort((a, b) => {
      if (!a.material || !b.material) {
        return 0
      }
      if (a.material.renderSortType !== b.material.renderSortType) {
        return a.material.renderSortType === MaterialRenderSortType.transparent ? 1 : -1
      }
      if (a.renderSortOrder === b.renderSortOrder) {
        return 0
      }
      return a.renderSortOrder < b.renderSortOrder ? -1 : 1
    })
  }

  /**
   * Enables shadows for the specified object. Adds the shadow render pass to 
   * the specified object and enables the standard material to use the casting 
   * light.
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
      mesh.enableRenderPass(this.shadowPass.name)
    }
    if (light) {
      this.shadowPass.addShadowCastingLight(light)
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
      mesh.disableRenderPass(this.shadowPass.name)
    }
  }
}

Compatibility.installRendererPlugin("pipeline", StandardPipeline)