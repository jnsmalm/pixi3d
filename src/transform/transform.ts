import { Transform } from "pixi.js"
import { Matrix4 } from "./matrix4"
import { ObservablePoint3D } from "./observable-point"
import { ObservableQuaternion } from "./observable-quaternion"
import { Mat4 } from "../math/mat4"

/**
 * Handles position, scaling and rotation in 3D.
 */
export class Transform3D extends Transform {

  /** The position in local space. */
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)

  /** The scale in local space. */
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)

  /** The rotation in local space. */
  rotationQuaternion = new ObservableQuaternion(this.onChange, this, 0, 0, 0, 1)

  /** The transformation matrix in world space. */
  worldTransform = new Matrix4()

  /** The transformation matrix in local space. */
  localTransform = new Matrix4()

  /** The inverse transformation matrix in world space. */
  inverseWorldTransform = new Matrix4()

  /** The normal transformation matrix. */
  normalTransform = new Matrix4()

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
   * Sets position, rotation and scale from a matrix array.
   * @param matrix The matrix to set.
   */
  setFromMatrix(matrix: Matrix4) {
    this.localTransform.copyFrom(matrix)

    this.position.set(this.localTransform.position[0], this.localTransform.position[1], this.localTransform.position[2])
    this.scale.set(this.localTransform.scaling[0], this.localTransform.scaling[1], this.localTransform.scaling[2])
    this.rotationQuaternion.set(this.localTransform.rotation[0], this.localTransform.rotation[1], this.localTransform.rotation[2], this.localTransform.rotation[3])
  }

  /**
   * Updates the world transformation matrix.
   * @param parentTransform The parent transform.
   */
  updateTransform(parentTransform?: Transform) {
    this.updateLocalTransform()
    if (parentTransform && this._parentID === parentTransform._worldID) {
      return
    }
    this.worldTransform.copyFrom(this.localTransform)
    if (parentTransform instanceof Transform3D) {
      this.worldTransform.multiply(parentTransform.worldTransform)
    }
    Mat4.invert(this.worldTransform.array, this.inverseWorldTransform.array)
    Mat4.transpose(this.inverseWorldTransform.array, this.normalTransform.array)
    this._worldID++
    if (parentTransform) {
      this._parentID = parentTransform._worldID
    }
  }

  /**
   * Rotates the transform so the forward vector points at specified point.
   * @param point The point to look at.
   * @param up The upward direction.
   */
  lookAt(point: ObservablePoint3D, up = new Float32Array([0, 1, 0])) {
    let rot = Mat4.getRotation(
      Mat4.targetTo(point.array, this.worldTransform.position, up))
    this.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
  }
}