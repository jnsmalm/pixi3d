import { Animation } from "../../animation"
import { glTFChannel } from "./gltf-channel"

/**
 * Represents an animation loaded from a glTF model.
 */
export class glTFAnimation extends Animation {
  private _duration = 0
  private _position = 0
  private _channels: glTFChannel[] = []

  /**
   * Creates a new glTF animation.
   * @param channels The channels used by this animation.
   * @param name The name for the animation.
   */
  constructor(channels: glTFChannel[], name?: string) {
    super(name)
    for (let channel of channels) {
      this._duration = Math.max(this._duration, channel.duration)
    }
    this._channels = channels
  }

  /** The duration (in seconds) of this animation. */
  get duration() {
    return this._duration
  }

  /** The current position (in seconds) of this animation. */
  get position() {
    return this._position
  }

  set position(value: number) {
    this._position = value
    for (let channel of this._channels) {
      channel.position = this._position
    }
  }
}

