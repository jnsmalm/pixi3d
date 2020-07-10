import * as PIXI from "pixi.js"

import { CubeMipMapTexture } from "./cube-mipmap"

export const CubeMapLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== "cubemap") {
      return next()
    }
    let loader = <PIXI.Loader>this
    let faces = CubeMipMapTexture.faces.map((face) => {
      return (<string[]>resource.data).map((mipmap) => {
        return mipmap.replace("{{face}}", face)
      })
    })
    // The list of urls (faces and mipmaps) which needs to be loaded before the 
    // cubemap should be created.
    let urls = faces.reduce((acc, val) => acc.concat(val), [])

    loader.add(urls.filter(url => !loader.resources[url]).map((url) => {
      return { parentResource: resource, url: url }
    }))
    let completed = 0
    let binding = loader.onLoad.add((loader: any, res: any) => {
      if (urls.includes(res.url)) {
        if (++completed === urls.length) {
          // All resources used by cubemap has been loaded.
          resource.texture = CubeMipMapTexture.fromSource(resource.data)
          binding.detach()
        }
      }
    })
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      "cubemap", PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

PIXI.Loader.registerPlugin(CubeMapLoader)