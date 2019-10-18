import { quat, vec3 } from "gl-matrix"
import { Transform3D } from "./transform"

export enum AnimationInterpolation {
  linear = "LINEAR",
  step = "STEP",
  cubicspline = "CUBICSPLINE"
}

export abstract class Animation {
  protected _position = 0

  constructor(public transform: Transform3D, public interpolation: AnimationInterpolation, public input: Float32Array, public output: Float32Array) {
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
  constructor(transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(transform, interpolation, input, output)
  }

  animate(position: number) {
    let rotation = this.getRotationAtPosition(position)
    this.transform.rotation.set(
      rotation[0], rotation[1], rotation[2], rotation[3]
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
  constructor(transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(transform, interpolation, input, output)
  }

  animate(position: number) {
    let translation = this.getTranslationAtPosition(position)
    this.transform.position.set(
      translation[0], translation[1], translation[2]
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
  constructor(transform: Transform3D, interpolation: AnimationInterpolation, input: Float32Array, output: Float32Array) {
    super(transform, interpolation, input, output)
  }

  animate(position: number) {
    let translation = this.getScaleAtPosition(position)
    this.transform.scale.set(
      translation[0], translation[1], translation[2]
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