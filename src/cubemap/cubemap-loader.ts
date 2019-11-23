import { CubeMipMapResource } from "./cube-mipmap"
import { ImageMipMapResource } from "./image-mipmap"

export interface CubeMapResource { source: string, mipmap?: string[] }

export const CubeMapLoader = {
  use: (resource: any, next: () => void) => {
    if (resource.extension !== "cubemap") {
      return next()
    }
    let faces = createFacesResource(resource.data)
    if (resource.data.mipmap) {
      ImageMipMapResource.install()
      resource.texture = new PIXI.CubeTexture(
        new CubeMipMapResource(faces, resource.data.mipmap.length))
    } else {
      resource.texture = PIXI.CubeTexture.from(
        faces.map((value) => { return value.source }))
    }
    next()
  },
  add: () => {
    PIXI.LoaderResource.setExtensionXhrType(
      "cubemap", PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
}

const FACES = ["posx", "negx", "posy", "negy", "posz", "negz"]

function createFacesResource(data: CubeMapResource): CubeMapResource[] {
  return FACES.map((value) => {
    let result: CubeMapResource = {
      source: data.source.replace("{{face}}", value),
      mipmap: []
    }
    if (data.mipmap && data.mipmap.length > 0) {
      for (let i = 0; i < data.mipmap.length; i++) {
        let url = data.mipmap[i].replace("{{face}}", value)
        if (result.mipmap) {
          result.mipmap.push(url)
        }
      }
    }
    return result
  })
}