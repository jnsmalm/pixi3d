import * as PIXI from "pixi.js"

const EXTENSIONS = ["glsl", "vert", "frag"]

export const ShaderSourceLoader = {
  use: (resource: any, next: () => void) => {
    if (!EXTENSIONS.includes(resource.extension)) {
      return next()
    }
    resource.source = resource.data
    next()
  },
  add: () => {
    for (let ext of EXTENSIONS) {
      PIXI.LoaderResource.setExtensionXhrType(
        ext, PIXI.LoaderResource.XHR_RESPONSE_TYPE.TEXT)
    }
  }
}

PIXI.Loader.registerPlugin(ShaderSourceLoader)