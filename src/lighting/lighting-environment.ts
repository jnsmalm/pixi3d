import { Renderer, IRendererPlugin } from "@pixi/core"
import { ImageBasedLighting } from "./image-based-lighting"
import { Light } from "./light"

/**
 * A lighting environment represents the different lighting conditions for a 
 * specific object or an entire scene.
 */
export class LightingEnvironment implements IRendererPlugin {
  /** The image-based lighting object. */
  imageBasedLighting?: ImageBasedLighting

  /** The lights affecting this lighting environment. */
  lights: Light[] = []

  /** The main lighting environment which is used by default. */
  static main: LightingEnvironment

  /**
   * Creates a new lighting environment using the specified renderer.
   * @param renderer The renderer to use.
   */
  constructor(public renderer: Renderer, imageBasedLighting?: ImageBasedLighting) {
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
    this.imageBasedLighting = imageBasedLighting
  }

  destroy() {
  }

  /** Value indicating if this object is valid to be used for rendering. */
  get valid() {
    return !this.imageBasedLighting || this.imageBasedLighting.valid
  }
}

Renderer.registerPlugin("lighting", LightingEnvironment)