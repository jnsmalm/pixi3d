import type { Loader } from "@pixi/loaders"
import { settings } from "@pixi/settings"
import { Texture } from "@pixi/core"
import { Cubemap } from "../cubemap/cubemap"
import { CubemapFaces } from "../cubemap/cubemap-faces"
import { LoaderResourceResponseType } from "../compatibility/compatibility-version"
import { Compatibility } from "../compatibility/compatibility"
import { CubemapFormat } from "../cubemap/cubemap-format"

interface CubemapFileVersion {
  format: CubemapFormat
  mipmaps: string[]
}

class CubemapFileVersion1 implements CubemapFileVersion {
  constructor(private json: any) { }

  get format() {
    return CubemapFormat.ldr
  }

  get mipmaps(): string[] {
    return this.json
  }
}

class CubemapFileVersion2 implements CubemapFileVersion {
  constructor(private json: any) { }

  get format() {
    return <CubemapFormat>this.json.format
  }

  get mipmaps(): string[] {
    return <string[]>this.json.mipmaps
  }
}

namespace CubemapFileVersionSelector {
  export function getFileVersion(json: any): CubemapFileVersion {
    if (json.version === 2) {
      return new CubemapFileVersion2(json)
    }
    return new CubemapFileVersion1(json)
  }
}

export const CubemapLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== "cubemap") {
      return next()
    }
    const loader = <Loader><unknown>this
    const version = CubemapFileVersionSelector.getFileVersion(resource.data)
    const mipmaps = version.mipmaps.map(mipmap => {
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
          let cubemap = Cubemap.fromFaces(textures)
          cubemap.cubemapFormat = version.format
          resource.cubemap = cubemap
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
    const version = CubemapFileVersionSelector.getFileVersion(json)
    const mipmaps = version.mipmaps.map(mipmap => {
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
    let cubemap = Cubemap.fromFaces(textures)
    cubemap.cubemapFormat = version.format
    return cubemap
  },
}

Compatibility.installLoaderPlugin("cubemap", CubemapLoader)