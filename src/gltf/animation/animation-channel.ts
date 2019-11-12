import { glTFAnimationInterpolation } from "./animation"

export abstract class glTFAnimationChannel {
  protected _position = 0

  constructor(public interpolation: glTFAnimationInterpolation, public input: Float32Array, public output: Float32Array) {
  }

  get position() {
    return this._position
  }

  set position(value: number) {
    this._position = value
    if (this._position > this.duration) {
      this._position = this._position % this.duration
    }
    this.animate(this._position)
  }

  get duration() {
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