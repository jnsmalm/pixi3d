import type { ILoaderResource } from "@pixi/loaders"
import { glTFAsset } from "../gltf/gltf-asset"
import { Compatibility } from "../compatibility/compatibility"
import { LoaderResourceResponseType } from "../compatibility/compatibility-version"

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
    Compatibility.setLoaderResourceExtensionType("glb",
      LoaderResourceResponseType.buffer)
  }
}

Compatibility.installLoaderPlugin("cubemap", glTFBinaryLoader)