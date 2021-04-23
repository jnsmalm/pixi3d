import { SkyboxMaterial } from "./skybox-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { Cubemap } from "../cubemap/cubemap"
import { Camera } from "../camera/camera"
import { CubemapFaces } from "../cubemap/cubemap-faces"

/**
 * A skybox is a method of creating backgrounds in a 3D scene. It consists of
 * a cubemap texture which has six sides. Note that the skybox should be rendered 
 * before all other objects in the scene.
 */
export class Skybox extends Container3D {
  private _mesh: Mesh3D

  /**
   * Creates a new skybox using the specified cubemap.
   * @param cubemap Cubemap to use for rendering.
   */
  constructor(cubemap: Cubemap) {
    super()
    this._mesh = this.addChild(Mesh3D.createCube(new SkyboxMaterial(cubemap)))
  }

  /**
   * Camera used when rendering. If this value is not set, the main camera will 
   * be used by default.
   */
  get camera() {
    return (<SkyboxMaterial>this._mesh.material).camera
  }

  set camera(value: Camera | undefined) {
    (<SkyboxMaterial>this._mesh.material).camera = value
  }

  /**
   * The cubemap texture used when rendering.
   */
  get cubemap() {
    return (<SkyboxMaterial>this._mesh.material).cubemap
  }

  set cubemap(value: Cubemap) {
    (<SkyboxMaterial>this._mesh.material).cubemap = value
  }

  /**
   * Creates a new skybox from the specified source.
   * @param source The source to create the skybox from.
   */
  static from(source: CubemapFaces) {
    return new Skybox(Cubemap.fromFaces(source))
  }
}