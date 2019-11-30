import { CubeMipMapTexture } from "./cube-mipmap"

export interface CubeMapResource { source: string, mipmap?: string[] }

export const CubeMapLoader = {
  use: (resource: any, next: () => void) => {
    if (resource.extension !== "cubemap") {
      return next()
    }
    resource.texture = new CubeMipMapTexture(resource.data)
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      "cubemap", PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}