import { CubeMipMapTexture } from "../cubemap/cube-mipmap"

/**
 * A collection of components used for image-based lighting (IBL).
 */
export class ImageBasedLighting {

  /**
   * Creates a new image based lighting object.
   * @param diffuse Cube texture used for the diffuse component.
   * @param specular Cube mipmap texture used for the specular component.
   * @param brdf BRDF integration map lookup texture.
   */
  constructor(public diffuse: PIXI.CubeTexture, public specular: CubeMipMapTexture, public brdf?: PIXI.Texture) {
    if (!this.brdf) {
      this.brdf = PIXI.Texture.from(require("./assets/brdf.png").default)
    }
  }

  /**
   * Value indicating if the image based lighting object is valid to be used 
   * for rendering.
   */
  get valid() {
    return this.diffuse && this.diffuse.valid && this.specular &&
      this.specular.valid && this.brdf && this.brdf.valid
  }
}