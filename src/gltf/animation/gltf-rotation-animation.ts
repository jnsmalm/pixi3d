import { quat } from "gl-matrix"
import { Transform3D } from "../../transform"
import { Interpolate } from "../../interpolate"
import { glTFAnimation, glTFAnimationInterpolation } from "./gltf-animation"

export class glTFRotationAnimation extends glTFAnimation {
  constructor(public transform: Transform3D, interpolation: glTFAnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== glTFAnimationInterpolation.cubicspline) {
      let rotation = this.getRotationAtPosition(position)
      this.transform.rotation.set(
        rotation[0], rotation[1], rotation[2], rotation[3]
      )
      return
    }

    let keyFrame = this.getKeyFrame(position)
    let keyDelta = this.input[keyFrame + 1] - this.input[keyFrame]
    let keyPosition = this.getKeyFramePosition(position)

    let result = Interpolate.cubicSpline(keyFrame, keyFrame + 1, this.output,
      keyDelta, keyPosition, 4)

    quat.normalize(result, result);

    this.transform.rotation.set(
      result[0], result[1], result[2], result[3]
    )
  }

  getRotationAtPosition(position: number) {
    let keyFrame = this.getKeyFrame(position)
    if (this.interpolation === glTFAnimationInterpolation.step) {
      return this.getRotationAtKeyFrame(keyFrame)
    }
    return quat.slerp(quat.create(),
      this.getRotationAtKeyFrame(keyFrame),
      this.getRotationAtKeyFrame(keyFrame + 1),
      this.getKeyFramePosition(position))
  }

  getRotationAtKeyFrame(keyFrame: number) {
    let index = keyFrame * 4
    return quat.fromValues(
      this.output[index], this.output[index + 1], this.output[index + 2], this.output[index + 3]
    )
  }
}