import { SkyboxMaterialFactory } from "./skybox-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { CubeMipMapTexture } from "../cubemap/cube-mipmap"

/**
 * A skybox is a method of creating backgrounds in a 3D scene. It consists of
 * a cube texture which has six sides.
 */
export class Skybox extends Container3D {
  private _mesh: Mesh3D

  /**
   * Creates a new skybox using the specified cube texture.
   * @param texture Cube texture to use.
   */
  constructor(texture: CubeMipMapTexture) {
    super()
    this._mesh = this.addChild(
      Mesh3D.createCube(new SkyboxMaterialFactory(texture)))
  }
}