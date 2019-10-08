import { vec3, mat4 } from "gl-matrix"
import { Transform3D } from "./transform"

class CameraTransform3D extends Transform3D {
  localPosition = vec3.create()
  localForward = vec3.create()
  localUp = vec3.create()
  localDirection = vec3.create()

  updateLocalTransform() {
    if (this._localID === this._currentLocalID) {
      return
    }
    super.updateLocalTransform()
    vec3.set(this.localPosition, this.position.x, this.position.y, this.position.z)
    vec3.set(this.localForward, this.localTransform[8], this.localTransform[9], this.localTransform[10])
    vec3.set(this.localUp, this.localTransform[4], this.localTransform[5], this.localTransform[6])
    vec3.add(this.localDirection, this.localPosition, this.localForward)
  }
}

export class Camera3D {
  transform = new CameraTransform3D()

  private _projection = mat4.create()
  private _view = mat4.create()
  private _viewProjection = mat4.create()
  private _projectionID = -1
  private _viewID = -1
  private _viewProjectionID = -1

  static main = new Camera3D()

  constructor(public aspectRatio = 1, public fieldOfView = 45, public near = 0.1, public far = 1000) {
  }

  get projection() {
    if (this._projectionID !== this.transform._localID) {
      this.updateProjection()
    }
    return this._projection
  }

  get view() {
    if (this._viewID !== this.transform._localID) {
      this.updateView()
    }
    return this._view
  }

  get viewProjection() {
    if (this._viewProjectionID !== this.transform._localID) {
      this.updateViewProjection()
    }
    return this._viewProjection
  }

  get position() {
    return this.transform.position
  }

  get rotation() {
    return this.transform.rotation
  }

  updateProjection() {
    mat4.perspective(this._projection, this.fieldOfView, this.aspectRatio, this.near, this.far)
    this._projectionID = this.transform._localID
  }

  updateViewProjection() {
    mat4.multiply(this._viewProjection, this.projection, this.view)
    this._viewProjectionID = this.transform._localID
  }

  updateView() {
    this.transform.updateLocalTransform()
    mat4.lookAt(this._view,
      this.transform.localPosition, this.transform.localDirection, this.transform.localUp)
    this._viewID = this.transform._localID
  }
}