import { BaseTexture } from "@pixi/core"
import { StandardMaterialTexture } from "./standard-material-texture"

/**
 * Represents a texture which holds specific data for a normal map.
 */
export class StandardMaterialNormalTexture extends StandardMaterialTexture {
  /**
   * Creates a new texture from the specified base texture.
   * @param baseTexture The base texture.
   * @param scale The scale of the normal.
   * @param uvSet The uv set to use (0 or 1).
   */
  constructor(baseTexture: BaseTexture, public scale?: number, public uvSet?: number) {
    super(baseTexture, uvSet)
  }
}