import * as PIXI from "pixi.js"

import { MipMapResource } from "./mipmap-resource"

/**
 * Cubemap texture which supports multiple user specified mipmaps.
 */
export class CubeMipMapTexture extends PIXI.BaseTexture {
  
  /** Gets an array of faces. */
  static get faces() {
    return ["posx", "negx", "posy", "negy", "posz", "negz"]
  }

  /** Gets the number of mipmap levels. */
  get levels() {
    return (<CubeMipMapResource>this.resource).levels
  }

  /**
   * Creates a cubemap texture from the specified source.
   * @param source Array with faces which contains arrays of mipmap sources.
   */
  static fromSource(source: string[]) {
    let resources = CubeMipMapTexture.faces.map((face, index) => {
      let textures = source.map((val) => {
        return PIXI.Texture.from(val.replace("{{face}}", face))
      })
      return new MipMapResource(textures,
        PIXI.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index)
    })
    return new CubeMipMapTexture(
      new CubeMipMapResource(resources, source.length))
  }
}

export class CubeMipMapResource extends PIXI.resources.CubeResource {
  constructor(source: MipMapResource[], public levels = 1) {
    super(source)
  }

  style(renderer: PIXI.Renderer) {
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