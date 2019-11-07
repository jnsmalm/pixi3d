import { quat, vec2, vec3 } from "gl-matrix"
import { Transform3D } from "./transform"
import { Interpolate } from "./interpolate"

export enum AnimationInterpolation {
  linear = "LINEAR",
  step = "STEP",
  cubicspline = "CUBICSPLINE"
}

export abstract class Animation {
  protected _position = 0

  constructor(public interpolation: AnimationInterpolation, public input: Float32Array, public output: Float32Array) {
  }

  get position() {
    return this._position
  }

  set position(value: number) {
    this._position = value
    if (this._position > this.seconds) {
      this._position = this._position % this.seconds
    }
    this.animate(this._position)
  }

  get seconds() {
    return this.input[this.input.length - 1]
  }

  animate(position: number) { }

  update(delta: number) {
    this.position += delta
  }

  getKeyFrame(position: number) {
    if (position < this.input[0]) {
      return 0
    }
    for (let i = 0; i < this.input.length - 1; i++) {
      if (position >= this.input[i] && position < this.input[i + 1]) {
        return i
      }
    }
    return this.input.length - 1
  }

  getKeyFramePosition(position: number) {
    let keyFrame = this.getKeyFrame(position)
    if (keyFrame === this.input.length - 1) {
      return 1
    }
    return (position - this.input[keyFrame]) / (this.input[keyFrame + 1] - this.input[keyFrame])
  }
}

export class RotationAnimation extends Animation {
  constructor(public transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== AnimationInterpolation.cubicspline) {
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
    if (this.interpolation === AnimationInterpolation.step) {
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

export class TranslationAnimation extends Animation {
  constructor(public transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== AnimationInterpolation.cubicspline) {
      let translation = this.getTranslationAtPosition(position)
      this.transform.position.set(
        translation[0], translation[1], translation[2]
      )
      return
    }

    let keyFrame = this.getKeyFrame(position)
    let keyDelta = this.input[keyFrame + 1] - this.input[keyFrame]
    let keyPosition = this.getKeyFramePosition(position)

    let result = Interpolate.cubicSpline(keyFrame, keyFrame + 1, this.output,
      keyDelta, keyPosition, 3)

    this.transform.position.set(
      result[0], result[1], result[2]
    )
  }

  getTranslationAtKeyFrame(keyFrame: number) {
    let index = keyFrame * 3
    return vec3.fromValues(
      this.output[index], this.output[index + 1], this.output[index + 2]
    )
  }

  getTranslationAtPosition(position: number) {
    let keyFrame = this.getKeyFrame(position)
    if (this.interpolation === AnimationInterpolation.step) {
      return this.getTranslationAtKeyFrame(keyFrame)
    }
    return vec3.lerp(vec3.create(),
      this.getTranslationAtKeyFrame(keyFrame),
      this.getTranslationAtKeyFrame(keyFrame + 1),
      this.getKeyFramePosition(position))
  }
}

export class ScaleAnimation extends Animation {
  constructor(public transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {

    if (this.interpolation !== AnimationInterpolation.cubicspline) {
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
    if (this.interpolation === AnimationInterpolation.step) {
      return this.getScaleAtKeyFrame(keyFrame)
    }
    return vec3.lerp(vec3.create(),
      this.getScaleAtKeyFrame(keyFrame),
      this.getScaleAtKeyFrame(keyFrame + 1),
      this.getKeyFramePosition(position))
  }
}

export class WeightsAnimation extends Animation {
  constructor(public weights: number[], interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(interpolation, input, output)
  }

  animate(position: number) {
    if (this.interpolation !== AnimationInterpolation.cubicspline) {
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
    if (this.interpolation === AnimationInterpolation.step) {
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