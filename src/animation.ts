import * as PIXI from "pixi.js"

/**
 * Represents an animation.
 */
export abstract class Animation {
  private _ticker?: PIXI.Ticker
  private _update?: (...params: any[]) => void

  /** The speed that the animation will play at. */
  speed = 1

  /**
   * Creates a new animation with the specified name.
   * @param name Name for the animation.
   */
  constructor(public name?: string) {
  }

  /**
   * Starts playing the animation using the specified ticker.
   * @param ticker The ticker to use for updating the animation. If a ticker 
   * is not given, the shared ticker will be used.
   */
  play(ticker = PIXI.Ticker.shared) {
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
  abstract update(delta: number): void
}