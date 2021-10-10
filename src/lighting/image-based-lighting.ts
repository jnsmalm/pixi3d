import { Texture, MIPMAP_MODES } from "pixi.js"
import { Cubemap } from "../cubemap/cubemap"

/**
 * Collection of components used for image-based lighting (IBL), a
 * rendering technique which involves capturing an omnidirectional representation
 * of real-world light information as an image.
 */
export class ImageBasedLighting {
  private _diffuse: Cubemap
  private _specular: Cubemap

  /** The default BRDF integration map lookup texture. */
  static defaultLookupBrdf = Texture.from(require("./assets/lut-ggx.png").default, {
    mipmap: MIPMAP_MODES.OFF
  })

  /** Cube texture used for the diffuse component. */
  get diffuse() {
    return this._diffuse
  }

  /** Cube mipmap texture used for the specular component. */
  get specular() {
    return this._specular
  }

  /** BRDF integration map lookup texture. */
  lookupBrdf?: Texture

  /**
   * Creates a new image-based lighting object.
   * @param diffuse Cubemap used for the diffuse component.
   * @param specular Cubemap used for the specular component.
   */
  constructor(diffuse: Cubemap, specular: Cubemap) {
    this._diffuse = diffuse
    this._specular = specular
  }

  /**
   * Value indicating if this object is valid to be used for rendering.
   */
  get valid() {
    return this._diffuse.valid &&
      this._specular.valid && (!this.lookupBrdf || this.lookupBrdf.valid)
  }
}