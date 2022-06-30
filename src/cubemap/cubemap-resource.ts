import { CubeResource } from "../resource/cube-resource"
import { Renderer } from "@pixi/core"
import { MipmapResource } from "./mipmap-resource"

export type MipmapResourceArray = [
  MipmapResource,
  MipmapResource,
  MipmapResource,
  MipmapResource,
  MipmapResource,
  MipmapResource
]

export class CubemapResource extends CubeResource {
  constructor(source: MipmapResourceArray, public levels = 1) {
    super(source)
  }

  style(renderer: Renderer) {
    let gl = renderer.gl
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    if (this.levels > 1) {
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    } else {
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
    return true
  }
}