import { Point3D } from "../transform/point"

/**
 * Axis-aligned bounding box.
 */
export class AABB {
  private _onChanged = () => {
    this._center.set(
      (this._min.x + this._max.x) / 2,
      (this._min.y + this._max.y) / 2,
      (this._min.z + this._max.z) / 2
    )
    this._extents.set(
      Math.abs(this._max.x - this._center.x),
      Math.abs(this._max.y - this._center.y),
      Math.abs(this._max.z - this._center.z),
    )
    this._size.set(
      this._extents.x * 2,
      this._extents.y * 2,
      this._extents.z * 2,
    )
  }

  private _min = new Point3D(0, 0, 0, this._onChanged, this)
  private _max = new Point3D(0, 0, 0, this._onChanged, this)
  private _center = new Point3D(0, 0, 0, () => { }, this)
  private _size = new Point3D(0, 0, 0, () => { }, this)
  private _extents = new Point3D(0, 0, 0, () => { }, this)

  /** The minimal point of the bounding box. */
  get min() {
    return this._min
  }

  set min(value: Point3D) {
    this._min.copyFrom(value)
  }

  /** The maximal point of the bounding box. */
  get max() {
    return this._max
  }

  set max(value: Point3D) {
    this._max.copyFrom(value)
  }

  /** The center of the bounding box. */
  get center() {
    return this._center
  }

  /** The size of the bounding box. */
  get size() {
    return this._size
  }

  /** The extents of the bounding box. */
  get extents() {
    return this._extents
  }

  /**
   * Creates a new bounding box from the specified source.
   * @param source The source to create the bounding box from.
   */
  static from(source: { min: Float32Array, max: Float32Array }) {
    let aabb = new AABB()
    aabb.min.setFrom(source.min)
    aabb.max.setFrom(source.max)
    return aabb
  }

  /**
   * Grows the bounding box to include the point.
   * @param point The point to include.
   */
  encapsulate(point: { x: number, y: number, z: number }) {
    this._min.x = Math.min(this._min.x, point.x)
    this._min.y = Math.min(this._min.y, point.y)
    this._min.z = Math.min(this._min.z, point.z)
    this._max.x = Math.max(this._max.x, point.x)
    this._max.y = Math.max(this._max.y, point.y)
    this._max.z = Math.max(this._max.z, point.z)
  }
}