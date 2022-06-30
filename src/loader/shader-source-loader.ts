import { Loader, LoaderResource } from "@pixi/loaders"

const EXTENSIONS = ["glsl", "vert", "frag"]

export const ShaderSourceLoader = {
  use: (resource: any, next: () => void) => {
    if (!EXTENSIONS.includes(resource.extension)) {
      return next()
    }
    next()
  },
  add: () => {
    for (let ext of EXTENSIONS) {
      LoaderResource.setExtensionXhrType(
        ext, LoaderResource.XHR_RESPONSE_TYPE.TEXT)
    }
  }
}

Loader.registerPlugin(ShaderSourceLoader)