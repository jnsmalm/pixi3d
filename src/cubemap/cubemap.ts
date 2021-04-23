import * as PIXI from "pixi.js"

import { MipmapResource } from "./mipmap-resource"
import { CubemapResource, MipmapResourceArray } from "./cubemap-resource"
import { Color } from "../color"
import { BufferResource } from "../pixi/buffer-resource"
import { CubemapFaces } from "./cubemap-faces"

/**
 * Cubemap which supports multiple user specified mipmaps.
 */
export class Cubemap extends PIXI.BaseTexture<CubemapResource> {

  /** Returns an array of faces. */
  static get faces(): ["posx", "negx", "posy", "negy", "posz", "negz"] {
    return ["posx", "negx", "posy", "negy", "posz", "negz"]
  }

  /** Returns the number of mipmap levels. */
  get levels() {
    return this.resource.levels
  }

  /**
   * Creates a new cubemap from the specified faces.
   * @param faces The faces to create the cubemap from.
   */
  static fromFaces(faces: CubemapFaces | CubemapFaces[]) {
    const array = Array.isArray(faces) ? faces : [faces]
    const resources = <MipmapResourceArray>Cubemap.faces.map((face, index) => {
      return new MipmapResource(array.map(f => f[face]),
        PIXI.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index)
    })
    return new Cubemap(
      new CubemapResource(resources, array.length))
  }

  /**
   * Creates a new cubemap from the specified colors.
   * @param posx The color for positive x.
   * @param negx The color for negative x.
   * @param posy The color for positive y.
   * @param negy The color for negative y.
   * @param posz The color for positive z.
   * @param negz The color for negative z.
   */
  static fromColors(posx: Color, negx = posx, posy = posx, negy = posx, posz = posx, negz = posx) {
    const resources: MipmapResource[] = []
    const colors = [posx, negx, posy, negy, posz, negz]

    for (let i = 0; i < colors.length; i++) {
      let resource = new BufferResource(
        new Uint8Array(colors[i].rgba), { width: 1, height: 1 })
      let texture = new PIXI.Texture(new PIXI.BaseTexture(resource, {
        type: PIXI.TYPES.UNSIGNED_BYTE,
        format: PIXI.FORMATS.RGB,
        alphaMode: PIXI.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      }))
      resources.push(new MipmapResource([texture],
        PIXI.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i))
    }
    return new Cubemap(
      new CubemapResource(<MipmapResourceArray>resources, 1))
  }
}