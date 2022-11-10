import { RenderTexture, Renderer } from "@pixi/core"
import { DisplayObject, IDestroyOptions } from "@pixi/display"
import { Sprite } from "@pixi/sprite"
import { Ticker } from "@pixi/ticker"
import { Compatibility } from "../compatibility/compatibility"
import { CompositeSpriteOptions } from "./composite-sprite-options"

/**
 * Represents a sprite used for compositing a 3D object as a 2D sprite. Can be
 * used for post processing effects and filters.
 */
export class CompositeSprite extends Sprite {
  private _tickerRender = () => { }
  private _renderTexture: RenderTexture

  /** The render texture. */
  get renderTexture() {
    return this._renderTexture
  }

  /**
   * Creates a new composite sprite using the specified options.
   * @param renderer The renderer to use.
   * @param options The options for the render texture. If both width and height
   * has not been set, it will automatically be resized to the renderer size.
   */
  constructor(public renderer: Renderer, options?: CompositeSpriteOptions) {
    super()

    let {
      width = 512, height = 512, objectToRender, resolution = 1
    } = options || {}

    this._renderTexture = RenderTexture.create({ width, height, resolution })
    /* When rendering to a texture, it's flipped vertically for some reason.
    This will flip it back to it's expected orientation. */
    this._renderTexture.rotate = 8
    this._renderTexture.baseTexture.framebuffer.depth = true
    this._texture = this._renderTexture

    if (!options || !options.width || !options.height) {
      renderer.on("prerender", () => {
        this._renderTexture.resize(renderer.screen.width, renderer.screen.height)
      })
    }
    if (objectToRender) {
      this._tickerRender = () => {
        if (Compatibility.isRendererDestroyed(renderer)) {
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
    Compatibility.render(this.renderer, object, this.renderTexture)
  }
}