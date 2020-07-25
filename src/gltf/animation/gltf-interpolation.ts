/**
 * Represents a specific interpolation method.
 */
export abstract class glTFInterpolation {
  /**
   * Interpolates within an animation frame and returns the output.
   * @param frame The animation frame to interpolate.
   * @param position The position within the animation frame (between 0-1).
   */
  abstract interpolate(frame: number, position: number): Float32Array

  static from(type: string, input: ArrayLike<number>, output: ArrayLike<number>, stride: number) {
    switch (type) {
      case "LINEAR": {
        return new glTFLinear(output, stride)
      }
      case "CUBICSPLINE": {
        return new glTFCubicSpline(input, output, stride)
      }
      case "STEP": {
        return new glTFStep(output, stride)
      }
    }
    throw new Error(`PIXI3D: Unknown interpolation type "${type}"`)
  }
}

// Fixes circular dependency in webpack
import { glTFLinear } from "./gltf-linear"
import { glTFCubicSpline } from "./gltf-cubic-spline"
import { glTFStep } from "./gltf-step"