import { glTFChannel } from "./gltf-channel"
import { glTFInterpolation } from "./gltf-interpolation"
import { Transform3D } from "../../transform"

export class glTFTranslation extends glTFChannel {
  private _transform: Transform3D

  constructor(transform: Transform3D, input: ArrayLike<number>, interpolation: glTFInterpolation) {
    super(input, interpolation)
    this._transform = transform
  }

  updateTarget(data: ArrayLike<number>) {
    this._transform.position.set(data[0], data[1], data[2])
  }
}