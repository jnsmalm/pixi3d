import { Container3D } from "../container"

/**
 * Represents a joint used for vertex skinning.
 */
export class Joint extends Container3D {
  /**
   * Creates a new joint.
   * @param inverseBindMatrix The inverse of the global transform matrix.
   */
  constructor(readonly inverseBindMatrix: Float32Array) {
    super()
  }
}
