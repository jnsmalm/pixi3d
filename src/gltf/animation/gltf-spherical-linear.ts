import { Quaternion } from "../../math/quaternion"
import { glTFInterpolation } from "./gltf-interpolation"

export class glTFSphericalLinear extends glTFInterpolation {
  private _data: Float32Array

  constructor(private _output: ArrayLike<number>) {
    super()
    this._data = new Float32Array(4)
  }

  interpolate(frame: number, position: number) {
    let pos1 = (frame + 0) * 4
    let pos2 = (frame + 1) * 4
    let a = Quaternion.set(
      this._output[pos1], this._output[pos1 + 1], this._output[pos1 + 2], this._output[pos1 + 3]
    )
    let b = Quaternion.set(
      this._output[pos2], this._output[pos2 + 1], this._output[pos2 + 2], this._output[pos2 + 3]
    )
    return <Float32Array>Quaternion.normalize(
      Quaternion.slerp(a, b, position, this._data), this._data)
  }
}