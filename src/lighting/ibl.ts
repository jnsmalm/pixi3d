import { CubeMipMapTexture } from "../cubemap/cube-mipmap"

export class ImageBasedLighting {
  constructor(public diffuse: PIXI.CubeTexture, public specular: CubeMipMapTexture, public brdf?: PIXI.Texture) {
    this.brdf = PIXI.Texture.from(require("../resources/brdf.png").default)
  }

  get renderable() {
    return this.diffuse && this.diffuse.valid && this.specular &&
      this.specular.valid && this.brdf && this.brdf.valid
  }
}