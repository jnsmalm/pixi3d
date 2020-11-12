/**
 * Represents an glTF animation channel which targets a specific node.
 */
export abstract class glTFChannel {
  private _position = 0
  private _frame = 0
  private _interpolation: glTFInterpolation
  private _input: ArrayLike<number>

  /**
   * Creates a new channel with the specified input and interpolation.
   * @param input An array of inputs representing linear time in seconds.
   * @param interpolation The interpolation method to use.
   */
  constructor(input: ArrayLike<number>, interpolation: glTFInterpolation) {
    this._input = input
    this._interpolation = interpolation
  }

  /** The position (in seconds) for this channel. */
  get position() {
    return this._position
  }

  set position(value: number) {
    this.setPosition(value)
  }

  /** The duration (in seconds) for this channel. */
  get duration() {
    return this._input[this._input.length - 1]
  }

  /** The current frame for this channel. */
  get frame() {
    return this._frame
  }

  /** The number of frames for this channel. */
  get length() {
    return this._input.length
  }

  /**
   * Sets the position and updates the current frame and animation.
   * @param position The position to set for this channel.
   */
  setPosition(position: number) {
    this._position = position
    this._frame = this.calculateFrame(this._position)
    this.updateTarget(
      this._interpolation.interpolate(
        this._frame, this.calculateFramePosition(this._frame, this._position)))
  }

  abstract updateTarget(data: ArrayLike<number>): void

  /**
   * Updates the channel with the specified delta time in seconds.
   * @param delta The time (in seconds) since last frame.
   */
  update(delta: number) {
    this.position += delta
  }

  /**
   * Calculates the position within the specified frame.
   * @param frame The frame to calculate the position in.
   * @param position The position of this channel.
   */
  calculateFramePosition(frame: number, position: number) {
    if (frame === this._input.length - 1) {
      return 1
    }
    return (position - this._input[frame]) / (this._input[frame + 1] - this._input[frame])
  }

  /**
   * Calculates the current frame for the specified position.
   * @param position The position of this channel.
   */
  calculateFrame(position: number) {
    if (position < this._input[0]) {
      return 0
    }
    for (let i = 0; i < this._input.length - 1; i++) {
      if (position >= this._input[i] && position < this._input[i + 1]) {
        return i
      }
    }
    return this._input.length - 1
  }

  static from(input: ArrayLike<number>, output: ArrayLike<number>, interpolation: string, path: string, target: Container3D) {
    if (path === "translation") {
      return new glTFTranslation(target.transform, input,
        glTFInterpolation.from(interpolation, input, output, 3))
    }
    if (path === "scale") {
      return new glTFScale(target.transform, input,
        glTFInterpolation.from(interpolation, input, output, 3))
    }
    if (path === "rotation") {
      if (interpolation === "LINEAR") {
        return new glTFRotation(target.transform, input,
          new glTFSphericalLinear(output))
      }
      return new glTFRotation(target.transform, input,
        glTFInterpolation.from(interpolation, input, output, 4))
    }
    if (path === "weights") {
      let weights = (<Mesh3D>target.children[0]).morphWeights
      if (!weights) {
        return undefined
      }
      return new glTFWeights(weights, input,
        glTFInterpolation.from(interpolation, input, output, weights.length))
    }
    throw new Error(`PIXI3D: Unknown channel path "${path}"`)
  }
}

// Fixes circular dependency in webpack
import { Container3D } from "../../container"
import { Mesh3D } from "../../mesh/mesh"
import { glTFInterpolation } from "./gltf-interpolation"
import { glTFSphericalLinear } from "./gltf-spherical-linear"
import { glTFScale } from "./gltf-scale"
import { glTFWeights } from "./gltf-weights"
import { glTFRotation } from "./gltf-rotation"
import { glTFTranslation } from "./gltf-translation"