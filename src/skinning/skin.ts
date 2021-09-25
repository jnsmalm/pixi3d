import { Joint } from "./joint"
import { Container3D } from "../container"
import { Mat4 } from "../math/mat4"

/**
 * Represents a skin used for vertex skinning.
 */
export class Skin {
  private _jointMatrices: Float32Array[] = []
  private _jointNormalMatrices: Float32Array[] = []
  private _transformIds: number[] = []

  /** The joint normal matrices which has been calculated. */
  jointNormalMatrices = new Float32Array(this.joints.length * 16)

  /** The joint matrices which has been calculated. */
  jointMatrices = new Float32Array(this.joints.length * 16)

  /**
   * Creates a new skin.
   * @param parent The parent container node for the skin.
   * @param joints The array of joints included in the skin.
   */
  constructor(readonly parent: Container3D, readonly joints: Joint[]) {
    for (let i = 0; i < joints.length; i++) {
      this._transformIds.push(-1)
      this._jointMatrices.push(
        new Float32Array(this.jointMatrices.buffer, 16 * 4 * i, 16))
      this._jointNormalMatrices.push(
        new Float32Array(this.jointNormalMatrices.buffer, 16 * 4 * i, 16))
    }
  }

  /**
   * Calculates the joint matrices.
   */
  calculateJointMatrices() {
    for (let i = 0; i < this.joints.length; i++) {
      if (this.joints[i].transform._worldID === this._transformIds[i]) {
        // The joint transform hasn't changed, no need to calculate.
        continue
      }
      this._transformIds[i] = this.joints[i].transform._worldID
      Mat4.multiply(this.joints[i].worldTransform.array,
        this.joints[i].inverseBindMatrix, this._jointMatrices[i])
      Mat4.multiply(this.parent.transform.inverseWorldTransform.array,
        this._jointMatrices[i], this._jointMatrices[i])
      Mat4.invert(this._jointMatrices[i], this._jointNormalMatrices[i])
      Mat4.transpose(
        this._jointNormalMatrices[i], this._jointNormalMatrices[i])
    }
  }
}
