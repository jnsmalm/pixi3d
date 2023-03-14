import { ObservablePoint } from "@pixi/math"
import type { InteractionEvent } from "@pixi/interaction"
import { Compatibility } from "../compatibility/compatibility"
import { Quat } from "../math/quat"
import { Vec3 } from "../math/vec3"
import { Camera } from "./camera"

/**
 * Allows the user to control the camera by orbiting the target.
 */
export class CameraOrbitControl {
  protected _autoUpdate = true;

  /** 
   * Whether to auto update the camera on prerender.
   * Default is true.
   */
  get autoUpdate(): boolean {
    return this._autoUpdate
  }

  set autoUpdate(value: boolean) {
    this._autoUpdate = value
  }

  protected _allowControl = true

  /** 
   * Allows the camera to be controlled by user.
   */
  get allowControl(): boolean {
    return this._allowControl
  }

  set allowControl(value: boolean) {
    this._allowControl = value
  }

  protected _camera = Camera.main

  /** 
   * The camera being controlled.
   */
  get camera(): Camera {
    return this._camera
  }

  set camera(value: Camera) {
    this._camera = value
  }

  protected _target = { x: 0, y: 0, z: 0 }

  /** 
   * Target position (x, y, z) to orbit.
   */
  get target(): { x: number; y: number; z: number } {
    return this._target
  }

  set target(value: { x: number; y: number; z: number }) {
    this._target = value
  }

  protected _angles = new ObservablePoint(() => {
    this._angles.x = Math.min(Math.max(-85, this._angles.x), 85)
  }, undefined, 0, 180)

  /**
   * Orientation euler angles (x-axis and y-axis).
   * The angle for the x-axis will be clamped between -85 and 85 degrees.
   */
  get angles() {
    return this._angles
  }

  protected _distance = 5

  /**
   * Distance between camera and the target.
   * Default value is 5.
   */
  get distance(): number {
    return this._distance
  }

  set distance(value: number) {
    this._distance = Math.min(Math.max(value, 0.01), Number.MAX_SAFE_INTEGER)
  }

  protected _enableDamping = false

  /** 
   * Value indicating if damping (inertia) is enabled, which can be used to give a sense of weight to the controls.
   * Default is false.
   */
  get enableDamping(): boolean {
    return this._enableDamping
  }

  set enableDamping(value: boolean) {
    this._enableDamping = value
  }

  protected _dampingFactor = 0.1

  /** 
   * The damping inertia used if enableDamping is true.
   * Default is 0.1.
   */
  get dampingFactor(): number {
    return this._dampingFactor
  }

  set dampingFactor(value: number) {
    this._dampingFactor = value
  }

  protected _element: HTMLElement

  protected _grabbed = false

  protected _previousPinchDistance = 0

  protected _previousClientX = 0

  protected _previousClientY = 0

  protected _dampingAngles = { x: 0, y: 180 }

  protected _dampingDistance = 5

  /**
   * Creates a new camera orbit control.
   * @param element The element for listening to user events.
   * @param camera The camera to control. If not set, the main camera will be used
   * by default.
   */
  constructor(element: HTMLElement, camera = Camera.main) {
    this._element = element
    this._camera = camera
    this.bind()
  }

  destroy(): void {
    this.unbind()
  }

  protected onPointerDown = (clientX: number, clientY: number): void => {
    this._grabbed = true
    this._previousClientX = clientX
    this._previousClientY = clientY
  }

  protected onPointerUp = (): void => {
    this._grabbed = false
  }

  protected onPointerMove = (clientX: number, clientY: number): void => {
    if (this._grabbed) {
      const movementX = clientX - this._previousClientX
      const movementY = clientY - this._previousClientY
      this.angles.x += movementY * 0.5
      this.angles.y -= movementX * 0.5
      this.updateCamera()
      this._previousClientX = clientX
      this._previousClientY = clientY
    }
  }

  protected onPreRender = (): void => {
    if (this.autoUpdate) {
      this.updateCamera()
    }
  }

  protected onMouseDownInteraction = (e: InteractionEvent): void => {
    if (this.allowControl) {
      if (!e.stopped) {
        this._grabbed = true
        const originalEvent = e.data.originalEvent
        const touchEvent = originalEvent as TouchEvent
        const mouseEvent = originalEvent as MouseEvent
        const touch = touchEvent?.targetTouches?.[0]
        const clientX = touch?.clientX ?? mouseEvent?.clientX
        const clientY = touch?.clientY ?? mouseEvent?.clientY
        this.onPointerDown(clientX, clientY)
      }
    }
  }

