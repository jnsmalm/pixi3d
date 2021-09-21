import * as PIXI from "pixi.js"

import { ShadowQuality } from "./shadow-quality"
import { Capabilities } from "../capabilities"

export namespace ShadowTexture {
  export function create(renderer: PIXI.Renderer, size: number, quality: ShadowQuality) {
    let type = getSupportedType(renderer, quality)
    return PIXI.RenderTexture.create({
      width: size, height: size, type: type, scaleMode: getSupportedScaleMode(renderer)
    })
  }

  function getSupportedScaleMode(renderer: PIXI.Renderer) {
    if (Capabilities.supportsFloatLinear(renderer)) {
      return PIXI.SCALE_MODES.LINEAR
    }
    return PIXI.SCALE_MODES.NEAREST
  }

  function getSupportedType(renderer: PIXI.Renderer, quality: ShadowQuality) {
    if (quality === ShadowQuality.high) {
      if (Capabilities.isFloatFramebufferSupported(renderer)) {
        return PIXI.TYPES.FLOAT
      }
      if (Capabilities.isHalfFloatFramebufferSupported(renderer)) {
        return PIXI.TYPES.HALF_FLOAT
      }
    }
    if (quality === ShadowQuality.medium && Capabilities.isHalfFloatFramebufferSupported(renderer)) {
      return PIXI.TYPES.HALF_FLOAT
    }
    return PIXI.TYPES.UNSIGNED_BYTE
  }
}