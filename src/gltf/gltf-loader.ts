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
  constructor(public loader: PIXI.Loader, public resource: PIXI.LoaderResource) {
    //
  }

  load(uri: string, onComplete: (resource: PIXI.LoaderResource) => void) {
    this.loader.add({
      parentResource: this.resource,
      url: this.resource.url.substring(0, this.resource.url.lastIndexOf("/") + 1) + uri,
      onComplete: onComplete
    })
  }
}