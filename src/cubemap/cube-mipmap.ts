import * as PIXI from "pixi.js"

import { ImageMipMapResource } from "./image-mipmap"
import { CubeMapResource } from "./cubemap-loader"


export class CubeMipMapTexture extends PIXI.CubeTexture {
  private _valid?: boolean

  levels: number

  constructor(resource: CubeMapResource) {
    let faces = createFacesResource(resource)
    if (resource.mipmap && resource.mipmap.length > 0) {
      ImageMipMapResource.install()
      super(new CubeMipMapResource(faces, resource.mipmap.length))
      this.levels = resource.mipmap.length
    } else {
      super(new PIXI.resources.CubeResource(
        faces.map((value) => { return value.source })))
      this.levels = 0
    }
  }

  set valid(value: boolean) {
    // This value can never be set directly, it's only there for 
    // PIXI compatibility reasons.
  }

  get valid() {
    if (this._valid) {
      return true
    }
    let resource = this.resource as CubeMipMapResource
    for (let i = 0; i < resource.items.length; i++) {
      if (!resource.items[i].resource.valid) {
        return false
      }
    }
    return this._valid = true
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

export class CubeMipMapResource extends PIXI.resources.CubeResource {
  constructor(resources: any, public levels: number) {
    super(resources)
  }

  style(renderer: PIXI.Renderer) {
    let gl = renderer.gl

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

    return true
  }
}