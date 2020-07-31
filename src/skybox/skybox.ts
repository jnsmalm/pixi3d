import { SkyboxMaterial } from "./skybox-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { CubeMipmapTexture } from "../cubemap/cube-mipmap-texture"
import { Camera3D } from "../camera/camera"

/**
 * A skybox is a method of creating backgrounds in a 3D scene. It consists of
 * a cube texture which has six sides. Note that the skybox should be rendered 
 * before all other objects in the scene.
 */
export class Skybox extends Container3D {
  private _mesh: Mesh3D

  /**
   * Creates a new skybox using the specified cube texture.
   * @param texture Cube texture to use for rendering.
   */
  constructor(texture: CubeMipmapTexture) {
    super()
    this._mesh = this.addChild(Mesh3D.createCube(new SkyboxMaterial(texture)))
  }

  /**
   * Camera used when rendering. If this value is not set, the main camera will 
   * be used by default.
   */
  get camera() {
    return (<SkyboxMaterial>this._mesh.material).camera
  }

  set camera(value: Camera3D | undefined) {
    (<SkyboxMaterial>this._mesh.material).camera = value
  }

  /**
   * Cube texture used when rendering.
   */
  get texture() {
    return (<SkyboxMaterial>this._mesh.material).texture
  }

  set texture(value: CubeMipmapTexture) {
    (<SkyboxMaterial>this._mesh.material).texture = value
  }

  /**
   * Creates a new skybox from the specified source.
   * @param source The source to create the skybox from. The format of the 
   * source should be "cubemap_{{face}}.jpg". "{{face}}" will automatically be
   * replaced with the faces (posx, negx, posy, negy, posz, negz). 
   */
  static from(source: string) {
    return new Skybox(CubeMipmapTexture.fromSource([source]))
  }
}