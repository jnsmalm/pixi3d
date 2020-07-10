import * as PIXI from "pixi.js"

import { glTFAsset, glTFAssetResourceLoader } from "./gltf-asset"

const EXTENSION = "gltf"

export const glTFLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== EXTENSION) {
      return next()
    }
    // @ts-ignore This function is bound to loader
    resource.gltf = glTFAsset.load(resource.data, new glTFExternalResourceLoader(this, resource))
    next()
  },
  add: function () {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

PIXI.Loader.registerPlugin(glTFLoader)

class glTFExternalResourceLoader implements glTFAssetResourceLoader {
  constructor(public loader: PIXI.Loader, public parentResource: PIXI.LoaderResource) {
    //
  }

  load(uri: string, onComplete: (resource: PIXI.LoaderResource) => void) {
    this.loader.add({
      parentResource: this.parentResource,
      url: this.parentResource.url.substring(0, this.parentResource.url.lastIndexOf("/") + 1) + uri,
      onComplete: onComplete
    })
  }
}