import * as PIXI from "pixi.js"

const EXTENSION = "bin"

export const glTFBufferLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== EXTENSION) {
      return next()
    }
    next()
  },
  add: function () {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
}

PIXI.Loader.registerPlugin(glTFBufferLoader)