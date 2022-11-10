import { Transform } from "@pixi/math"
import { Matrix4x4 } from "./matrix"
import { Point3D } from "./point"
import { Quaternion } from "./quaternion"
import { Mat4 } from "../math/mat4"

/**
 * Handles position, scaling and rotation in 3D.
 */
export class Transform3D extends Transform {

  /** The position in local space. */
  position = new Point3D(0, 0, 0, this.onChange, this)

  /** The scale in local space. */
  scale = new Point3D(1, 1, 1, this.onChange, this)

  /** The rotation in local space. */
  rotationQuaternion = new Quaternion(0, 0, 0, 1, this.onChange, this)

  /** The transformation matrix in world space. */
  worldTransform = new Matrix4x4()

  /** The transformation matrix in local space. */
  localTransform = new Matrix4x4()

  /** The inverse transformation matrix in world space. */
  inverseWorldTransform = new Matrix4x4()

  /** The normal transformation matrix. */
  normalTransform = new Matrix4x4()

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
  setFromMatrix(matrix: Matrix4x4) {
    this.localTransform.copyFrom(matrix)
    this.position.copyFrom(this.localTransform.position)
    this.scale.copyFrom(this.localTransform.scaling)
    this.rotationQuaternion.copyFrom(this.localTransform.rotation)
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
  lookAt(point: Point3D, up = new Float32Array([0, 1, 0])) {
    let rot = Mat4.getRotation(
      Mat4.targetTo(point.array, this.worldTransform.position.array, up))
    this.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
  }
}