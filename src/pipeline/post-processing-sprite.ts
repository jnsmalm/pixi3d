import * as PIXI from "pixi.js"

interface PostProcessingSpriteOptions { width?: number, height?: number }

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

  /**
   * Creates a new post processing sprite using the specified options.
   * @param renderer The renderer to use.
   * @param options The options for the render texture. If both width and height
   * has not been set, it will automatically be resized to the renderer size.
   */
  constructor(renderer: PIXI.Renderer, options?: PostProcessingSpriteOptions) {
    let { width = 512, height = 512 } = options || {}
    let renderTexture = PIXI.RenderTexture.create({ width, height })

    /* When rendering to a texture, it's flipped vertically for some reason. 
    This will flip it back to it's expected orientation. */
    renderTexture.rotate = 8

    // @ts-ignore
    renderTexture.baseTexture.framebuffer.addDepthTexture()
    super(renderTexture)
    this._renderTexture = renderTexture

    if (!options || !options.width || !options.height) {
      renderer.on("prerender", () => {
        this._renderTexture.resize(renderer.width, renderer.height)
      })
    }
  }
}