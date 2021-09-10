import * as PIXI from "pixi.js"

import { Container3D } from "../container"
import { Mat4 } from "../math/mat4"
import { Ray } from "../math/ray"
import { Vec3 } from "../math/vec3"
import { Vec4 } from "../math/vec4"
import { MatrixComponent } from "../transform/matrix-component"
import { ObservablePoint3D } from "../transform/observable-point"
import { TransformId } from "../transform/transform-id"

const vec3 = new Float32Array(3)
const mat4 = new Float32Array(16)
const vec4 = new Float32Array(4)

/**
 * Camera is a device from which the world is viewed.
 */
export class Camera extends Container3D implements TransformId {
  private _transformId = 0

  get transformId() {
    return this.transform._worldID + this._transformId
  }

  private _projection?: MatrixComponent
  private _view?: MatrixComponent
  private _viewProjection?: MatrixComponent
  private _orthographic = false
  private _orthographicSize = 10

  /** Main camera which is used by default. */
  static main: Camera

  /**
   * Creates a new camera using the specified renderer. By default the camera
   * looks towards negative z and is positioned at z = 5.
   * @param renderer Renderer to use.
   */
  constructor(public renderer: PIXI.Renderer) {
    super()

    let aspect = renderer.width / renderer.height
    let localID = -1

    this.renderer.on("prerender", () => {
      if (!this._aspect) {
        // When there is no specific aspect set, this is used for the 
        // projection matrix to always update each frame (in case when the 
        // renderer aspect ratio has changed).
        if (renderer.width / renderer.height !== aspect) {
          this._transformId++
          aspect = renderer.width / renderer.height
        }
      }
      // @ts-ignore: _localID do exist, but be careful if this changes.
      if (!this.parent && localID !== this.transform._localID) {
        // When the camera is not attached to the scene hierarchy the transform 
        // needs to be updated manually.
        this.transform.updateTransform()
        // @ts-ignore: _localID do exist, but be careful if this changes.
        localID = this.transform._localID
      }
    })
    if (!Camera.main) {
      Camera.main = this
    }
    this.transform.position.z = 5
    this.transform.rotationQuaternion.setEulerAngles(0, 180, 0)
  }

  destroy(options?: boolean | PIXI.IDestroyOptions) {
    super.destroy(options)
    if (this === Camera.main) {
      // @ts-ignore It's ok, main camera was destroyed.
      Camera.main = undefined
    }
  }

  /**
   * The camera's half-size when in orthographic mode. The visible area from 
   * center of the screen to the top.
   */
  get orthographicSize() {
    return this._orthographicSize
  }

  set orthographicSize(value: number) {
    if (this._orthographicSize !== value) {
      this._orthographicSize = value; this._transformId++
    }
  }


  /**
   * Camera will render objects uniformly, with no sense of perspective.
   */
  get orthographic() {
    return this._orthographic
  }

  set orthographic(value: boolean) {
    if (this._orthographic !== value) {
      this._orthographic = value; this._transformId++
    }
  }

  /**
   * Converts screen coordinates to a ray.
   * @param x Screen x coordinate.
   * @param y Screen y coordinate.
   * @param viewSize The size of the view when not rendering to the entire screen.
   */
  screenToRay(x: number, y: number, viewSize: { width: number, height: number } = this.renderer) {
    let screen = this.screenToWorld(x, y, 1, undefined, viewSize)
    if (screen) {
      return new Ray(this.worldTransform.position,
        Vec3.subtract(screen.array, this.worldTransform.position, vec3))
    }
  }

  /**
   * Converts screen coordinates to world coordinates.
   * @param x Screen x coordinate.
   * @param y Screen y coordinate.
   * @param distance Distance from the camera.
   * @param point Point to set.
   * @param viewSize The size of the view when not rendering to the entire screen.
   */
  screenToWorld(x: number, y: number, distance: number, point = new ObservablePoint3D(() => { }, undefined), viewSize: { width: number, height: number } = this.renderer) {
    x = x * this.renderer.resolution
    y = y * this.renderer.resolution

    // Make sure the transform is updated in case something has been changed, 
    // otherwise it may be using wrong values.
    this.transform.updateTransform(this.parent?.transform)

    let far = this.far

    // Before doing the calculations, the far clip plane is changed to the same 
    // value as distance from the camera. By doing this we can just set z value 
    // for the clip space to 1 and the desired z position will be correct.
    this.far = distance

    let invertedViewProjection = Mat4.invert(this.viewProjection, mat4)
    if (invertedViewProjection === null) {
      return
    }
    let clipSpace = Vec4.set(
      (x / viewSize.width) * 2 - 1, ((y / viewSize.height) * 2 - 1) * -1, 1, 1, vec4
    )
    this.far = far

    let worldSpace = Vec4.transformMat4(clipSpace, invertedViewProjection, vec4)
    worldSpace[3] = 1.0 / worldSpace[3]
    for (let i = 0; i < 3; i++) {
      worldSpace[i] *= worldSpace[3]
    }
    return point.set(worldSpace[0], worldSpace[1], worldSpace[2])
  }

