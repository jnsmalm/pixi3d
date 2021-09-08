/**
 * Represents different billboard types.
 */
export enum SpriteBillboardType {
  /**
   * Sprite will be rotated towards the viewer on both the x-plane and y-plane.
   */
  Spherical = "spherical",
  /**
   * Sprite will be rotated towards the viewer on the y-plane.
   */
  Cylindrical = "cylindrical",
}