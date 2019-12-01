import { CubeMapResource } from "./cubemap-loader"
import { ImageMipMapResource } from "./image-mipmap"

export class CubeMipMapTexture extends PIXI.CubeTexture {
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

  style(renderer: any) {
    let gl = renderer.gl

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

    if (renderer.context.webGLVersion === 2) {
      // Setting the base/max level of mipmap makes it look much better, 
      // but it's only available in webgl 2.
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_BASE_LEVEL, 0)
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LEVEL, this.levels - 1)
    }
    return true
  }
}