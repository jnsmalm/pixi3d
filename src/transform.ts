import { vec3, mat4, quat } from "gl-matrix"
import { ObservablePoint3D } from "./point"

export class Transform3D extends PIXI.Transform {
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  rotation = new ObservablePoint3D(this.onChange, this, 0, 0, 0)

  localRotation = quat.create()
  localScale = vec3.create()
  localPosition = vec3.create()
  localForward = vec3.create()
  localUp = vec3.create()
  localDirection = vec3.create()

  /**
   * The world transformation matrix.
   */
  worldTransform = mat4.create()

  /**
   * The local transformation matrix.
   */
  localTransform = mat4.create()

  updateLocalTransform() {
    if (this._localID === this._currentLocalID) {
      return
    }
    quat.fromEuler(this.localRotation, this.rotation.x, this.rotation.y, this.rotation.z)
    vec3.set(this.localScale, this.scale.x, this.scale.y, this.scale.z)
    vec3.set(this.localPosition, this.position.x, this.position.y, this.position.z)
    mat4.fromRotationTranslationScale(this.localTransform, 
      this.localRotation, this.localPosition, this.localScale)

    vec3.set(this.localForward, this.localTransform[8], this.localTransform[9], this.localTransform[10])
    vec3.set(this.localUp, this.localTransform[4], this.localTransform[5], this.localTransform[6])
    vec3.add(this.localDirection, this.localPosition, this.localForward)

    this._parentID = -1
    this._currentLocalID = this._localID
  }

  updateTransform(parentTransform: PIXI.Transform) {
    this.updateLocalTransform()
    if (this._parentID === parentTransform._worldID) {
      return
    }
    if (parentTransform instanceof Transform3D) {
      mat4.multiply(this.worldTransform,
        parentTransform.worldTransform, this.localTransform)
    } else {
      mat4.copy(this.worldTransform, this.localTransform)
    }
    this._worldID++
    this._parentID = parentTransform._worldID
  }
}