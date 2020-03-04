import { Transform3D } from "./transform"
import { ObservableQuaternion } from "./quaternion"
import { ObservablePoint3D } from "./point"
import { Container3D } from "./container"

export class DisplayObject3D extends PIXI.utils.EventEmitter {
  protected _trackedPointers?: {}
  protected _transform = new Transform3D()

  cursor?: string
  parent?: Container3D
  interactive = false
  interactiveChildren = false
  name?: string
  visible = true
  renderable = true

  set transform(value: Transform3D) {
    this._transform = value
  }

  /** The world transform and local transform of the object. */
  get transform() {
    return this._transform
  }

  get trackedPointers() {
    if (this._trackedPointers === undefined) {
      this._trackedPointers = {}
    }
    return this._trackedPointers
  }

  get buttonMode() {
    return this.cursor === "pointer"
  }

  set buttonMode(value) {
    if (value) {
      this.cursor = "pointer"
    } else if (this.cursor === "pointer") {
      this.cursor = undefined
    }
  }

  updateTransform() {
    let parentTransform: Transform3D | undefined
    if (this.parent) {
      parentTransform = this.parent.transform
    }
    this.transform.updateTransform(parentTransform)
  }

  get worldTransform() {
    return this.transform.worldTransform
  }

  get localTransform() {
    return this.transform.localTransform
  }

  set rotation(value: ObservableQuaternion | Float32Array) {
    this.transform.rotation.copyFrom(value)
  }

  /** The quaternion rotation of the object. */
  get rotation(): ObservableQuaternion | Float32Array {
    return this.transform.rotation
  }

  /** The coordinate of the object relative to the local coordinates 
   * of the parent. */
  get position() {
    return this.transform.position
  }

  set position(value: ObservablePoint3D) {
    this.transform.position.copyFrom(value)
  }

  /** The scale factor of the object. */
  get scale() {
    return this.transform.scale
  }

  set scale(value: ObservablePoint3D) {
    this.transform.scale.copyFrom(value)
  }

  /** The position of the object on the x axis relative to the local 
   * coordinates of the parent. */
  get x() {
    return this.transform.position.x
  }

  set x(value: number) {
    this.transform.position.x = value
  }

  /** The position of the object on the y axis relative to the local 
   * coordinates of the parent. */
  get y() {
    return this.transform.position.y
  }

  set y(value: number) {
    this.transform.position.y = value
  }

  /** The position of the object on the z axis relative to the local 
   * coordinates of the parent. */
  get z() {
    return this.transform.position.z
  }

  set z(value: number) {
    this.transform.position.z = value
  }
}