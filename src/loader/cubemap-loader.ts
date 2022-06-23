import * as PIXI from "pixi.js"

import { Cubemap } from "../cubemap/cubemap"
import { CubemapFaces } from "../cubemap/cubemap-faces"

export const CubemapLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== "cubemap") {
      return next()
    }
    let loader = <PIXI.Loader><unknown>this

    const mipmaps = (<string[]>resource.data).map(mipmap => {
      return Cubemap.faces.map(face => {
        return resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + mipmap.replace("{{face}}", face)
      })
    })

    // The list of urls (faces and mipmaps) which needs to be loaded before the 
    // cubemap should be created.
    let urls = mipmaps.reduce((acc, val) => acc.concat(val), [])

    loader.add(urls.filter(url => !loader.resources[url]).map((url) => {
      return { parentResource: resource, name: url, url: url }
    }))
    let completed = 0

    // Listen for resources being loaded.
    let binding = loader.onLoad.add((loader: any, res: any) => {
      if (urls.includes(res.name)) {
        if (++completed === urls.length) {
          // All resources used by cubemap has been loaded.
          const textures = mipmaps.map(face => {
            return <CubemapFaces>{
              posx: PIXI.Texture.from(face[0]),
              negx: PIXI.Texture.from(face[1]),
              posy: PIXI.Texture.from(face[2]),
              negy: PIXI.Texture.from(face[3]),
              posz: PIXI.Texture.from(face[4]),
              negz: PIXI.Texture.from(face[5]),
            }
          })
          resource.cubemap = Cubemap.fromFaces(textures)
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

PIXI.Loader.registerPlugin(CubemapLoader)