import { BaseTexture, Texture } from "@pixi/core"
import { TextureTransform } from "../../texture/texture-transform"

/**
 * Represents a texture which can have a transform.
 */
export class StandardMaterialTexture extends Texture {
  /** The transform to use for this texture. */
  transform?: TextureTransform

  /**
   * Creates a new texture from the specified base texture.
   * @param baseTexture The base texture.
   * @param uvSet The uv set to use (0 or 1).
   */
  constructor(baseTexture: BaseTexture, public uvSet?: number) {
    super(baseTexture)
  }
}