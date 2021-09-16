import { ObservablePoint } from "pixi.js"
import { Mat3 } from "../math/mat3"

/**
 * Transform used to offset, rotate and scale texture coordinates.
 */
export class TextureTransform {
  private _rotation = 0
  private _array = new Float32Array(9)
  private _dirty = true
  private _translation = new Float32Array([
    1, 0, 0, 0, 1, 0, 0, 0, 1
  ])
  private _scaling = new Float32Array([
    1, 0, 0, 0, 1, 0, 0, 0, 1
  ])
  private _rotate = new Float32Array([
    Math.cos(0), -Math.sin(0), 0, Math.sin(0), Math.cos(0), 0, 0, 0, 1
  ])

  /** The rotation for the texture coordinates. */
  get rotation() {
    return this._rotation
  }

  set rotation(value: number) {
    this._rotation = value
    this._rotate.set([
      Math.cos(value), -Math.sin(value), 0, Math.sin(value), Math.cos(value), 0, 0, 0, 1
    ])
    this._dirty = true
  }

  /** The offset for the texture coordinates. */
  offset = new ObservablePoint(() => {
    this._translation.set([
      1, 0, 0, 0, 1, 0, this.offset.x, this.offset.y, 1
    ])
    this._dirty = true
  }, undefined)

  /** The scale of the texture coordinates. */
  scale = new ObservablePoint(() => {
    this._scaling.set([
      this.scale.x, 0, 0, 0, this.scale.y, 0, 0, 0, 1
    ])
    this._dirty = true
  }, undefined, 1, 1)

  /** The matrix array. */
  get array() {
    if (this._dirty) {
      Mat3.multiply(
        Mat3.multiply(this._translation, this._rotate, this._array), this._scaling, this._array)
      this._dirty = false
    }
    return this._array
  }
}