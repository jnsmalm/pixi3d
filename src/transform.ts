import { ObservablePoint3D } from "./point"
import { ObservableQuaternion } from "./quaternion"
import { TransformMatrix } from "./matrix/transform-matrix"

/**
 * Handles position, scaling and rotation.
 */
export class Transform3D {

  public _localID = 0
  public _currentLocalID = 0
  public _parentID = 0
  public _worldID = 0

  /** Position in local space. */
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  /** Scale in local space. */
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  /** Rotation in local space. */
  rotation = new ObservableQuaternion(this.onChange, this, 0, 0, 0, 1)

  /** Transformation matrix in world space. */
  worldTransform = new TransformMatrix()
  /** Transformation matrix in local space. */
  localTransform = new TransformMatrix()

  protected onChange() {
    this._localID++
  }

  /**
   * Updates the local transformation matrix.
   */
  protected updateLocalTransform() {
    if (this._localID === this._currentLocalID) {
      return
    }
    this.localTransform.setFromRotationPositionScale(
      this.rotation, this.position, this.scale)

    this._parentID = -1
    this._currentLocalID = this._localID
  }

  /**
   * Sets position, rotation and scale from an matrix array.
   * @param matrix Matrix array, expected to have a length of 16.
   */
  setFromMatrix(matrix: ArrayLike<number>) {
    this.localTransform.copyFrom(matrix)
    this.position.set(...this.localTransform.position)
    this.scale.set(...this.localTransform.scale)
    this.rotation.set(...this.localTransform.rotation)
  }

  /**
   * Updates the world transformation matrix.
   * @param parentTransform Parent transform.
   */
  updateTransform(parentTransform?: Transform3D) {
    this.updateLocalTransform()
    if (parentTransform && this._parentID === parentTransform._worldID) {
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
      this._parentID = parentTransform._worldID
    }
  }
}