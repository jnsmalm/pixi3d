import { Loader, LoaderResource } from "@pixi/loaders"
import { Texture } from "@pixi/core"
import { Cubemap } from "../cubemap/cubemap"
import { CubemapFaces } from "../cubemap/cubemap-faces"

export const CubemapLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== "cubemap") {
      return next()
    }
    let loader = <Loader><unknown>this

    const mipmaps = (<string[]>resource.data).map(mipmap => {
      return Cubemap.faces.map(face => {
        return resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + mipmap.replace("{{face}}", face)
      })
    })

    // The list of urls (faces and mipmaps) which needs to be loaded before the 
    // cubemap should be created.
    let urls = mipmaps.reduce((acc, val) => acc.concat(val), [])

    loader.add(urls.filter(url => !loader.resources[url]).map((url) => {
      return { parentResource: resource, url: url }
    }))
    let completed = 0

    // Listen for resources being loaded.
    let binding = loader.onLoad.add((loader: any, res: any) => {
      if (urls.includes(res.url)) {
        if (++completed === urls.length) {
          // All resources used by cubemap has been loaded.
          const textures = mipmaps.map(face => {
            return <CubemapFaces>{
              posx: Texture.from(face[0]),
              negx: Texture.from(face[1]),
              posy: Texture.from(face[2]),
              negy: Texture.from(face[3]),
              posz: Texture.from(face[4]),
              negz: Texture.from(face[5]),
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
    LoaderResource.setExtensionXhrType(
      "cubemap", LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

Loader.registerPlugin(CubemapLoader)