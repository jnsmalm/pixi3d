import * as PIXI from "pixi.js"

export class SpriteBatchGeometry extends PIXI.BatchGeometry {
  constructor() {
    super()

    this.addAttribute("aMatrix0", this._buffer, 4, false, PIXI.TYPES.FLOAT)
    this.addAttribute("aMatrix1", this._buffer, 4, false, PIXI.TYPES.FLOAT)
    this.addAttribute("aMatrix2", this._buffer, 4, false, PIXI.TYPES.FLOAT)
    this.addAttribute("aMatrix3", this._buffer, 4, false, PIXI.TYPES.FLOAT)
  }
}