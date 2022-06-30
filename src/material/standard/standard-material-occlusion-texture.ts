import { BaseTexture } from "@pixi/core"
import { StandardMaterialTexture } from "./standard-material-texture"

/**
 * Represents a texture which holds specific data for a occlusion map.
 */
export class StandardMaterialOcclusionTexture extends StandardMaterialTexture {
  /**
   * Creates a new texture from the specified base texture.
   * @param baseTexture The base texture.
   * @param strength The strength of the occlusion.
   * @param uvSet The uv set to use (0 or 1).
   */
  constructor(baseTexture: BaseTexture, public strength?: number, public uvSet?: number) {
    super(baseTexture, uvSet)
  }
}