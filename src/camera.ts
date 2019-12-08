import { mat4 } from "gl-matrix"
import { UpdatableFloat32Array } from "./matrix"
import { Transform3D } from "./transform"
import { ScreenSpace, WorldSpace } from "./space"

export class Camera3D extends PIXI.DisplayObject {
  transform = new Transform3D()

  private _id = 0

  get id() {
    return this.transform._worldID + this._id
  }

  private _projection?: UpdatableFloat32Array
  private _view?: UpdatableFloat32Array
  private _viewProjection?: UpdatableFloat32Array

  static main = new Camera3D()

  constructor(private _aspectRatio = 1, private _fieldOfView = 45, private _near = 0.1, private _far = 1000) {
    super()

    this.position.z = 5
    this.rotation.y = 180
  }

  screenToWorld(x: number, y: number, z: number, screenSize: { width: number, height: number }) {
    return ScreenSpace.toWorld(x, y, z,
      screenSize.width, screenSize.height, this.viewProjection)
  }

  worldToScreen(x: number, y: number, z: number, viewSize: { width: number, height: number }) {
    return WorldSpace.toScreen(x, y, z, this.view, this.projection, viewSize.width, viewSize.height)
  }

  get aspectRatio() {
    return this._aspectRatio
  }

  set aspectRatio(value: number) {
    if (this._aspectRatio !== value) {
      this._aspectRatio = value; this._id++
    }
  }

  get fieldOfView() {
    return this._fieldOfView
  }

  set fieldOfView(value: number) {
    if (this._fieldOfView !== value) {
      this._fieldOfView = value; this._id++
    }
  }

  get near() {
    return this._near
  }

  set near(value: number) {
    if (this._near !== value) {
      this._near = value; this._id++
    }
  }

  get far() {
    return this._far
  }

  set far(value: number) {
    if (this._far !== value) {
      this._far = value; this._id++
    }
  }

  get projection() {
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    if (!this._projection) {
      this._projection = new UpdatableFloat32Array(this, 16, data => {
        mat4.perspective(data, this._fieldOfView, this._aspectRatio, this._near, this._far)
      })
    }
    return this._projection.data
  }

  get view() {
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    if (!this._view) {
      this._view = new UpdatableFloat32Array(this, 16, data => {
        mat4.lookAt(data, this.transform.worldTransform.position, this.transform.worldTransform.direction, this.transform.worldTransform.up)
      })
    }
    return this._view.data
  }

  get viewProjection() {
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    if (!this._viewProjection) {
      this._viewProjection = new UpdatableFloat32Array(this, 16, data => {
        mat4.multiply(data, this.projection, this.view)
      })
    }
    return this._viewProjection.data
  }

  get position() {
    return this.transform.position
  }

  get rotation() {
    return this.transform.rotation
  }

  get viewPosition() {
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    return this.transform.worldTransform.position
  }
}