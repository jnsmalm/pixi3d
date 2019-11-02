import { ObservablePoint3D } from "./point"
import { ObservableQuaternion } from "./quaternion"
import { TransformMatrix } from "./matrix"

export class Transform3D extends PIXI.Transform {
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  rotation = new ObservableQuaternion(this.onChange, this, 0, 0, 0, 1)

  /**
   * The world transformation matrix.
   */
  worldTransform = new TransformMatrix()

  /**
   * The local transformation matrix.
   */
  localTransform = new TransformMatrix()

  updateLocalTransform() {
    if (this._localID === this._currentLocalID) {
      return
    }
    this.localTransform.setFromRotationPositionScale(
      this.rotation, this.position, this.scale)
    this.worldTransform.setFromMatrix(this.localTransform)

    this._parentID = -1
    this._currentLocalID = this._localID
  }

  setFromTransform(transform: Transform3D) {
    this.position.copyFrom(transform.position)
    this.scale.copyFrom(transform.scale)
    this.rotation.copyFrom(transform.rotation)
  }

  setFromMatrix(matrix: ArrayLike<number>) {
    this.localTransform.setFromMatrix(matrix)
    this.position.set(...this.localTransform.position)
    this.scale.set(...this.localTransform.scale)
    this.rotation.set(...this.localTransform.rotation)
  }

  updateTransform(parentTransform: PIXI.Transform) {
    this.updateLocalTransform()
    if (this._parentID === parentTransform._worldID) {
      return
    }
    if (parentTransform instanceof Transform3D) {
      this.worldTransform.setFromMultiplication(
        parentTransform.worldTransform, this.localTransform)
    } else {
      this.worldTransform.setFromMatrix(this.localTransform)
    }
    this._worldID++
    this._parentID = parentTransform._worldID
  }
}