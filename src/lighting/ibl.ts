import { CubeMipMapTexture } from "../cubemap/cube-mipmap"

export class ImageBasedLighting {
  constructor(public diffuse: PIXI.CubeTexture, public specular: CubeMipMapTexture, public brdf?: PIXI.Texture) {
    this.brdf = PIXI.Texture.from(require("../resources/brdf.png").default)
  }
}