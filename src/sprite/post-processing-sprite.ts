import { RenderTexture, Renderer } from "@pixi/core"
import { DisplayObject, IDestroyOptions } from "@pixi/display"
import { Sprite } from "@pixi/sprite"
import { Ticker } from "@pixi/ticker"

export interface PostProcessingSpriteOptions {
  /**
   * The width of the texture for the sprite.
   */
  width?: number,
  /**
   * The height of the texture for the sprite.
   */
  height?: number,
  /**
   * The object to render. When set, it will automatically be rendered to the 
   * sprite's texture each frame.
   */
  objectToRender?: DisplayObject,
  /**
   * The resolution of the texture for the sprite.
   */
  resolution?: number
}

/**
 * Represents a sprite which can have post processing effects. Can be used for 
 * rendering 3D objects as 2D sprites.
 */
export class PostProcessingSprite extends Sprite {
  private _tickerRender = () => { }
  private _renderTexture: RenderTexture

  /** The render texture. */
  get renderTexture() {
    return this._renderTexture
  }

  /** The depth texture. */
  get depthTexture() {
    if (this._renderTexture) {
      return this._renderTexture.baseTexture.framebuffer.depthTexture
    }
  }

  /**
   * Creates a new post processing sprite using the specified options.
   * @param renderer The renderer to use.
   * @param options The options for the render texture. If both width and height
   * has not been set, it will automatically be resized to the renderer size.
   */
  constructor(public renderer: Renderer, options?: PostProcessingSpriteOptions) {
    super()

    let {
      width = 512, height = 512, objectToRender, resolution = 1
    } = options || {}

    this._renderTexture = RenderTexture.create({ width, height, resolution })
    /* When rendering to a texture, it's flipped vertically for some reason.
    This will flip it back to it's expected orientation. */
    this._renderTexture.rotate = 8
    this._renderTexture.baseTexture.framebuffer.addDepthTexture()
    this._texture = this._renderTexture

    if (!options || !options.width || !options.height) {
      renderer.on("prerender", () => {
        this._renderTexture.resize(renderer.screen.width, renderer.screen.height)
      })
    }
    if (objectToRender) {
      this._tickerRender = () => {
        if (!renderer.gl) {
          // The renderer was probably destroyed.
          Ticker.shared.remove(this._tickerRender); return
        }
        if (this.worldVisible && this.worldAlpha > 0 && this.renderable) {
          objectToRender && this.renderObject(objectToRender)
        }
      }
      Ticker.shared.add(this._tickerRender)
    }
  }

  /**
   * Sets the resolution of the render texture.
   * @param resolution The resolution to set.
   */
  setResolution(resolution: number) {
    this._renderTexture.setResolution(resolution)
    this._renderTexture.resize(
      this._renderTexture.width, this._renderTexture.height, true)
  }

  destroy(options?: boolean | IDestroyOptions) {
    Ticker.shared.remove(this._tickerRender); super.destroy(options)
  }

  /**
   * Updates the sprite's texture by rendering the specified object to it.
   * @param object The object to render.
   */
  renderObject(object: DisplayObject) {
    this.renderer.render(object, this._renderTexture)
  }
}