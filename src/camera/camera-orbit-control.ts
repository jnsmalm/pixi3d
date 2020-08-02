import { Camera3D } from "./camera"
import { Quaternion } from "../math/quaternion"
import { Vector3 } from "../math/vector3"

/**
 * Allows the user to control the camera by orbiting the target.
 */
export class CameraOrbitControl {
  private _distance = 5

  private _angles = new PIXI.ObservablePoint(() => {
    this._angles.x = Math.min(Math.max(-85, this._angles.x), 85)
  }, undefined, 0, 180)

  /**
   * Orientation euler angles (x-axis and y-axis). The angle for the x-axis 
   * will be clamped between -85 and 85 degrees.
   */
  get angles() {
    return this._angles
  }

  /** Target position (x, y, z) to orbit. */
  target = { x: 0, y: 0, z: 0 }

  /** Allows the camera to be controlled. */
  allowControl = true

  /**
   * Creates a new camera orbit control.
   * @param canvas Canvas for user events.
   * @param camera Camera to control. If not set, the main camera will be used 
   * by default.
   */
  constructor(canvas: HTMLCanvasElement, public camera = Camera3D.main) {
    this.camera.renderer.on("prerender", () => {
      this.updateCamera()
    })
    canvas.addEventListener("mousemove", (event) => {
      if (this.allowControl && event.buttons === 1) {
        this._angles.x += event.movementY * 0.5
        this._angles.y -= event.movementX * 0.5
      }
    })
    canvas.addEventListener("mousewheel", (event: Event) => {
      if (this.allowControl) {
        this.distance += (<WheelEvent>event).deltaY * 0.01
        event.preventDefault()
      }
    })
  }

  /**
   * Updates the position and rotation of the camera.
   */
  updateCamera() {
    let rot = Quaternion.fromEuler(this._angles.x, this._angles.y, 0, new Float32Array(4))
    let dir = Vector3.transformQuat(
      Vector3.set(0, 0, 1, new Float32Array(3)), rot, new Float32Array(3))
    let pos = Vector3.subtract(
      Vector3.set(this.target.x, this.target.y, this.target.z, new Float32Array(3)), Vector3.scale(dir, this.distance, new Float32Array(3)), new Float32Array(3))

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