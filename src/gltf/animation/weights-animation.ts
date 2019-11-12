import { glTFAnimationInterpolation } from "./animation"
import { Interpolate } from "../../interpolate"
import { glTFAnimationChannel } from "./animation-channel"

export class glTFWeightsAnimation extends glTFAnimationChannel {
  constructor(public weights: number[], interpolation: glTFAnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== glTFAnimationInterpolation.cubicspline) {
      let weights = this.getWeightsAtPosition(position)
      for (let i = 0; i < weights.length; i++) {
        this.weights[i] = weights[i]
      }
      return
    }

    let keyFrame = this.getKeyFrame(position)
    let keyDelta = this.input[keyFrame + 1] - this.input[keyFrame]
    let keyPosition = this.getKeyFramePosition(position)

    let result = Interpolate.cubicSpline(keyFrame, keyFrame + 1, this.output,
      keyDelta, keyPosition, this.weights.length)

    for (let i = 0; i < result.length; i++) {
      this.weights[i] = result[i]
    }
  }

  getWeightsAtKeyFrame(keyFrame: number) {
    let index = keyFrame * this.weights.length
    return this.output.subarray(index, index + this.weights.length)
  }

  getWeightsAtPosition(position: number) {
    let keyFrame = this.getKeyFrame(position)
    if (this.interpolation === glTFAnimationInterpolation.step) {
      return this.getWeightsAtKeyFrame(keyFrame)
    }
    let frame1 = this.getWeightsAtKeyFrame(keyFrame)
    let frame2 = this.getWeightsAtKeyFrame(keyFrame + 1)
    let framePosition = this.getKeyFramePosition(position)
    let result = []
    for (let i = 0; i < frame1.length; i++) {
      result.push(frame1[i] + (frame2[i] - frame1[i]) * framePosition)
    }
    return result
  }
}