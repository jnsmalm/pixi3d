import { BaseTexture, Texture, TARGETS, TYPES, FORMATS, ALPHA_MODES } from "pixi.js"
import { MipmapResource } from "./mipmap-resource"
import { CubemapResource, MipmapResourceArray } from "./cubemap-resource"
import { Color } from "../color"
import { CubemapFaces } from "./cubemap-faces"
import { BufferResource } from "../resource/buffer-resource"

/**
 * Cubemap which supports multiple user specified mipmaps.
 */
export class Cubemap extends BaseTexture<CubemapResource> {

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
        TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index)
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
        new Uint8Array(colors[i].rgba.map(c => c * 255)), { width: 1, height: 1 })
      let texture = new Texture(new BaseTexture(resource, {
        type: TYPES.UNSIGNED_BYTE,
        format: FORMATS.RGB,
        alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      }))
      resources.push(new MipmapResource([texture],
        TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i))
    }
    return new Cubemap(
      new CubemapResource(<MipmapResourceArray>resources, 1))
  }
}