  /**
   * Converts world coordinates to screen coordinates.
   * @param x World x coordinate.
   * @param y World y coordinate.
   * @param z World z coordinate.
   * @param point Point to set.
   * @param viewSize The size of the view when not rendering to the entire screen.
   */
  worldToScreen(x: number, y: number, z: number, point = new PIXI.Point(), viewSize: { width: number, height: number } = this.renderer) {
    // Make sure the transform is updated in case something has been changed, 
    // otherwise it may be using wrong values.
    this.transform.updateTransform(this.parent?.transform)

    let worldSpace = Vec4.set(x, y, z, 1, vec4)
    let clipSpace = Vec4.transformMat4(
      Vec4.transformMat4(worldSpace, this.view, vec4), this.projection, vec4
    )
    if (clipSpace[3] !== 0) {
      for (let i = 0; i < 3; i++) {
        clipSpace[i] /= clipSpace[3]
      }
    }
    const width = viewSize.width / this.renderer.resolution
    const height = viewSize.height / this.renderer.resolution
    return point.set((
      clipSpace[0] + 1) / 2 * width, height - (clipSpace[1] + 1) / 2 * height)
  }

  private _fieldOfView = 60
  private _near = 0.1
  private _far = 1000
  private _aspect?: number

  /**
   * The aspect ratio (width divided by height). If not set, the aspect ratio of 
   * the renderer will be used by default.
   */
  get aspect() {
    return this._aspect
  }

  set aspect(value: number | undefined) {
    if (this._aspect !== value) {
      this._aspect = value; this._transformId++
    }
  }

  /** The vertical field of view in degrees, 60 is the default value. */
  get fieldOfView() {
    return this._fieldOfView
  }

  set fieldOfView(value: number) {
    if (this._fieldOfView !== value) {
      this._fieldOfView = value; this._transformId++
    }
  }

  /** The near clipping plane distance, 0.1 is the default value. */
  get near() {
    return this._near
  }

  set near(value: number) {
    if (this._near !== value) {
      this._near = value; this._transformId++
    }
  }

  /** The far clipping plane distance, 1000 is the default value. */
  get far() {
    return this._far
  }

  set far(value: number) {
    if (this._far !== value) {
      this._far = value; this._transformId++
    }
  }

  /** Returns the projection matrix. */
  get projection() {
    if (!this._projection) {
      this._projection = new MatrixComponent(this, 16, data => {
        const aspect = this._aspect || this.renderer.width / this.renderer.height
        if (this._orthographic) {
          Mat4.ortho(-this._orthographicSize * aspect, this._orthographicSize * aspect, -this._orthographicSize, this._orthographicSize, this._near, this._far, data)
        } else {
          Mat4.perspective(this._fieldOfView * PIXI.DEG_TO_RAD, aspect, this._near, this._far, data)
        }
      })
    }
    return this._projection.array
  }

  /** Returns the view matrix. */
  get view() {
    if (!this._view) {
      this._view = new MatrixComponent(this, 16, data => {
        const target = Vec3.add(
          this.worldTransform.position, this.worldTransform.forward, vec3)
        Mat4.lookAt(this.worldTransform.position,
          target, this.worldTransform.up, data)
      })
    }
    return this._view.array
  }

  /** Returns the view projection matrix. */
  get viewProjection() {
    if (!this._viewProjection) {
      this._viewProjection = new MatrixComponent(this, 16, data => {
        Mat4.multiply(this.projection, this.view, data)
      })
    }
    return this._viewProjection.array
  }
}

PIXI.Renderer.registerPlugin("camera", Camera)