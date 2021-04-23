import * as PIXI from "pixi.js"

import { Cubemap } from "../cubemap/cubemap"

/**
 * A collection of components used for image-based lighting (IBL).
 */
export class ImageBasedLighting {
  private _diffuse: Cubemap
  private _brdf: PIXI.Texture
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
  constructor(diffuse: Cubemap, specular: Cubemap, brdf?: PIXI.Texture) {
    this._diffuse = diffuse
    this._brdf = brdf || PIXI.Texture.from(require("./assets/brdf.png").default)
    this._specular = specular
  }

  /**
   * Value indicating if this object is valid to be used for rendering.
   */
  get valid() {
    return this._diffuse.valid && this._specular.valid && this._brdf.valid
  }
}