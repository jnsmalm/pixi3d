import type { Loader } from "@pixi/loaders"
import { settings } from "@pixi/settings"
import { Texture } from "@pixi/core"
import { Cubemap } from "../cubemap/cubemap"
import { CubemapFaces } from "../cubemap/cubemap-faces"
import { LoaderResourceResponseType } from "../compatibility/compatibility-version"
import { Compatibility } from "../compatibility/compatibility"

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
          binding.detach(); next()
        }
      }
    })
  },
  add: function () {
    Compatibility.setLoaderResourceExtensionType("cubemap",
      LoaderResourceResponseType.json)
  },
  test(url: string): boolean {
    return url.includes(".cubemap")
  },
  async load(url: string): Promise<Cubemap> {
    if (!Compatibility.assets) {
      throw new Error("PIXI3D: This feature is only available when using PixiJS v7+")
    }
    const response = await settings.ADAPTER.fetch(url)
    const json = await response.json()
    const mipmaps = (<string[]>json).map(mipmap => {
      return Cubemap.faces.map(face => {
        return url.substring(0, url.lastIndexOf("/") + 1) + mipmap.replace("{{face}}", face)
      })
    })
    const textures: CubemapFaces[] = []
    for (let mipmap of mipmaps) {
      let faceMipMaps = <CubemapFaces>{
        posx: await Compatibility.assets.load<Texture>(mipmap[0]),
        negx: await Compatibility.assets.load<Texture>(mipmap[1]),
        posy: await Compatibility.assets.load<Texture>(mipmap[2]),
        negy: await Compatibility.assets.load<Texture>(mipmap[3]),
        posz: await Compatibility.assets.load<Texture>(mipmap[4]),
        negz: await Compatibility.assets.load<Texture>(mipmap[5]),
      }
      textures.push(faceMipMaps)
    }
    return Cubemap.fromFaces(textures)
  },
}

Compatibility.installLoaderPlugin("cubemap", CubemapLoader)