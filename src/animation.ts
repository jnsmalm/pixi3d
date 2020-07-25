import * as PIXI from "pixi.js"

/**
 * Represents an animation.
 */
export abstract class Animation {
  private _ticker?: PIXI.Ticker

  /** The speed that the animation will play at. */
  speed = 1

  /**
   * Creates a new animation with the specified name.
   * @param name Name for the animation.
   */
  constructor(public name?: string) {
  }

  /**
   * Starts playing the animation using the shared ticker.
   */
  play() {
    if (!this._ticker) {
      this._ticker = PIXI.Ticker.shared.add(() => {
        if (this._ticker) {
          this.update(this._ticker.deltaMS / 1000 * this.speed)
        }
      })
    }
  }

  /**
   * Stops playing the animation.
   */
  stop() {
    if (this._ticker) { this._ticker.stop() }
  }

  /**
   * Updates the animation by the specified delta time.
   * @param delta The time in seconds since last frame.
   */
  abstract update(delta: number): void
}