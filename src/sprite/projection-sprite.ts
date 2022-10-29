import { Sprite } from "@pixi/sprite"
import { Texture, Resource } from "@pixi/core"
import { settings } from "@pixi/settings"
import { Matrix4x4 } from "../transform/matrix"

export class ProjectionSprite extends Sprite {
  private _pixelsPerUnit = 100

  distanceFromCamera = 0
  modelViewProjection = new Matrix4x4()

  constructor(texture?: Texture<Resource>) {
    super(texture)
    this.pluginName = "pipeline"
  }

  get pixelsPerUnit() {
    return this._pixelsPerUnit
  }

  set pixelsPerUnit(value: number) {
    if (value !== this._pixelsPerUnit) {
      // @ts-ignore
      this._transformID = -1
      this._pixelsPerUnit = value
    }
  }

  calculateVertices() {
    const texture = this._texture
    // @ts-ignore
    if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) {
      return
    }
    if (this._textureID !== texture._updateID) {
      this.uvs = this._texture._uvs.uvsFloat32
    }
    // @ts-ignore
    this._transformID = this.transform._worldID
    this._textureID = texture._updateID

    const wt = this.transform.worldTransform;
    const orig = texture.orig
    const anchor = this._anchor

    const w1 = texture.trim ? texture.trim.x - (anchor._x * orig.width) : -anchor._x * orig.width
    const w0 = texture.trim ? w1 + texture.trim.width : w1 + orig.width
    const h1 = texture.trim ? texture.trim.y - (anchor._y * orig.height) : -anchor._y * orig.height
    const h0 = texture.trim ? h1 + texture.trim.height : h1 + orig.height

    this.vertexData[0] = ((wt.a * w1) + (wt.c * -h1)) / this._pixelsPerUnit
    this.vertexData[1] = ((wt.d * -h1) + (wt.b * w1)) / this._pixelsPerUnit

    this.vertexData[2] = ((wt.a * w0) + (wt.c * -h1)) / this._pixelsPerUnit
    this.vertexData[3] = ((wt.d * -h1) + (wt.b * w0)) / this._pixelsPerUnit

    this.vertexData[4] = ((wt.a * w0) + (wt.c * -h0)) / this._pixelsPerUnit
    this.vertexData[5] = ((wt.d * -h0) + (wt.b * w0)) / this._pixelsPerUnit

    this.vertexData[6] = ((wt.a * w1) + (wt.c * -h0)) / this._pixelsPerUnit
    this.vertexData[7] = ((wt.d * -h0) + (wt.b * w1)) / this._pixelsPerUnit

    if (this.roundPixels) {
      const resolution = settings.RESOLUTION
      for (var i = 0; i < this.vertexData.length; ++i) {
        this.vertexData[i] = Math.round((this.vertexData[i] * resolution | 0) / resolution)
      }
    }
  }
}