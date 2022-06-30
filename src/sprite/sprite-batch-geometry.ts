import { BatchGeometry } from "@pixi/core"
import { TYPES } from "@pixi/constants"

export class SpriteBatchGeometry extends BatchGeometry {
  constructor() {
    super()

    this.addAttribute("aMatrix0", this._buffer, 4, false, TYPES.FLOAT)
    this.addAttribute("aMatrix1", this._buffer, 4, false, TYPES.FLOAT)
    this.addAttribute("aMatrix2", this._buffer, 4, false, TYPES.FLOAT)
    this.addAttribute("aMatrix3", this._buffer, 4, false, TYPES.FLOAT)
  }
}