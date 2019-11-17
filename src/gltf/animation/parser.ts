import { glTFResource } from "../loader"
import { Container3D } from "../../container"
import { glTFBufferAccessor } from "../buffer-accessor"
import { glTFAnimation, glTFRotationAnimation, glTFTranslationAnimation, glTFScaleAnimation, glTFWeightsAnimation } from "./animation"
import { glTFStepInterpolation, glTFSphericalLinearInterpolation, glTFCubicSplineInterpolation, glTFLinearInterpolation } from "./interpolation"

export class glTFAnimationParser {
  protected bufferAccessor: glTFBufferAccessor

  constructor(public resource: glTFResource) {
    this.bufferAccessor = new glTFBufferAccessor(resource.descriptor, resource.buffers)
  }

  createAnimation(animation: any, nodes: Container3D[]) {
    let result = new glTFAnimation(animation.name)
    for (let channel of animation.channels) {
      let animationChannel = this.createAnimationChannel(
        animation.samplers[channel.sampler], channel.target.path, nodes[channel.target.node])
      if (animationChannel) {
        result.channels.push(animationChannel)
      }
    }
    return result
  }

  private createAnimationChannel(sampler: any, path: string, target: Container3D) {
    let input = this.bufferAccessor.createAttributeData(sampler.input).buffer as Float32Array
    let output = this.bufferAccessor.createAttributeData(sampler.output).buffer as Float32Array

    if (path === "rotation") {
      if (sampler.interpolation === "LINEAR") {
        return new glTFRotationAnimation(target.transform, input,
          new glTFSphericalLinearInterpolation(output))
      }
      return new glTFRotationAnimation(target.transform, input,
        this.createInterpolation(sampler.interpolation, input, output, 4))
    }
    if (path === "translation") {
      return new glTFTranslationAnimation(target.transform, input,
        this.createInterpolation(sampler.interpolation, input, output, 3))
    }
    if (path === "scale") {
      return new glTFScaleAnimation(target.transform, input,
        this.createInterpolation(sampler.interpolation, input, output, 3))
    }
    if (path === "weights") {
      let weights = target.children[0].weights
      return new glTFWeightsAnimation(weights, input,
        this.createInterpolation(sampler.interpolation, input, output, weights.length))
    }
  }

  private createInterpolation(type: string, input: Float32Array, output: Float32Array, stride: number) {
    switch (type) {
      case "LINEAR": {
        return new glTFLinearInterpolation(output, stride)
      }
      case "CUBICSPLINE": {
        return new glTFCubicSplineInterpolation(input, output, stride)
      }
      case "STEP": {
        return new glTFStepInterpolation(output, stride)
      }
    }
    throw new Error(`PIXI3D: Unknown interpolation type "${type}"`)
  }
}