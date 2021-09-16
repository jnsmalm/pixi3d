import * as PIXI from "pixi.js"

import { glTFAsset } from "../gltf/gltf-asset"
import { glTFResourceLoader } from "../gltf/gltf-resource-loader"

export const glTFLoader = {
  use: function (resource: PIXI.ILoaderResource, next: () => void) {
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

class glTFExternalResourceLoader implements glTFResourceLoader {
  constructor(private _loader: PIXI.Loader, private _resource: PIXI.ILoaderResource) {
  }

  load(uri: string, onComplete: (resource: PIXI.ILoaderResource) => void) {
    const url = this._resource.url.substring(
      0, this._resource.url.lastIndexOf("/") + 1) + uri

    if (!this._loader.resources[url]) {
      // The resource does not exists and needs to be loaded.
      // @ts-ignore
      this._loader.add({ parentResource: this._resource, url, onComplete })
    } else if (this._loader.resources[url].data) {
      // The resource already exists, just use that one.
      onComplete(this._loader.resources[url])
    } else {
      // The resource is in queue to be loaded, wait for it.
      let binding = this._loader.onProgress.add((_, resource) => {
        if (resource.url === url) {
          onComplete(resource); binding.detach()
        }
      })
    }
  }
}