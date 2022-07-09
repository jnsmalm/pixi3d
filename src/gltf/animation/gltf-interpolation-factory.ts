import { glTFLinear } from "./gltf-linear"
import { glTFCubicSpline } from "./gltf-cubic-spline"
import { glTFStep } from "./gltf-step"

export abstract class glTFInterpolationFactory {
  static create(type: string, input: ArrayLike<number>, output: ArrayLike<number>, stride: number) {
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