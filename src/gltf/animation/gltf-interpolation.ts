/**
 * Represents a specific interpolation method.
 */
export interface glTFInterpolation {
  /**
   * Interpolates within an animation frame and returns the output.
   * @param frame The animation frame to interpolate.
   * @param position The position within the animation frame (between 0-1).
   */
  interpolate(frame: number, position: number): Float32Array
}