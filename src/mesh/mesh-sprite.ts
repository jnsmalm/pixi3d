import * as PIXI from "pixi.js"

import { Container3D } from "../container"

export interface MeshSpriteOptions {
  /**
   * The width of the texture for the sprite.
   */
  width?: number,
  /**
   * The height of the texture for the sprite.
   */
  height?: number, 
  /**
   * Value indicating if the object should automatically be rendered each
   * frame. If not set, `renderObject()` has to be manually called.
   */
  autoRenderObject?: boolean
}

/**
 * Used for rendering 3D objects as 2D sprites.
 */
export class MeshSprite extends PIXI.Sprite {
  /**
   * Creates a new sprite using the specified 3D object.
   * @param renderer The renderer to use.
   * @param object The object to render as a sprite.
   */
  constructor(public renderer: PIXI.Renderer, public object: Container3D, { width = 256, height = 256, autoRenderObject = true }: MeshSpriteOptions = {}) {
    super(PIXI.RenderTexture.create({ width, height }));
    /* When rendering to a texture, it's flipped vertically for some reason. 
    This will flip it back to it's expected orientation. */
    this.texture.rotate = 8;
    (<PIXI.RenderTexture>this.texture).baseTexture.framebuffer.addDepthTexture()

    if (autoRenderObject) {
      PIXI.Ticker.shared.add(() => {
        this.renderObject()
      })
    }
  }

  /**
   * Updates the sprite's texture by rendering the set object to it.
   */
  renderObject() {
    this.renderer.render(this.object, <PIXI.RenderTexture>this.texture)
  }
}