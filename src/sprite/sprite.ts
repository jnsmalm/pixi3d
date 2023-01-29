import { Renderer, Texture, Resource } from "@pixi/core"
import { IDestroyOptions } from "@pixi/display"
import { BLEND_MODES } from "@pixi/constants"
import { ObservablePoint } from "@pixi/math"
import { Camera } from "../camera/camera"
import { Mat4 } from "../math/mat4"
import { Vec3 } from "../math/vec3"
import { SpriteBillboardType } from "./sprite-billboard-type"
import { Container3D } from "../container"
import { ProjectionSprite } from "./projection-sprite"

const vec3 = new Float32Array(3)

/**
 * Represents a sprite in 3D space.
 */
export class Sprite3D extends Container3D {
  private _sprite: ProjectionSprite
  private _modelView = new Float32Array(16)
  private _cameraTransformId?: number
  private _billboardType?: SpriteBillboardType
  private _parentID?: number

  /**
   * The camera used when rendering the sprite. Uses main camera by default.
   */
  camera?: Camera

  /**
   * Creates a new sprite using the specified texture.
   * @param texture The texture to use.
   */
  constructor(texture?: Texture<Resource>) {
    super()
    this._sprite = new ProjectionSprite(texture)
    this._sprite.anchor.set(0.5)
  }

  /**
   * The billboard type to use when rendering the sprite. Used for making the 
   * sprite always face the viewer.
   */
  get billboardType() {
    return this._billboardType
  }

  set billboardType(value: SpriteBillboardType | undefined) {
    if (value !== this._billboardType) {
      this._billboardType = value
      this._cameraTransformId = undefined
    }
  }

  /** Defines the size of the sprite relative to a unit in world space. */
  get pixelsPerUnit() {
    return this._sprite.pixelsPerUnit
  }

  set pixelsPerUnit(value: number) {
    this._sprite.pixelsPerUnit = value
  }

  /**
   * The zIndex of the sprite.
   * A higher value will mean it will be rendered on top of other sprites within the same container.
   */
  get renderSortOrder() {
    return this._sprite.zIndex;
  }

  set renderSortOrder(value: number) {
    this._sprite.zIndex = value;
  }

  /**
   * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF 
   * will remove any tint effect.
   */
  get tint() {
    return this._sprite.tint
  }

  set tint(value: number) {
    this._sprite.tint = value
  }

  /**
   * Destroys this sprite and optionally its texture and children.
   */
  destroy(options?: boolean | IDestroyOptions) {
    super.destroy(options)
    this._sprite.destroy(options)
  }

  /**
   * Renders the sprite.
   * @param renderer The renderer to use.
   */
  _render(renderer: Renderer) {
    const camera = this.camera || Camera.main
    const update = camera.transformId !== this._cameraTransformId ||
      this._parentID !== this.transform._worldID

    if (update) {
      const scaling = this.worldTransform.scaling
      Mat4.multiply(camera.view.array, this.worldTransform.array, this._modelView)
      switch (this._billboardType) {
        case SpriteBillboardType.spherical: {
          this._modelView[0] = scaling.x
          this._modelView[1] = 0
          this._modelView[2] = 0
          this._modelView[3] = 0
          this._modelView[4] = 0
          this._modelView[5] = scaling.y
          this._modelView[6] = 0
          this._modelView[7] = 0
          break
        }
        case SpriteBillboardType.cylindrical: {
          this._modelView[0] = scaling.x
          this._modelView[1] = 0
          this._modelView[2] = 0
          this._modelView[3] = 0
          this._modelView[8] = 0
          this._modelView[9] = 0
          this._modelView[10] = 1
          this._modelView[11] = 0
          break
        }
      }
      Mat4.multiply(camera.projection.array,
        this._modelView, this._sprite.modelViewProjection.array)
      this._parentID = this.transform._worldID
      this._cameraTransformId = camera.transformId
      const dir = Vec3.subtract(camera.worldTransform.position.array, 
        this.worldTransform.position.array, vec3)
      const projection = Vec3.scale(camera.worldTransform.forward.array,
        Vec3.dot(dir, camera.worldTransform.forward.array), vec3)
      this._sprite.distanceFromCamera = Vec3.squaredMagnitude(projection)
    }
    this._sprite.worldAlpha = this.worldAlpha
    this._sprite.render(renderer)
  }

  /**
   * The anchor sets the origin point of the sprite.
   */
  get anchor() {
    return this._sprite.anchor
  }

  set anchor(value: ObservablePoint) {
    this._sprite.anchor = value
  }

  /** The texture used when rendering the sprite. */
  get texture() {
    return this._sprite.texture
  }

  set texture(value: Texture<Resource>) {
    this._sprite.texture = value
  }

  /** The blend used when rendering the sprite. */
  get blendMode() {
    return this._sprite.blendMode
  }

  set blendMode(value: BLEND_MODES) {
    this._sprite.blendMode = value
  }
}