import * as PIXI from "pixi.js"

import { Light } from "../lighting/light"
import { LightType } from "../lighting/light-type"
import { Camera } from "../camera/camera"
import { Platform } from "../platform"
import { ShadowTexture } from "./shadow-texture"
import { ShadowQuality } from "./shadow-quality"
import { ShadowMath } from "./shadow-math"

/**
 * Contains the required components used for rendering a shadow casted by a light.
 */
export class ShadowCastingLight {
  private _shadowTexture: PIXI.RenderTexture
  private _filterTexture: PIXI.RenderTexture
  private _lightViewProjection = new Float32Array(16)

  /** The light view projection matrix. */
  get lightViewProjection() {
    return this._lightViewProjection
  }

  /** The camera to follow when using directional lights. */
  camera?: Camera

  /**
   * Value indicating if the shadow should follow the specified camera. If the 
   * camera is not set, the main camera will be used as default. Only available 
   * when using directional lights.
   */
  followCamera = true

  /**
   * The rendered shadow texture.
   */
  get shadowTexture() {
    return this._shadowTexture
  }

  /**
   * The rendered filter texture.
   */
  get filterTexture() {
    return this._filterTexture
  }

  /**
   * Creates a new shadow casting light used for rendering a shadow texture.
   * @param renderer The renderer to use.
   * @param light The light which is casting the shadow.
   * @param shadowTextureSize The size (width/height) in pixels for the shadow 
   * texture. Increasing the size will improve the quality of the shadow.
   * @param shadowArea The area in units of the shadow when using directional 
   * lights. Reducing the area will improve the quality of the shadow.
   * @param softness The softness of the edges of the shadow.
   * @param quality The quality (precision) of the shadow. If the quality is not 
   * supported by current platform, a lower quality will be selected instead.
   */
  constructor(public renderer: PIXI.Renderer, public light: Light, shadowTextureSize: number, public shadowArea: number, public softness = 0, quality = ShadowQuality.medium) {
    if (light.type === LightType.point) {
      throw new Error("PIXI3D: Only directional and spot lights are supported as shadow casters.")
    }
    this._shadowTexture = ShadowTexture.create(renderer, shadowTextureSize, quality)
    this._shadowTexture.baseTexture.framebuffer.addDepthTexture()
    this._filterTexture = ShadowTexture.create(renderer, shadowTextureSize, quality)
  }

  /**
   * Destroys the shadow casting light and it's used resources.
   */
  destroy() {
    this._shadowTexture.destroy(true)
    this._filterTexture.destroy(true)
  }

  /**
   * Clears the rendered shadow texture.
   */
  clear() {
    this.renderer.renderTexture.bind(this._shadowTexture)
    this.renderer.renderTexture.clear([0, 0, 0, 0], this.renderer.gl.COLOR_BUFFER_BIT | this.renderer.gl.DEPTH_BUFFER_BIT)
    this.renderer.renderTexture.bind(undefined)
  }

  /**
   * Updates the light view projection matrix.
   */
  updateLightViewProjection() {
    if (this.light.type === LightType.directional) {
      ShadowMath.calculateDirectionalLightViewProjection(this)
    } else if (this.light.type === LightType.spot) {
      ShadowMath.calculateSpotLightViewProjection(this)
    }
  }

  /**
   * Returns a value indicating if medium quality (16-bit precision) shadows is 
   * supported by current platform.
   * @param renderer The renderer to use.
   */
  static isMediumQualitySupported(renderer: PIXI.Renderer) {
    return Platform.isHalfFloatFramebufferSupported(renderer)
  }

  /**
   * Returns a value indicating if high quality (32-bit precision) shadows is 
   * supported by current platform.
   * @param renderer The renderer to use.
   */
  static isHighQualitySupported(renderer: PIXI.Renderer) {
    return Platform.isFloatFramebufferSupported(renderer)
  }
}