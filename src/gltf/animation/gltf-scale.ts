import { glTFChannel } from "./gltf-channel"
import { glTFInterpolation } from "./gltf-interpolation"
import { Transform3D } from "../../transform/transform"

export class glTFScale extends glTFChannel {
  private _transform: Transform3D

  constructor(transform: Transform3D, input: ArrayLike<number>, interpolation: glTFInterpolation) {
    super(input, interpolation)
    this._transform = transform
  }

  updateTarget(data: ArrayLike<number>) {
    this._transform.scale.set(data[0], data[1], data[2])
  }
}