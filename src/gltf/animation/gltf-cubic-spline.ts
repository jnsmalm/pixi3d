import { glTFInterpolation } from "./gltf-interpolation"

export class glTFCubicSpline extends glTFInterpolation {
  private _data: Float32Array

  constructor(private _input: ArrayLike<number>, private _output: ArrayLike<number>, private _stride: number) {
    super()
    this._data = new Float32Array(_stride)
  }

  interpolate(frame: number, position: number) {
    const diff = this._input[frame + 1] - this._input[frame]
    const pos1 = (frame + 0) * this._stride * 3
    const pos2 = (frame + 1) * this._stride * 3
    for (let i = 0; i < this._stride; i++) {
      this._data[i] = glTFCubicSpline.calculate(
        position, this._output[pos1 + i + 1 * this._stride], this._output[pos2 + i + 1 * this._stride], diff * this._output[pos2 + i], diff * this._output[pos1 + i + 2 * this._stride])
    }
    return this._data
  }

  static calculate(t: number, p0: number, p1: number, m0: number, m1: number) {
    return ((2 * (t ** 3) - 3 * (t ** 2) + 1) * p0) + (((t ** 3) - 2 * (t ** 2) + t) * m0) + ((-2 * (t ** 3) + 3 * (t ** 2)) * p1) + (((t ** 3) - (t ** 2)) * m1)
  }
}

