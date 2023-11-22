import { glTFInterpolation, getDenormalizeFunction } from "./gltf-interpolation"

export class glTFStep implements glTFInterpolation {
  private _data: Float32Array
  private _denormalize: (data: Float32Array) => Float32Array

  constructor(private _output: ArrayLike<number>, private _stride: number) {
    this._data = new Float32Array(_stride)
    this._denormalize = getDenormalizeFunction(this._output, this._stride)
  }

  interpolate(frame: number) {
    for (let i = 0; i < this._stride; i++) {
      this._data[i] = this._output[frame * this._stride + i]
    }
    return this._denormalize(this._data)
  }
}