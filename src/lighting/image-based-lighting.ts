import { Texture, MIPMAP_MODES } from "pixi.js"
import { Cubemap } from "../cubemap/cubemap"

/**
 * A collection of components used for image-based lighting (IBL).
 */
export class ImageBasedLighting {
  private _diffuse: Cubemap
  private _brdf: Texture
  private _specular: Cubemap

  /** Cube texture used for the diffuse component. */
  get diffuse() {
    return this._diffuse
  }

  /** BRDF integration map lookup texture. */
  get brdf() {
    return this._brdf
  }

  /** Cube mipmap texture used for the specular component. */
  get specular() {
    return this._specular
  }

  /**
   * Creates a new image-based lighting object.
   * @param diffuse Cube texture used for the diffuse component.
   * @param specular Cube mipmap texture used for the specular component.
   * @param brdf BRDF integration map lookup texture.
   */
  constructor(diffuse: Cubemap, specular: Cubemap, brdf?: Texture) {
    this._diffuse = diffuse
    this._brdf = brdf || Texture.from(require("./assets/lut-ggx.png").default, {
      mipmap: MIPMAP_MODES.OFF
    })
    this._specular = specular
  }

  /**
   * Value indicating if this object is valid to be used for rendering.
   */
  get valid() {
    return this._diffuse.valid && this._specular.valid && this._brdf.valid
  }
}