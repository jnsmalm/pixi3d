import { ObservablePoint } from "@pixi/math"
import type { InteractionEvent } from "@pixi/interaction"
import { Camera } from "./camera"
import { Quat } from "../math/quat"
import { Vec3 } from "../math/vec3"
import { Compatibility } from "../compatibility/compatibility"

/**
 * Allows the user to control the camera by orbiting the target.
 */
export class CameraOrbitControl {
  private _grabbed = false

  private _dampingAngles = new ObservablePoint(() => { }, undefined, 0, 180)

  private _distance = 5
  private _dampingDistance = 5

  private _angles = new ObservablePoint(() => {
    this._angles.x = Math.min(Math.max(-85, this._angles.x), 85)
  }, undefined, 0, 180)

  /**
   * Orientation euler angles (x-axis and y-axis). The angle for the x-axis 
   * will be clamped between -85 and 85 degrees.
   */
  get angles() {
    return this._angles
  }

  /** Value indicating if damping (inertia) is enabled, which can be used to give a sense of weight to the controls. Default is false. */
  enableDamping = false

  /** The damping inertia used if enableDamping is true. Default is 0.1. */
  dampingFactor = 0.1

  /** Target position (x, y, z) to orbit. */
  target = { x: 0, y: 0, z: 0 }

  /** Allows the camera to be controlled by user. */
  allowControl = true

  /**
   * Creates a new camera orbit control.
   * @param element The element for listening to user events.
   * @param camera The camera to control. If not set, the main camera will be used 
   * by default.
   */
  constructor(element: HTMLElement, public camera = Camera.main) {
    this.camera.renderer.on("prerender", () => {
      if (this.enableDamping) {
        this._dampingAngles.x = this._dampingAngles.x + (this._angles.x - this._dampingAngles.x) * this.dampingFactor
        this._dampingAngles.y = this._dampingAngles.y + (this._angles.y - this._dampingAngles.y) * this.dampingFactor
        this._dampingDistance = this._dampingDistance + (this._distance - this._dampingDistance) * this.dampingFactor
      }
      this.updateCamera()
    })
    let interaction = Compatibility.getInteractionPlugin(this.camera.renderer)
    if (interaction) {
      interaction.on("mousedown", (e: InteractionEvent) => {
        if (!e.stopped) {
          this._grabbed = true
        }
      })
    }
    element.addEventListener("mousedown", () => {
      this._grabbed = true
    })
    element.addEventListener("mouseup", () => {
      this._grabbed = false
    })
    element.addEventListener("mousemove", (event) => {
      if (this.allowControl && event.buttons === 1 && this._grabbed) {
        this._angles.x += event.movementY * 0.5
        this._angles.y -= event.movementX * 0.5
      }
    })
    element.addEventListener("wheel", (event) => {
      if (this.allowControl) {
        this.distance += event.deltaY * 0.01
        event.preventDefault()
      }
    })
  }

  /**
   * Updates the position and rotation of the camera.
   */
  updateCamera() {
    let angles = this.enableDamping ? this._dampingAngles : this._angles
    let distance = this.enableDamping ? this._dampingDistance : this._distance

    let rot = Quat.fromEuler(angles.x, angles.y, 0, new Float32Array(4))
    let dir = Vec3.transformQuat(
      Vec3.set(0, 0, 1, new Float32Array(3)), rot, new Float32Array(3))
    let pos = Vec3.subtract(
      Vec3.set(this.target.x, this.target.y, this.target.z, new Float32Array(3)), Vec3.scale(dir, distance, new Float32Array(3)), new Float32Array(3))

    this.camera.position.set(pos[0], pos[1], pos[2])
    this.camera.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
  }

  /**
   * Distance between camera and the target. Default value is 5.
   */
  get distance() {
    return this._distance
  }

  set distance(value: number) {
    this._distance = Math.min(
      Math.max(value, 0.01), Number.MAX_SAFE_INTEGER)
  }
}