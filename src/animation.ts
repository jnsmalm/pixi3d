import * as PIXI from "pixi.js"

/**
 * Represents an animation.
 */
export abstract class Animation extends PIXI.utils.EventEmitter {
  private _ticker?: PIXI.Ticker
  private _update?: (...params: any[]) => void

  /** The duration (in seconds) of this animation. */
  abstract readonly duration: number

  /** The current position (in seconds) of this animation. */
  abstract position: number

  /** The speed that the animation will play at. */
  speed = 1

  /** A value indicating if the animation is looping. */
  loop = false

  /**
   * Creates a new animation with the specified name.
   * @param name Name for the animation.
   */
  constructor(public name?: string) {
    super()
  }

  /**
   * Starts playing the animation using the specified ticker.
   * @param ticker The ticker to use for updating the animation. If a ticker 
   * is not given, the shared ticker will be used.
   */
  play(ticker = PIXI.Ticker.shared) {
    this.position = 0
    if (!this._ticker) {
      this._update = () => {
        this.update(ticker.deltaMS / 1000 * this.speed)
      }
      this._ticker = ticker.add(this._update)
    }
  }

  /**
   * Stops playing the animation.
   */
  stop() {
    if (this._ticker && this._update) {
      this._ticker.remove(this._update)
      this._ticker = this._update = undefined
    }
  }

  /**
   * Updates the animation by the specified delta time.
   * @param delta The time in seconds since last frame.
   */
  update(delta: number) {
    this.position += delta
    if (this.position < this.duration) {
      return
    }
    if (this.loop) {
      if (this.position > this.duration) {
        this.position = this.position % this.duration
      }
    }
    else {
      this.position = this.duration
      this.stop()
    }
    // @ts-expect-error
    this.emit("complete")
  }
}