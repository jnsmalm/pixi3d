import { glTFChannel } from "./gltf-channel"
import { glTFInterpolation } from "./gltf-interpolation"

export class glTFWeights extends glTFChannel {
  private _weights: number[]

  constructor(weights: number[], input: ArrayLike<number>, interpolation: glTFInterpolation) {
    super(input, interpolation)
    this._weights = weights
  }

  updateTarget(data: ArrayLike<number>) {
    for (let i = 0; i < data.length; i++) {
      this._weights[i] = data[i]
    }
  }
}