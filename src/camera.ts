import { mat4 } from "gl-matrix"
import { Transform3D } from "./transform"

export class Camera3D {
  transform = new Transform3D()

  private _projection = mat4.create()
  private _view = mat4.create()
  private _viewProjection = mat4.create()
  private _projectionID = -1
  private _viewID = -1
  private _viewProjectionID = -1

  static main = new Camera3D()

  constructor(private _aspectRatio = 1, private _fieldOfView = 45, private _near = 0.1, private _far = 1000) {
    this.position.z = 5
    this.rotation.y = 180
  }

  get aspectRatio() {
    return this._aspectRatio
  }

  set aspectRatio(value: number) {
    if (this._aspectRatio !== value) {
      this._aspectRatio = value
      this._viewProjectionID = this._projectionID = -1
    }
  }

  get fieldOfView() {
    return this._fieldOfView
  }

  set fieldOfView(value: number) {
    if (this._fieldOfView !== value) {
      this._fieldOfView = value
      this._viewProjectionID = this._projectionID = -1
    }
  }

  get near() {
    return this._near
  }

  set near(value: number) {
    if (this._near !== value) {
      this._near = value
      this._viewProjectionID = this._projectionID = -1
    }
  }

  get far() {
    return this._far
  }

  set far(value: number) {
    if (this._far !== value) {
      this._far = value
      this._viewProjectionID = this._projectionID = -1
    }
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
    mat4.perspective(this._projection, this._fieldOfView, this._aspectRatio, this._near, this._far)
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