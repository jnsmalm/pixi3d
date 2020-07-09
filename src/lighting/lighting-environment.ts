import { ImageBasedLighting } from "./ibl"
import { Light } from "./light"

/**
 * A lighting environment represents the different lighting conditions for a 
 * specific object or an entire scene.
 */
export class LightingEnvironment {
  private _ibl?: ImageBasedLighting

  /** Lights affecting this lighting environment. */
  lights: Light[] = []

  /**
   * Creates a new lighting environment.
   * @param ibl Settings when using image-based lighting (IBL).
   */
  constructor(ibl?: ImageBasedLighting) {
    this._ibl = ibl
  }

  /** Settings when using image-based lighting (IBL). */
  get ibl() {
    return this._ibl
  }

  /**
   * Value indicating if this object is valid to be used for rendering.
   */
  get valid() {
    return !this._ibl || this._ibl.valid
  }

  /** The main lighting environment which is used by default. */
  static main = new LightingEnvironment()
}