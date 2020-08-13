import { Container3D } from "../container"

/**
 * Represents a joint used for vertex skinning.
 */
export class Joint {
  /**
   * Creates a new joint.
   * @param node The node container using this skin.
   * @param inverseBindMatrix The inverse of the global transform matrix.
   */
  constructor(public node: Container3D, public inverseBindMatrix: Float32Array) {
  }
}
