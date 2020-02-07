import { Container3D } from "../container"
import { SkyboxMaterialFactory } from "./skybox-material"
import { Mesh3D } from "../mesh/mesh"

/**
 * A skybox is a method of creating backgrounds in a 3D scene. It consists of
 * a cube texture which has six sides.
 */
export class Skybox extends Container3D {

  /** Cube mesh used to render the skybox. */
  mesh: Mesh3D

  /**
   * Creates a new skybox using the specified cube texture.
   * @param texture Cube texture to use.
   */
  constructor(public texture: PIXI.CubeTexture) {
    super()

    this.mesh = this.addChild(
      Mesh3D.createCube(new SkyboxMaterialFactory(texture)))
    this.mesh.scale.set(500)
  }
}