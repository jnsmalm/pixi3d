import * as PIXI from "pixi.js"

import { MipmapResource } from "./mipmap-resource"
import { CubeMipmapResource } from "./cube-mipmap-resource"

/**
 * Cubemap texture which supports multiple user specified mipmaps.
 */
export class CubeMipmapTexture extends PIXI.BaseTexture {
  
  /** Returns an array of faces. */
  static get faces() {
    return ["posx", "negx", "posy", "negy", "posz", "negz"]
  }

  /** Returns the number of mipmap levels. */
  get levels() {
    return (<CubeMipmapResource>this.resource).levels
  }

  /**
   * Creates a new cubemap texture from the specified source.
   * @param source The array of mipmap sources. The format of the mipmap source 
   * should be "cubemap_{{face}}.jpg". "{{face}}" will automatically be
   * replaced with the faces (posx, negx, posy, negy, posz, negz). 
   */
  static fromSource(source: string[]) {
    let resources = CubeMipmapTexture.faces.map((face, index) => {
      let textures = source.map((val) => {
        return PIXI.Texture.from(val.replace("{{face}}", face))
      })
      return new MipmapResource(textures,
        PIXI.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index)
    })
    return new CubeMipmapTexture(
      new CubeMipmapResource(resources, source.length))
  }
}