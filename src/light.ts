import { Transform3D } from "./transform"
import { ObservablePoint3D } from "./point"

export class DirectionalLight {
  transform = new Transform3D()

  constructor() {
    this.transform.position.z = 5
  }

  get position() {
    return this.transform.position
  }
}

class PointLight extends PIXI.DisplayObject {
  transform = new Transform3D()

  constructor(x = 0, y = 0, z = 0, public color = [1, 1, 1]) {
    super()
    this.position.set(x, y, z)
  }

  get position() {
    return this.transform.position
  }

  get worldPosition() {
    // Make sure the transform is updated. This may happen when the light has 
    // not been added to the stage heirarchy.
    if (!this.parent) {
      this.transform.updateLocalTransform()
      return this.transform.localPosition
    }
    this.transform.updateTransform(this.parent.transform)
    return [
      this.transform.worldTransform[12],
      this.transform.worldTransform[13],
      this.transform.worldTransform[14],
    ]
  }
}

export class LightingEnvironment {
  pointLights: PointLight[] = []
  directionalLight: DirectionalLight | undefined
  environment: PIXI.CubeTexture | undefined

  static main = new LightingEnvironment()

  constructor() {
    this.directionalLight = new DirectionalLight()
  }

  createPointLight(x = 0, y = 0, z = 0, color = [1, 1, 1]) {
    this.pointLights.push(new PointLight(x, y, z, color))
    return this.pointLights[this.pointLights.length - 1]
  }
}