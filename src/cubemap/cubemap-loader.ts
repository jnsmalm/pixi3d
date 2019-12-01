import { CubeMipMapTexture } from "./cube-mipmap"

export interface CubeMapResource { source: string, mipmap?: string[] }

const EXTENSION = "cubemap"

export const CubeMapLoader = {
  use: (resource: any, next: () => void) => {
    if (resource.extension !== EXTENSION) {
      return next()
    }
    resource.texture = new CubeMipMapTexture(resource.data)
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

if (PIXI) {
  PIXI.Loader.registerPlugin(CubeMapLoader)
}