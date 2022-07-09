import { glTFInterpolation } from "./gltf-interpolation"

export class glTFLinear implements glTFInterpolation {
  private _data: Float32Array

  constructor(private _output: ArrayLike<number>, private _stride: number) {
    this._data = new Float32Array(_stride)
  }

  interpolate(frame: number, position: number) {
    let pos1 = (frame + 0) * this._stride
    let pos2 = (frame + 1) * this._stride
    for (let i = 0; i < this._stride; i++) {
      if (this._output.length > pos2) {
        this._data[i] = (1 - position) * this._output[pos1 + i] + position * this._output[pos2 + i]
      } else {
        this._data[i] = this._output[pos1 + i]
      }
    }
    return this._data
  }
}