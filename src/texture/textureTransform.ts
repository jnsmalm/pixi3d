import * as PIXI from "pixi.js"

import { Mat3 } from "../math/mat3"
import { KHR_texture_transform } from "./khrTextureTransform"

export class TextureTransform {
  private static _uvTransMat: Float32Array = new Float32Array(9)
  private static _uvRotMat: Float32Array = new Float32Array(9)
  private static _uvScaleMat: Float32Array = new Float32Array(9)

  /**
   * Calculates uv transform matrix based on "offset", "rotation" and "scale" 
   * parameters from extension data (if any), and attaches it to texture
   * @param KHR_texture_transform extension data from gltf file
   * @param texture Texture to attach generated matrix to
   */
  static calculateUVTransform(uvTransform: KHR_texture_transform, texture: PIXI.Texture) {
    TextureTransform._uvTransMat.set([1, 0, 0, 0, 1, 0, 0, 0, 1], 0)
    TextureTransform._uvRotMat.set([1, 0, 0, 0, 1, 0, 0, 0, 1], 0)
    TextureTransform._uvScaleMat.set([1, 0, 0, 0, 1, 0, 0, 0, 1], 0)

    if (uvTransform.rotation !== undefined) {
      const s = Math.sin(uvTransform.rotation)
      const c = Math.cos(uvTransform.rotation)
      TextureTransform._uvRotMat.set([c, s, 0, -s, c, 0, 0, 0, 1], 0)
    }
    if (uvTransform.scale !== undefined) {
      TextureTransform._uvScaleMat.set([uvTransform.scale[0], 0, 0, 0, uvTransform.scale[1], 0, 0, 0, 1], 0)
    }
    if (uvTransform.offset !== undefined) {
      TextureTransform._uvTransMat.set([1, 0, uvTransform.offset[0], 0, 1, uvTransform.offset[1], 0, 0, 1], 0)
    }

    let uvMatrix: Float32Array = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
    Mat3.multiply(TextureTransform._uvRotMat, TextureTransform._uvScaleMat, uvMatrix)
    Mat3.multiply(uvMatrix, TextureTransform._uvTransMat, uvMatrix);

    (<any>texture).uvTransform = uvMatrix
  }
}