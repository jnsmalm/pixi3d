import { glTFResource } from "../loader"
import { Container3D } from "../../container"
import { glTFBufferAccessor } from "../buffer-accessor"
import { glTFRotationAnimation } from "./rotation-animation"
import { glTFTranslationAnimation } from "./translation-animation"
import { glTFScaleAnimation } from "./scale-animation"
import { glTFWeightsAnimation } from "./weights-animation"
import { glTFAnimation } from "./animation"

export class glTFAnimationParser {
  protected bufferAccessor: glTFBufferAccessor

  constructor(public resource: glTFResource) {
    this.bufferAccessor = new glTFBufferAccessor(resource.descriptor, resource.buffers)
  }

  createAnimation(animation: any, nodes: Container3D[]) {
    let result = new glTFAnimation(animation.name)
    for (let channel of animation.channels) {
      let sampler = animation.samplers[channel.sampler]
      let target = nodes[channel.target.node]
      let animationChannel = this.createAnimationChannel(sampler, channel.target.path, target)
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
      return new glTFRotationAnimation(
        target.transform, sampler.interpolation, input, output)
    }
    if (path === "translation") {
      return new glTFTranslationAnimation(
        target.transform, sampler.interpolation, input, output)
    }
    if (path === "scale") {
      return new glTFScaleAnimation(
        target.transform, sampler.interpolation, input, output)
    }
    if (path === "weights") {
      let mesh = target.children[0].mesh
      return new glTFWeightsAnimation(
        mesh.geometry.weights, sampler.interpolation, input, output)
    }
  }
}