  protected onMouseDown = (e: MouseEvent): void => {
    if (this.allowControl) {
      this.onPointerDown(e.clientX, e.clientY)
    }
  }

  protected onMouseMove = (e: MouseEvent): void => {
    if (this.allowControl) {
      if (e.buttons === 1) {
        this.onPointerMove(e.clientX, e.clientY)
      }
    }
  }

  protected onMouseUp = (_e: MouseEvent): void => {
    if (this.allowControl) {
      this.onPointerUp()
    }
  }

  protected onWheel = (e: WheelEvent): void => {
    if (this.allowControl) {
      this.distance += e.deltaY * 0.01
      e.preventDefault()
      this.updateCamera()
    }
  }

  protected onTouchStart = (e: TouchEvent): void => {
    if (this.allowControl) {
      const touch = e?.targetTouches?.[0]
      if (touch) {
        const clientX = touch.clientX
        const clientY = touch.clientY
        this.onPointerDown(clientX, clientY)
      }
      if (e.touches.length === 2) {
        e.preventDefault() // Prevent page scroll
        this._previousPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }
  }

  protected onPinch = (e: TouchEvent): void => {
    if (this.allowControl) {
      e.preventDefault() // Prevent page scroll
      const currentPinchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const deltaPinchDistance =
        currentPinchDistance - this._previousPinchDistance
      this.distance -= deltaPinchDistance * 0.1
      this.updateCamera()
      this._previousPinchDistance = currentPinchDistance
    }
  }

  protected onTouchMove = (e: TouchEvent): void => {
    if (this.allowControl) {
      const touch = e?.targetTouches?.[0]
      if (e.touches.length === 1 && touch) {
        const clientX = touch.clientX
        const clientY = touch.clientY
        this.onPointerMove(clientX, clientY)
      }
      if (e.touches.length === 2) {
        this.onPinch(e)
      }
    }
  }

  protected onTouchEnd = (e: TouchEvent): void => {
    if (this.allowControl) {
      if (e.touches.length === 0) {
        this.onPointerUp()
      }
    }
  }

  protected bind(): void {
    this.camera.renderer.on("prerender", this.onPreRender)
    let interaction = Compatibility.getInteractionPlugin(this.camera.renderer)
    if (interaction) {
      interaction.on("mousedown", this.onMouseDownInteraction)
    }
    this._element.addEventListener("mousedown", this.onMouseDown)
    this._element.addEventListener("touchstart", this.onTouchStart)
    this._element.addEventListener("wheel", this.onWheel)
    // Bind mouse and touch equivalent pointermove and pointerup events to window
    // to support the case where the pointer leaves the element while dragging
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("touchmove", this.onTouchMove)
    window.addEventListener("mouseup", this.onMouseUp)
    window.addEventListener("touchend", this.onTouchEnd)
  }

  protected unbind(): void {
    this._element.removeEventListener("mousedown", this.onMouseDown)
    this._element.removeEventListener("touchstart", this.onTouchStart)
    this._element.removeEventListener("wheel", this.onWheel)
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("touchmove", this.onTouchMove)
    window.removeEventListener("mouseup", this.onMouseUp)
    window.removeEventListener("touchend", this.onTouchEnd)
  }

  /**
   * Updates the position and rotation of the camera.
   */
  updateCamera(): void {
    if (this.enableDamping) {
      this._dampingAngles.x +=
        (this.angles.x - this._dampingAngles.x) * this.dampingFactor
      this._dampingAngles.y +=
        (this.angles.y - this._dampingAngles.y) * this.dampingFactor
      this._dampingDistance +=
        (this.distance - this._dampingDistance) * this.dampingFactor
    }

    const angles = this.enableDamping ? this._dampingAngles : this.angles
    const distance = this.enableDamping ? this._dampingDistance : this.distance

    const rot = Quat.fromEuler(angles.x, angles.y, 0, new Float32Array(4))
    const dir = Vec3.transformQuat(
      Vec3.set(0, 0, 1, new Float32Array(3)), rot, new Float32Array(3))
    const pos = Vec3.subtract(
      Vec3.set(this.target.x, this.target.y, this.target.z, new Float32Array(3)), Vec3.scale(dir, distance, new Float32Array(3)), new Float32Array(3))

    this.camera.position.set(pos[0], pos[1], pos[2])
    this.camera.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
  }
}