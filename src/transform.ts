import { vec3, mat4, quat } from "gl-matrix"
import { ObservablePoint3D } from "./point"

export class Transform3D extends PIXI.Transform {
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  rotation = new ObservablePoint3D(this.onChange, this, 0, 0, 0)

  worldTransform: mat4 = mat4.create()
  localTransform: mat4 = mat4.create()

  updateTransform(parentTransform: PIXI.Transform) {
    if (this._localID !== this._currentLocalID) {
      mat4.fromRotationTranslationScale(
        this.localTransform,
        quat.fromEuler(quat.create(), this.rotation.x, this.rotation.y, this.rotation.z),
        vec3.fromValues(this.position.x, this.position.y, this.position.z),
        vec3.fromValues(this.scale.x, this.scale.y, this.scale.z)
      )
      this._parentID = -1
      this._currentLocalID = this._localID
    }
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