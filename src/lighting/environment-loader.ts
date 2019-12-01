import { CubeMipMapTexture } from "../cubemap/cube-mipmap"
import { LightingEnvironment } from "../light"

const EXTENSION = "lightenv"

export const EnvironmentLoader = {
  use: (resource: any, next: () => void) => {
    if (resource.extension !== EXTENSION) {
      return next()
    }
    let lightingEnvironment = new LightingEnvironment()
    lightingEnvironment.radianceTexture =
      new CubeMipMapTexture(resource.data.specular)
    lightingEnvironment.irradianceTexture =
      new CubeMipMapTexture(resource.data.diffuse)
    resource.lightingEnvironment = lightingEnvironment
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

if (PIXI) {
  PIXI.Loader.registerPlugin(EnvironmentLoader)
}