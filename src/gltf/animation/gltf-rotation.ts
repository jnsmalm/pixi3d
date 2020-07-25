import { glTFChannel } from "./gltf-channel"
import { glTFInterpolation } from "./gltf-interpolation"
import { Transform3D } from "../../transform"

export class glTFRotation extends glTFChannel {
  private _transform: Transform3D

  constructor(transform: Transform3D, input: ArrayLike<number>, interpolation: glTFInterpolation) {
    super(input, interpolation)
    this._transform = transform
  }

  updateTarget(data: ArrayLike<number>) {
    this._transform.rotationQuaternion.set(data[0], data[1], data[2], data[3])
  }
}