import { quat, vec3 } from "gl-matrix"
import { Transform3D } from "./transform"

export enum AnimationType {
  rotation = "rotation",
  translation = "translation",
  scale = "scale"
}

export enum AnimationInterpolation {
  linear = "LINEAR",
  step = "STEP",
  cubicspline = "CUBICSPLINE"
}

export class Animation {
  constructor(public name = "", public node: number, public type: AnimationType, public interpolation: AnimationInterpolation, public input: Float32Array, public output: Float32Array) {
  }

  get seconds() {
    return this.input[this.input.length - 1]
  }

  getRotationAtKeyFrame(keyFrame: number) {
    let index = keyFrame * 4
    return quat.fromValues(
      this.output[index], this.output[index + 1], this.output[index + 2], this.output[index + 3]
    )
  }

  getTranslationAtKeyFrame(keyFrame: number) {
    let index = keyFrame * 3
    return vec3.fromValues(
      this.output[index], this.output[index + 1], this.output[index + 2]
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

export abstract class Animator {
  protected _position = 0

  constructor(public animation: Animation) {
  }

  get position() {
    return this._position
  }

  set position(value: number) {
    this._position = value
    if (this._position > this.animation.seconds) {
      this._position = this._position % this.animation.seconds
    }
    this.animate(this._position)
  }

  animate(position: number) { }

  update(delta: number) {
    this.position += delta
  }
}

export class TranslationAnimator extends Animator {
  constructor(public transform: Transform3D, animation: Animation) {
    super(animation)
  }

  animate(position: number) {
    let translation = this.animation.getTranslationAtPosition(position)
    this.transform.position.set(
      translation[0], translation[1], translation[2]
    )
  }
}

export class ScaleAnimator extends Animator {
  constructor(public transform: Transform3D, animation: Animation) {
    super(animation)
  }

  animate(position: number) {
    let scale = this.animation.getTranslationAtPosition(position)
    this.transform.scale.set(
      scale[0], scale[1], scale[2]
    )
  }
}

export class RotationAnimator extends Animator {
  constructor(public transform: Transform3D, animation: Animation) {
    super(animation)
  }

  animate(position: number) {
    let rotation = this.animation.getRotationAtPosition(position)
    this.transform.rotation.set(
      rotation[0], rotation[1], rotation[2], rotation[3]
    )
  }
}