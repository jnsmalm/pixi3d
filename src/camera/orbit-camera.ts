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
  private _rotation = Quaternion.create()
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
        this.updateOrbitBy(-event.movementX * 0.01, -event.movementY * 0.01)
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
    this.updateOrbitBy(0, 0)
  }

  /**
   * Updates the orbit position by the specified x-axis and y-axis.
   * @param x Value for the x-axis.
   * @param y Value for the y-axis.
   */
  updateOrbitBy(x: number, y: number) {
    MatrixPool.scope(() => {
      Quaternion.rotateY(this._rotation, x, this._rotation)
      Quaternion.rotateX(this._rotation, y, this._rotation)

      let pos = Vector3.transformQuat(
        Vector3.from({ x: 0, y: 0, z: this._distance }), this._rotation)
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