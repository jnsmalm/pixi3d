import { vec3, mat4, quat } from "gl-matrix"
import { ObservablePoint3D } from "./point"
import { ObservableQuanternion } from "./quanternion"

export class Transform3D extends PIXI.Transform {
  position = new ObservablePoint3D(this.onChange, this, 0, 0, 0)
  scale = new ObservablePoint3D(this.onChange, this, 1, 1, 1)
  rotation = new ObservableQuanternion(this.onChange, this, 0, 0, 0, 1)

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
    quat.set(this.localRotation, 
      this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.w)
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

  setFromMatrix(matrix: ArrayLike<number>) {
    mat4.getTranslation(this.localPosition, matrix as mat4)
    this.position.set(
      this.localPosition[0], this.localPosition[1], this.localPosition[2]
    )
    mat4.getScaling(this.localScale, matrix as mat4)
    this.scale.set(
      this.localScale[0], this.localScale[1], this.localScale[2]
    )
    mat4.getRotation(this.localRotation, matrix as mat4)
    this.rotation.set(
      this.localRotation[0], this.localRotation[1], this.localRotation[2], this.localRotation[3]
    )
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