import { Renderer, RenderTexture, SCALE_MODES, TYPES } from "pixi.js"
import { Capabilities } from "../capabilities"
import { ShadowQuality } from "./shadow-quality"

export namespace ShadowTexture {
  export function create(renderer: Renderer, size: number, quality: ShadowQuality) {
    let type = getSupportedType(renderer, quality)
    return RenderTexture.create({
      width: size, height: size, type: type, scaleMode: getSupportedScaleMode(renderer)
    })
  }

  function getSupportedScaleMode(renderer: Renderer) {
    if (Capabilities.supportsFloatLinear(renderer)) {
      return SCALE_MODES.LINEAR
    }
    return SCALE_MODES.NEAREST
  }

  function getSupportedType(renderer: Renderer, quality: ShadowQuality) {
    if (quality === ShadowQuality.high) {
      if (Capabilities.isFloatFramebufferSupported(renderer)) {
        return TYPES.FLOAT
      }
      if (Capabilities.isHalfFloatFramebufferSupported(renderer)) {
        return TYPES.HALF_FLOAT
      }
    }
    if (quality === ShadowQuality.medium && Capabilities.isHalfFloatFramebufferSupported(renderer)) {
      return TYPES.HALF_FLOAT
    }
    return TYPES.UNSIGNED_BYTE
  }
}