import { glTFInterpolation } from "./gltf-interpolation"

export class glTFStep implements glTFInterpolation {
  private _data: Float32Array

  constructor(private _output: ArrayLike<number>, private _stride: number) {
    this._data = new Float32Array(_stride)
  }

  interpolate(frame: number) {
    for (let i = 0; i < this._stride; i++) {
      this._data[i] = this._output[frame * this._stride + i]
    }
    return this._data
  }
}