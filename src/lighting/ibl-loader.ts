import { CubeMipMapTexture } from "../cubemap/cube-mipmap"
import { ImageBasedLighting } from "./ibl"

const EXTENSION = "ibl"

export const ImageBasedLightingLoader = {
  use: (resource: any, next: () => void) => {
    if (resource.extension !== EXTENSION) {
      return next()
    }
    resource.ibl = new ImageBasedLighting(
      new CubeMipMapTexture(resource.data.diffuse),
      new CubeMipMapTexture(resource.data.specular))
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

if (PIXI) {
  PIXI.Loader.registerPlugin(ImageBasedLightingLoader)
}