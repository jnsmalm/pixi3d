import * as PIXI from "pixi.js"

import { TransformMatrix } from "./matrix/transform-matrix"
import { ObservablePoint3D } from "./point"
import { ObservableQuaternion } from "./quaternion"

/**
 * Handles position, scaling and rotation.
 */
export class Transform3D extends PIXI.Transform {
  
  /** Position in local space. */
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)

  /** Scale in local space. */
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)

  /** Rotation in local space. */
  rotationQuaternion = new ObservableQuaternion(this.onChange, this, 0, 0, 0, 1)

  /** Transformation matrix in world space. */
  worldTransform = new TransformMatrix()

  /** Transformation matrix in local space. */
  localTransform = new TransformMatrix()

  /**
   * Updates the local transformation matrix.
   */
  updateLocalTransform() {
    if (this._localID === this._currentLocalID) {
      return
    }
    this.localTransform.setFromRotationPositionScale(
      this.rotationQuaternion, this.position, this.scale)

    this._parentID = -1
    this._currentLocalID = this._localID
  }

  /**
   * Sets position, rotation and scale from an matrix array.
   * @param matrix The matrix to set.
   */
  setFromMatrix(matrix: TransformMatrix) {
    this.localTransform.copyFrom(matrix)

    this.position.set(this.localTransform.position[0], this.localTransform.position[1], this.localTransform.position[2])
    this.scale.set(this.localTransform.scaling[0], this.localTransform.scaling[1], this.localTransform.scaling[2])
    this.rotationQuaternion.set(this.localTransform.rotation[0], this.localTransform.rotation[1], this.localTransform.rotation[2], this.localTransform.rotation[3])
  }

  /**
   * Updates the world transformation matrix.
   * @param parentTransform Parent transform.
   */
  updateTransform(parentTransform?: PIXI.Transform) {
    this.updateLocalTransform()
    if (parentTransform && this._parentID === (<any>parentTransform)._worldID) {
      return
    }
    if (parentTransform instanceof Transform3D) {
      this.worldTransform.setFromMultiplyWorldLocal(
        parentTransform.worldTransform, this.localTransform)
    } else {
      this.worldTransform.copyFrom(this.localTransform)
    }
    this._worldID++
    if (parentTransform) {
      this._parentID = (<any>parentTransform)._worldID
    }
  }
}