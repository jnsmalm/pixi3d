import { Quaternion } from "../math/quaternion"
import { Camera3D } from "./camera"
import { Matrix3 } from "../math/matrix3"
import { Matrix4 } from "../math/matrix4"
import { Vector3 } from "../math/vector3"
import { MatrixPool } from "../math/matrix-pool"

/**
 * Allows the user to control the camera by orbiting around the target.
 */
export class OrbitCameraControl {
  private _euler = { x: 0, y: 0 }
  private _distance = 5

  /** Allows the camera to be controlled. */
  allowControl = true

  constructor(canvas: HTMLCanvasElement, public camera = Camera3D.main) {
    canvas.addEventListener("mousewheel", (event: Event) => {
      if (this.allowControl) {
        this.distance -= (<WheelEvent>event).deltaY * 0.01
        event.preventDefault()
      }
    })
    canvas.addEventListener("mousemove", (event) => {
      if (this.allowControl && event.buttons === 1) {
        this.orbitBy(-event.movementY, -event.movementX)
      }
    })
  }

  get distance() {
    return this._distance
  }

  /**
   * Get or sets the distance (in units) between camera and the target.
   */
  set distance(value: number) {
    this._distance = value
    this.orbitTo(this._euler.x, this._euler.y)
  }

  /**
   * Moves the orbit position by the specified x-axis and y-axis.
   * @param x Value for the x-axis.
   * @param y Value for the y-axis.
   */
  orbitBy(x: number, y: number) {
    this.orbitTo(this._euler.x + x, this._euler.y + y)
  }

  /**
   * Sets the orbit position to the specified x-axis and y-axis.
   * @param x Value for the x-axis (between -75 and 75).
   * @param y Value for the y-axis.
   */
  orbitTo(x: number, y: number) {
    this._euler.x = Math.min(Math.max(-75, x), 75)
    this._euler.y = y

    MatrixPool.scope(() => {
      let quat = Quaternion.fromEuler(this._euler.x, this._euler.y, 0)
      let pos = Vector3.transformQuat(
        Vector3.from({ x: 0, y: 0, z: this._distance }), quat)
      let up = Vector3.from({ x: 0, y: 1, z: 0 })
      let forward = Vector3.normalize(pos)
      let target = Vector3.from({ x: 0, y: 0, z: 0 })
      let rot = Quaternion.normalize(
        Quaternion.fromMat3(
          Matrix3.fromMat4(
            Matrix4.targetTo(target, forward, up))))

      this.camera.rotationQuaternion.set(rot[0], rot[1], rot[2], rot[3])
      this.camera.position.set(pos[0], pos[1], pos[2])
    })
  }
}