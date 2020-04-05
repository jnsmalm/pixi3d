import { Animation } from "../../animation"
import { glTFInterpolation } from "./interpolation"
import { Transform3D } from "../../transform"

export class glTFAnimation implements Animation {
  channels: glTFAnimationChannel[] = []

  constructor(public name?: string) {
  }

  update(delta: number): void {
    for (let channel of this.channels) {
      channel.update(delta)
    }
  }
}

export abstract class glTFAnimationChannel {
  private _position = 0

  constructor(private input: Float32Array, protected interpolation: glTFInterpolation) {
  }

  get position() {
    return this._position
  }

  set position(value: number) {
    this._position = value
    if (this._position > this.duration) {
      this._position = this._position % this.duration
    }
    this.animate()
  }

  get duration() {
    return this.input[this.input.length - 1]
  }

  animate() { }

  update(delta: number) {
    this.position += delta
  }

  getCurrentFramePosition() {
    let frame = this.getCurrentFrame()
    if (frame === this.input.length - 1) {
      return 1
    }
    return (this.position - this.input[frame]) / (this.input[frame + 1] - this.input[frame])
  }

  getCurrentFrame() {
    if (this.position < this.input[0]) {
      return 0
    }
    for (let i = 0; i < this.input.length - 1; i++) {
      if (this.position >= this.input[i] && this.position < this.input[i + 1]) {
        return i
      }
    }
    return this.input.length - 1
  }
}

export class glTFRotationAnimation extends glTFAnimationChannel {
  constructor(public transform: Transform3D, input: Float32Array, interpolation: glTFInterpolation) {
    super(input, interpolation)
  }

  animate() {
    let result = this.interpolation.interpolate(
      this.getCurrentFrame(), this.getCurrentFramePosition()
    )
    this.transform.rotationQuaternion.set(result[0], result[1], result[2], result[3])
  }
}

export class glTFScaleAnimation extends glTFAnimationChannel {
  constructor(public transform: Transform3D, input: Float32Array, interpolation: glTFInterpolation) {
    super(input, interpolation)
  }

  animate() {
    let result = this.interpolation.interpolate(
      this.getCurrentFrame(), this.getCurrentFramePosition()
    )
    this.transform.scale.set(result[0], result[1], result[2])
  }
}

export class glTFTranslationAnimation extends glTFAnimationChannel {
  constructor(public transform: Transform3D, input: Float32Array, interpolation: glTFInterpolation) {
    super(input, interpolation)
  }

  animate() {
    let result = this.interpolation.interpolate(
      this.getCurrentFrame(), this.getCurrentFramePosition()
    )
    this.transform.position.set(result[0], result[1], result[2])
  }
}

export class glTFWeightsAnimation extends glTFAnimationChannel {
  constructor(public weights: number[], input: Float32Array, interpolation: glTFInterpolation) {
    super(input, interpolation)
  }

  animate() {
    let result = this.interpolation.interpolate(
      this.getCurrentFrame(), this.getCurrentFramePosition()
    )
    for (let i = 0; i < result.length; i++) {
      this.weights[i] = result[i]
    }
  }
}