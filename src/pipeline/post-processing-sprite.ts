import * as PIXI from "pixi.js"

export interface PostProcessingSpriteOptions { width?: number, height?: number }

/**
 * Represents a sprite which has post processing effects.
 */
export class PostProcessingSprite extends PIXI.Sprite {
  private _renderTexture: PIXI.RenderTexture

  /** The render texture. */
  get renderTexture() {
    return this._renderTexture
  }

  /** The depth texture. */
  get depthTexture() {
    if (this._renderTexture) {
      // @ts-ignore
      return <PIXI.BaseTexture>this._renderTexture.baseTexture.framebuffer.depthTexture
    }
  }

  private _fxaa = new PIXI.filters.FXAAFilter()

  /** The FXAA (Fast approximate anti-aliasing) filter.*/
  get fxaa() {
    return this._fxaa
  }

  /**
   * Creates a new post processing sprite using the specified options.
   * @param renderer The renderer to use.
   * @param options The options for the render texture. If both width and height
   * has not been set, it will automatically be resized to the renderer size.
   */
  constructor(renderer: PIXI.Renderer, options?: PostProcessingSpriteOptions) {
    super()

    let { width = 512, height = 512 } = options || {}

    this._renderTexture = PIXI.RenderTexture.create({ width, height })
    /* When rendering to a texture, it's flipped vertically for some reason. 
    This will flip it back to it's expected orientation. */
    this._renderTexture.rotate = 8
    // @ts-ignore
    this._renderTexture.baseTexture.framebuffer.addDepthTexture()

    this._fxaa.enabled = false

    this.texture = this._renderTexture
    this.filters = [this._fxaa]

    if (!options || !options.width || !options.height) {
      renderer.on("prerender", () => {
        this._renderTexture.resize(renderer.width, renderer.height)
      })
    }
  }
}