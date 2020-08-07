import * as PIXI from "pixi.js"

import { glTFAsset, glTFAssetResourceLoader } from "../gltf/gltf-asset"

export const glTFLoader = {
  use: function (resource: PIXI.LoaderResource, next: () => void) {
    if (resource.extension !== "gltf") {
      return next()
    }
    let loader = <PIXI.Loader><unknown>this
    Object.assign(resource, {
      gltf: glTFAsset.load(resource.data, new glTFExternalResourceLoader(loader, resource))
    })
    next()
  },
  add: function () {
    PIXI.LoaderResource.setExtensionXhrType(
      "bin", PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
    PIXI.LoaderResource.setExtensionXhrType(
      "gltf", PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

PIXI.Loader.registerPlugin(glTFLoader)

class glTFExternalResourceLoader implements glTFAssetResourceLoader {
  constructor(private _loader: PIXI.Loader, private _resource: PIXI.LoaderResource) {
  }

  load(uri: string, onComplete: (resource: PIXI.LoaderResource) => void) {
    this._loader.add({
      parentResource: this._resource,
      url: this._resource.url.substring(
        0, this._resource.url.lastIndexOf("/") + 1) + uri,
      onComplete: onComplete
    })
  }
}