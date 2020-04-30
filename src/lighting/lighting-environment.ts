import { ImageBasedLighting } from "./ibl"
import { Light } from "./light"

/**
 * A lighting environment represents the different lighting conditions for a 
 * specific object or an entire scene.
 */
export class LightingEnvironment {

  /** Settings when using image-based lighting (IBL). */
  ibl?: ImageBasedLighting

  lights: Light[] = []

  /** The main lighting environment which is used by default. */
  static main = new LightingEnvironment()
}