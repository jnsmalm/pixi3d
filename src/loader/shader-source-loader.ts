import { LoaderResource } from "@pixi/loaders"
import { Compatibility } from "../compatibility/compatibility"

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

Compatibility.installLoaderPlugin("shader", ShaderSourceLoader)