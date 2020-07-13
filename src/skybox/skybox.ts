import { SkyboxMaterialFactory, SkyboxMaterial } from "./skybox-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { CubeMipMapTexture } from "../cubemap/cubemap-texture"
import { Camera3D } from "../camera/camera"

/**
 * A skybox is a method of creating backgrounds in a 3D scene. It consists of
 * a cube texture which has six sides. Note that the skybox should be added 
 * before all other objects in the scene.
 */
export class Skybox extends Container3D {
  private _mesh: Mesh3D

  /**
   * Creates a new skybox using the specified cube texture.
   * @param texture Cube texture to use for rendering.
   */
  constructor(texture: CubeMipMapTexture) {
    super()
    this._mesh = this.addChild(
      Mesh3D.createCube(new SkyboxMaterialFactory(texture)))
  }

  /**
   * Camera used when rendering. If this value is not set, the main camera will 
   * be used by default.
   */
  get camera() {
    return (<SkyboxMaterial>this._mesh.material).camera
  }

  set camera(val: Camera3D | undefined) {
    (<SkyboxMaterial>this._mesh.material).camera = val
  }

  /**
   * Cube texture to use for rendering.
   */
  get texture() {
    return (<SkyboxMaterial>this._mesh.material).texture
  }

  set texture(val: CubeMipMapTexture) {
    (<SkyboxMaterial>this._mesh.material).texture = val
  }
}