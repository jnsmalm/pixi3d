import * as PIXI from "pixi.js"

import { glTFAsset } from "../gltf/gltf-asset"

export const glTFBinaryLoader = {
  use: function (resource: PIXI.ILoaderResource, next: () => void) {
    if (resource.extension !== "glb") {
      return next()
    }
    if (glTFAsset.isValidBinary(resource.data)) {
      glTFAsset.fromBuffer(resource.data, (gltf) => {
        Object.assign(resource, { gltf })
      })
    }
    next()
  },
  add: function () {
    PIXI.LoaderResource.setExtensionXhrType(
      "glb", PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
}

PIXI.Loader.registerPlugin(glTFBinaryLoader)