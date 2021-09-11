import * as PIXI from "pixi.js"

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
  objectToRender?: PIXI.DisplayObject
}

/**
 * Represents a sprite which has post processing effects. Can be used for 
 * rendering 3D objects as 2D sprites.
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
      return this._renderTexture.baseTexture.framebuffer.depthTexture
    }
  }

  /**
   * Creates a new post processing sprite using the specified options.
   * @param renderer The renderer to use.
   * @param options The options for the render texture. If both width and height
   * has not been set, it will automatically be resized to the renderer size.
   */
  constructor(public renderer: PIXI.Renderer, options?: PostProcessingSpriteOptions) {
    super()

    let { width = 512, height = 512, objectToRender } = options || {}

    this._renderTexture = PIXI.RenderTexture.create({ width, height })
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
      PIXI.Ticker.shared.add(() => {
        if (this.worldVisible && this.worldAlpha > 0 && this.renderable) {
          objectToRender && this.renderObject(objectToRender)
        }
      })
    }
  }

  /**
   * Updates the sprite's texture by rendering the specified object to it.
   * @param object The object to render.
   */
  renderObject(object: PIXI.DisplayObject) {
    this.renderer.render(object, this._renderTexture)
  }
}