import * as PIXI from "pixi.js"

import { Platform } from "../../platform"

export class StandardMaterialMatrixTexture extends PIXI.Texture {
  private _buffer: Float32Array

  static isSupported(renderer: PIXI.Renderer) {
    return Platform.isFloatTextureSupported(renderer)
  }

  constructor(matrixCount: number) {
    let buffer = new Float32Array(matrixCount * 16);
    let resource = new PIXI.resources.BufferResource(buffer, {
      width: 4, height: matrixCount
    });
    super(new PIXI.BaseTexture(resource, {
      mipmap: PIXI.MIPMAP_MODES.OFF,
      wrapMode: PIXI.WRAP_MODES.CLAMP,
      scaleMode: PIXI.SCALE_MODES.NEAREST,
      format: PIXI.FORMATS.RGBA,
      type: PIXI.TYPES.FLOAT,
      alphaMode: PIXI.ALPHA_MODES.NO_PREMULTIPLIED_ALPHA
    }))
    this._buffer = buffer
  }

  updateBuffer(buffer: Float32Array) {
    for (let i = 0; i < buffer.length; i++) {
      // Normalize the values between 0 and 1 because textures can't have negative values
      this._buffer[i] = (buffer[i] + 1) / 2
    }
    this.baseTexture.resource.update()
  }
}