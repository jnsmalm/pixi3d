import { Transform3D } from "../../transform"
import { glTFAnimationInterpolation, glTFAnimation } from "./gltf-animation"
import { vec3 } from "gl-matrix"
import { Interpolate } from "../../interpolate"

export class glTFScaleAnimation extends glTFAnimation {
  constructor(public transform: Transform3D, interpolation: glTFAnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== glTFAnimationInterpolation.cubicspline) {
      let translation = this.getScaleAtPosition(position)
      this.transform.scale.set(
        translation[0], translation[1], translation[2]
      )
      return
    }

    let keyFrame = this.getKeyFrame(position)
    let keyDelta = this.input[keyFrame + 1] - this.input[keyFrame]
    let keyPosition = this.getKeyFramePosition(position)

    let result = Interpolate.cubicSpline(keyFrame, keyFrame + 1, this.output,
      keyDelta, keyPosition, 3)

    this.transform.scale.set(
      result[0], result[1], result[2]
    )
  }

  getScaleAtKeyFrame(keyFrame: number) {
    let index = keyFrame * 3
    return vec3.fromValues(
      this.output[index], this.output[index + 1], this.output[index + 2]
    )
  }

  getScaleAtPosition(position: number) {
    let keyFrame = this.getKeyFrame(position)
    if (this.interpolation === glTFAnimationInterpolation.step) {
      return this.getScaleAtKeyFrame(keyFrame)
    }
    return vec3.lerp(vec3.create(),
      this.getScaleAtKeyFrame(keyFrame),
      this.getScaleAtKeyFrame(keyFrame + 1),
      this.getKeyFramePosition(position))
  }
}