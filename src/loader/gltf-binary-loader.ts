import { ILoaderResource, LoaderResource, Loader } from "pixi.js"
import { glTFAsset } from "../gltf/gltf-asset"

export const glTFBinaryLoader = {
  use: function (resource: ILoaderResource, next: () => void) {
    if (resource.extension !== "glb") {
      return next()
    }
    if (glTFAsset.isValidBuffer(resource.data)) {
      glTFAsset.fromBuffer(resource.data, (gltf) => {
        Object.assign(resource, { gltf })
      })
    }
    next()
  },
  add: function () {
    LoaderResource.setExtensionXhrType(
      "glb", LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
}

Loader.registerPlugin(glTFBinaryLoader)