import { mat4 } from "gl-matrix"
import { UpdatableFloat32Array } from "./matrix"
import { Transform3D } from "./transform"
import { ScreenSpace, WorldSpace } from "./space"

interface ViewSize { width: number, height: number }

export class Camera3D extends PIXI.DisplayObject {
  transform = new Transform3D()

  private _id = 0

  get id() {
    return this.transform._worldID + this._id
  }

  private _aspectTo?: ViewSize
  private _projection?: UpdatableFloat32Array
  private _view?: UpdatableFloat32Array
  private _viewProjection?: UpdatableFloat32Array

  get aspectTo() {
    return this._aspectTo
  }

  set aspectTo(value: ViewSize | undefined) {
    this._aspectTo = value
  }

  static main: Camera3D

  constructor(aspectTo?: ViewSize) {
    super()
    if (!Camera3D.main) {
      Camera3D.main = this
    }
    this._aspectTo = aspectTo

    this.position.z = 5
    this.rotation.y = 180
  }

  screenToWorld(x: number, y: number, z: number, viewSize = this._aspectTo) {
    if (!viewSize) {
      return undefined
    }
    return ScreenSpace.toWorld(x, y, z, viewSize.width, viewSize.height, this.viewProjection)
  }

  worldToScreen(x: number, y: number, z: number, viewSize = this._aspectTo) {
    if (!viewSize) {
      return undefined
    }
    return WorldSpace.toScreen(x, y, z, this.view, this.projection, viewSize.width, viewSize.height)
  }

  private _aspect = 1
  private _fieldOfView = 45
  private _near = 0.1
  private _far = 1000

  get aspect() {
    return this._aspect
  }

  set aspect(value: number) {
    if (this._aspect !== value) {
      this._aspect = value; this._id++
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
    if (this._aspectTo) {
      this.aspect = this._aspectTo.width / this._aspectTo.height
    }
    if (!this.parent) {
      this.transform.updateLocalTransform()
    }
    if (!this._projection) {
      this._projection = new UpdatableFloat32Array(this, 16, data => {
        mat4.perspective(data, this._fieldOfView, this._aspect, this._near, this._far)
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
    if (this._aspectTo) {
      this.aspect = this._aspectTo.width / this._aspectTo.height
    }
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

if (PIXI) {
  PIXI.Renderer.registerPlugin("camera", Camera3D)
}