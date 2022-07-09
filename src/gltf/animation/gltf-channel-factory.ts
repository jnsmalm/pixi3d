import { Mesh3D } from "../../mesh/mesh"
import { Container3D } from "../../container"
import { glTFInterpolationFactory } from "./gltf-interpolation-factory"
import { glTFRotation } from "./gltf-rotation"
import { glTFScale } from "./gltf-scale"
import { glTFSphericalLinear } from "./gltf-spherical-linear"
import { glTFTranslation } from "./gltf-translation"
import { glTFWeights } from "./gltf-weights"

export abstract class glTFChannelFactory {
  static create(input: ArrayLike<number>, output: ArrayLike<number>, interpolation: string, path: string, target: Container3D) {
    if (path === "translation") {
      return new glTFTranslation(target.transform, input,
        glTFInterpolationFactory.create(interpolation, input, output, 3))
    }
    if (path === "scale") {
      return new glTFScale(target.transform, input,
        glTFInterpolationFactory.create(interpolation, input, output, 3))
    }
    if (path === "rotation") {
      if (interpolation === "LINEAR") {
        return new glTFRotation(target.transform, input,
          new glTFSphericalLinear(output))
      }
      return new glTFRotation(target.transform, input,
        glTFInterpolationFactory.create(interpolation, input, output, 4))
    }
    if (path === "weights") {
      let weights = (<Mesh3D>target.children[0]).targetWeights
      if (!weights) {
        return undefined
      }
      return new glTFWeights(weights, input,
        glTFInterpolationFactory.create(interpolation, input, output, weights.length))
    }
    throw new Error(`PIXI3D: Unknown channel path "${path}"`)
  }
}