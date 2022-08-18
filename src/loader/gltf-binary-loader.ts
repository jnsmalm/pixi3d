import { ILoaderResource, LoaderResource } from "@pixi/loaders"
import { glTFAsset } from "../gltf/gltf-asset"
import { Compatibility } from "../compatibility/compatibility"

export const glTFBinaryLoader = {
  use: function (resource: ILoaderResource, next: () => void) {
    if (resource.extension !== "glb") {
      return next()
    }
    if (glTFAsset.isValidBuffer(resource.data)) {
      glTFAsset.fromBuffer(resource.data, gltf => {
        Object.assign(resource, { gltf }); next()
      })
    } else {
      return next()
    }
  },
  add: function () {
    LoaderResource.setExtensionXhrType(
      "glb", LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
}

Compatibility.installLoaderPlugin("cubemap", glTFBinaryLoader)