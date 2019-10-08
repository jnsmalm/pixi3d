import { vec3, mat4, quat } from "gl-matrix"
import { ObservablePoint3D } from "./point"

const position = vec3.create()
const scale = vec3.create()
const rotation = quat.create()

export class Transform3D extends PIXI.Transform {
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  rotation = new ObservablePoint3D(this.onChange, this, 0, 0, 0)

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
    quat.fromEuler(rotation, this.rotation.x, this.rotation.y, this.rotation.z)
    vec3.set(scale, this.scale.x, this.scale.y, this.scale.z)
    vec3.set(position, this.position.x, this.position.y, this.position.z)
    mat4.fromRotationTranslationScale(this.localTransform, rotation, position, scale)

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