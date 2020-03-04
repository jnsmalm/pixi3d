import { DisplayObject3D } from "./object"
import { Transform3D } from "./transform"

/**
 * A container represents a collection of 3D objects.
 */
export class Container3D extends DisplayObject3D {
  private _container: any

  constructor() {
    super()

    this._container = new PIXI.Container()
    this._container.transform = this.transform
  }

  get transform() {
    return this._transform
  }

  set transform(value: Transform3D) {
    this._transform = value
    this._container.transform = value
  }

  get children() {
    return this._container.children
  }

  get parent(): Container3D | undefined {
    return this._container.parent
  }

  set parent(parent: Container3D | undefined) {
    this._container.parent = parent
  }

  updateTransform() {
    this._container.updateTransform()
  }

  addChild(child: Container3D) {
    return this._container.addChild(child)
  }

  removeChild(child: Container3D) {
    return this._container.removeChild(child)
  }

  render(renderer: PIXI.Renderer) {
    if (!this.visible || !this.renderable) {
      return
    }
    this._container.render(renderer)
  }
}