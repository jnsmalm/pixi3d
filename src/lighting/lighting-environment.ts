import * as PIXI from "pixi.js"

import { ImageBasedLighting } from "./image-based-lighting"
import { Light } from "./light"

/**
 * A lighting environment represents the different lighting conditions for a 
 * specific object or an entire scene.
 */
export class LightingEnvironment {
  private _imageBasedLighting?: ImageBasedLighting

  /** The lights affecting this lighting environment. */
  lights: Light[] = []

  /** The main lighting environment which is used by default. */
  static main: LightingEnvironment

  /**
   * Creates a new lighting environment using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: PIXI.Renderer, imageBasedLighting?: ImageBasedLighting) {
    // @ts-expect-error
    this.renderer.on("prerender", () => {
      for (let light of this.lights) {
        // Make sure the transform has been updated in the case where the light
        // is not part of the stage hierarchy.
        if (!light.parent) {
          light.transform.updateTransform()
        }
      }
    })
    if (!LightingEnvironment.main) {
      LightingEnvironment.main = this
    }
    this._imageBasedLighting = imageBasedLighting
  }

  get imageBasedLighting() {
    return this._imageBasedLighting
  }

  /** Value indicating if this object is valid to be used for rendering. */
  get valid() {
    return !this._imageBasedLighting || this._imageBasedLighting.valid
  }
}

PIXI.Renderer.registerPlugin("lighting", <any>LightingEnvironment)